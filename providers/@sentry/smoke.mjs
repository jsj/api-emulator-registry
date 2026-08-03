import assert from 'node:assert/strict';
import { plugin, contract } from './api-emulator.mjs';

function createHarness() {
  const routes = new Map();
  const data = new Map();
  const deliveries = [];
  const app = {
    get: (path, handler) => routes.set(`GET ${path}`, handler),
    post: (path, handler) => routes.set(`POST ${path}`, handler),
  };
  plugin.register(app, {
    getData: (key) => data.get(key),
    setData: (key, value) => data.set(key, value),
  });
  globalThis.fetch = async (url, init = {}) => {
    deliveries.push({ url, init });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  };
  return {
    deliveries,
    async call(method, path, body = {}, params = {}, query = {}, headers = {}) {
      const handler = routes.get(`${method} ${path}`);
      assert.ok(handler, `missing route ${method} ${path}`);
      let status = 200;
      let payload;
      const responseHeaders = {};
      await handler({
        req: {
          json: async () => typeof body === 'string' ? JSON.parse(body) : body,
          text: async () => typeof body === 'string' ? body : JSON.stringify(body),
          param: (name) => params[name],
          query: (name) => query[name],
          header: (name) => headers[name.toLowerCase()],
        },
        header: (name, value) => { responseHeaders[name.toLowerCase()] = value; },
        json: (value, nextStatus = 200) => {
          status = nextStatus;
          payload = value;
          return { status, payload };
        },
      });
      return { status, payload, headers: responseHeaders };
    },
  };
}

const harness = createHarness();
assert.equal(contract.provider, 'sentry');
await harness.call('POST', '/control/targets', {
  url: 'http://127.0.0.1:8787/v1/webhooks/sentry/crash',
  secret: 'sentry-emulator-secret',
});
const triggered = await harness.call('POST', '/control/issues', {
  issue: { title: 'Fatal crash in Bot Detail', metadata: { filename: 'BotDetailView.swift' } },
});
assert.equal(triggered.status, 202);
assert.equal(harness.deliveries.length, 1);
assert.match(harness.deliveries[0].init.headers['sentry-hook-signature'], /^[a-f0-9]{64}$/);
assert.match(harness.deliveries[0].init.body, /Fatal crash in Bot Detail/);

const eventId = '0123456789abcdef0123456789abcdef';
const envelope = [
  JSON.stringify({ event_id: eventId, dsn: 'https://sentry-emulator-key@sentry.local/1' }),
  JSON.stringify({ type: 'event' }),
  JSON.stringify({
    event_id: eventId,
    platform: 'swift',
    level: 'error',
    exception: { values: [{ type: 'ExampleError', value: 'The request failed' }] },
  }),
].join('\n');
const envelopeResult = await harness.call(
  'POST',
  '/api/:projectId/envelope/',
  envelope,
  { projectId: '1' },
  { sentry_key: 'sentry-emulator-key' },
);
assert.equal(envelopeResult.status, 200);
assert.equal(envelopeResult.payload.id, eventId);

const duplicateResult = await harness.call(
  'POST',
  '/api/:projectId/envelope/',
  envelope,
  { projectId: '1' },
  { sentry_key: 'sentry-emulator-key' },
);
assert.equal(duplicateResult.payload.id, eventId);

const stored = await harness.call(
  'POST',
  '/api/:projectId/store/',
  {
    event_id: 'fedcba9876543210fedcba9876543210',
    platform: 'swift',
    exception: { values: [{ type: 'ExampleError', value: 'The request failed' }] },
  },
  { projectId: '1' },
  { sentry_key: 'sentry-emulator-key' },
);
assert.equal(stored.status, 200);

const events = await harness.call('GET', '/inspect/events');
assert.equal(events.payload.length, 2);
const issues = await harness.call('GET', '/inspect/issues');
const ingestedIssues = issues.payload.filter((issue) => issue.projectId === '1');
assert.equal(ingestedIssues.length, 1);
assert.equal(ingestedIssues[0].count, 2);

const unauthorized = await harness.call('POST', '/api/:projectId/store/', {}, { projectId: '1' });
assert.equal(unauthorized.status, 401);

await harness.call('POST', '/control/rate-limits', { envelope: 30 });
const limited = await harness.call(
  'POST',
  '/api/:projectId/envelope/',
  envelope,
  { projectId: '1' },
  { sentry_key: 'sentry-emulator-key' },
);
assert.equal(limited.status, 429);
assert.equal(limited.headers['retry-after'], '30');
assert.match(limited.headers['x-sentry-rate-limits'], /^30:/);

console.log('sentry smoke ok');
