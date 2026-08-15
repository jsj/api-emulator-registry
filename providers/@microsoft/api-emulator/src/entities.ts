import type { Entity } from "@api-emulator/core";

export interface MicrosoftUser extends Entity {
  /** Object ID (oid) — unique per-tenant user identifier */
  oid: string;
  email: string;
  name: string;
  given_name: string;
  family_name: string;
  email_verified: boolean;
  /** Microsoft tenant ID */
  tenant_id: string;
  /** User principal name (usually email) */
  preferred_username: string;
}

export interface MicrosoftOAuthClient extends Entity {
  client_id: string;
  client_secret: string;
  name: string;
  redirect_uris: string[];
  /** Tenant ID this app is registered in */
  tenant_id: string;
}

export interface MicrosoftTeam extends Entity {
  team_id: string;
  display_name: string;
  description: string;
  tenant_id: string;
}

export interface MicrosoftChannel extends Entity {
  channel_id: string;
  team_id: string;
  display_name: string;
  description: string;
  membership_type: "standard" | "private" | "shared";
}

export interface MicrosoftChannelMessage extends Entity {
  message_id: string;
  team_id: string;
  channel_id: string;
  created_date_time: string;
  last_modified_date_time: string;
  content_type: "text" | "html";
  content: string;
  from_user_id: string;
  from_display_name: string;
}
