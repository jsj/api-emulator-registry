import { describe, it, expect } from "vitest";
import { Store } from "@api-emulator/core";
import { Hono } from "hono";
import { ascPlugin } from "../asc.js";
import { assetLibraryState } from "../routes/asset-library.js";

function setup() {
  const app = new Hono(), store = new Store();
  ascPlugin.seed!(store, "http://localhost");
  ascPlugin.register(app as never, store, { dispatch: () => {}, subscribe: () => () => {} } as never, "http://localhost");
  const request = (path: string, method = "GET", data?: unknown) => app.request(path, {
    method, headers: { "Content-Type": "application/json" }, ...(data ? { body: JSON.stringify({ data }) } : {})
  });
  const rel = (type: string, id: string) => ({ data: { type, id } });
  async function reserve(kind = "Images", name = "Summer") {
    await request("/v1/apps/1234567890/assetLibrary");
    const response = await request(`/v1/appAssetLibrary${kind}`, "POST", { type: `appAssetLibrary${kind}`,
      attributes: { fileName: "test.png", fileSize: 3, category: "CREATIVE_ASSETS", referenceName: name },
      relationships: { assetLibrary: rel("appAssetLibraries", "library-1234567890") } });
    expect(response.status).toBe(201);
    return (await response.json()).data;
  }
  async function upload(kind = "Images", name = "Summer") {
    const resource = await reserve(kind, name);
    expect((await app.request(`/_asc/assets/${resource.id}`, { method: "PUT", body: "abc" })).status).toBe(200);
    const result = await request(`/v1/${resource.type}/${resource.id}`, "PATCH", { type: resource.type, id: resource.id, attributes: { uploaded: true } });
    expect(result.status).toBe(200);
    return (await result.json()).data;
  }
  return { app, store, request, rel, reserve, upload };
}

describe("Asset Library 4.5.1 subset", () => {
  it("gets a stable library and rejects unknown apps", async () => {
    const { request } = setup();
    const first = await (await request("/v1/apps/1234567890/assetLibrary")).json();
    expect((await (await request("/v1/apps/1234567890/assetLibrary")).json()).data.id).toBe(first.data.id);
    expect((await request("/v1/apps/missing/assetLibrary")).status).toBe(404);
    expect((await request(`/v1/appAssetLibraries/${first.data.id}`)).status).toBe(200);
  });
  it.each(["Images", "Videos"])("requires all bytes before committing %s", async kind => {
    const { app, request, reserve } = setup(), asset = await reserve(kind);
    const patch = { type: asset.type, id: asset.id, attributes: { uploaded: true } };
    expect((await request(`/v1/${asset.type}/${asset.id}`, "PATCH", patch)).status).toBe(409);
    expect((await app.request(`/_asc/assets/${asset.id}`, { method: "PUT", body: "a" })).status).toBe(409);
    expect((await app.request(`/_asc/assets/${asset.id}`, { method: "PUT", body: "abc" })).status).toBe(200);
    const response = await request(`/v1/${asset.type}/${asset.id}`, "PATCH", patch);
    expect((await response.json()).data.attributes.state).toBe("READY_FOR_REVIEW");
  });
  it("filters, sorts, and paginates using the original collection", async () => {
    const { request, upload, app } = setup();
    await upload("Images", "Zebra"); await upload("Images", "Apple");
    const first = await (await request("/v1/appAssetLibraries/library-1234567890/images?limit=1&sort=referenceName&filter[state]=READY_FOR_REVIEW")).json();
    expect(first.data[0].attributes.referenceName).toBe("Apple");
    expect(first.links.next).toContain("/v1/appAssetLibraries/library-1234567890/images?");
    const second = await (await app.request(first.links.next)).json();
    expect(second.data[0].attributes.referenceName).toBe("Zebra");
    expect(second.links.next).toBe(null);
    expect((await request("/v1/appAssetLibraries/library-1234567890/images?limit=201")).status).toBe(409);
  });
  it.each([
    ["Images", false], ["Images", true], ["Videos", false], ["Videos", true],
  ] as const)("advances delayed %s processing through collection-only polling (filtered=%s)", async (kind, filtered) => {
    const { request, store, upload } = setup();
    assetLibraryState(store).processingDelayReads = 2;
    const asset = await upload(kind);
    const other = await upload(kind === "Images" ? "Videos" : "Images");
    expect(asset.attributes.state).toBe("UPLOAD_COMPLETE");
    const path = `/v1/appAssetLibraries/library-1234567890/${kind.toLowerCase()}`
      + (filtered ? "?filter[state]=READY_FOR_REVIEW" : "");
    for (let read = 0; read < 3; read++) {
      const response = await request(path);
      expect(response.status).toBe(200);
      const body = await response.json();
      if (filtered && read < 2) expect(body.data).toEqual([]);
      else {
        expect(body.data.map((r: any) => r.id)).toEqual([asset.id]);
        expect(body.data[0].attributes.state).toBe(read < 2 ? "UPLOAD_COMPLETE" : "READY_FOR_REVIEW");
      }
    }
    expect(assetLibraryState(store).processing?.[asset.id]).toBeUndefined();
    expect(assetLibraryState(store).processing?.[other.id]).toBe(2);
    expect((await (await request(path)).json()).data[0].attributes.state).toBe("READY_FOR_REVIEW");
  });
  it.each(["Images", "Videos"])("shares the deterministic processing counter between collection and detail reads for %s", async kind => {
    const { request, store, upload } = setup();
    assetLibraryState(store).processingDelayReads = 2;
    const asset = await upload(kind);
    const collection = `/v1/appAssetLibraries/library-1234567890/${kind.toLowerCase()}`;
    const detail = `/v1/${asset.type}/${asset.id}`;
    expect((await (await request(collection)).json()).data[0].attributes.state).toBe("UPLOAD_COMPLETE");
    expect((await (await request(detail)).json()).data.attributes.state).toBe("UPLOAD_COMPLETE");
    expect((await (await request(collection)).json()).data[0].attributes.state).toBe("READY_FOR_REVIEW");
    expect((await (await request(detail)).json()).data.attributes.state).toBe("READY_FOR_REVIEW");
  });
  it("guards archive and poster eligibility", async () => {
    const { request, store, upload } = setup(), asset = await upload("Videos");
    const path = `/v1/${asset.type}/${asset.id}`;
    const patch = (attributes: unknown) => request(path, "PATCH", { type: asset.type, id: asset.id, attributes });
    expect((await patch({ archived: true })).status).toBe(409);
    assetLibraryState(store).media[0].attributes.state = "APPROVED";
    expect((await patch({ previewFrameTimeCode: "00:00:01:00" })).status).toBe(409);
    expect((await (await patch({ archived: true })).json()).data.attributes.state).toBe("ARCHIVED");
    expect((await (await patch({ archived: false })).json()).data.attributes.state).toBe("APPROVED");
  });
  it("creates placements, validates complete ordering, and protects assets in use", async () => {
    const { request, upload, rel } = setup(), asset = await upload();
    const make = () => request("/v1/appAssetLibraryPlacements", "POST", { type: "appAssetLibraryPlacements",
      attributes: { placementType: "APP_SCREENSHOT", placementGroup: "IPHONE_DUO_PROFILE" },
      relationships: { image: rel(asset.type, asset.id), appStoreVersionLocalization: rel("appStoreVersionLocalizations", "loc") } });
    const a = (await (await make()).json()).data, b = (await (await make()).json()).data;
    expect((await request(`/v1/${asset.type}/${asset.id}`, "DELETE")).status).toBe(409);
    const reorder = (ids: string[]) => request("/v1/appAssetLibraryPlacementOrderingRequests", "POST", {
      type: "appAssetLibraryPlacementOrderingRequests", attributes: { placementGroup: "IPHONE_DUO_PROFILE" },
      relationships: { appStoreVersionLocalization: rel("appStoreVersionLocalizations", "loc"), orderedPlacements: { data: ids.map(id => ({ type: "appAssetLibraryPlacements", id })) } } });
    expect((await reorder([a.id])).status).toBe(409);
    expect((await reorder([b.id, a.id])).status).toBe(201);
    const list = await (await request("/v1/appStoreVersionLocalizations/loc/placements")).json();
    expect(list.data.map((r: any) => r.id)).toEqual([b.id, a.id]);
    for (const id of [a.id, b.id]) expect((await request(`/v1/appAssetLibraryPlacements/${id}`, "DELETE")).status).toBe(204);
    expect((await request(`/v1/${asset.type}/${asset.id}`, "DELETE")).status).toBe(204);
  });
  it("rejects placements with missing or ambiguous media", async () => {
    const { request, rel } = setup();
    const response = await request("/v1/appAssetLibraryPlacements", "POST", { type: "appAssetLibraryPlacements", attributes: { placementType: "APP_SCREENSHOT" }, relationships: {
      image: rel("appAssetLibraryImages", "missing"), video: rel("appAssetLibraryVideos", "missing"), appEventLocalization: rel("appEventLocalizations", "loc") } });
    expect(response.status).toBe(409);
  });
  it("adds standalone assets to review and rejects incomplete assets", async () => {
    const { request, rel, upload, reserve } = setup();
    const ready = await upload("Videos"), incomplete = await reserve();
    const review = (asset: any, name: string) => request("/v1/reviewSubmissionItems", "POST", {
      type: "reviewSubmissionItems", relationships: { reviewSubmission: rel("reviewSubmissions", "submission"), [name]: rel(asset.type, asset.id) } });
    const response = await review(ready, "appAssetLibraryVideo");
    expect(response.status).toBe(201);
    expect((await response.json()).data.relationships.appAssetLibraryVideo.data.id).toBe(ready.id);
    const items = await (await request("/v1/reviewSubmissions/submission/items")).json();
    expect(items.data[0].relationships.appAssetLibraryVideo.data.id).toBe(ready.id);
    expect((await review(incomplete, "appAssetLibraryImage")).status).toBe(409);
  });

  it("returns relationship linkage and paginates relationship URLs", async () => {
    const { request, upload, app } = setup();
    await upload("Images", "A"); await upload("Images", "B");
    const library = await (await request("/v1/apps/1234567890/relationships/assetLibrary")).json();
    expect(library.data).toEqual({ type: "appAssetLibraries", id: "library-1234567890" });
    const first = await (await request("/v1/appAssetLibraries/library-1234567890/relationships/images?limit=1")).json();
    expect(first.data[0].attributes).toBeUndefined();
    expect(first.links.next).toContain("/relationships/images");
    expect((await (await app.request(first.links.next)).json()).data).toHaveLength(1);
  });

});
