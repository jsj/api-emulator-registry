import { Store, type Collection } from "@api-emulator/core";
import type { MicrosoftUser, MicrosoftOAuthClient, MicrosoftTeam, MicrosoftChannel, MicrosoftChannelMessage } from "./entities.js";

export interface MicrosoftStore {
  users: Collection<MicrosoftUser>;
  oauthClients: Collection<MicrosoftOAuthClient>;
  teams: Collection<MicrosoftTeam>;
  channels: Collection<MicrosoftChannel>;
  channelMessages: Collection<MicrosoftChannelMessage>;
}

export function getMicrosoftStore(store: Store): MicrosoftStore {
  return {
    users: store.collection<MicrosoftUser>("microsoft.users", ["oid", "email"]),
    oauthClients: store.collection<MicrosoftOAuthClient>("microsoft.oauth_clients", ["client_id"]),
    teams: store.collection<MicrosoftTeam>("microsoft.teams", ["team_id", "tenant_id"]),
    channels: store.collection<MicrosoftChannel>("microsoft.channels", ["channel_id", "team_id"]),
    channelMessages: store.collection<MicrosoftChannelMessage>("microsoft.channel_messages", ["message_id", "team_id", "channel_id"]),
  };
}
