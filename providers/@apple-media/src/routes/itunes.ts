import type { RouteContext, Store } from "@api-emulator/core";
import { existsSync, readFileSync } from "node:fs";

/**
 * iTunes Search / Lookup API emulator.
 *
 * Serves both the raw Apple endpoints (`/search`, `/lookup`) and the
 * xc-cli proxied paths (`/v1/app-store/search`, `/v1/app-store/lookup`,
 * `/v1/app-store/storefront`) so the emulator works whether the client
 * hits iTunes directly or goes through `AppStoreBackendRequestMapper`.
 */

interface ITunesApp {
  trackId: number;
  trackName: string;
  bundleId: string;
  sellerName: string;
  primaryGenreName: string;
  averageUserRating: number;
  userRatingCount: number;
  description: string;
  screenshotUrls: string[];
  ipadScreenshotUrls: string[];
  appletvScreenshotUrls: string[];
  supportedDevices: string[];
}

interface ITunesAudiobook {
  collectionId: number;
  collectionName: string;
  artistName: string;
  artworkUrl100: string;
  collectionViewUrl: string;
  artistViewUrl: string;
  description: string;
  releaseDate: string;
  primaryGenreName: string;
  previewUrl: string;
  collectionPrice: number;
  currency: string;
}

const audiobookFixtures = [
  [1808184252, "The Calamity Club", "Kathryn Stockett", "Fiction"],
  [1808184253, "Yesteryear", "Caro Claire Burke", "Fiction"],
  [1808184254, "Dungeon Crawler Carl", "Matt Dinniman", "Fiction"],
  [1808184255, "Theo of Golden", "Allen Levi", "Fiction"],
  [1808184256, "The Divorce", "Freida McFadden", "Fiction"],
  [1808184257, "Whistler", "Ann Patchett", "Fiction"],
  [1808184258, "Regime Change", "Maggie Haberman and Jonathan Swan", "Nonfiction"],
  [1808184259, "Strangers", "Belle Burden", "Nonfiction"],
  [1808184260, "The Land and Its People", "David Sedaris", "Nonfiction"],
  [1808184261, "Communion", "JD Vance", "Nonfiction"],
  [1808184262, "Famesick", "Lena Dunham", "Nonfiction"],
  [1808184263, "London Falling", "Patrick Radden Keefe", "Nonfiction"],
] as const;

function getAudiobooks(baseUrl: string): ITunesAudiobook[] {
  return audiobookFixtures.map(([collectionId, collectionName, artistName, genre]) => ({
    collectionId,
    collectionName,
    artistName,
    artworkUrl100: `${baseUrl}/fixtures/audiobook-covers/${collectionId}/100x100bb.jpg?fixture=real-v1`,
    collectionViewUrl: `${baseUrl}/us/audiobook/id${collectionId}`,
    artistViewUrl: `${baseUrl}/us/author/${encodeURIComponent(artistName)}`,
    description: `A deterministic ${genre.toLowerCase()} audiobook fixture for local development.`,
    releaseDate: "2026-07-21T00:00:00Z",
    primaryGenreName: genre,
    previewUrl: `${baseUrl}/fixtures/audiobook-preview/${collectionId}.m4a`,
    collectionPrice: 14.99,
    currency: "USD",
  }));
}

function getApps(store: Store): ITunesApp[] {
  return store.getData<ITunesApp[]>("itunes.apps") ?? [];
}

function searchApps(apps: ITunesApp[], term: string, limit: number): ITunesApp[] {
  const lower = term.toLowerCase();
  const matched = apps.filter(
    (a) =>
      a.trackName.toLowerCase().includes(lower) ||
      a.bundleId.toLowerCase().includes(lower) ||
      a.description.toLowerCase().includes(lower),
  );
  return matched.slice(0, limit);
}

function itunesResponse(results: ITunesApp[]) {
  return { resultCount: results.length, results };
}

export function itunesRoutes({ app, store, baseUrl }: RouteContext): void {
  // --- Raw iTunes endpoints ---

  app.get("/search", (c) => {
    const term = c.req.query("term") ?? "";
    const limit = parseInt(c.req.query("limit") ?? "10", 10);
    if (c.req.query("media") === "audiobook" || c.req.query("entity") === "audiobook") {
      const words = term.toLowerCase().split(/\s+/).filter(Boolean);
      const results = getAudiobooks(baseUrl)
        .filter((book) => {
          const haystack = `${book.collectionName} ${book.artistName}`.toLowerCase();
          return !words.length || words.every((word) => haystack.includes(word));
        })
        .slice(0, limit);
      return c.json({ resultCount: results.length, results });
    }
    const results = searchApps(getApps(store), term, limit);
    return c.json(itunesResponse(results));
  });

  app.get("/api/v2/us/audio-books/top/:limit/audio-books.json", (c) => {
    const limit = Math.max(1, parseInt(c.req.param("limit") ?? "10", 10));
    const results = getAudiobooks(baseUrl).slice(0, limit).map((book) => ({
      id: String(book.collectionId),
      name: book.collectionName,
      artistName: book.artistName,
      artworkUrl100: book.artworkUrl100,
      url: book.collectionViewUrl,
      genres: [{ name: book.primaryGenreName }, { name: "Audiobooks" }],
    }));
    return c.json({ feed: { title: "Top Audiobooks", results } });
  });

  app.get("/fixtures/audiobook-covers/:id/:size", (c) => {
    const id = Number(c.req.param("id"));
    const book = getAudiobooks(baseUrl).find((item) => item.collectionId === id);
    if (!book) return c.notFound();
    const sourceFixture = new URL(`../../fixtures/audiobook-covers/${id}.jpg`, import.meta.url);
    const bundledFixture = new URL(`./fixtures/audiobook-covers/${id}.jpg`, import.meta.url);
    const cover = readFileSync(existsSync(sourceFixture) ? sourceFixture : bundledFixture);
    c.header("content-type", "image/jpeg");
    c.header("cache-control", "public, max-age=31536000, immutable");
    return c.body(cover);
  });

  app.get("/lookup", (c) => {
    const id = c.req.query("id") ?? "";
    const apps = getApps(store);
    const found = apps.filter((a) => String(a.trackId) === id);
    return c.json(itunesResponse(found));
  });

  // --- xc-cli proxied endpoints ---

  app.get("/v1/app-store/search", (c) => {
    const term = c.req.query("term") ?? "";
    const limit = parseInt(c.req.query("limit") ?? "10", 10);
    const results = searchApps(getApps(store), term, limit);
    return c.json(itunesResponse(results));
  });

  app.get("/v1/app-store/lookup", (c) => {
    const appId = c.req.query("appId") ?? "";
    const apps = getApps(store);
    const found = apps.filter((a) => String(a.trackId) === appId);
    return c.json(itunesResponse(found));
  });

  // Storefront (screenshot HTML scraping fallback) — return minimal HTML
  app.get("/v1/app-store/storefront", (c) => {
    const appId = c.req.query("appId") ?? "";
    const apps = getApps(store);
    const found = apps.find((a) => String(a.trackId) === appId);
    if (!found || found.screenshotUrls.length === 0) {
      return c.html("<html><body></body></html>");
    }
    // Return minimal HTML that AppStoreStorefrontScreenshotParser can extract
    const pictures = found.screenshotUrls
      .map((url) => `<picture><source srcset="${url} 460w"></picture>`)
      .join("\n");
    return c.html(`<html><body><section id="product_media_screenshots">${pictures}</section><div class="platform-description"></div></body></html>`);
  });

  // Storefront direct path (apps.apple.com/:store/app/id:appId)
  app.get("/:store/app/id:appId", (c) => {
    const appId = c.req.param("appId");
    const apps = getApps(store);
    const found = apps.find((a) => String(a.trackId) === appId);
    if (!found) {
      return c.html("<html><body></body></html>");
    }
    const pictures = found.screenshotUrls
      .map((url) => `<picture><source srcset="${url} 460w"></picture>`)
      .join("\n");
    return c.html(`<html><body><section id="product_media_screenshots">${pictures}</section><div class="platform-description"></div></body></html>`);
  });
}

// --- Seed support ---

export interface ITunesSeedConfig {
  apps?: Array<{
    trackId: number;
    trackName: string;
    bundleId: string;
    sellerName?: string;
    primaryGenreName?: string;
    averageUserRating?: number;
    userRatingCount?: number;
    description?: string;
    screenshotUrls?: string[];
  }>;
}

export function seedITunes(store: Store, config: ITunesSeedConfig): void {
  if (config.apps) {
    const apps: ITunesApp[] = config.apps.map((a) => ({
      trackId: a.trackId,
      trackName: a.trackName,
      bundleId: a.bundleId,
      sellerName: a.sellerName ?? "",
      primaryGenreName: a.primaryGenreName ?? "Utilities",
      averageUserRating: a.averageUserRating ?? 4.5,
      userRatingCount: a.userRatingCount ?? 100,
      description: a.description ?? "",
      screenshotUrls: a.screenshotUrls ?? [],
      ipadScreenshotUrls: [],
      appletvScreenshotUrls: [],
      supportedDevices: ["iPhone", "iPad"],
    }));
    store.setData("itunes.apps", apps);
  }
}
