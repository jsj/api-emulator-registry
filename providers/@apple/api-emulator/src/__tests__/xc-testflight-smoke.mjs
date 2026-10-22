import assert from "node:assert/strict";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Store } from "@api-emulator/core";
import { Hono } from "hono";
import { ascPlugin, seedFromConfig } from "../../../api-emulator.mjs";

const binary = process.env.XC_ASC_BINARY;
assert(binary, "Set XC_ASC_BINARY to the xc binary under test");
const app = new Hono(), store = new Store(), requests = [];
app.use("*", async (c, next) => { requests.push({ method: c.req.method, path: new URL(c.req.url).pathname }); await next(); });
const server = Bun.serve({ hostname: "127.0.0.1", port: 0, fetch: app.fetch });
const baseURL = `http://127.0.0.1:${server.port}`;
seedFromConfig(store, baseURL, {
  apps: [{ id: "app", name: "TestFlight Fixture", bundle_id: "example.testflight" }, { id: "other", name: "Other", bundle_id: "example.other" }],
  builds: [{ id: "build", app_id: "app", version: "42" }, { id: "expired", app_id: "app", version: "41", is_expired: true }],
});
store.setData("asc.beta_groups", [{ id: "group", name: "External", app_id: "app", is_internal_group: false, public_link_enabled: true }]);
store.setData("asc.beta_testers", [{ id: "tester", email: "tester@example.com", first_name: "Test", last_name: "User" }]);
ascPlugin.register(app, store, undefined, baseURL);
const state = { localizations: [], reviews: {}, individualTesters: {}, notifications: [], usages: {} };
store.setData("asc.testflight_metadata", state);
state.reviews.app = { contactEmail: "initial@example.com", demoAccountPassword: "initial-secret" };
state.usages["app:tester"] = [
  { crashCount: 1, sessionCount: 7, feedbackCount: 2 },
  { crashCount: 2, sessionCount: 5, feedbackCount: 1 },
];
const scratch = await mkdtemp(join(tmpdir(), "xc-testflight-smoke-"));
let calls = 0, failures = 0;
try {
  const key = Bun.spawnSync(["openssl", "genpkey", "-algorithm", "EC", "-pkeyopt", "ec_paramgen_curve:P-256"]);
  assert.equal(key.exitCode, 0);
  const keyPath = join(scratch, "test.p8"); await writeFile(keyPath, key.stdout, { mode: 0o600 });
  async function run(args, ok = true) {
    const proc = Bun.spawn([binary, "release", "beta", ...args, "--json"], {
      cwd: scratch, stdout: "pipe", stderr: "pipe", env: { ...process.env,
        XC_SUPPRESS_SELF_SKILL_WARNING: "1", ASC_API_BASE_URL: baseURL,
        APPSTORECONNECT_KEY_ID: "EMULATOR", APPSTORECONNECT_ISSUER_ID: "00000000-0000-0000-0000-000000000000",
        APPSTORECONNECT_PRIVATE_KEY_PATH: keyPath,
      },
    });
    const timeout = setTimeout(() => proc.kill(), 30000);
    let stdout, stderr, code;
    try { [stdout, stderr, code] = await Promise.all([new Response(proc.stdout).text(), new Response(proc.stderr).text(), proc.exited]); }
    finally { clearTimeout(timeout); }
    const events = stdout.split("\n").filter(line => line.startsWith("{")).map(line => JSON.parse(line));
    if (ok) {
      assert.equal(code, 0, `${args.join(" ")}: ${stderr}\n${stdout}`);
      assert(!events.some(e => e.event === "error"), stdout);
    } else {
      assert.notEqual(code, 0, `${args.join(" ")} unexpectedly succeeded: ${stdout}`);
      assert(!events.some(e => ["beta_notification_sent", "beta_review_updated", "beta_individual_testers_changed",
        "beta_app_localization", "beta_build_localization", "beta_group"].includes(e.event)), "Failed command emitted a success receipt");
      failures++;
    }
    calls++; return { events, stdout };
  }
  const data = (result, event) => {
    const receipt = result.events.find(e => e.event === event);
    assert(receipt, `Missing ${event}: ${result.stdout}`); return receipt.payload.data;
  };
  const api = async path => {
    const res = await fetch(baseURL + path); assert.equal(res.status, 200); return (await res.json()).data;
  };
  // Confirmation and required inputs fail before any API request.
  for (const args of [
    ["groups", "update", "--group-id", "group", "--name", "Unconfirmed"],
    ["notify", "--build-id", "build"],
    ["review", "update", "--id", "review-detail-app", "--contact-email", "no@example.com"],
    ["individual-testers", "add", "--build-id", "build", "--tester-id", "tester"],
    ["app-info", "create", "--app-id", "app", "--locale", "en-US"],
    ["usage", "--tester-id", "tester"],
  ]) {
    const before = requests.length; await run(args, false); assert.equal(requests.length, before);
  }
  await run(["groups", "update", "--group-id", "group", "--public-link-enabled", "false", "--feedback-enabled", "false",
    "--public-link-limit", "42", "--public-link-limit-enabled", "true", "--confirm"]);
  const group = (await api("/v1/betaGroups/group")).attributes;
  assert.equal(group.name, "External"); assert.equal(group.publicLinkEnabled, false); assert.equal(group.feedbackEnabled, false);
  assert.equal(group.publicLinkLimit, 42);
  await run(["groups", "update", "--group-id", "missing", "--name", "Beta", "--confirm"], false);

  const passwordFile = join(scratch, "password"), notesFile = join(scratch, "notes"), descriptionFile = join(scratch, "description");
  await writeFile(passwordFile, "new-demo-secret", { mode: 0o600 });
  await writeFile(notesFile, "Try the new beta.\n"); await writeFile(descriptionFile, "Beta description.\n");
  const updated = await run(["review", "update", "--id", "review-detail-app", "--demo-account-required", "false",
    "--demo-account-password-file", passwordFile, "--notes-file", notesFile, "--confirm"]);
  const review = data(await run(["review", "view", "--app-id", "app"]), "beta_review_detail");
  assert.equal(review.contactEmail, "initial@example.com"); assert.equal(review.demoAccountRequired, false);
  assert.equal(review.notes, "Try the new beta.\n"); assert.equal(review.demoAccountPassword, undefined);
  assert.equal(state.reviews.app.demoAccountPassword, "new-demo-secret"); assert(!updated.stdout.includes("new-demo-secret"));
  await run(["review", "view", "--app-id", "missing"], false);
  await run(["review", "update", "--id", "missing", "--contact-email", "review@example.com", "--confirm"], false);

  const loc = data(await run(["app-info", "create", "--app-id", "app", "--locale", "en-US", "--description-file", descriptionFile,
    "--marketing-url", "https://example.com", "--privacy-policy-url", "https://example.com/privacy", "--confirm"]), "beta_app_localization");
  assert.equal(loc.marketingURL, "https://example.com");
  await run(["app-info", "update", "--id", loc.id, "--feedback-email", "beta@example.com", "--confirm"]);
  const localizations = data(await run(["app-info", "list", "--app-id", "app"]), "beta_app_localization");
  assert.equal(localizations[0].description, "Beta description.\n"); assert.equal(localizations[0].feedbackEmail, "beta@example.com");
  await run(["app-info", "create", "--app-id", "app", "--locale", "en-US", "--confirm"], false);
  await run(["app-info", "create", "--app-id", "missing", "--locale", "en-US", "--confirm"], false);
  await run(["app-info", "update", "--id", "missing", "--feedback-email", "beta@example.com", "--confirm"], false);
  await run(["app-info", "delete", "--id", loc.id, "--confirm"]);
  await run(["app-info", "delete", "--id", loc.id, "--confirm"], false);
  // Force pagination through the app-scoped route; do not let a page leak another app's locales.
  for (let i = 0; i < 201; i++) state.localizations.push({ id: `page-${i}`, appId: "app", attributes: { locale: `fixture-${i}` } });
  state.localizations.push({ id: "other-locale", appId: "other", attributes: { locale: "other" } });
  const pages = data(await run(["app-info", "list", "--app-id", "app"]), "beta_app_localization");
  assert.equal(pages.length, 201); assert(!pages.some(l => l.id === "other-locale"));
  state.localizations.length = 0;

  const buildLoc = data(await run(["build-info", "create", "--build-id", "build", "--locale", "en-US", "--whats-new-file", notesFile,
    "--confirm"]), "beta_build_localization");
  await writeFile(notesFile, "Updated notes.\n");
  await run(["build-info", "update", "--id", buildLoc.id, "--whats-new-file", notesFile, "--confirm"]);
  const buildLocs = data(await run(["build-info", "list", "--build-id", "build"]), "beta_build_localization");
  assert.equal(buildLocs[0].whatsNew, "Updated notes.\n");
  await run(["build-info", "delete", "--id", buildLoc.id, "--confirm"]);
  await run(["build-info", "delete", "--id", buildLoc.id, "--confirm"], false);
  await run(["build-info", "create", "--build-id", "missing", "--locale", "en-US", "--whats-new-file", notesFile, "--confirm"], false);
  const beforeFileError = requests.length;
  await run(["build-info", "create", "--build-id", "build", "--locale", "en-US", "--whats-new-file", join(scratch, "missing"), "--confirm"], false);
  assert.equal(requests.length, beforeFileError);

  await run(["individual-testers", "add", "--build-id", "build", "--tester-id", "tester", "--confirm"]);
  assert.equal(data(await run(["individual-testers", "list", "--build-id", "build"]), "beta_individual_testers")[0].email, "tester@example.com");
  await run(["individual-testers", "add", "--build-id", "build", "--tester-id", "missing", "--confirm"], false);
  await run(["individual-testers", "remove", "--build-id", "build", "--tester-id", "tester", "--confirm"]);
  assert.deepEqual(data(await run(["individual-testers", "list", "--build-id", "build"]), "beta_individual_testers"), []);
  await run(["notify", "--build-id", "build", "--confirm"]); assert.equal(state.notifications.length, 1);
  await run(["notify", "--build-id", "expired", "--confirm"], false); assert.equal(state.notifications.length, 1);
  const usage = data(await run(["usage", "--tester-id", "tester", "--app-id", "app"]), "beta_tester_usage");
  assert.deepEqual(usage, [{ id: "tester", crashCount: 3, sessionCount: 12, feedbackCount: 3 }]);
  await run(["usage", "--tester-id", "missing", "--app-id", "app"], false);
  await run(["usage", "--tester-id", "tester", "--app-id", "missing"], false);
  console.log(`Passed ${calls} xc TestFlight commands against the local ASC emulator (${failures} expected failures).`);
} finally {
  server.stop(true); await rm(scratch, { recursive: true, force: true });
}
