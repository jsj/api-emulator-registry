import assert from 'node:assert/strict';
import { createHarness } from '../scripts/provider-smoke-harness.mjs';
import { contract, plugin } from './api-emulator.mjs';

const harness = createHarness(plugin);

assert.equal(contract.provider, 'finnhub');

const marketNews = await harness.call('GET', '/news?category=general&token=finnhub-emulator-token');
assert.equal(marketNews.status, 200);
assert.equal(typeof marketNews.payload[0].id, 'number');
assert.ok(marketNews.payload[0].headline);
assert.ok(marketNews.payload[0].source);

const filtered = await harness.call('GET', '/api/v1/news?category=forex&minId=4085113', undefined, {
  'X-Finnhub-Token': 'demo-token',
});
assert.equal(filtered.status, 200);
assert.equal(filtered.payload.length, 1);
assert.equal(filtered.payload[0].category, 'forex');

const companyNews = await harness.call('GET', '/company-news?symbol=AAPL&from=2025-05-15&to=2025-06-20');
assert.equal(companyNews.status, 200);
assert.equal(companyNews.payload[0].related, 'AAPL');
assert.match(companyNews.payload[1].headline, /Apple/);

const unknownCompany = await harness.call('GET', '/company-news?symbol=NVDA&from=2025-05-15&to=2025-06-20');
assert.equal(unknownCompany.payload[0].related, 'NVDA');

const invalidCategory = await harness.call('GET', '/news?category=commodities');
assert.equal(invalidCategory.status, 400);
assert.equal(invalidCategory.payload.error.code, 'invalid_category');

const invalidToken = await harness.call('GET', '/news?category=general&token=bad-token');
assert.equal(invalidToken.status, 401);

const state = await harness.call('GET', '/inspect/state');
assert.equal(state.payload.requests.length, 4);

console.log('finnhub smoke ok');
