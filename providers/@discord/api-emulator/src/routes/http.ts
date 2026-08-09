type Entity = { id: number; created_at: string; updated_at: string };
type CollectionLike<T extends Entity> = {
  all(): T[];
  insert(data: Omit<T, "id" | "created_at" | "updated_at">): T;
  update(id: number, data: Partial<T>): T | undefined;
  delete(id: number): boolean;
  findOneBy(field: keyof T, value: string | number): T | undefined;
};
type StoreLike = { collection<T extends Entity>(name: string, indexes: string[]): CollectionLike<T> };
type ContextLike = { req: { param(n: string): string; query(n: string): string | undefined; json(): Promise<Record<string, unknown>>; header(n: string): string | undefined }; json(p: unknown, s?: number): Response; body(p: null, s: number): Response; redirect(url: string, status?: number): Response; html?(p: string, s?: number): Response };
type Handler = (c: ContextLike) => Promise<Response> | Response;
type AppLike = { get(path: string, h: Handler): void; post(path: string, h: Handler): void; put(path: string, h: Handler): void; patch(path: string, h: Handler): void; delete(path: string, h: Handler): void };

type DiscordUser = Entity & { discord_id: string; username: string; discriminator: string; global_name: string | null; bot: boolean };
type DiscordGuild = Entity & { guild_id: string; name: string; owner_id: string };
type DiscordChannel = Entity & { channel_id: string; guild_id: string; name: string; type: number; position: number; parent_id: string | null };
type DiscordMessage = Entity & { message_id: string; channel_id: string; author_id: string; content: string; timestamp: string };
type DiscordMember = Entity & { guild_id: string; user_id: string; nick: string | null; roles: string[]; joined_at: string; communication_disabled_until: string | null };
type DiscordRole = Entity & { role_id: string; guild_id: string; name: string; color: number; permissions: string; position: number; managed: boolean; mentionable: boolean };
type DiscordApplication = Entity & { client_id: string; client_secret: string; name: string; redirect_uris: string[]; bot_token: string };
type DiscordCode = Entity & { code: string; client_id: string; user_id: string; redirect_uri: string; scope: string };
type DiscordAuditEntry = Entity & { audit_id: string; guild_id: string; user_id: string; target_id: string | null; action_type: number; reason: string | null; changes: unknown[] };
type DiscordAutomodRule = Entity & { rule_id: string; guild_id: string; name: string; creator_id: string; event_type: number; trigger_type: number; trigger_metadata: Record<string, unknown>; actions: unknown[]; enabled: boolean; exempt_roles: string[]; exempt_channels: string[] };
type DiscordBan = Entity & { guild_id: string; user_id: string; reason: string | null };

export interface DiscordSeedConfig {
  discord?: {
    bot_token?: string;
    application?: { client_id?: string; client_secret?: string; name?: string; redirect_uris?: string[] };
    guilds?: Array<{
      id?: string;
      name: string;
      channels?: Array<{ name: string; type?: number }>;
      members?: Array<{ username: string; nick?: string; roles?: string[]; bot?: boolean }>;
      messages?: Array<{ channel?: string; author?: string; content: string }>;
    }>;
  };
}

export function getDiscordStore(store: StoreLike) {
  return {
    users: store.collection<DiscordUser>("discord.users", ["discord_id", "username"]),
    guilds: store.collection<DiscordGuild>("discord.guilds", ["guild_id"]),
    channels: store.collection<DiscordChannel>("discord.channels", ["channel_id", "guild_id", "name"]),
    messages: store.collection<DiscordMessage>("discord.messages", ["message_id", "channel_id"]),
    members: store.collection<DiscordMember>("discord.members", ["guild_id", "user_id"]),
    roles: store.collection<DiscordRole>("discord.roles", ["role_id", "guild_id", "name"]),
    apps: store.collection<DiscordApplication>("discord.apps", ["client_id"]),
    codes: store.collection<DiscordCode>("discord.codes", ["code"]),
    audit: store.collection<DiscordAuditEntry>("discord.audit", ["audit_id", "guild_id"]),
    automod: store.collection<DiscordAutomodRule>("discord.automod", ["rule_id", "guild_id"]),
    bans: store.collection<DiscordBan>("discord.bans", ["guild_id", "user_id"]),
  };
}

function snowflake(): string {
  return String((BigInt(Date.now() - 1420070400000) << 22n) + BigInt(Math.floor(Math.random() * 4194304)));
}

function botUser(store: StoreLike): DiscordUser {
  const users = getDiscordStore(store).users;
  return users.all().find((user) => user.bot) ?? users.insert({
    discord_id: snowflake(), username: "simulation-bot", discriminator: "0000", global_name: "Simulation Bot", bot: true,
  });
}

async function body(c: ContextLike): Promise<Record<string, any>> {
  try { return await c.req.json() as Record<string, any>; } catch { return {}; }
}

function userJson(user: DiscordUser) {
  return { id: user.discord_id, username: user.username, discriminator: user.discriminator, global_name: user.global_name, bot: user.bot };
}

function guildJson(guild: DiscordGuild, store: StoreLike) {
  const members = getDiscordStore(store).members.all().filter((member) => member.guild_id === guild.guild_id);
  return { id: guild.guild_id, name: guild.name, owner_id: guild.owner_id, approximate_member_count: members.length, approximate_presence_count: members.length };
}

function channelJson(channel: DiscordChannel) {
  return { id: channel.channel_id, guild_id: channel.guild_id, name: channel.name, type: channel.type, position: channel.position, parent_id: channel.parent_id };
}

function roleJson(role: DiscordRole, store: StoreLike) {
  const memberCount = getDiscordStore(store).members.all().filter((member) => member.guild_id === role.guild_id && member.roles.includes(role.role_id)).length;
  return { id: role.role_id, name: role.name, color: role.color, permissions: role.permissions, position: role.position, managed: role.managed, mentionable: role.mentionable, member_count: memberCount };
}

function memberJson(member: DiscordMember, store: StoreLike) {
  const user = getDiscordStore(store).users.findOneBy("discord_id", member.user_id);
  return { user: user ? userJson(user) : { id: member.user_id, username: "unknown", global_name: null, bot: false }, nick: member.nick, roles: member.roles, joined_at: member.joined_at, communication_disabled_until: member.communication_disabled_until, deaf: false, mute: false, flags: 0 };
}

function messageJson(message: DiscordMessage, store: StoreLike) {
  const author = getDiscordStore(store).users.findOneBy("discord_id", message.author_id) ?? botUser(store);
  return { id: message.message_id, channel_id: message.channel_id, content: message.content, timestamp: message.timestamp, edited_timestamp: null, author: userJson(author), attachments: [], embeds: [], mentions: [], pinned: false, type: 0 };
}

function automodJson(rule: DiscordAutomodRule) {
  return { id: rule.rule_id, guild_id: rule.guild_id, name: rule.name, creator_id: rule.creator_id, event_type: rule.event_type, trigger_type: rule.trigger_type, trigger_metadata: rule.trigger_metadata, actions: rule.actions, enabled: rule.enabled, exempt_roles: rule.exempt_roles, exempt_channels: rule.exempt_channels };
}

function decodeReason(value: string | undefined): string | null {
  if (!value) return null;
  try { return decodeURIComponent(value); } catch { return value; }
}

function addAudit(store: StoreLike, guildId: string, targetId: string | null, actionType: number, reason: string | null, changes: unknown[] = []): void {
  getDiscordStore(store).audit.insert({ audit_id: snowflake(), guild_id: guildId, user_id: botUser(store).discord_id, target_id: targetId, action_type: actionType, reason, changes });
}

function findMember(store: StoreLike, guildId: string, userId: string): DiscordMember | undefined {
  return getDiscordStore(store).members.all().find((member) => member.guild_id === guildId && member.user_id === userId);
}

const defaultConfig: DiscordSeedConfig = {
  discord: {
    bot_token: "discord-emulator-bot-token",
    application: { client_id: "discord-test-client", client_secret: "discord-test-secret" },
    guilds: [{
      name: "Simulation Guild",
      channels: [{ name: "general" }, { name: "operations" }],
      members: [
        { username: "sample-admin", nick: "Sample Admin" },
        { username: "sample-member", nick: "Sample Member" },
      ],
      messages: [
        { channel: "general", author: "sample-member", content: "This is a generic message for local simulation." },
        { channel: "operations", author: "sample-admin", content: "The scheduled deployment simulation completed successfully." },
        { channel: "operations", author: "simulation-bot", content: "Automated check finished with no action required." },
      ],
    }],
  },
};

export function seedDefaults(store: StoreLike): void {
  seedFromConfig(store, "", defaultConfig);
}

export function seedFromConfig(store: StoreLike, _baseUrl: string, config: DiscordSeedConfig): void {
  const s = getDiscordStore(store);
  const bot = botUser(store);
  const app = config.discord?.application ?? {};
  if (!s.apps.findOneBy("client_id", app.client_id ?? "discord-test-client")) {
    s.apps.insert({ client_id: app.client_id ?? "discord-test-client", client_secret: app.client_secret ?? "discord-test-secret", name: app.name ?? "Discord Emulator", redirect_uris: app.redirect_uris ?? ["http://localhost:3000/callback"], bot_token: config.discord?.bot_token ?? "discord-emulator-bot-token" });
  }

  for (const seed of config.discord?.guilds ?? defaultConfig.discord!.guilds!) {
    const guildId = seed.id ?? snowflake();
    if (s.guilds.findOneBy("guild_id", guildId)) continue;
    const memberSeeds = seed.members ?? defaultConfig.discord!.guilds![0].members!;
    const ownerSeed = memberSeeds[0] ?? { username: "sample-admin" };
    let owner = s.users.findOneBy("username", ownerSeed.username);
    if (!owner) owner = s.users.insert({ discord_id: snowflake(), username: ownerSeed.username, discriminator: "0000", global_name: ownerSeed.nick ?? null, bot: Boolean(ownerSeed.bot) });
    const guild = s.guilds.insert({ guild_id: guildId, name: seed.name, owner_id: owner.discord_id });
    const everyone = s.roles.insert({ role_id: guild.guild_id, guild_id: guild.guild_id, name: "@everyone", color: 0, permissions: "0", position: 0, managed: false, mentionable: false });
    const moderator = s.roles.insert({ role_id: snowflake(), guild_id: guild.guild_id, name: "Moderator", color: 0, permissions: "0", position: 1, managed: false, mentionable: false });

    s.members.insert({ guild_id: guild.guild_id, user_id: bot.discord_id, nick: "Simulation Bot", roles: [everyone.role_id, moderator.role_id], joined_at: new Date().toISOString(), communication_disabled_until: null });
    for (const memberSeed of memberSeeds) {
      let user = s.users.findOneBy("username", memberSeed.username);
      if (!user) user = s.users.insert({ discord_id: snowflake(), username: memberSeed.username, discriminator: "0000", global_name: memberSeed.nick ?? null, bot: Boolean(memberSeed.bot) });
      const namedRoles = memberSeed.roles ?? (memberSeed === ownerSeed ? ["Moderator"] : []);
      const roles = [everyone.role_id, ...namedRoles.map((name) => s.roles.all().find((role) => role.guild_id === guild.guild_id && role.name === name)?.role_id).filter((id): id is string => Boolean(id))];
      s.members.insert({ guild_id: guild.guild_id, user_id: user.discord_id, nick: memberSeed.nick ?? null, roles, joined_at: new Date().toISOString(), communication_disabled_until: null });
    }

    const channels = (seed.channels ?? defaultConfig.discord!.guilds![0].channels!).map((channelSeed, position) => s.channels.insert({ channel_id: snowflake(), guild_id: guild.guild_id, name: channelSeed.name, type: channelSeed.type ?? 0, position, parent_id: null }));
    for (const messageSeed of seed.messages ?? defaultConfig.discord!.guilds![0].messages!) {
      const channel = channels.find((item) => item.name === (messageSeed.channel ?? "general")) ?? channels[0];
      const author = s.users.findOneBy("username", messageSeed.author ?? "simulation-bot") ?? bot;
      if (channel) s.messages.insert({ message_id: snowflake(), channel_id: channel.channel_id, author_id: author.discord_id, content: messageSeed.content, timestamp: new Date().toISOString() });
    }

    s.automod.insert({ rule_id: snowflake(), guild_id: guild.guild_id, name: "Generic spam protection", creator_id: bot.discord_id, event_type: 1, trigger_type: 3, trigger_metadata: { mention_total_limit: 10, mention_raid_protection_enabled: true }, actions: [{ type: 1, metadata: { custom_message: "This message was blocked by the simulation rule." } }], enabled: true, exempt_roles: [], exempt_channels: [] });
  }
}

export function registerRoutes(app: AppLike, store: StoreLike): void {
  app.get("/api/v10/users/@me", (c) => c.json(userJson(botUser(store))));
  app.get("/api/users/@me", (c) => c.json(userJson(botUser(store))));
  app.get("/api/v10/guilds", (c) => c.json(getDiscordStore(store).guilds.all().map((guild) => guildJson(guild, store))));
  app.post("/api/v10/guilds", async (c) => {
    const input = await body(c);
    const guild = getDiscordStore(store).guilds.insert({ guild_id: snowflake(), name: String(input.name ?? "New Guild"), owner_id: botUser(store).discord_id });
    getDiscordStore(store).members.insert({ guild_id: guild.guild_id, user_id: guild.owner_id, nick: null, roles: [], joined_at: new Date().toISOString(), communication_disabled_until: null });
    return c.json(guildJson(guild, store), 201);
  });
  app.get("/api/v10/guilds/:guildId", (c) => {
    const guild = getDiscordStore(store).guilds.findOneBy("guild_id", c.req.param("guildId"));
    return guild ? c.json(guildJson(guild, store)) : c.json({ message: "Unknown Guild", code: 10004 }, 404);
  });
  app.patch("/api/v10/guilds/:guildId", async (c) => {
    const s = getDiscordStore(store); const guild = s.guilds.findOneBy("guild_id", c.req.param("guildId"));
    if (!guild) return c.json({ message: "Unknown Guild", code: 10004 }, 404);
    return c.json(guildJson(s.guilds.update(guild.id, { name: String((await body(c)).name ?? guild.name) }) ?? guild, store));
  });
  app.delete("/api/v10/guilds/:guildId", (c) => {
    const guild = getDiscordStore(store).guilds.findOneBy("guild_id", c.req.param("guildId"));
    if (!guild) return c.json({ message: "Unknown Guild", code: 10004 }, 404);
    getDiscordStore(store).guilds.delete(guild.id); return c.json({});
  });

  app.get("/api/v10/guilds/:guildId/channels", (c) => c.json(getDiscordStore(store).channels.all().filter((channel) => channel.guild_id === c.req.param("guildId")).map(channelJson)));
  app.post("/api/v10/guilds/:guildId/channels", async (c) => {
    const input = await body(c); const channels = getDiscordStore(store).channels.all().filter((channel) => channel.guild_id === c.req.param("guildId"));
    const channel = getDiscordStore(store).channels.insert({ channel_id: snowflake(), guild_id: c.req.param("guildId"), name: String(input.name ?? "channel"), type: Number(input.type ?? 0), position: channels.length, parent_id: null });
    return c.json(channelJson(channel), 201);
  });
  app.get("/api/v10/channels/:channelId", (c) => { const channel = getDiscordStore(store).channels.findOneBy("channel_id", c.req.param("channelId")); return channel ? c.json(channelJson(channel)) : c.json({ message: "Unknown Channel", code: 10003 }, 404); });
  app.patch("/api/v10/channels/:channelId", async (c) => { const s = getDiscordStore(store); const channel = s.channels.findOneBy("channel_id", c.req.param("channelId")); if (!channel) return c.json({ message: "Unknown Channel", code: 10003 }, 404); return c.json(channelJson(s.channels.update(channel.id, { name: String((await body(c)).name ?? channel.name) }) ?? channel)); });
  app.delete("/api/v10/channels/:channelId", (c) => { const s = getDiscordStore(store); const channel = s.channels.findOneBy("channel_id", c.req.param("channelId")); if (!channel) return c.json({ message: "Unknown Channel", code: 10003 }, 404); s.channels.delete(channel.id); return c.json(channelJson(channel)); });

  app.get("/api/v10/channels/:channelId/messages", (c) => {
    const limit = Math.min(Math.max(Number(c.req.query("limit") ?? 50), 1), 100);
    const messages = getDiscordStore(store).messages.all().filter((message) => message.channel_id === c.req.param("channelId")).sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, limit);
    return c.json(messages.map((message) => messageJson(message, store)));
  });
  app.post("/api/v10/channels/:channelId/messages", async (c) => { const message = getDiscordStore(store).messages.insert({ message_id: snowflake(), channel_id: c.req.param("channelId"), author_id: botUser(store).discord_id, content: String((await body(c)).content ?? ""), timestamp: new Date().toISOString() }); return c.json(messageJson(message, store), 201); });
  app.get("/api/v10/channels/:channelId/messages/:messageId", (c) => { const message = getDiscordStore(store).messages.findOneBy("message_id", c.req.param("messageId")); return message ? c.json(messageJson(message, store)) : c.json({ message: "Unknown Message", code: 10008 }, 404); });
  app.patch("/api/v10/channels/:channelId/messages/:messageId", async (c) => { const s = getDiscordStore(store); const message = s.messages.findOneBy("message_id", c.req.param("messageId")); if (!message) return c.json({ message: "Unknown Message", code: 10008 }, 404); return c.json(messageJson(s.messages.update(message.id, { content: String((await body(c)).content ?? message.content) }) ?? message, store)); });
  app.delete("/api/v10/channels/:channelId/messages/:messageId", (c) => { const s = getDiscordStore(store); const message = s.messages.findOneBy("message_id", c.req.param("messageId")); if (!message) return c.json({ message: "Unknown Message", code: 10008 }, 404); s.messages.delete(message.id); return c.json({}); });

  app.get("/api/v10/guilds/:guildId/messages/search", (c) => {
    const s = getDiscordStore(store); const content = (c.req.query("content") ?? "").toLowerCase(); const limit = Math.min(Math.max(Number(c.req.query("limit") ?? 25), 1), 25);
    const channelIds = new Set(s.channels.all().filter((channel) => channel.guild_id === c.req.param("guildId")).map((channel) => channel.channel_id));
    const matches = s.messages.all().filter((message) => channelIds.has(message.channel_id) && message.content.toLowerCase().includes(content));
    return c.json({ analytics_id: "simulation-search", messages: matches.slice(0, limit).map((message) => [messageJson(message, store)]), total_results: matches.length });
  });
  app.get("/api/v10/guilds/:guildId/members/search", (c) => {
    const s = getDiscordStore(store); const query = (c.req.query("query") ?? "").toLowerCase(); const limit = Math.min(Math.max(Number(c.req.query("limit") ?? 1), 1), 1000);
    const members = s.members.all().filter((member) => member.guild_id === c.req.param("guildId")).filter((member) => { const user = s.users.findOneBy("discord_id", member.user_id); return [member.nick, user?.username, user?.global_name].some((value) => value?.toLowerCase().startsWith(query)); }).slice(0, limit);
    return c.json(members.map((member) => memberJson(member, store)));
  });
  app.get("/api/v10/guilds/:guildId/members", (c) => { const limit = Math.min(Math.max(Number(c.req.query("limit") ?? 1), 1), 1000); return c.json(getDiscordStore(store).members.all().filter((member) => member.guild_id === c.req.param("guildId")).slice(0, limit).map((member) => memberJson(member, store))); });
  app.get("/api/v10/guilds/:guildId/members/:userId", (c) => { const member = findMember(store, c.req.param("guildId"), c.req.param("userId")); return member ? c.json(memberJson(member, store)) : c.json({ message: "Unknown Member", code: 10007 }, 404); });
  app.put("/api/v10/guilds/:guildId/members/:userId", async (c) => { const input = await body(c); const member = getDiscordStore(store).members.insert({ guild_id: c.req.param("guildId"), user_id: c.req.param("userId"), nick: typeof input.nick === "string" ? input.nick : null, roles: Array.isArray(input.roles) ? input.roles as string[] : [], joined_at: new Date().toISOString(), communication_disabled_until: null }); return c.json(memberJson(member, store), 201); });
  app.patch("/api/v10/guilds/:guildId/members/:userId", async (c) => {
    const s = getDiscordStore(store); const member = findMember(store, c.req.param("guildId"), c.req.param("userId")); if (!member) return c.json({ message: "Unknown Member", code: 10007 }, 404);
    const input = await body(c); const updated = s.members.update(member.id, { nick: input.nick === null || typeof input.nick === "string" ? input.nick : member.nick, roles: Array.isArray(input.roles) ? input.roles as string[] : member.roles, communication_disabled_until: input.communication_disabled_until === null || typeof input.communication_disabled_until === "string" ? input.communication_disabled_until : member.communication_disabled_until }) ?? member;
    addAudit(store, member.guild_id, member.user_id, 24, decodeReason(c.req.header("X-Audit-Log-Reason"))); return c.json(memberJson(updated, store));
  });
  app.delete("/api/v10/guilds/:guildId/members/:userId", (c) => { const s = getDiscordStore(store); const member = findMember(store, c.req.param("guildId"), c.req.param("userId")); if (member) { s.members.delete(member.id); addAudit(store, member.guild_id, member.user_id, 20, decodeReason(c.req.header("X-Audit-Log-Reason"))); } return c.body(null, 204); });
  app.put("/api/v10/guilds/:guildId/members/:userId/roles/:roleId", (c) => { const s = getDiscordStore(store); const member = findMember(store, c.req.param("guildId"), c.req.param("userId")); if (!member) return c.json({ message: "Unknown Member", code: 10007 }, 404); const roleId = c.req.param("roleId"); if (!member.roles.includes(roleId)) s.members.update(member.id, { roles: [...member.roles, roleId] }); addAudit(store, member.guild_id, member.user_id, 25, decodeReason(c.req.header("X-Audit-Log-Reason"))); return c.body(null, 204); });
  app.delete("/api/v10/guilds/:guildId/members/:userId/roles/:roleId", (c) => { const s = getDiscordStore(store); const member = findMember(store, c.req.param("guildId"), c.req.param("userId")); if (!member) return c.json({ message: "Unknown Member", code: 10007 }, 404); s.members.update(member.id, { roles: member.roles.filter((role) => role !== c.req.param("roleId")) }); addAudit(store, member.guild_id, member.user_id, 25, decodeReason(c.req.header("X-Audit-Log-Reason"))); return c.body(null, 204); });

  app.get("/api/v10/guilds/:guildId/roles", (c) => c.json(getDiscordStore(store).roles.all().filter((role) => role.guild_id === c.req.param("guildId")).map((role) => roleJson(role, store))));
  app.post("/api/v10/guilds/:guildId/roles", async (c) => { const s = getDiscordStore(store); const input = await body(c); const roles = s.roles.all().filter((role) => role.guild_id === c.req.param("guildId")); const role = s.roles.insert({ role_id: snowflake(), guild_id: c.req.param("guildId"), name: String(input.name ?? "new role"), color: Number(input.color ?? 0), permissions: String(input.permissions ?? "0"), position: roles.length, managed: false, mentionable: Boolean(input.mentionable) }); return c.json(roleJson(role, store), 201); });
  app.patch("/api/v10/guilds/:guildId/roles/:roleId", async (c) => { const s = getDiscordStore(store); const role = s.roles.findOneBy("role_id", c.req.param("roleId")); if (!role) return c.json({ message: "Unknown Role", code: 10011 }, 404); const input = await body(c); const updated = s.roles.update(role.id, { name: String(input.name ?? role.name), permissions: String(input.permissions ?? role.permissions), mentionable: input.mentionable === undefined ? role.mentionable : Boolean(input.mentionable) }) ?? role; return c.json(roleJson(updated, store)); });
  app.delete("/api/v10/guilds/:guildId/roles/:roleId", (c) => { const s = getDiscordStore(store); const role = s.roles.findOneBy("role_id", c.req.param("roleId")); if (role) s.roles.delete(role.id); return c.body(null, 204); });

  app.get("/api/v10/guilds/:guildId/audit-logs", (c) => { const s = getDiscordStore(store); const limit = Math.min(Math.max(Number(c.req.query("limit") ?? 50), 1), 100); const entries = s.audit.all().filter((entry) => entry.guild_id === c.req.param("guildId")).slice(-limit).reverse(); const userIds = new Set(entries.map((entry) => entry.user_id)); return c.json({ audit_log_entries: entries.map((entry) => ({ id: entry.audit_id, target_id: entry.target_id, user_id: entry.user_id, action_type: entry.action_type, reason: entry.reason, changes: entry.changes })), users: s.users.all().filter((user) => userIds.has(user.discord_id)).map(userJson), application_commands: [], auto_moderation_rules: [], guild_scheduled_events: [], integrations: [], threads: [], webhooks: [] }); });
  app.get("/api/v10/guilds/:guildId/auto-moderation/rules", (c) => c.json(getDiscordStore(store).automod.all().filter((rule) => rule.guild_id === c.req.param("guildId")).map(automodJson)));
  app.put("/api/v10/guilds/:guildId/bans/:userId", async (c) => { const s = getDiscordStore(store); const reason = decodeReason(c.req.header("X-Audit-Log-Reason")); if (!s.bans.all().some((ban) => ban.guild_id === c.req.param("guildId") && ban.user_id === c.req.param("userId"))) s.bans.insert({ guild_id: c.req.param("guildId"), user_id: c.req.param("userId"), reason }); const member = findMember(store, c.req.param("guildId"), c.req.param("userId")); if (member) s.members.delete(member.id); addAudit(store, c.req.param("guildId"), c.req.param("userId"), 22, reason); await body(c); return c.body(null, 204); });

  app.get("/oauth2/authorize", (c) => c.json({ authorize: true, client_id: c.req.query("client_id"), redirect_uri: c.req.query("redirect_uri") }));
  app.post("/oauth2/authorize/callback", async (c) => { const input = await body(c); const code = crypto.randomUUID(); getDiscordStore(store).codes.insert({ code, client_id: String(input.client_id), redirect_uri: String(input.redirect_uri), scope: String(input.scope ?? "identify"), user_id: botUser(store).discord_id }); return c.json({ code, state: input.state }); });
  const token = async (c: ContextLike) => { const input = await body(c); const code = getDiscordStore(store).codes.findOneBy("code", String(input.code)); if (input.grant_type === "authorization_code" && !code) return c.json({ error: "invalid_grant" }, 400); return c.json({ access_token: `discord-access-${crypto.randomUUID()}`, token_type: "Bearer", expires_in: 604800, scope: code?.scope ?? input.scope ?? "identify" }); };
  app.post("/oauth2/token", token); app.post("/api/oauth2/token", token); app.post("/api/v10/oauth2/token", token);
  app.get("/", (c) => { const s = getDiscordStore(store); return c.json({ users: s.users.all().map(userJson), guilds: s.guilds.all().map((guild) => guildJson(guild, store)), channels: s.channels.all().map(channelJson), messages: s.messages.all().map((message) => messageJson(message, store)) }); });
}
