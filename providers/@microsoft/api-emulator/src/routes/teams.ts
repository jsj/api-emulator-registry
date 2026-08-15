import type { RouteContext } from "@api-emulator/core";
import { generateOid } from "../helpers.js";
import { getMicrosoftStore } from "../store.js";
import type { MicrosoftChannelMessage } from "../entities.js";

function graphError(code: string, message: string) {
  return { error: { code, message, innerError: { date: new Date().toISOString(), "request-id": generateOid() } } };
}

function messageJson(message: MicrosoftChannelMessage) {
  return {
    id: message.message_id,
    replyToId: null,
    etag: message.message_id,
    messageType: "message",
    createdDateTime: message.created_date_time,
    lastModifiedDateTime: message.last_modified_date_time,
    deletedDateTime: null,
    subject: null,
    summary: null,
    importance: "normal",
    locale: "en-us",
    webUrl: null,
    from: {
      user: {
        id: message.from_user_id,
        displayName: message.from_display_name,
        userIdentityType: "aadUser",
      },
    },
    body: { contentType: message.content_type, content: message.content },
    attachments: [],
    mentions: [],
    reactions: [],
  };
}

export function teamsRoutes({ app, store, baseUrl }: RouteContext): void {
  const ms = getMicrosoftStore(store);
  const prefix = "/v1.0";

  app.get(`${prefix}/me/joinedTeams`, (c) =>
    c.json({
      "@odata.context": `${baseUrl}/v1.0/$metadata#teams`,
      value: ms.teams.all().map((team) => ({ id: team.team_id, displayName: team.display_name, description: team.description })),
    }),
  );

  app.get(`${prefix}/teams/:teamId`, (c) => {
    const team = ms.teams.findOneBy("team_id", c.req.param("teamId"));
    return team
      ? c.json({ "@odata.context": `${baseUrl}/v1.0/$metadata#teams/$entity`, id: team.team_id, displayName: team.display_name, description: team.description })
      : c.json(graphError("NotFound", "Failed to execute Skype backend request GetThreadS2SRequest."), 404);
  });

  app.get(`${prefix}/teams/:teamId/channels`, (c) => {
    const teamId = c.req.param("teamId");
    if (!ms.teams.findOneBy("team_id", teamId)) return c.json(graphError("NotFound", "Team not found."), 404);
    const value = ms.channels.all().filter((channel) => channel.team_id === teamId).map((channel) => ({
      id: channel.channel_id,
      displayName: channel.display_name,
      description: channel.description,
      membershipType: channel.membership_type,
      email: "",
      webUrl: null,
    }));
    return c.json({ "@odata.context": `${baseUrl}/v1.0/$metadata#teams('${teamId}')/channels`, value });
  });

  app.get(`${prefix}/teams/:teamId/channels/:channelId/messages`, (c) => {
    const { teamId, channelId } = c.req.param();
    const channel = ms.channels.findOneBy("channel_id", channelId);
    if (!channel || channel.team_id !== teamId) return c.json(graphError("NotFound", "Channel not found."), 404);
    const value = ms.channelMessages.all()
      .filter((message) => message.team_id === teamId && message.channel_id === channelId)
      .sort((a, b) => b.created_date_time.localeCompare(a.created_date_time))
      .map(messageJson);
    return c.json({ "@odata.context": `${baseUrl}/v1.0/$metadata#teams('${teamId}')/channels('${channelId}')/messages`, value });
  });

  app.get(`${prefix}/teams/:teamId/channels/:channelId/messages/:messageId`, (c) => {
    const { teamId, channelId, messageId } = c.req.param();
    const message = ms.channelMessages.findOneBy("message_id", messageId);
    return message && message.team_id === teamId && message.channel_id === channelId
      ? c.json(messageJson(message))
      : c.json(graphError("NotFound", "Message not found."), 404);
  });

  app.post(`${prefix}/teams/:teamId/channels/:channelId/messages`, async (c) => {
    const { teamId, channelId } = c.req.param();
    const channel = ms.channels.findOneBy("channel_id", channelId);
    if (!channel || channel.team_id !== teamId) return c.json(graphError("NotFound", "Channel not found."), 404);
    const input: Record<string, unknown> = await c.req.json<Record<string, unknown>>().catch(() => ({}));
    const body = input.body as Record<string, unknown> | undefined;
    if (!body || typeof body.content !== "string" || body.content.length === 0) {
      return c.json(graphError("BadRequest", "The message body content is required."), 400);
    }
    const user = ms.users.all()[0];
    const timestamp = new Date().toISOString();
    let messageId = Date.now();
    while (ms.channelMessages.findOneBy("message_id", String(messageId))) messageId += 1;
    const message = ms.channelMessages.insert({
      message_id: String(messageId), team_id: teamId, channel_id: channelId,
      created_date_time: timestamp, last_modified_date_time: timestamp,
      content_type: body.contentType === "html" ? "html" : "text", content: body.content,
      from_user_id: user?.oid ?? "00000000-0000-0000-0000-000000000000",
      from_display_name: user?.name ?? "Emulator User",
    });
    return c.json(messageJson(message), 201);
  });
}
