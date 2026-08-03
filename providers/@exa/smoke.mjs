import assert from 'node:assert/strict';
import { contract, plugin } from './api-emulator.mjs';

function createHarness() {
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
  plugin.register(app, store);
  return {
    async call(method, path, body = {}, headers = {}) {
      const handler = routes.get(`${method} ${path}`);
      assert.ok(handler, `missing route ${method} ${path}`);
      let status = 200;
      let payload;
      await handler({
        req: {
          json: async () => body,
          header: (name) => headers[name.toLowerCase()],
        },
        json: (value, nextStatus = 200) => {
          status = nextStatus;
          payload = value;
          return { status, payload };
        },
      });
      return { status, payload };
    },
  };
}

const harness = createHarness();
assert.equal(contract.provider, 'exa');

const search = await harness.call('POST', '/search', {
  query: 'agent search APIs',
  type: 'auto',
  numResults: 1,
  contents: {
    text: { maxCharacters: 2000 },
    highlights: { maxCharacters: 1000 },
    summary: { query: 'agent search APIs' },
  },
});
assert.equal(search.status, 200);
assert.equal(search.payload.results.length, 1);
assert.match(search.payload.results[0].title, /agent search APIs/);
assert.match(search.payload.results[0].summary, /agent search APIs/);
assert.equal(search.payload.costDollars.total, 0);

const legacySummary = await harness.call('POST', '/search', {
  query: 'legacy summary shape',
  contents: { summary: true },
});
assert.equal(legacySummary.status, 400);
assert.match(legacySummary.payload.error, /summary must be an object/);

const invalidType = await harness.call('POST', '/search', { query: 'bad type', type: 'neural' });
assert.equal(invalidType.status, 400);
assert.match(invalidType.payload.error, /type must be one of/);

const paymentRequired = await harness.call(
  'POST',
  '/search',
  { query: 'billing test' },
  { 'x-api-key': 'exa-payment-required' },
);
assert.equal(paymentRequired.status, 402);
assert.equal(paymentRequired.payload.tag, 'X402_PAYMENT_REQUIRED');

const contents = await harness.call('POST', '/contents', { ids: [search.payload.results[0].id] });
assert.equal(contents.payload.results[0].id, search.payload.results[0].id);

const similar = await harness.call('POST', '/findSimilar', { url: 'https://example.com', numResults: 1 });
assert.match(similar.payload.results[0].title, /Similar to https:\/\/example.com/);

const answer = await harness.call('POST', '/answer', { query: 'best web APIs for agents' });
assert.match(answer.payload.answer, /best web APIs for agents/);

const state = await harness.call('GET', '/inspect/state');
assert.equal(state.payload.searches[0].query, 'agent search APIs');
assert.equal(state.payload.answers[0].query, 'best web APIs for agents');

console.log('exa smoke ok');
