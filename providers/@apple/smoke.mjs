import assert from 'node:assert/strict';
import { contract, plugin } from './api-emulator.mjs';

const routes = new Map();
const data = new Map();
const app = {
  get: (path, handler) => routes.set(`GET ${path}`, handler),
  post: (path, handler) => routes.set(`POST ${path}`, handler),
};
const store = {
  getData: (key) => data.get(key),
  setData: (key, value) => data.set(key, value),
};
plugin.register(app, store, undefined, 'http://apple.test');

async function call(method, path, body = {}, params = {}, query = {}) {
  const handler = routes.get(`${method} ${path}`);
  assert.ok(handler, `missing route ${method} ${path}`);
  let status = 200;
  let payload;
  await handler({
    req: {
      url: `http://apple.test${path}`,
      json: async () => body,
      formData: async () => new FormData(),
      parseBody: async () => body,
      arrayBuffer: async () => Buffer.from(body?.raw ?? ''),
      header: () => undefined,
      param: (name) => params[name],
      query: (name) => query[name],
    },
    json: (value, nextStatus = 200) => {
      status = nextStatus;
      payload = value;
      return { status, payload };
    },
    body: (value, nextStatus = 200) => ({ status: nextStatus, payload: value }),
    header: () => {},
  });
  return { status, payload };
}

assert.equal(contract.provider, 'apple');
assert.equal(routes.has('GET /v1/apps'), false);
assert.equal(routes.has('GET /search'), false);
assert.equal(routes.has('GET /auth/authorize'), true);
assert.equal(routes.has('POST /3/device/:token'), true);
assert.equal(routes.has('GET /database/1/:container/:environment/:database/users/current'), true);

const signIn = await call('POST', '/auth/signin', { username: 'demo' });
assert.equal(signIn.payload.user.email, 'demo@apple-emulator.local');
const keys = await call('GET', '/auth/keys');
assert.equal(keys.payload.keys[0].kid, 'apple-emulator-key');

await call('POST', '/apns/control/register-team', { teamId: 'TEAMID1234' });
await call('POST', '/apns/control/register-key', { teamId: 'TEAMID1234', keyId: 'KEYID12345' });
await call('POST', '/apns/control/register-topic', { topic: 'com.example.app' });
await call('POST', '/apns/control/register-device', { deviceToken: 'token-1', topic: 'com.example.app', status: 'registered' });
const delivery = await call('POST', '/apns/send', { deviceToken: 'token-1', teamId: 'TEAMID1234', keyId: 'KEYID12345', topic: 'com.example.app', payload: { aps: { alert: 'hello' } } });
assert.equal(delivery.payload.ok, true);
assert.equal(delivery.payload.queued, false);

console.log('apple smoke ok');
