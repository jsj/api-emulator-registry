import { createToken, fixedNow, getState, readBody, setState } from '../scripts/provider-plugin-kit.mjs';

const STATE_KEY = 'agentmail:state';

function makeInbox(input = {}, index = 1) {
  const username = input.username ?? `agent-${index}`;
  const domain = input.domain ?? 'agentmail.to';
  return {
    pod_id: input.pod_id ?? 'pod_emulator',
    inbox_id: input.inbox_id ?? createToken('inbox', index),
    email: input.email ?? `${username}@${domain}`,
    display_name: input.display_name ?? input.displayName ?? 'AgentMail Emulator',
    client_id: input.client_id ?? input.clientId,
    updated_at: input.updated_at ?? fixedNow,
    created_at: input.created_at ?? fixedNow,
  };
}

function makeMessage({ inbox, body = {}, index = 1, threadId, labels = ['sent'] }) {
  const messageId = body.message_id ?? createToken('msg', index);
  const from = body.from ?? { name: inbox.display_name, address: inbox.email };
  const to = normalizeAddresses(body.to ?? ['recipient@example.com']);
  return {
    inbox_id: inbox.inbox_id,
    thread_id: threadId ?? body.thread_id ?? createToken('thread', index),
    message_id: messageId,
    labels: body.labels ?? labels,
    timestamp: body.timestamp ?? fixedNow,
    from,
    reply_to: normalizeAddresses(body.reply_to ?? body.replyTo ?? [from]),
    to,
    cc: normalizeAddresses(body.cc ?? []),
    bcc: normalizeAddresses(body.bcc ?? []),
    subject: body.subject ?? 'Hello from AgentMail emulator',
    preview: body.preview ?? body.text?.slice(0, 120) ?? 'Hello from AgentMail emulator',
    text: body.text ?? 'Hello from AgentMail emulator',
    html: body.html,
    extracted_text: body.extracted_text ?? body.text ?? 'Hello from AgentMail emulator',
    extracted_html: body.extracted_html ?? body.html,
    attachments: body.attachments ?? [],
    headers: body.headers ?? {},
    size: body.size ?? Buffer.byteLength(body.text ?? body.html ?? ''),
    updated_at: body.updated_at ?? fixedNow,
    created_at: body.created_at ?? fixedNow,
  };
}

function initialState(config = {}) {
  const inboxes = (config.inboxes ?? [makeInbox({ username: 'emulator', display_name: 'AgentMail Emulator' })]).map((inbox, index) => makeInbox(inbox, index + 1));
  const messages = config.messages ?? [
    makeMessage({
      inbox: inboxes[0],
      body: {
        from: { name: 'Example Sender', address: 'sender@example.com' },
        to: [inboxes[0].email],
        subject: 'Welcome to AgentMail',
        text: 'This deterministic message is available in the local AgentMail emulator.',
      },
      labels: ['received', 'unread'],
    }),
  ];
  return {
    inboxes,
    messages,
    nextInbox: inboxes.length + 1,
    nextMessage: messages.length + 1,
    nextThread: messages.length + 1,
    ...config,
  };
}

const state = (store) => getState(store, STATE_KEY, () => initialState());
const save = (store, next) => setState(store, STATE_KEY, next);

function agentmailError(c, message, status = 400, name = status === 404 ? 'NotFoundError' : 'BadRequestError') {
  return c.json({ name, message }, status);
}

function validationError(c, field, message) {
  return c.json({ name: 'ValidationError', errors: [{ field, message }] }, 400);
}

function normalizeAddresses(value) {
  const values = Array.isArray(value) ? value : value ? [value] : [];
  return values.map((item) => (typeof item === 'string' ? { address: item } : item));
}

function paginate(items, c) {
  const limit = Math.max(1, Math.min(Number(c.req.query('limit') ?? 50), 100));
  const offset = c.req.query('page_token') ? Number(Buffer.from(c.req.query('page_token'), 'base64url').toString('utf8')) || 0 : 0;
  const page = items.slice(offset, offset + limit);
  const nextOffset = offset + limit;
  return {
    page,
    limit,
    next_page_token: nextOffset < items.length ? Buffer.from(String(nextOffset)).toString('base64url') : undefined,
  };
}

function sorted(items, field, c) {
  const direction = c.req.query('ascending') === 'true' ? 1 : -1;
  return [...items].sort((a, b) => direction * String(a[field]).localeCompare(String(b[field])));
}

function findInbox(current, inboxId) {
  return current.inboxes.find((inbox) => inbox.inbox_id === inboxId || inbox.email === inboxId);
}

function filterMessages(current, c) {
  const inboxId = c.req.param('inbox_id');
  const labels = c.req.queries?.('labels') ?? (c.req.query('labels') ? String(c.req.query('labels')).split(',') : []);
  return sorted(
    current.messages.filter((message) => message.inbox_id === inboxId && labels.every((label) => message.labels.includes(label))),
    'timestamp',
    c,
  );
}

export function seedFromConfig(store, _baseUrl, config = {}) {
  return save(store, initialState(config));
}

export const contract = {
  provider: 'agentmail',
  source: 'Official AgentMail OpenAPI',
  docs: 'https://docs.agentmail.to/openapi.json',
  baseUrl: 'https://api.agentmail.to/v0',
  auth: 'Authorization: Bearer <api_key>',
  scope: ['inboxes.create', 'inboxes.list', 'inboxes.get', 'inboxes.update', 'inboxes.delete', 'messages.send', 'messages.list', 'messages.get', 'messages.reply'],
  fidelity: 'stateful-rest-emulator',
};

export const plugin = {
  name: 'agentmail',
  register(app, store) {
    app.get('/v0/inboxes', (c) => {
      const current = state(store);
      const { page, limit, next_page_token } = paginate(sorted(current.inboxes, 'created_at', c), c);
      return c.json({ count: page.length, limit, next_page_token, inboxes: page });
    });

    app.post('/v0/inboxes', async (c) => {
      const current = state(store);
      const body = await readBody(c);
      const username = body.username ?? `agent-${current.nextInbox}`;
      const domain = body.domain ?? 'agentmail.to';
      if (!/^[a-z0-9._-]+$/i.test(username)) return validationError(c, 'username', 'username must be a valid email local part');
      const inbox = makeInbox({ ...body, username, domain, inbox_id: createToken('inbox', current.nextInbox) }, current.nextInbox);
      current.nextInbox += 1;
      current.inboxes.unshift(inbox);
      save(store, current);
      return c.json(inbox);
    });

    app.get('/v0/inboxes/:inbox_id', (c) => {
      const inbox = findInbox(state(store), c.req.param('inbox_id'));
      return inbox ? c.json(inbox) : agentmailError(c, 'Inbox not found', 404);
    });

    app.patch('/v0/inboxes/:inbox_id', async (c) => {
      const current = state(store);
      const inbox = findInbox(current, c.req.param('inbox_id'));
      if (!inbox) return agentmailError(c, 'Inbox not found', 404);
      const body = await readBody(c);
      if (body.display_name !== undefined) inbox.display_name = body.display_name;
      if (body.displayName !== undefined) inbox.display_name = body.displayName;
      if (body.client_id !== undefined) inbox.client_id = body.client_id;
      inbox.updated_at = fixedNow;
      save(store, current);
      return c.json(inbox);
    });

    app.delete('/v0/inboxes/:inbox_id', (c) => {
      const current = state(store);
      const inbox = findInbox(current, c.req.param('inbox_id'));
      if (!inbox) return agentmailError(c, 'Inbox not found', 404);
      current.inboxes = current.inboxes.filter((item) => item.inbox_id !== inbox.inbox_id);
      current.messages = current.messages.filter((message) => message.inbox_id !== inbox.inbox_id);
      save(store, current);
      return c.body(null, 200);
    });

    app.get('/v0/inboxes/:inbox_id/messages', (c) => {
      const current = state(store);
      if (!findInbox(current, c.req.param('inbox_id'))) return agentmailError(c, 'Inbox not found', 404);
      const { page, limit, next_page_token } = paginate(filterMessages(current, c), c);
      return c.json({ count: page.length, limit, next_page_token, messages: page });
    });

    app.post('/v0/inboxes/:inbox_id/messages/send', async (c) => {
      const current = state(store);
      const inbox = findInbox(current, c.req.param('inbox_id'));
      if (!inbox) return agentmailError(c, 'Inbox not found', 404);
      const body = await readBody(c);
      const recipients = [...normalizeAddresses(body.to), ...normalizeAddresses(body.cc), ...normalizeAddresses(body.bcc)];
      if (recipients.length === 0) return validationError(c, 'to', 'at least one recipient is required');
      if (recipients.length > 50) return validationError(c, 'to', 'too many recipients');
      const message = makeMessage({
        inbox,
        body: { ...body, message_id: createToken('msg', current.nextMessage) },
        index: current.nextMessage,
        threadId: createToken('thread', current.nextThread),
        labels: body.labels ?? ['sent'],
      });
      current.nextMessage += 1;
      current.nextThread += 1;
      current.messages.unshift(message);
      save(store, current);
      return c.json({ message_id: message.message_id, thread_id: message.thread_id });
    });

    app.get('/v0/inboxes/:inbox_id/messages/:message_id', (c) => {
      const message = state(store).messages.find((item) => item.inbox_id === c.req.param('inbox_id') && item.message_id === c.req.param('message_id'));
      return message ? c.json(message) : agentmailError(c, 'Message not found', 404);
    });

    app.post('/v0/inboxes/:inbox_id/messages/:message_id/reply', async (c) => {
      const current = state(store);
      const inbox = findInbox(current, c.req.param('inbox_id'));
      const original = current.messages.find((item) => item.inbox_id === c.req.param('inbox_id') && item.message_id === c.req.param('message_id'));
      if (!inbox || !original) return agentmailError(c, 'Message not found', 404);
      const body = await readBody(c);
      const message = makeMessage({
        inbox,
        body: {
          ...body,
          message_id: createToken('msg', current.nextMessage),
          subject: body.subject ?? (original.subject?.startsWith('Re:') ? original.subject : `Re: ${original.subject ?? ''}`.trim()),
          to: body.to ?? [original.from],
        },
        index: current.nextMessage,
        threadId: original.thread_id,
        labels: body.labels ?? ['sent'],
      });
      current.nextMessage += 1;
      current.messages.unshift(message);
      save(store, current);
      return c.json({ message_id: message.message_id, thread_id: message.thread_id });
    });

    app.get('/agentmail/inspect/state', (c) => c.json(state(store)));
  },
};

export const label = 'AgentMail API emulator';
export const endpoints = contract.scope.join(', ');
export const capabilities = contract.scope;
export const initConfig = { agentmail: initialState() };
export default plugin;
