import { cursorPage, fixedNow, getState, readBody, setState } from '../../scripts/provider-plugin-kit.mjs';

const STATE_KEY = 'linq:state';
const PREFIXES = ['/v3', '/api/partner/v3'];
const uuid = (n) => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;

function makeHandle(handle, index, isMe = false) {
  return { id: uuid(100 + index), handle, joined_at: fixedNow, service: 'iMessage', is_me: isMe, left_at: null, status: 'active' };
}

function makeChat(input = {}, index = 1) {
  const from = input.from ?? '+12025550100';
  const to = input.to ?? ['+12025550101'];
  return {
    id: input.id ?? uuid(index),
    created_at: input.created_at ?? fixedNow,
    display_name: input.display_name ?? to.join(', '),
    handles: input.handles ?? [makeHandle(from, index * 10, true), ...to.map((handle, offset) => makeHandle(handle, index * 10 + offset + 1))],
    health_status: input.health_status ?? { status: 'HEALTHY', doc_url: 'https://docs.linqapp.com/guides/chats/chat-health#healthy', updated_at: fixedNow },
    is_archived: input.is_archived ?? false,
    is_group: input.is_group ?? to.length > 1,
    updated_at: input.updated_at ?? fixedNow,
    group_chat_icon: input.group_chat_icon ?? null,
    service: input.service ?? 'iMessage',
  };
}

function makeMessage(chat, content = {}, index = 1) {
  const fromHandle = chat.handles.find((handle) => handle.is_me) ?? chat.handles[0];
  return {
    id: content.id ?? uuid(1000 + index),
    chat_id: chat.id,
    created_at: content.created_at ?? fixedNow,
    delivery_status: content.delivery_status ?? 'pending',
    is_delivered: content.is_delivered ?? false,
    is_from_me: content.is_from_me ?? true,
    is_read: content.is_read ?? false,
    updated_at: content.updated_at ?? fixedNow,
    delivered_at: content.delivered_at ?? null,
    effect: content.effect ?? null,
    from: content.from ?? fromHandle?.handle,
    from_handle: fromHandle,
    parts: (content.parts ?? [{ type: 'text', value: 'Hello from the Linq emulator.' }]).map((part) => ({ reactions: [], ...part })),
    preferred_service: content.preferred_service ?? null,
    reply_to: content.reply_to ?? null,
    sent_at: content.sent_at ?? fixedNow,
    service: content.service ?? 'iMessage',
  };
}

function initialState(config = {}) {
  const chats = (config.chats ?? [makeChat()]).map((chat, index) => makeChat(chat, index + 1));
  const messages = config.messages ?? [makeMessage(chats[0], {}, 1)];
  return {
    chats,
    messages,
    phone_numbers: config.phone_numbers ?? [{ id: uuid(2001), phone_number: '+12025550100', forwarding_number: null, reputation: { status: 'HEALTHY', doc_url: 'https://docs.linqapp.com/guides/phone-numbers/phone-reputation#healthy' } }],
    webhook_subscriptions: config.webhook_subscriptions ?? [],
    next_chat: chats.length + 1,
    next_message: messages.length + 1,
    next_subscription: (config.webhook_subscriptions ?? []).length + 1,
  };
}

const state = (store) => getState(store, STATE_KEY, () => initialState());
const save = (store, value) => setState(store, STATE_KEY, value);

function error(c, status, code, message) {
  return c.json({ success: false, error: { status, code, message, doc_url: `https://docs.linqapp.com/error/codes/${String(code)[0]}xxx/${code}/` }, trace_id: '00000000000000000000000000000001' }, status);
}

function findChat(current, chatId) {
  return current.chats.find((chat) => chat.id === chatId);
}

function page(items, c, defaultLimit = 20) {
  const { page: values, nextCursor } = cursorPage(items, c, defaultLimit);
  return { values, next_cursor: nextCursor ?? null };
}

function registerRoutes(app, store, prefix) {
  app.get(`${prefix}/phone_numbers`, (c) => c.json({ phone_numbers: state(store).phone_numbers }));
  app.get(`${prefix}/phonenumbers`, (c) => c.json({ phone_numbers: state(store).phone_numbers }));

  app.get(`${prefix}/chats`, (c) => {
    let chats = state(store).chats;
    const from = c.req.query('from');
    const to = c.req.query('to');
    if (from) chats = chats.filter((chat) => chat.handles.some((handle) => handle.is_me && handle.handle === from));
    if (to) chats = chats.filter((chat) => chat.handles.some((handle) => !handle.is_me && handle.handle === to));
    const result = page(chats, c);
    return c.json({ chats: result.values, next_cursor: result.next_cursor });
  });

  app.post(`${prefix}/chats`, async (c) => {
    const current = state(store);
    const body = await readBody(c);
    if (!body.from) return error(c, 400, 1001, 'Missing required field: from');
    if (!Array.isArray(body.to) || body.to.length === 0) return error(c, 400, 1001, 'Missing required field: to');
    if (!body.message) return error(c, 400, 1001, 'Missing required field: message');
    let chat = current.chats.find((item) => item.handles.some((handle) => handle.is_me && handle.handle === body.from) && body.to.every((recipient) => item.handles.some((handle) => handle.handle === recipient)));
    if (!chat || chat.display_name !== chat.handles.filter((handle) => !handle.is_me).map((handle) => handle.handle).join(', ')) {
      chat = makeChat({ from: body.from, to: body.to }, current.next_chat++);
      current.chats.unshift(chat);
    }
    const message = makeMessage(chat, body.message, current.next_message++);
    current.messages.unshift(message);
    save(store, current);
    return c.json({ chat, message });
  });

  app.get(`${prefix}/chats/:chatId`, (c) => {
    const chat = findChat(state(store), c.req.param('chatId'));
    return chat ? c.json(chat) : error(c, 404, 2001, 'Resource not found');
  });

  app.put(`${prefix}/chats/:chatId`, async (c) => {
    const current = state(store);
    const chat = findChat(current, c.req.param('chatId'));
    if (!chat) return error(c, 404, 2001, 'Resource not found');
    Object.assign(chat, await readBody(c), { updated_at: fixedNow });
    save(store, current);
    return c.json(chat);
  });

  app.get(`${prefix}/chats/:chatId/messages`, (c) => {
    const current = state(store);
    if (!findChat(current, c.req.param('chatId'))) return error(c, 404, 2001, 'Resource not found');
    const result = page(current.messages.filter((message) => message.chat_id === c.req.param('chatId')), c);
    return c.json({ messages: result.values, next_cursor: result.next_cursor });
  });

  app.post(`${prefix}/chats/:chatId/messages`, async (c) => {
    const current = state(store);
    const chat = findChat(current, c.req.param('chatId'));
    if (!chat) return error(c, 404, 2001, 'Resource not found');
    const body = await readBody(c);
    if (!Array.isArray(body.parts) && !body.action) return error(c, 400, 1004, 'Invalid message content');
    const message = makeMessage(chat, body, current.next_message++);
    current.messages.unshift(message);
    save(store, current);
    return c.json({ chat_id: chat.id, message });
  });

  app.get(`${prefix}/messages/:messageId`, (c) => {
    const message = state(store).messages.find((item) => item.id === c.req.param('messageId'));
    return message ? c.json(message) : error(c, 404, 2001, 'Resource not found');
  });

  app.patch(`${prefix}/messages/:messageId`, async (c) => {
    const current = state(store);
    const message = current.messages.find((item) => item.id === c.req.param('messageId'));
    if (!message) return error(c, 404, 2001, 'Resource not found');
    Object.assign(message, await readBody(c), { updated_at: fixedNow });
    save(store, current);
    return c.json(message);
  });

  app.delete(`${prefix}/messages/:messageId`, (c) => {
    const current = state(store);
    const message = current.messages.find((item) => item.id === c.req.param('messageId'));
    if (!message) return error(c, 404, 2001, 'Resource not found');
    current.messages = current.messages.filter((item) => item.id !== message.id);
    save(store, current);
    return c.body(null, 204);
  });

  app.get(`${prefix}/webhook_subscriptions`, (c) => c.json({ webhook_subscriptions: state(store).webhook_subscriptions }));
  app.post(`${prefix}/webhook_subscriptions`, async (c) => {
    const current = state(store);
    const body = await readBody(c);
    if (!body.target_url) return error(c, 400, 1001, 'Missing required field: target_url');
    const subscription = { id: uuid(3000 + current.next_subscription++), created_at: fixedNow, updated_at: fixedNow, is_active: body.is_active ?? true, signing_secret: `whsec_linq_emulator_${current.next_subscription}`, subscribed_events: body.subscribed_events ?? ['message.sent'], target_url: body.target_url, phone_numbers: body.phone_numbers ?? [] };
    current.webhook_subscriptions.unshift(subscription);
    save(store, current);
    return c.json(subscription);
  });

  app.get(`${prefix}/webhook_subscriptions/:subscriptionId`, (c) => {
    const subscription = state(store).webhook_subscriptions.find((item) => item.id === c.req.param('subscriptionId'));
    return subscription ? c.json(subscription) : error(c, 404, 2001, 'Resource not found');
  });

  app.delete(`${prefix}/webhook_subscriptions/:subscriptionId`, (c) => {
    const current = state(store);
    const subscription = current.webhook_subscriptions.find((item) => item.id === c.req.param('subscriptionId'));
    if (!subscription) return error(c, 404, 2001, 'Resource not found');
    current.webhook_subscriptions = current.webhook_subscriptions.filter((item) => item.id !== subscription.id);
    save(store, current);
    return c.body(null, 204);
  });
}

export function seedFromConfig(store, _baseUrl, config = {}) {
  return save(store, initialState(config));
}

export const contract = {
  provider: 'linq',
  source: 'Official Linq Partner API v3 documentation and @linqapp/sdk 0.33.1',
  docs: 'https://docs.linqapp.com/api/',
  baseUrl: 'https://api.linqapp.com/api/partner',
  auth: 'Authorization: Bearer <token>',
  scope: ['chats.create', 'chats.list', 'chats.get', 'chats.update', 'messages.send', 'messages.list', 'messages.get', 'messages.update', 'messages.delete', 'phone_numbers.list', 'webhook_subscriptions.create', 'webhook_subscriptions.list', 'webhook_subscriptions.get', 'webhook_subscriptions.delete'],
  fidelity: 'stateful-rest-subset',
};

export const plugin = {
  name: 'linq',
  register(app, store) {
    for (const prefix of PREFIXES) registerRoutes(app, store, prefix);
  },
  seed(store) {
    seedFromConfig(store);
  },
};

export const label = 'Linq Partner API emulator';
export const endpoints = contract.scope.join(', ');
export const capabilities = contract.scope;
export const initConfig = { linq: initialState() };
export default plugin;
