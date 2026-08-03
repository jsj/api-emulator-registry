import type { AppEnv, RouteContext, ServicePlugin, Store, TokenMap, WebhookDispatcher } from "@api-emulator/core";
import type { Hono } from "hono";
import { itunesRoutes, seedITunes, type ITunesSeedConfig } from "./routes/itunes.js";

export const contract = {
  provider: "apple-media",
  source: "iTunes Search API and Apple Marketing Tools RSS feeds",
  docs: "https://performance-partners.apple.com/search-api",
  scope: ["itunes-search", "itunes-lookup", "apple-storefront", "apple-books-audiobooks", "apple-rss-feeds"],
  fidelity: "deterministic-media-catalog-subset",
} as const;

export const plugin: ServicePlugin = {
  name: "apple-media",
  register(
    app: Hono<AppEnv>,
    store: Store,
    webhooks: WebhookDispatcher,
    baseUrl = "",
    tokenMap?: TokenMap,
  ): void {
    itunesRoutes({ app, store, webhooks, baseUrl, tokenMap } as RouteContext);
  },
};

export function seedFromConfig(store: Store, _baseUrl: string, config: ITunesSeedConfig = {}): void {
  seedITunes(store, config);
}

export const label = "Apple Media API emulator";
export const endpoints = "iTunes search and lookup, App Store storefront metadata, Apple Books audiobook charts, and cover fixtures";
export const capabilities = contract.scope;
export const initConfig = { "apple-media": { apps: [] } };
export default plugin;
