import type { Hono } from "hono";
import type { ServicePlugin, Store, WebhookDispatcher, TokenMap, AppEnv, RouteContext } from "@api-emulator/core";
import { getMicrosoftStore } from "./store.js";
import { generateOid, DEFAULT_TENANT_ID } from "./helpers.js";
import { oauthRoutes } from "./routes/oauth.js";
import { teamsRoutes } from "./routes/teams.js";
import { graphFallbackRoutes } from "./routes/graph-fallback.js";

export { getMicrosoftStore, type MicrosoftStore } from "./store.js";
export * from "./entities.js";

export interface MicrosoftSeedConfig {
  users?: Array<{
    email: string;
    name?: string;
    given_name?: string;
    family_name?: string;
    tenant_id?: string;
  }>;
  oauth_clients?: Array<{
    client_id: string;
    client_secret: string;
    name: string;
    redirect_uris: string[];
    tenant_id?: string;
  }>;
  teams?: Array<{
    id?: string;
    display_name: string;
    description?: string;
    tenant_id?: string;
    channels?: Array<{ id?: string; display_name: string; description?: string; membership_type?: "standard" | "private" | "shared" }>;
  }>;
}

function seedDefaults(store: Store, _baseUrl: string): void {
  const ms = getMicrosoftStore(store);

  ms.users.insert({
    oid: generateOid(),
    email: "testuser@outlook.com",
    name: "Test User",
    given_name: "Test",
    family_name: "User",
    email_verified: true,
    tenant_id: DEFAULT_TENANT_ID,
    preferred_username: "testuser@outlook.com",
  });

  const teamId = "00000000-0000-0000-0000-000000000001";
  ms.teams.insert({ team_id: teamId, display_name: "Emulator Team", description: "Default Microsoft Teams workspace", tenant_id: DEFAULT_TENANT_ID });
  ms.channels.insert({ channel_id: "19:general@thread.tacv2", team_id: teamId, display_name: "General", description: "General discussion", membership_type: "standard" });
  ms.channelMessages.insert({
    message_id: "1704067200000", team_id: teamId, channel_id: "19:general@thread.tacv2",
    created_date_time: "2024-01-01T00:00:00.000Z", last_modified_date_time: "2024-01-01T00:00:00.000Z",
    content_type: "text", content: "Welcome to the Emulator Team.", from_user_id: ms.users.all()[0]!.oid, from_display_name: ms.users.all()[0]!.name,
  });
}

export function seedFromConfig(store: Store, _baseUrl: string, config: MicrosoftSeedConfig): void {
  const ms = getMicrosoftStore(store);

  if (config.users) {
    for (const u of config.users) {
      const existing = ms.users.findOneBy("email", u.email);
      if (existing) continue;

      const nameParts = (u.name ?? "").split(/\s+/);
      ms.users.insert({
        oid: generateOid(),
        email: u.email,
        name: u.name ?? u.email.split("@")[0],
        given_name: u.given_name ?? nameParts[0] ?? "",
        family_name: u.family_name ?? nameParts.slice(1).join(" ") ?? "",
        email_verified: true,
        tenant_id: u.tenant_id ?? DEFAULT_TENANT_ID,
        preferred_username: u.email,
      });
    }
  }

  if (config.oauth_clients) {
    for (const client of config.oauth_clients) {
      const existing = ms.oauthClients.findOneBy("client_id", client.client_id);
      if (existing) continue;
      ms.oauthClients.insert({
        client_id: client.client_id,
        client_secret: client.client_secret,
        name: client.name,
        redirect_uris: client.redirect_uris,
        tenant_id: client.tenant_id ?? DEFAULT_TENANT_ID,
      });
    }
  }

  for (const team of config.teams ?? []) {
    const teamId = team.id ?? generateOid();
    if (!ms.teams.findOneBy("team_id", teamId)) ms.teams.insert({ team_id: teamId, display_name: team.display_name, description: team.description ?? "", tenant_id: team.tenant_id ?? DEFAULT_TENANT_ID });
    for (const channel of team.channels ?? []) {
      const channelId = channel.id ?? `19:${generateOid()}@thread.tacv2`;
      if (!ms.channels.findOneBy("channel_id", channelId)) ms.channels.insert({ channel_id: channelId, team_id: teamId, display_name: channel.display_name, description: channel.description ?? "", membership_type: channel.membership_type ?? "standard" });
    }
  }
}

export const contract = {
  provider: "microsoft",
  source: "Microsoft Graph v1.0 documentation",
  docs: "https://learn.microsoft.com/graph/api/resources/teams-api-overview?view=graph-rest-1.0",
  scope: ["oauth", "users", "teams", "channels", "channel-messages"],
  fidelity: "stateful-core-plus-openapi-compatible-generic-fallback",
  openapiVersion: "v1.0",
  openapiOperationCount: 17531,
  openapiCommit: "bd05c95ec804b2eec35e787a524976b67f9a5e36",
} as const;

export const microsoftPlugin: ServicePlugin = {
  name: "microsoft",
  register(app: Hono<AppEnv>, store: Store, webhooks: WebhookDispatcher, baseUrl: string, tokenMap?: TokenMap): void {
    const ctx: RouteContext = { app, store, webhooks, baseUrl, tokenMap };
    oauthRoutes(ctx);
    teamsRoutes(ctx);
    graphFallbackRoutes(ctx);
  },
  seed(store: Store, baseUrl: string): void {
    seedDefaults(store, baseUrl);
  },
};

export const plugin = microsoftPlugin;
export default microsoftPlugin;
