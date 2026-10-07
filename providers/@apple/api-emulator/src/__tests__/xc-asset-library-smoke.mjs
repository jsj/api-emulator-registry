import assert from "node:assert/strict";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Store } from "@api-emulator/core";
import { Hono } from "hono";
import { ascPlugin } from "../asc.js";
import { assetLibraryState } from "../routes/asset-library.js";

const binary = process.env.XC_ASC_BINARY;
assert(binary, "Set XC_ASC_BINARY to the xc binary under test");
const app = new Hono(), store = new Store();
const server = Bun.serve({ hostname: "127.0.0.1", port: 0, fetch: app.fetch });
const baseURL = `http://127.0.0.1:${server.port}`;
ascPlugin.seed(store, baseURL);
ascPlugin.register(app, store, undefined, baseURL);
const scratch = await mkdtemp(join(tmpdir(), "xc-asset-library-smoke-"));
let calls = 0;
try {
  const key = Bun.spawnSync(["openssl", "genpkey", "-algorithm", "EC", "-pkeyopt", "ec_paramgen_curve:P-256"]);
  assert.equal(key.exitCode, 0);
  const keyPath = join(scratch, "test.p8");
  await writeFile(keyPath, key.stdout, { mode: 0o600 });
  async function xc(...args) {
    const proc = Bun.spawn([binary, "asc", "asset-library", ...args, "--json"], {
      cwd: scratch, stdout: "pipe", stderr: "pipe", env: { ...process.env,
        XC_SUPPRESS_SELF_SKILL_WARNING: "1", ASC_API_BASE_URL: baseURL,
        APPSTORECONNECT_KEY_ID: "EMULATOR", APPSTORECONNECT_ISSUER_ID: "00000000-0000-0000-0000-000000000000",
        APPSTORECONNECT_PRIVATE_KEY_PATH: keyPath,
      }
    });
    const [stdout, stderr, code] = await Promise.all([new Response(proc.stdout).text(), new Response(proc.stderr).text(), proc.exited]);
    assert.equal(code, 0, `${args.join(" ")}: ${stderr}\n${stdout}`);
    const events = stdout.split("\n").filter(line => line.startsWith("{")).map(line => JSON.parse(line));
    assert(!events.some(e => e.event === "error"), stdout);
    calls++;
    return events.filter(e => e.event === "asc_api_response").map(e => e.payload.body_json ? JSON.parse(e.payload.body_json) : null);
  }
  const library = (await xc("view", "--app-id", "1234567890"))[0].data.id;
  assert.equal((await xc("view", "--library-id", library))[0].data.id, library);
  await xc("view", "--app-id", "1234567890", "--relationships-only");
  await xc("specs"); await xc("specs", "--id", "creative-image");
  const file = join(scratch, "image.png"), videoFile = join(scratch, "video.mp4");
  for (const args of [
    ["-f", "lavfi", "-i", "color=c=blue:s=1920x1080", "-frames:v", "1", "-pix_fmt", "rgb24", file],
    ["-f", "lavfi", "-i", "color=c=blue:s=1920x1080:r=30", "-t", "1", "-c:v", "libx264", "-pix_fmt", "yuv420p", videoFile]
  ]) {
    const generated = Bun.spawnSync(["ffmpeg", "-hide_banner", "-loglevel", "error", ...args]);
    assert.equal(generated.exitCode, 0, new TextDecoder().decode(generated.stderr));
  }
  assetLibraryState(store).processingDelayReads = 1;
  const images = [];
  for (const kind of ["images", "videos"]) {
    const id = (await xc(kind, "upload", "--library-id", library, "--file", kind === "images" ? file : videoFile, "--confirm", "--wait", "--timeout", "10"))[0].data.id;
    await xc(kind, "wait", "--id", id, "--timeout", "10");
    if (kind === "images") images.push(id);
    await xc(kind, "get", "--id", id);
    await xc(kind, "rename", "--id", id, "--name", "Summer", "--confirm");
    await xc(kind, "list", "--library-id", library, "--state", "READY_FOR_REVIEW", "--sort", "referenceName");
    await xc(kind, "list", "--library-id", library, "--relationships-only");
    await xc(kind, "placements", "--id", id, "--relationships-only");
    if (kind === "videos") await xc(kind, "set-poster-frame", "--id", id, "--time-code", "00:00:01:00", "--confirm");
    await xc(kind, "review", "--id", id, "--submission-id", "submission", "--confirm");
    assetLibraryState(store).media.find(r => r.id === id).attributes.state = "APPROVED";
    await xc(kind, "archive", "--id", id, "--confirm");
    await xc(kind, "unarchive", "--id", id, "--confirm");
  }
  const second = (await xc("images", "upload", "--library-id", library, "--file", file, "--confirm", "--wait", "--timeout", "10"))[0].data.id;
  images.push(second);
  const pages = await xc("images", "list", "--library-id", library, "--limit", "1", "--paginate");
  assert.equal(pages.length, 2);
  const linkPages = await xc("images", "list", "--library-id", library, "--limit", "1", "--paginate", "--relationships-only");
  assert.equal(linkPages.length, 2);
  for (const context of ["version", "page", "experiment", "event"]) {
    const owner = ["--context", context, "--localization-id", "localization"];
    const placements = [];
    for (const image of images) {
      const response = await xc("placements", "create", ...owner, "--image-id", image,
        "--placement-type", "APP_SCREENSHOT", "--placement-group", "IPHONE_DUO_PROFILE", "--confirm");
      placements.push(response[0].data.id);
    }
    await xc("placements", "get", "--id", placements[0]);
    await xc("placements", "list", ...owner, "--paginate", "--limit", "1");
    await xc("placements", "list", ...owner, "--relationships-only", "--paginate", "--limit", "1");
    if (context !== "event") await xc("placements", "reorder", ...owner, "--placement-group", "IPHONE_DUO_PROFILE", "--ids", placements.reverse().join(","), "--confirm");
    for (const id of placements) await xc("placements", "delete", "--id", id, "--confirm");
  }
  for (const asset of [...assetLibraryState(store).media]) await xc(asset.type.endsWith("Images") ? "images" : "videos", "delete", "--id", asset.id, "--confirm");
  assert.equal(assetLibraryState(store).media.length, 0);
  console.log(`Passed ${calls} xc commands against the local ASC emulator.`);
} finally {
  server.stop(true);
  await rm(scratch, { recursive: true, force: true });
}
