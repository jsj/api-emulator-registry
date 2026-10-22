import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import type { RouteContext } from "@api-emulator/core";
import { ascId, jsonApiError, jsonApiResource, parseCursor } from "../jsonapi.js";
import { getASCStore } from "../store.js";

type Attributes = Record<string, unknown>;
interface Localization { id: string; appId: string; attributes: Attributes }
interface Tester { id: string; email: string; first_name?: string; last_name?: string }
interface State {
  localizations: Localization[];
  reviews: Record<string, Attributes>;
  individualTesters: Record<string, string[]>;
  notifications: Array<{ id: string; buildId: string }>;
  usages: Record<string, Array<{ crashCount: number; sessionCount: number; feedbackCount: number }>>;
}

export function testflightMetadataState(store: RouteContext["store"]): State {
  let state = store.getData<State>("asc.testflight_metadata");
  if (!state) {
    state = { localizations: [], reviews: {}, individualTesters: {}, notifications: [], usages: {} };
    store.setData("asc.testflight_metadata", state);
  }
  return state;
}

function fail(c: Context, status: 404 | 409 | 422, detail: string): never {
  throw new HTTPException(status, { res: c.json(jsonApiError(status, "ENTITY_ERROR", "Invalid TestFlight operation", detail), status) });
}

async function testflightRequestBody(c: Context, type: string, schema: Record<string, "string" | "boolean" | "number">, id?: string) {
  let json;
  try { json = await c.req.json(); } catch { fail(c, 422, "Expected JSON:API request body"); }
  const data = json?.data;
  if (!data || Array.isArray(data) || data.type !== type || (id !== undefined && data.id !== id)) {
    fail(c, 422, "Resource type or ID does not match the endpoint");
  }
  const attributes = data.attributes ?? {};
  if (!attributes || typeof attributes !== "object" || Array.isArray(attributes)) fail(c, 422, "Invalid attributes");
  for (const [key, value] of Object.entries(attributes)) {
    if (!schema[key] || typeof value !== schema[key]) fail(c, 422, `Invalid attribute ${key}`);
  }
  return { ...data, attributes } as { attributes: Attributes; relationships?: Record<string, { data?: { type?: string; id?: string } }> };
}

export function testflightMetadataRoutes({ app, store, baseUrl }: RouteContext): void {
  const asc = getASCStore(store);
  const state = () => testflightMetadataState(store);
  const requireApp = (c: Context, id: string) => {
    if (!asc.apps.findOneBy("asc_id", id)) fail(c, 404, "App not found");
  };
  const requireBuild = (c: Context, id: string) => {
    const build = asc.builds.findOneBy("asc_id", id);
    if (!build) fail(c, 404, "Build not found");
    return build;
  };
  const testers = () => store.getData<Tester[]>("asc.beta_testers") ?? [];
  const requireTester = (c: Context, id: string) => {
    if (!testers().some(t => t.id === id)) fail(c, 404, "Tester not found");
  };
  const list = (c: Context, type: string, items: Array<{ id: string; attributes: Attributes }>) => {
    const { cursor, limit } = parseCursor(c);
    const next = new URL(c.req.url); next.searchParams.set("cursor", String(cursor + limit));
    return c.json({
      data: items.slice(cursor, cursor + limit).map(r => jsonApiResource(baseUrl, type, r.id, r.attributes).data),
      links: { self: c.req.url, next: cursor + limit < items.length ? next.toString() : null },
      meta: { paging: { total: items.length, limit } },
    });
  };
  const ref = (c: Context, relationships: Awaited<ReturnType<typeof testflightRequestBody>>["relationships"], name: string, type: string) => {
    const value = relationships?.[name]?.data;
    if (value?.type !== type || !value.id) fail(c, 422, `Expected ${name} relationship`);
    return value.id;
  };

  const groupKeys: Record<string, string> = {
    name: "name", publicLinkEnabled: "public_link_enabled", publicLinkLimitEnabled: "public_link_limit_enabled",
    publicLinkLimit: "public_link_limit", feedbackEnabled: "feedback_enabled",
  };
  const groupSchema = { name: "string", publicLinkEnabled: "boolean", publicLinkLimitEnabled: "boolean", publicLinkLimit: "number", feedbackEnabled: "boolean" } as const;
  const group = (c: Context) => {
    const groups = store.getData<Array<Attributes & { id: string }>>("asc.beta_groups") ?? [];
    const value = groups.find(g => g.id === c.req.param("id"));
    if (!value) fail(c, 404, "Beta group not found");
    return value;
  };
  const renderGroup = (value: Attributes & { id: string }) => jsonApiResource(baseUrl, "betaGroups", value.id, {
    ...Object.fromEntries(Object.entries(groupKeys).map(([api, stored]) => [api, value[stored]])),
    isInternalGroup: value.is_internal_group,
  });
  app.get("/v1/betaGroups/:id", c => c.json(renderGroup(group(c))));
  app.patch("/v1/betaGroups/:id", async c => {
    const value = group(c);
    const data = await testflightRequestBody(c, "betaGroups", groupSchema, value.id);
    if (data.attributes.publicLinkEnabled === true && value.is_internal_group === true) fail(c, 409, "Internal groups cannot use public links");
    const limit = data.attributes.publicLinkLimit;
    if (limit !== undefined && (!Number.isInteger(limit) || Number(limit) < 1 || Number(limit) > 10000)) fail(c, 422, "Invalid public link limit");
    if (data.attributes.name === "") fail(c, 422, "Group name cannot be empty");
    for (const [key, valueToSet] of Object.entries(data.attributes)) value[groupKeys[key]] = valueToSet;
    return c.json(renderGroup(value));
  });

  const reviewSchema = {
    contactFirstName: "string", contactLastName: "string", contactPhone: "string", contactEmail: "string",
    demoAccountName: "string", demoAccountPassword: "string", demoAccountRequired: "boolean", notes: "string",
  } as const;
  app.get("/v1/apps/:appId/betaAppReviewDetail", c => {
    const appId = c.req.param("appId"); requireApp(c, appId);
    return c.json(jsonApiResource(baseUrl, "betaAppReviewDetails", `review-detail-${appId}`, state().reviews[appId] ?? {}));
  });
  app.patch("/v1/betaAppReviewDetails/:id", async c => {
    const id = c.req.param("id");
    if (!id.startsWith("review-detail-")) fail(c, 404, "Review detail not found");
    const appId = id.slice("review-detail-".length); requireApp(c, appId);
    const data = await testflightRequestBody(c, "betaAppReviewDetails", reviewSchema, id);
    state().reviews[appId] = { ...state().reviews[appId], ...data.attributes };
    return c.json(jsonApiResource(baseUrl, "betaAppReviewDetails", id, state().reviews[appId]));
  });

  const localizationSchema = { description: "string", feedbackEmail: "string", marketingUrl: "string", privacyPolicyUrl: "string", tvOsPrivacyPolicy: "string" } as const;
  const localizations = (c: Context, appId: string) => {
    requireApp(c, appId);
    return list(c, "betaAppLocalizations", state().localizations.filter(l => l.appId === appId));
  };
  app.get("/v1/apps/:appId/betaAppLocalizations", c => localizations(c, c.req.param("appId")));
  app.get("/v1/betaAppLocalizations", c => {
    const appId = c.req.query("filter[app]");
    if (!appId) fail(c, 422, "App filter is required");
    return localizations(c, appId);
  });
  app.post("/v1/betaAppLocalizations", async c => {
    const data = await testflightRequestBody(c, "betaAppLocalizations", { ...localizationSchema, locale: "string" });
    const appId = ref(c, data.relationships, "app", "apps"); requireApp(c, appId);
    if (!data.attributes.locale) fail(c, 422, "Locale is required");
    if (state().localizations.some(l => l.appId === appId && l.attributes.locale === data.attributes.locale)) fail(c, 409, "Locale already exists");
    const value = { id: ascId(), appId, attributes: data.attributes };
    state().localizations.push(value);
    return c.json(jsonApiResource(baseUrl, "betaAppLocalizations", value.id, value.attributes), 201);
  });
  const localization = (c: Context) => {
    const value = state().localizations.find(l => l.id === c.req.param("id"));
    if (!value) fail(c, 404, "Beta app localization not found");
    return value;
  };
  app.patch("/v1/betaAppLocalizations/:id", async c => {
    const value = localization(c);
    const data = await testflightRequestBody(c, "betaAppLocalizations", localizationSchema, value.id);
    if (Object.values(data.attributes).some(v => v === "")) fail(c, 422, "Localized information cannot be cleared");
    Object.assign(value.attributes, data.attributes);
    return c.json(jsonApiResource(baseUrl, "betaAppLocalizations", value.id, value.attributes));
  });
  app.delete("/v1/betaAppLocalizations/:id", c => {
    const value = localization(c);
    state().localizations = state().localizations.filter(l => l.id !== value.id);
    return c.body(null, 204);
  });

  app.get("/v1/betaBuildLocalizations", c => {
    const buildId = c.req.query("filter[build]");
    if (!buildId) fail(c, 422, "Build filter is required");
    requireBuild(c, buildId);
    const values = store.getData<Array<{ id: string; build_id: string; locale: string; whats_new: string }>>("asc.beta_build_localizations") ?? [];
    return list(c, "betaBuildLocalizations", values.filter(l => l.build_id === buildId).map(l => ({ id: l.id, attributes: { locale: l.locale, whatsNew: l.whats_new } })));
  });
  const buildLocalizations = () => store.getData<Array<{ id: string; build_id: string; locale: string; whats_new: string }>>("asc.beta_build_localizations") ?? [];
  app.get("/v1/builds/:buildId/betaBuildLocalizations", c => {
    const buildId = c.req.param("buildId"); requireBuild(c, buildId);
    return list(c, "betaBuildLocalizations", buildLocalizations().filter(l => l.build_id === buildId)
      .map(l => ({ id: l.id, attributes: { locale: l.locale, whatsNew: l.whats_new } })));
  });
  app.post("/v1/betaBuildLocalizations", async c => {
    const data = await testflightRequestBody(c, "betaBuildLocalizations", { locale: "string", whatsNew: "string" });
    const buildId = ref(c, data.relationships, "build", "builds"); requireBuild(c, buildId);
    if (!data.attributes.locale) fail(c, 422, "Locale is required");
    const values = buildLocalizations();
    if (values.some(l => l.build_id === buildId && l.locale === data.attributes.locale)) fail(c, 409, "Locale already exists");
    const value = { id: ascId(), build_id: buildId, locale: String(data.attributes.locale), whats_new: String(data.attributes.whatsNew ?? "") };
    values.push(value); store.setData("asc.beta_build_localizations", values);
    return c.json(jsonApiResource(baseUrl, "betaBuildLocalizations", value.id, { locale: value.locale, whatsNew: value.whats_new }), 201);
  });
  app.patch("/v1/betaBuildLocalizations/:id", async c => {
    const values = buildLocalizations(), value = values.find(l => l.id === c.req.param("id"));
    if (!value) fail(c, 404, "Beta build localization not found");
    const data = await testflightRequestBody(c, "betaBuildLocalizations", { whatsNew: "string" }, value.id);
    if (data.attributes.whatsNew !== undefined) value.whats_new = String(data.attributes.whatsNew);
    store.setData("asc.beta_build_localizations", values);
    return c.json(jsonApiResource(baseUrl, "betaBuildLocalizations", value.id, { locale: value.locale, whatsNew: value.whats_new }));
  });
  app.delete("/v1/betaBuildLocalizations/:id", c => {
    const values = buildLocalizations();
    if (!values.some(l => l.id === c.req.param("id"))) fail(c, 404, "Beta build localization not found");
    store.setData("asc.beta_build_localizations", values.filter(l => l.id !== c.req.param("id")));
    return c.body(null, 204);
  });
  app.get("/v1/builds/:id/individualTesters", c => {
    const id = c.req.param("id"); requireBuild(c, id);
    const members = state().individualTesters[id] ?? [];
    return list(c, "betaTesters", testers().filter(t => members.includes(t.id)).map(t => ({ id: t.id,
      attributes: { email: t.email, firstName: t.first_name, lastName: t.last_name } })));
  });
  for (const method of ["post", "delete"] as const) {
    app[method]("/v1/builds/:id/relationships/individualTesters", async c => {
      const id = c.req.param("id"); requireBuild(c, id);
      let json;
      try { json = await c.req.json(); } catch { fail(c, 422, "Expected tester linkages"); }
      if (!Array.isArray(json?.data) || !json.data.length) fail(c, 422, "Expected tester linkages");
      const ids = json.data.map((value: { type?: string; id?: string }) => {
        if (value.type !== "betaTesters" || !value.id) fail(c, 422, "Invalid tester linkage");
        requireTester(c, value.id); return value.id;
      });
      const members = state().individualTesters[id] ?? [];
      state().individualTesters[id] = method === "post" ? [...new Set([...members, ...ids])] : members.filter(t => !ids.includes(t));
      return c.body(null, 204);
    });
  }
  app.post("/v1/buildBetaNotifications", async c => {
    const data = await testflightRequestBody(c, "buildBetaNotifications", {});
    const buildId = ref(c, data.relationships, "build", "builds");
    const build = requireBuild(c, buildId);
    if (build.processing_state !== "VALID" || build.is_expired) fail(c, 409, "Build is not available for testing");
    const id = ascId(); state().notifications.push({ id, buildId });
    return c.json(jsonApiResource(baseUrl, "buildBetaNotifications", id, {}), 201);
  });
  app.get("/v1/betaTesters/:id/metrics/betaTesterUsages", c => {
    const testerId = c.req.param("id"); requireTester(c, testerId);
    const appId = c.req.query("filter[apps]");
    if (!appId) fail(c, 422, "A nonempty filter[apps] is required");
    requireApp(c, appId);
    const points = state().usages[`${appId}:${testerId}`] ?? [];
    return c.json({ data: points.length ? [{ dimensions: { apps: { data: appId } }, dataPoints: points.map(values => ({ values })) }] : [],
      links: { self: c.req.url } });
  });
}
