import { describe, it, expect } from "vitest";
import { Store } from "@api-emulator/core";
import { Hono } from "hono";
import type { AppEnv } from "@api-emulator/core";
import { ascPlugin, seedFromConfig } from "../asc.js";
import { testflightMetadataState } from "../routes/testflight-metadata.js";

function setup() {
  const app = new Hono<AppEnv>(), store = new Store();
  seedFromConfig(store, "http://localhost", {
    apps: [{ id: "app", name: "App", bundle_id: "example.app" }, { id: "other", name: "Other", bundle_id: "example.other" }],
    builds: [{ id: "build", app_id: "app", version: "1" }, { id: "expired", app_id: "app", version: "2", is_expired: true }],
  });
  store.setData("asc.beta_groups", [{ id: "group", name: "Beta", app_id: "app", is_internal_group: false, public_link_enabled: true }]);
  store.setData("asc.beta_testers", [{ id: "tester", email: "test@example.com" }]);
  ascPlugin.register(app, store, undefined, "http://localhost");
  const request = (method: string, path: string, data?: unknown) => app.request(path, {
    method, headers: { "Content-Type": "application/json" }, ...(data ? { body: JSON.stringify({ data }) } : {}),
  });
  return { app, store, request };
}

describe("TestFlight metadata contracts", () => {
  it("updates group settings without clearing omitted fields", async () => {
    const { request } = setup();
    const res = await request("PATCH", "/v1/betaGroups/group", {
      type: "betaGroups", id: "group", attributes: { publicLinkEnabled: false, publicLinkLimitEnabled: true, publicLinkLimit: 42 },
    });
    expect(res.status).toBe(200);
    const value = (await res.json()).data.attributes;
    expect(value.name).toBe("Beta"); expect(value.publicLinkEnabled).toBe(false); expect(value.publicLinkLimit).toBe(42);
    expect((await request("GET", "/v1/betaGroups/group")).status).toBe(200);
  });

  it.each([
    { type: "wrong", id: "group", attributes: { name: "Changed" } },
    { type: "betaGroups", id: "other", attributes: { name: "Changed" } },
    { type: "betaGroups", id: "group", attributes: { publicLinkEnabled: "false" } },
    { type: "betaGroups", id: "group", attributes: { publicLinkLimit: 10001 } },
    { type: "betaGroups", id: "group", attributes: { unexpected: true } },
  ])("rejects malformed group updates without mutation", async data => {
    const { request } = setup();
    expect((await request("PATCH", "/v1/betaGroups/group", data)).status).toBe(422);
    const value = (await (await request("GET", "/v1/betaGroups/group")).json()).data.attributes;
    expect(value.name).toBe("Beta"); expect(value.publicLinkEnabled).toBe(true);
  });

  it("rejects public links for internal groups", async () => {
    const { request, store } = setup();
    store.setData("asc.beta_groups", [{ id: "group", is_internal_group: true }]);
    expect((await request("PATCH", "/v1/betaGroups/group", {
      type: "betaGroups", id: "group", attributes: { publicLinkEnabled: true },
    })).status).toBe(409);
  });

  it("persists review updates and explicit false", async () => {
    const { request } = setup();
    const get = () => request("GET", "/v1/apps/app/betaAppReviewDetail");
    expect((await get()).status).toBe(200);
    for (const attributes of [{ contactEmail: "review@example.com", demoAccountPassword: "secret" }, { demoAccountRequired: false }]) {
      expect((await request("PATCH", "/v1/betaAppReviewDetails/review-detail-app", { type: "betaAppReviewDetails", id: "review-detail-app", attributes })).status).toBe(200);
    }
    const value = (await (await get()).json()).data.attributes;
    expect(value.contactEmail).toBe("review@example.com"); expect(value.demoAccountRequired).toBe(false);
  });

  it("scopes app localizations and retains the scope on pagination links", async () => {
    const { request, app } = setup();
    for (const [appId, locale] of [["app", "en-US"], ["app", "fr-FR"], ["other", "de-DE"]]) {
      const res = await request("POST", "/v1/betaAppLocalizations", { type: "betaAppLocalizations", attributes: { locale, description: locale },
        relationships: { app: { data: { type: "apps", id: appId } } } });
      expect(res.status).toBe(201);
    }
    const page = await (await app.request("/v1/apps/app/betaAppLocalizations?limit=1")).json();
    const next = await (await app.request(page.links.next)).json();
    expect(page.data[0].attributes.locale).toBe("en-US"); expect(next.data[0].attributes.locale).toBe("fr-FR"); expect(next.links.next).toBeNull();
    const id = page.data[0].id;
    expect((await request("PATCH", `/v1/betaAppLocalizations/${id}`, { type: "betaAppLocalizations", id, attributes: { feedbackEmail: "beta@example.com" } })).status).toBe(200);
    expect((await request("PATCH", `/v1/betaAppLocalizations/${id}`, { type: "betaAppLocalizations", id, attributes: { description: "" } })).status).toBe(422);
    expect((await request("POST", "/v1/betaAppLocalizations", { type: "betaAppLocalizations", attributes: { locale: "en-US" }, relationships: { app: { data: { type: "apps", id: "app" } } } })).status).toBe(409);
    expect((await request("DELETE", `/v1/betaAppLocalizations/${id}`)).status).toBe(204);
    expect((await request("DELETE", `/v1/betaAppLocalizations/${id}`)).status).toBe(404);
  });

  it("rejects missing resources and malformed JSON", async () => {
    const { request, app } = setup();
    expect((await request("GET", "/v1/apps/missing/betaAppLocalizations")).status).toBe(404);
    expect((await request("GET", "/v1/apps/missing/betaAppReviewDetail")).status).toBe(404);
    expect((await request("PATCH", "/v1/betaAppReviewDetails/missing", {})).status).toBe(404);
    expect((await request("PATCH", "/v1/betaGroups/missing", {})).status).toBe(404);
    expect((await app.request("/v1/betaGroups/group", { method: "PATCH", body: "bad json" })).status).toBe(422);
  });

  it("validates individual tester linkages atomically", async () => {
    const { request, store } = setup();
    const path = "/v1/builds/build/relationships/individualTesters";
    expect((await request("POST", path, [{ type: "betaTesters", id: "tester" }, { type: "betaTesters", id: "missing" }])).status).toBe(404);
    expect(testflightMetadataState(store).individualTesters.build).toBeUndefined();
    for (let i = 0; i < 2; i++) expect((await request("POST", path, [{ type: "betaTesters", id: "tester" }])).status).toBe(204);
    expect((await (await request("GET", "/v1/builds/build/individualTesters")).json()).data).toHaveLength(1);
    expect((await request("DELETE", path, [{ type: "betaTesters", id: "tester" }])).status).toBe(204);
    expect((await (await request("GET", "/v1/builds/build/individualTesters")).json()).data).toHaveLength(0);
  });

  it("validates build localization lifecycle and resource identities", async () => {
    const { request } = setup();
    const create = (build: string) => request("POST", "/v1/betaBuildLocalizations", {
      type: "betaBuildLocalizations", attributes: { locale: "en-US", whatsNew: "Initial" },
      relationships: { build: { data: { type: "builds", id: build } } },
    });
    expect((await create("missing")).status).toBe(404);
    const created = await create("build"); expect(created.status).toBe(201);
    const id = (await created.json()).data.id;
    expect((await create("build")).status).toBe(409);
    expect((await request("PATCH", `/v1/betaBuildLocalizations/${id}`, {
      type: "betaBuildLocalizations", id: "wrong", attributes: { whatsNew: "Changed" },
    })).status).toBe(422);
    expect((await request("PATCH", `/v1/betaBuildLocalizations/${id}`, {
      type: "betaBuildLocalizations", id, attributes: { whatsNew: "Changed" },
    })).status).toBe(200);
    const list = await (await request("GET", "/v1/betaBuildLocalizations?filter[build]=build")).json();
    expect(list.data[0].attributes.whatsNew).toBe("Changed");
    expect((await request("DELETE", `/v1/betaBuildLocalizations/${id}`)).status).toBe(204);
    expect((await request("DELETE", `/v1/betaBuildLocalizations/${id}`)).status).toBe(404);
  });

  it("rejects notifications for unavailable builds", async () => {
    const { request, store } = setup();
    const notify = (id: string) => request("POST", "/v1/buildBetaNotifications", { type: "buildBetaNotifications", relationships: { build: { data: { type: "builds", id } } } });
    expect((await notify("expired")).status).toBe(409); expect((await notify("missing")).status).toBe(404);
    expect((await notify("build")).status).toBe(201); expect(testflightMetadataState(store).notifications).toHaveLength(1);
  });

  it("requires a nonempty app filter and returns seeded metric points", async () => {
    const { app, store } = setup();
    const path = "/v1/betaTesters/tester/metrics/betaTesterUsages";
    for (const query of ["", "?filter[apps]="]) expect((await app.request(path + query)).status).toBe(422);
    testflightMetadataState(store).usages["app:tester"] = [{ crashCount: 1, sessionCount: 7, feedbackCount: 2 }];
    const result = await (await app.request(path + "?filter[apps]=app")).json();
    expect(result.data[0].dataPoints[0].values.sessionCount).toBe(7);
  });

  it("resets TestFlight state through the admin endpoint", async () => {
    const { request, store } = setup();
    testflightMetadataState(store).notifications.push({ id: "notification", buildId: "build" });
    expect((await request("POST", "/_admin/reset")).status).toBe(200);
    expect(testflightMetadataState(store).notifications).toHaveLength(0);
  });
});
