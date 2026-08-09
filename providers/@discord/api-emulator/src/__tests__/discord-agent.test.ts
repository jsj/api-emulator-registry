import { beforeEach, describe, expect, it } from "vitest";
import { Hono } from "hono";
import { Store } from "@api-emulator/core";
import { getDiscordStore, plugin } from "../index.ts";

const base = "http://localhost:4000/api/v10";

function createTestApp() {
  const store = new Store();
  const app = new Hono();
  plugin.register(app as any, store as any);
  plugin.seed(store as any);
  const state = getDiscordStore(store as any);
  const guild = state.guilds.all()[0];
  return { app, store, state, guild };
}

describe("Discord agent compatibility", () => {
  let fixture: ReturnType<typeof createTestApp>;

  beforeEach(() => {
    fixture = createTestApp();
  });

  it("seeds a bot and only generic simulation messages", async () => {
    const me = await (await fixture.app.request(`${base}/users/@me`)).json() as any;
    expect(me.username).toBe("simulation-bot");
    expect(me.bot).toBe(true);

    const messages = fixture.state.messages.all().map((message) => message.content);
    expect(messages.length).toBeGreaterThan(0);
    expect(messages.join(" ")).not.toMatch(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    expect(messages.join(" ")).not.toMatch(/\+?\d[\d\s().-]{8,}\d/);
  });

  it("returns Discord-shaped guild, channel, role, and member objects", async () => {
    const guild = await (await fixture.app.request(`${base}/guilds/${fixture.guild.guild_id}?with_counts=true`)).json() as any;
    expect(guild.id).toBe(fixture.guild.guild_id);
    expect(guild.approximate_member_count).toBe(3);

    const channels = await (await fixture.app.request(`${base}/guilds/${guild.id}/channels`)).json() as any[];
    expect(channels[0]).toMatchObject({ name: "general", position: 0, parent_id: null });
    expect(channels[0].id).toBeDefined();

    const roles = await (await fixture.app.request(`${base}/guilds/${guild.id}/roles`)).json() as any[];
    expect(roles.find((role) => role.name === "Moderator")?.id).toBeDefined();

    const members = await (await fixture.app.request(`${base}/guilds/${guild.id}/members?limit=100`)).json() as any[];
    expect(members[0].user.id).toBeDefined();
    expect(members[0].joined_at).toBeDefined();
  });

  it("searches members and generic messages", async () => {
    const guildId = fixture.guild.guild_id;
    const members = await (await fixture.app.request(`${base}/guilds/${guildId}/members/search?query=sample-member&limit=25`)).json() as any[];
    expect(members).toHaveLength(1);
    expect(members[0].user.username).toBe("sample-member");

    const search = await (await fixture.app.request(`${base}/guilds/${guildId}/messages/search?content=deployment&limit=25`)).json() as any;
    expect(search.total_results).toBe(1);
    expect(search.messages[0][0].content).toContain("deployment simulation");
  });

  it("lists channel messages with the requested limit", async () => {
    const channel = fixture.state.channels.all().find((item) => item.name === "operations")!;
    const response = await fixture.app.request(`${base}/channels/${channel.channel_id}/messages?limit=1`);
    expect(response.status).toBe(200);
    const messages = await response.json() as any[];
    expect(messages).toHaveLength(1);
    expect(messages[0].author.username).toBeDefined();
  });

  it("assigns and removes roles and records decoded audit reasons", async () => {
    const member = fixture.state.members.all().find((item) => fixture.state.users.findOneBy("discord_id", item.user_id)?.username === "sample-member")!;
    const role = fixture.state.roles.all().find((item) => item.name === "Moderator")!;
    const route = `${base}/guilds/${fixture.guild.guild_id}/members/${member.user_id}/roles/${role.role_id}`;
    const headers = { "X-Audit-Log-Reason": "Approved%20simulation" };

    expect((await fixture.app.request(route, { method: "PUT", headers })).status).toBe(204);
    expect(fixture.state.members.findOneBy("user_id", member.user_id)?.roles).toContain(role.role_id);
    expect((await fixture.app.request(route, { method: "DELETE", headers })).status).toBe(204);
    expect(fixture.state.members.findOneBy("user_id", member.user_id)?.roles).not.toContain(role.role_id);

    const audit = await (await fixture.app.request(`${base}/guilds/${fixture.guild.guild_id}/audit-logs?limit=10`)).json() as any;
    expect(audit.audit_log_entries[0]).toMatchObject({ action_type: 25, reason: "Approved simulation" });
  });

  it("applies timeouts and exposes AutoMod rules", async () => {
    const member = fixture.state.members.all().find((item) => fixture.state.users.findOneBy("discord_id", item.user_id)?.username === "sample-member")!;
    const until = new Date(Date.now() + 60_000).toISOString();
    const response = await fixture.app.request(`${base}/guilds/${fixture.guild.guild_id}/members/${member.user_id}`, { method: "PATCH", headers: { "Content-Type": "application/json", "X-Audit-Log-Reason": "Generic%20test" }, body: JSON.stringify({ communication_disabled_until: until }) });
    expect(response.status).toBe(200);
    expect((await response.json() as any).communication_disabled_until).toBe(until);

    const rules = await (await fixture.app.request(`${base}/guilds/${fixture.guild.guild_id}/auto-moderation/rules`)).json() as any[];
    expect(rules[0]).toMatchObject({ name: "Generic spam protection", enabled: true });
  });

  it("supports kick and ban with audit entries", async () => {
    const members = fixture.state.members.all().filter((item) => !fixture.state.users.findOneBy("discord_id", item.user_id)?.bot);
    const [kickTarget, banTarget] = members;
    expect((await fixture.app.request(`${base}/guilds/${fixture.guild.guild_id}/members/${kickTarget.user_id}`, { method: "DELETE", headers: { "X-Audit-Log-Reason": "Kick%20simulation" } })).status).toBe(204);
    expect((await fixture.app.request(`${base}/guilds/${fixture.guild.guild_id}/bans/${banTarget.user_id}`, { method: "PUT", headers: { "Content-Type": "application/json", "X-Audit-Log-Reason": "Ban%20simulation" }, body: JSON.stringify({ delete_message_seconds: 0 }) })).status).toBe(204);
    expect(fixture.state.bans.all()).toHaveLength(1);
    expect(fixture.state.audit.all().map((entry) => entry.action_type)).toEqual(expect.arrayContaining([20, 22]));
  });
});
