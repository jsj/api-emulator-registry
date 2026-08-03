import type { Hono } from "hono";
import type { ServicePlugin, Store, WebhookDispatcher, TokenMap, AppEnv, RouteContext } from "@api-emulator/core";
import { appleIdentityRoutes } from "./routes/auth.js";
import { apnsRoutes } from "./routes/apns.js";
import { cloudKitRoutes } from "./routes/cloudkit.js";

export { getASCStore, type ASCStore } from "./store.js";
export { ascContract, ascCapabilities, ascPlugin, registerASCRoutes, seedASCDefaults, seedFromConfig, type ASCSeedConfig } from "./asc.js";
export * from "./entities.js";

export const contract = {
  provider: "apple",
  source: "Sign in with Apple, Apple APNs provider API, and CloudKit Web Services",
  docs: "https://developer.apple.com/icloud/cloudkit/",
  scope: [
    "ams-auth",
    "sign-in-with-apple-oauth",
    "apns-auth",
    "teams",
    "keys",
    "topics",
    "device-tokens",
    "notifications",
    "cloudkit-web-services",
    "icloud-app-containers",
  ],
  fidelity: "resource-model-subset",
} as const;

export const plugin: ServicePlugin = {
  name: "apple",
  register(
    app: Hono<AppEnv>,
    store: Store,
    webhooks: WebhookDispatcher = { dispatch: () => {}, subscribe: () => () => {} } as unknown as WebhookDispatcher,
    baseUrl = "",
    tokenMap?: TokenMap,
  ): void {
    const ctx: RouteContext = { app, store, webhooks, baseUrl, tokenMap };
    appleIdentityRoutes(ctx);
    apnsRoutes(ctx);
    cloudKitRoutes(ctx);
  },
};

export default plugin;

export const label = "Sign in with Apple, APNs, and CloudKit emulator";
export const endpoints = "Sign in with Apple OAuth, AMS auth, APNs notifications, CloudKit records, zones, subscriptions, and iCloud app containers";
export const capabilities = contract.scope;
export const initConfig = {
  apple: {
    emulatorBaseUrl: "same emulator origin",
    apnsProxyPath: "/apns/send",
    apnsDevicePath: "/3/device/:deviceToken",
    cloudKitBaseUrlEnv: "CLOUDKIT_API_BASE_URL",
    oauthBaseUrlEnv: "APPLEID_AUTH_BASE_URL",
  },
};
