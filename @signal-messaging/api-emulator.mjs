import { createToken, fixedNow, getState, readBody, routeError, setState } from '../scripts/provider-plugin-kit.mjs';

const STATE_KEY = 'signal-messaging:state';

function initialState(config = {}) {
  return {
    accounts: config.accounts ?? [{ number: 'signal-account-a', registered: true, deviceName: 'api-emulator' }],
    groups: config.groups ?? [{ id: 'group.emulator', name: 'Emulator Group', members: ['signal-account-a', 'signal-account-b'] }],
    messages: config.messages ?? [],
    nextMessage: config.nextMessage ?? 1,
    ...config,
  };
}

function state(store) {
  return getState(store, STATE_KEY, () => initialState());
}

function save(store, next) {
  return setState(store, STATE_KEY, next);
}

export function seedFromConfig(store, _baseUrl, config = {}) {
  return save(store, initialState(config));
}

function account(s, number) {
  return s.accounts.find((item) => item.number === number);
}

function envelope(message) {
  return {
    envelope: {
      timestamp: message.timestamp,
      source: message.recipient,
      sourceNumber: message.recipient,
      sourceUuid: '00000000-0000-4000-8000-000000000001',
      dataMessage: {
        timestamp: message.timestamp,
        message: `echo: ${message.message}`,
        expiresInSeconds: 0,
        attachments: [],
        groupInfo: message.groupId ? { groupId: message.groupId, type: 'DELIVER' } : undefined,
      },
    },
    account: message.recipient,
  };
}

export const contract = {
  provider: 'signal-messaging',
  source: 'Signal protocol documentation plus bbernhard/signal-cli-rest-api OpenAPI-compatible routes',
  docs: 'https://bbernhard.github.io/signal-cli-rest-api/',
  baseUrls: ['http://localhost:8080'],
  scope: ['about', 'register', 'verify', 'send', 'receive', 'groups', 'inspection'],
  compatibilityOracle: 'signal-cli-rest-api clients can point at a local HTTP base URL.',
  fidelity: 'deterministic-signal-cli-rest-subset',
};

export const plugin = {
  name: 'signal-messaging',
  register(app, store) {
    app.get('/v1/about', (c) => c.json({ version: 'signal-cli-rest-api-emulator', mode: 'json-rpc', capabilities: contract.scope }));

    app.post('/v1/register/:number', (c) => {
      const s = state(store);
      const number = c.req.param('number');
      if (!account(s, number)) s.accounts.push({ number, registered: false, deviceName: 'api-emulator' });
      save(store, s);
      return c.json({ number, status: 'verification_required' }, 201);
    });

    app.post('/v1/register/:number/verify/:code', (c) => {
      const s = state(store);
      const number = c.req.param('number');
      const row = account(s, number) ?? { number, deviceName: 'api-emulator' };
      row.registered = true;
      if (!account(s, number)) s.accounts.push(row);
      save(store, s);
      return c.json({ number, status: 'registered', code: c.req.param('code') });
    });

    app.post('/v2/send', async (c) => {
      const s = state(store);
      const body = await readBody(c).catch(() => ({}));
      const recipients = body.recipients ?? body.recipient ?? body.number ?? [];
      const recipientList = Array.isArray(recipients) ? recipients : [recipients];
      if (!body.message) return routeError(c, 'message is required');
      if (recipientList.length === 0) return routeError(c, 'at least one recipient is required');
      const results = recipientList.map((recipient) => {
        const row = {
          id: createToken('sigmsg', s.nextMessage++),
          timestamp: Date.parse(fixedNow),
          sender: body.number ?? body.username ?? 'signal-account-a',
          recipient,
          groupId: body.groupId,
          message: body.message,
        };
        s.messages.push(row);
        return { recipientAddress: { number: recipient }, type: 'SUCCESS', timestamp: row.timestamp };
      });
      save(store, s);
      return c.json({ timestamp: results[0].timestamp, results });
    });

    app.get('/v1/receive/:number', (c) => {
      const s = state(store);
      const number = c.req.param('number');
      return c.json(s.messages.filter((item) => item.recipient === number || item.sender === number).map(envelope));
    });

    app.get('/v1/groups/:number', (c) => c.json(state(store).groups.map((group) => ({ ...group, isMember: group.members.includes(c.req.param('number')) }))));
    app.get('/inspect/contract', (c) => c.json(contract));
    app.get('/inspect/state', (c) => c.json(state(store)));
  },
};

export const label = 'Signal Messaging API emulator';
export const endpoints = contract.scope.join(', ');
export const capabilities = contract.scope;
export const initConfig = { 'signal-messaging': initialState() };
export default plugin;
