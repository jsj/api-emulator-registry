export const defaultSeed = {
  userId: "user-1",
  authToken: "token-1",
  rooms: [
    { _id: "room-project-dev", name: "project-dev", fname: "project-dev", msgs: 4, t: "p" },
    { _id: "room-general", name: "general", fname: "general", msgs: 1, t: "c" },
    { _id: "room-sample-user", name: "sample-user", fname: "sample-user", msgs: 1, t: "d", usernames: ["test", "sample-user"] },
  ],
  messagesByRoomId: {
    "room-project-dev": [
      { _id: "m1", ts: "2026-04-28T20:46:33.790Z", u: { username: "sample-user-1" }, msg: "The sample app kept cycling for a user" },
      { _id: "m2", ts: "2026-04-28T20:47:43.831Z", u: { username: "sample-user-2" }, msg: "is it constantly reloading?" },
      { _id: "m3", ts: "2026-04-28T21:01:06.803Z", u: { username: "sample-user-1" }, msg: "I assume so, but the test user disconnected" },
      { _id: "m4", ts: "2026-04-28T21:01:44.094Z", u: { username: "sample-user-1" }, msg: ":bug: sample roles should be IDP bound." },
    ],
    "room-general": [
      { _id: "m5", ts: "2026-04-28T19:00:00.000Z", u: { username: "admin" }, msg: "Welcome" },
    ],
    "room-sample-user": [
      { _id: "m6", ts: "2026-04-28T19:05:00.000Z", u: { username: "sample-user" }, msg: "Direct message test" },
    ],
  },
};

export const plugin = {
  name: "rocketchat",
  register(app, store) {
    registerRoutes(app, () => seedFromStore(store), (message) => appendStoreMessage(store, message));
  },
  seed(store) {
    seedStore(store, defaultSeed);
  },
};

export default plugin;

export function seedFromConfig(store, _baseUrl, config = {}) {
  seedStore(store, {
    userId: config.userId ?? defaultSeed.userId,
    authToken: config.authToken ?? defaultSeed.authToken,
    rooms: config.rooms ?? defaultSeed.rooms,
    messagesByRoomId: config.messagesByRoomId ?? defaultSeed.messagesByRoomId,
  });
}

function seedStore(store, seed) {
  const rooms = store.collection("rocketchat:rooms", ["_id", "name", "t"]);
  const messages = store.collection("rocketchat:messages", ["room_id"]);
  store.setData("rocketchat:auth", { userId: seed.userId, authToken: seed.authToken });
  for (const room of seed.rooms) rooms.insert(room);
  for (const [roomId, roomMessages] of Object.entries(seed.messagesByRoomId)) {
    for (const message of roomMessages) messages.insert({ ...message, room_id: roomId });
  }
}

function seedFromStore(store) {
  const auth = store.getData("rocketchat:auth") ?? { userId: defaultSeed.userId, authToken: defaultSeed.authToken };
  const storedRooms = store.collection("rocketchat:rooms", ["_id", "name", "t"]).all();
  const messages = store.collection("rocketchat:messages", ["room_id"]).all();
  const messagesByRoomId = {};
  for (const message of messages) {
    messagesByRoomId[message.room_id] ??= [];
    messagesByRoomId[message.room_id].push(message);
  }
  const rooms = storedRooms.map((room) => ({
    ...room,
    msgs: messagesByRoomId[room._id]?.length ?? room.msgs ?? 0,
    _updatedAt: messagesByRoomId[room._id]?.at(-1)?.ts ?? room._updatedAt,
    lastMessage: messagesByRoomId[room._id]?.at(-1),
  }));
  return {
    userId: auth.userId,
    authToken: auth.authToken,
    rooms: rooms.length ? rooms : defaultSeed.rooms,
    messagesByRoomId: Object.keys(messagesByRoomId).length ? messagesByRoomId : defaultSeed.messagesByRoomId,
  };
}

function appendSeedMessage(seed, message) {
  let room = findRoomByTarget(seed.rooms, message.roomId ?? message.channel);
  if (!room) {
    room = { _id: message.roomId ?? `room-${message.channel}`, name: message.channel, fname: message.channel, msgs: 0, t: "c" };
    seed.rooms.push(room);
  }
  room.msgs = (room.msgs ?? 0) + 1;
  seed.messagesByRoomId[room._id] ??= [];
  const created = {
    _id: `msg-${crypto.randomUUID()}`,
    rid: room._id,
    ts: new Date().toISOString(),
    _updatedAt: new Date().toISOString(),
    u: { username: message.username ?? "portal" },
    msg: message.text,
    attachments: message.attachments,
  };
  seed.messagesByRoomId[room._id].push(created);
  room.lastMessage = created;
  room._updatedAt = created._updatedAt;
  return { room, message: created };
}

function appendStoreMessage(store, message) {
  const rooms = store.collection("rocketchat:rooms", ["_id", "name", "t"]);
  let room = findStoredRoom(rooms, message.roomId ?? message.channel);
  if (!room) {
    room = rooms.insert({
      _id: message.roomId ?? `room-${message.channel}`,
      name: message.channel,
      fname: message.channel,
      msgs: 0,
      t: "c",
    });
  }
  const timestamp = new Date().toISOString();
  const created = store.collection("rocketchat:messages", ["room_id"]).insert({
    _id: `msg-${crypto.randomUUID()}`,
    rid: room._id,
    ts: timestamp,
    _updatedAt: timestamp,
    u: { username: message.username ?? "portal" },
    msg: message.text,
    attachments: message.attachments,
    room_id: room._id,
  });
  return { room, message: created };
}

function normalizeRoomTarget(value) {
  if (!value) return "";
  return String(value).replace(/^[#@]/, "");
}

function findRoomByTarget(rooms, target) {
  const normalized = normalizeRoomTarget(target);
  return rooms.find((room) => room._id === target || room.name === normalized || room.fname === normalized);
}

function findStoredRoom(rooms, target) {
  const normalized = normalizeRoomTarget(target);
  return rooms.findOneBy("_id", target) ?? rooms.findOneBy("name", normalized);
}

async function readBody(c) {
  const contentType = c.req.header("content-type") ?? "";
  if (contentType.includes("application/json")) return c.req.json();
  return c.req.parseBody();
}

function registerRoutes(app, getSeed, appendMessage) {
  app.use("/api/v1/*", async (c, next) => {
    const seed = getSeed();
    if (c.req.header("X-User-Id") !== seed.userId || c.req.header("X-Auth-Token") !== seed.authToken) {
      return c.json({ success: false, error: "unauthorized" }, 401);
    }
    await next();
  });

  app.get("/api/v1/rooms.get", (c) => {
    const seed = getSeed();
    return c.json({ success: true, update: seed.rooms, remove: [] });
  });
  app.get("/api/v1/im.list", (c) => {
    const seed = getSeed();
    const ims = seed.rooms.filter((room) => room.t === "d");
    return c.json({ success: true, ims, count: ims.length, total: ims.length });
  });
  app.get("/api/v1/groups.info", (c) => roomInfo(c, getSeed(), "p", "group"));
  app.get("/api/v1/channels.info", (c) => roomInfo(c, getSeed(), "c", "channel"));
  app.get("/api/v1/im.info", (c) => roomInfo(c, getSeed(), "d", "room"));
  app.get("/api/v1/groups.history", (c) => history(c, getSeed()));
  app.get("/api/v1/channels.history", (c) => history(c, getSeed()));
  app.get("/api/v1/im.history", (c) => history(c, getSeed()));
  app.post("/api/v1/chat.postMessage", async (c) => {
    const body = await readBody(c);
    const text = String(body.text ?? "");
    const roomId = body.roomId ? String(body.roomId) : undefined;
    const channel = normalizeRoomTarget(body.channel ?? body.roomName ?? roomId ?? "help");
    if (!text && !body.attachments) return c.json({ success: false, error: "missing-text" }, 400);
    const created = appendMessage({
      text,
      channel,
      roomId,
      username: body.username ? String(body.username) : undefined,
      attachments: body.attachments,
    });
    return c.json({ success: true, channel: created.room._id, message: created.message });
  });
}

function roomInfo(c, seed, type, key) {
  const room = findRoom(c, seed, type);
  return room ? c.json({ success: true, [key]: room }) : c.json({ success: false, error: "not-found" }, 404);
}

function findRoom(c, seed, type) {
  const roomId = c.req.query("roomId");
  const roomName = c.req.query("roomName");
  return seed.rooms.find((room) => room.t === type && (room._id === roomId || room.name === roomName || room.fname === roomName));
}

function history(c, seed) {
  const room = findRoomByTarget(seed.rooms, c.req.query("roomId") ?? c.req.query("roomName"));
  const roomId = room?._id ?? c.req.query("roomId") ?? "";
  const count = Number(c.req.query("count") ?? "20");
  const offset = Number(c.req.query("offset") ?? "0");
  const messages = seed.messagesByRoomId[roomId] ?? [];
  const ordered = [...messages].reverse();
  const paged = ordered.slice(offset, offset + count);
  return c.json({ success: true, messages: paged, count: paged.length, offset, total: messages.length });
}

export const label = "Rocket.Chat API emulator";
export const endpoints = "rooms.get, im.list, groups/channels/im info, history, chat.postMessage";
export const contract = {
  service: "rocketchat",
  endpoints,
};
export const initConfig = {
  rocketchat: {
    userId: defaultSeed.userId,
    authToken: defaultSeed.authToken,
    rooms: defaultSeed.rooms,
    messagesByRoomId: defaultSeed.messagesByRoomId,
  },
};
