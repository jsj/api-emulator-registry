import type { RouteContext, Store } from "@api-emulator/core";
import type { Context } from "hono";
import { ascId, jsonApiError, jsonApiResource } from "../jsonapi.js";
import { getASCStore } from "../store.js";

type Resource = { id: string; type: string; attributes: Record<string, any>; relationships: Record<string, any> };
type State = { libraries: Resource[]; media: Resource[]; placements: Resource[]; transfers: Record<string, number>; processingDelayReads?: number; processing?: Record<string, number> };
export function assetLibraryState(store: Store): State {
  let state = store.getData<State>("asc.asset_library");
  if (!state) { state = { libraries: [], media: [], placements: [], transfers: {} }; store.setData("asc.asset_library", state); }
  return state;
}
const owners = ["appStoreVersionLocalization", "appCustomProductPageLocalization", "appStoreVersionExperimentTreatmentLocalization", "appEventLocalization"];
const categories = ["CREATIVE_ASSETS", "APP_SCREENSHOTS_AND_PREVIEWS"];
const placementTypes = ["APP_SCREENSHOT", "IMESSAGE_APP_SCREENSHOT", "APP_PREVIEW", "PRODUCT_PAGE_HEADER_ASSET", "APP_STORE_SEARCH_RESULTS_ASSET", "SEARCH_RESULTS_ADS_ASSET", "TODAY_TAB_ADS_ASSET", "EVENT_CARD_ASSET", "EVENT_DETAILS_PAGE_ASSET", "RETENTION_MESSAGE_ASSET"];
const refID = (r: Resource, key: string) => r.relationships[key]?.data?.id;

export function assetLibraryRoutes({ app, store, baseUrl }: RouteContext): void {
  const state = () => assetLibraryState(store);
  const bad = (c: Context, detail: string) => c.json(jsonApiError(409, "ENTITY_ERROR", "Invalid asset operation", detail), 409);
  const missing = (c: Context) => c.json(jsonApiError(404, "NOT_FOUND", "Not Found", "Resource not found"), 404);
  const advanceProcessing = (r: Resource) => {
    if (r.attributes.state === "UPLOAD_COMPLETE" && state().processing?.[r.id] !== undefined) {
      if (state().processing![r.id]-- <= 0) { r.attributes.state = "READY_FOR_REVIEW"; delete state().processing![r.id]; }
    }
  };
  const render = (r: Resource) => jsonApiResource(baseUrl, r.type, r.id, r.attributes, r.relationships).data;
  const one = (c: Context, r?: Resource) => r ? c.json({ data: render(r) }) : missing(c);
  const list = (c: Context, items: Resource[]) => {
    const limit = Number(c.req.query("limit") ?? "50"), cursor = Number(c.req.query("cursor") ?? "0");
    if (!Number.isInteger(limit) || limit < 1 || limit > 200 || !Number.isInteger(cursor) || cursor < 0) return bad(c, "Invalid pagination");
    for (const field of ["category", "state", "referenceName", "specId", "id"]) {
      const filter = c.req.query(`filter[${field}]`);
      if (filter) items = items.filter(r => filter.split(",").includes(String(field === "id" ? r.id : r.attributes[field])));
    }
    const sorts = (c.req.query("sort") ?? "").split(",").filter(Boolean);
    if (sorts.some(s => !["createdDate", "lastModifiedDate", "referenceName"].includes(s.replace(/^-/, "")))) return bad(c, "Invalid sort field");
    items = [...items].sort((a, b) => {
      for (const sort of sorts) {
        const key = sort.replace(/^-/, "");
        const result = String(a.attributes[key] ?? "").localeCompare(String(b.attributes[key] ?? ""));
        if (result) return sort.startsWith("-") ? -result : result;
      }
      return 0;
    });
    const next = new URL(c.req.url); next.searchParams.set("cursor", String(cursor + limit));
    return c.json({ data: items.slice(cursor, cursor + limit).map(render),
      links: { next: cursor + limit < items.length ? next.toString() : null }, meta: { paging: { total: items.length, limit } } });
  };
  app.get("/v1/apps/:id/assetLibrary", c => {
    const id = c.req.param("id");
    if (!getASCStore(store).apps.findOneBy("asc_id", id)) return missing(c);
    let library = state().libraries.find(r => refID(r, "app") === id);
    if (!library) {
      library = { id: `library-${id}`, type: "appAssetLibraries", attributes: {}, relationships: { app: { data: { type: "apps", id } } } };
      state().libraries.push(library);
    }
    return one(c, library);
  });
  app.get("/v1/appAssetLibraries/:id", c => one(c, state().libraries.find(r => r.id === c.req.param("id"))));
  // This fixture does not represent Apple's complete compatibility catalog.
  const specs: Resource[] = [{ id: "creative-image", type: "appAssetLibraryRefData", attributes: {
    placementTypes: [{ placementTypeId: "PRODUCT_PAGE_HEADER_ASSET", acceptsAssetCategories: categories }],
    imageSpecs: [{ specId: "creative-image", dimensions: { minWidth: 1920, maxWidth: 1920, minHeight: 1080, maxHeight: 1080 },
      compatiblePlacementTypes: ["PRODUCT_PAGE_HEADER_ASSET"], alphaAllowed: false, fileExtensions: [".png", ".jpg"],
      mimeTypes: ["image/png", "image/jpeg"], maxFileSize: 10485760 }],
    videoSpecs: [{ specId: "creative-video", dimensions: { minWidth: 1920, maxWidth: 1920, minHeight: 1080, maxHeight: 1080 },
      compatiblePlacementTypes: ["PRODUCT_PAGE_HEADER_ASSET"], frameRates: [{ minFps: 24, maxFps: 30 }],
      duration: { min: "PT1S", max: "PT30S" }, audioRequired: false, fileExtensions: [".mp4", ".mov"],
      mimeTypes: ["video/mp4", "video/quicktime"], maxFileSize: 524288000 }]
  }, relationships: {} }];
  app.get("/v1/appAssetLibraryRefData", c => list(c, specs));
  app.get("/v1/appAssetLibraryRefData/:id", c => one(c, specs.find(r => r.id === c.req.param("id"))));
  for (const kind of ["Images", "Videos"]) {
    const type = `appAssetLibrary${kind}`;
    app.get(`/v1/appAssetLibraries/:id/${kind.toLowerCase()}`, c => {
      if (!state().libraries.some(r => r.id === c.req.param("id"))) return missing(c);
      const media = state().media.filter(r => r.type === type && refID(r, "assetLibrary") === c.req.param("id"));
      // Advance before filtering so READY_FOR_REVIEW queries can observe pending assets becoming ready.
      media.forEach(advanceProcessing);
      return list(c, media);
    });
    app.post(`/v1/${type}`, async c => {
      const { data } = await c.req.json();
      const attrs = data?.attributes, library = data?.relationships?.assetLibrary?.data;
      if (data?.type !== type || library?.type !== "appAssetLibraries" || !state().libraries.some(r => r.id === library.id) ||
          !attrs?.fileName || !Number.isSafeInteger(attrs.fileSize) || attrs.fileSize < 1 || !categories.includes(attrs.category)) return bad(c, "Invalid upload reservation");
      const id = ascId(), now = new Date().toISOString();
      const resource: Resource = { id, type, relationships: { assetLibrary: { data: library } }, attributes: {
        ...attrs, state: "AWAITING_UPLOAD", createdDate: now, lastModifiedDate: now,
        uploadOperations: [{ method: "PUT", url: `${baseUrl}/_asc/assets/${id}`, offset: 0, length: attrs.fileSize, requestHeaders: [] }],
      } };
      state().media.push(resource); return c.json({ data: render(resource) }, 201);
    });
    app.get(`/v1/${type}/:id`, c => {
      const r = state().media.find(r => r.id === c.req.param("id") && r.type === type);
      if (r) advanceProcessing(r);
      return one(c, r);
    });
    app.get(`/v1/${type}/:id/placements`, c => {
      if (!state().media.some(r => r.id === c.req.param("id") && r.type === type)) return missing(c);
      return list(c, state().placements.filter(r => refID(r, kind === "Images" ? "image" : "video") === c.req.param("id")));
    });
    app.patch(`/v1/${type}/:id`, async c => {
      const r = state().media.find(r => r.id === c.req.param("id") && r.type === type);
      if (!r) return missing(c);
      const { data } = await c.req.json();
      if (data?.type !== type || data?.id !== r.id) return bad(c, "Resource type or ID mismatch");
      const attrs = data.attributes ?? {};
      if (Object.keys(attrs).some(k => !["referenceName", "archived", "uploaded", ...(kind === "Videos" ? ["previewFrameTimeCode"] : [])].includes(k))) return bad(c, "Unsupported attribute");
      if (attrs.archived === true && r.attributes.state !== "APPROVED") return bad(c, "Only approved assets can be archived");
      if (attrs.uploaded === true && (r.attributes.state !== "AWAITING_UPLOAD" || state().transfers[r.id] !== r.attributes.fileSize)) return bad(c, "Asset bytes are incomplete");
      if (attrs.previewFrameTimeCode !== undefined && ["APPROVED", "ARCHIVED"].includes(r.attributes.state)) return bad(c, "Approved poster frames cannot change");
      Object.assign(r.attributes, attrs, { lastModifiedDate: new Date().toISOString() });
      if (attrs.uploaded === true) { r.attributes.state = state().processingDelayReads ? "UPLOAD_COMPLETE" : "READY_FOR_REVIEW";
        if (state().processingDelayReads) (state().processing ??= {})[r.id] = state().processingDelayReads!;
        r.attributes.specId = kind === "Images" ? "creative-image" : "creative-video";
        if (kind === "Images") r.attributes.imageAsset = { width: 1920, height: 1080, templateUrl: `https://assets.example.com/${r.id}/{w}x{h}.png` };
        else r.attributes.videoAsset = `https://assets.example.com/${r.id}.mp4`;
        delete r.attributes.uploadOperations; }
      if (attrs.archived === true) r.attributes.state = "ARCHIVED";
      if (attrs.archived === false && r.attributes.state === "ARCHIVED") r.attributes.state = "APPROVED";
      return one(c, r);
    });
    app.delete(`/v1/${type}/:id`, c => {
      const index = state().media.findIndex(r => r.id === c.req.param("id") && r.type === type);
      if (index < 0) return missing(c);
      if (state().placements.some(r => refID(r, kind === "Images" ? "image" : "video") === c.req.param("id"))) return bad(c, "Asset has active placements");
      state().media.splice(index, 1); delete state().transfers[c.req.param("id")]; return c.body(null, 204);
    });
  }
  app.put("/_asc/assets/:id", async c => {
    const r = state().media.find(r => r.id === c.req.param("id"));
    if (!r) return missing(c);
    const length = (await c.req.arrayBuffer()).byteLength;
    if (r.attributes.state !== "AWAITING_UPLOAD" || length !== r.attributes.fileSize) return bad(c, "Unexpected upload bytes");
    state().transfers[r.id] = length; return c.body(null, 200);
  });
  for (const owner of owners) app.get(`/v1/${owner}s/:id/placements`, c => list(c, state().placements.filter(r => refID(r, owner) === c.req.param("id"))));
  app.post("/v1/appAssetLibraryPlacements", async c => {
    const { data } = await c.req.json();
    const rel = data?.relationships ?? {}, attrs = data?.attributes ?? {}, keys = ["image", "video"].filter(k => rel[k]);
    if (data?.type !== "appAssetLibraryPlacements" || keys.length !== 1 || owners.filter(k => rel[k]).length !== 1 || !placementTypes.includes(attrs.placementType)) return bad(c, "Invalid placement relationships or type");
    const key = keys[0], asset = state().media.find(r => r.id === rel[key].data?.id && r.type === rel[key].data?.type);
    if (!asset || !["READY_FOR_REVIEW", "APPROVED", "ACCEPTED", "COMPLETE"].includes(asset.attributes.state)) return bad(c, "Asset is unavailable for placement");
    const r: Resource = { id: ascId(), type: "appAssetLibraryPlacements", attributes: { ...attrs, mediaType: key.toUpperCase() }, relationships: rel };
    state().placements.push(r); return c.json({ data: render(r) }, 201);
  });
  app.get("/v1/appAssetLibraryPlacements/:id", c => one(c, state().placements.find(r => r.id === c.req.param("id"))));
  app.delete("/v1/appAssetLibraryPlacements/:id", c => {
    const index = state().placements.findIndex(r => r.id === c.req.param("id"));
    if (index < 0) return missing(c);
    state().placements.splice(index, 1); return c.body(null, 204);
  });
  app.post("/v1/appAssetLibraryPlacementOrderingRequests", async c => {
    const { data } = await c.req.json();
    const rel = data?.relationships ?? {}, selected = owners.filter(k => rel[k]), ids = rel.orderedPlacements?.data?.map((r: any) => r.id);
    if (data?.type !== "appAssetLibraryPlacementOrderingRequests" || selected.length !== 1 || selected[0] === "appEventLocalization" ||
        !data.attributes?.placementGroup || !Array.isArray(ids) || !ids.length || new Set(ids).size !== ids.length) return bad(c, "Invalid placement order");
    const eligible = state().placements.filter(r => refID(r, selected[0]) === rel[selected[0]].data?.id && r.attributes.placementGroup === data.attributes.placementGroup);
    if (ids.length !== eligible.length || ids.some((id: string) => !eligible.some(r => r.id === id))) return bad(c, "Order must contain every placement in the selected group");
    state().placements = state().placements.filter(r => !eligible.includes(r)).concat(ids.map((id: string) => eligible.find(r => r.id === id)!));
    return c.json({ data: { type: data.type, id: ascId(), attributes: data.attributes, relationships: rel } }, 201);
  });
  const relationships = [
    "/v1/apps/:id/relationships/assetLibrary",
    "/v1/appAssetLibraries/:id/relationships/images",
    "/v1/appAssetLibraries/:id/relationships/videos",
    "/v1/appAssetLibraryImages/:id/relationships/placements",
    "/v1/appAssetLibraryVideos/:id/relationships/placements",
    ...owners.map(owner => `/v1/${owner}s/:id/relationships/placements`),
  ];
  for (const path of relationships) app.get(path, async c => {
    const url = new URL(c.req.url); url.pathname = url.pathname.replace("/relationships/", "/");
    const response = await app.request(url.toString());
    if (!response.ok) return response;
    const envelope = await response.json();
    const linkage = (r: Resource) => ({ type: r.type, id: r.id });
    envelope.data = Array.isArray(envelope.data) ? envelope.data.map(linkage) : linkage(envelope.data);
    if (envelope.links?.next) envelope.links.next = envelope.links.next.replace(url.pathname, new URL(c.req.url).pathname);
    return c.json(envelope);
  });

}
