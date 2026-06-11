import assert from 'node:assert/strict';
import { createHarness } from '../scripts/provider-smoke-harness.mjs';
import { contract, plugin } from './api-emulator.mjs';

const harness = createHarness(plugin);

assert.equal(contract.provider, 'alpha-vantage');

const quote = await harness.call('GET', '/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=alpha-vantage-emulator-key');
assert.equal(quote.status, 200);
assert.equal(quote.payload['Global Quote']['01. symbol'], 'IBM');
assert.equal(quote.payload['Global Quote']['05. price'], '272.3600');

const daily = await harness.call('GET', '/query?function=TIME_SERIES_DAILY&symbol=AAPL&apikey=demo');
assert.equal(daily.status, 200);
assert.equal(daily.payload['Meta Data']['2. Symbol'], 'AAPL');
assert.equal(daily.payload['Time Series (Daily)']['2026-06-10']['4. close'], '204.7500');

const search = await harness.call('GET', '/query?function=SYMBOL_SEARCH&keywords=tesco&apikey=alpha-vantage-emulator-key');
assert.equal(search.status, 200);
assert.equal(search.payload.bestMatches[0]['1. symbol'], 'TSCO.LON');
assert.equal(search.payload.bestMatches[0]['2. name'], 'Tesco PLC');

const status = await harness.call('GET', '/query?function=MARKET_STATUS&apikey=alpha-vantage-emulator-key');
assert.equal(status.status, 200);
assert.equal(status.payload.endpoint, 'Global Market Open & Close Status');
assert.ok(status.payload.markets.some((market) => market.region === 'United States'));

const unknown = await harness.call('GET', '/query?function=OVERVIEW&symbol=IBM&apikey=alpha-vantage-emulator-key');
assert.equal(unknown.status, 200);
assert.match(unknown.payload.Information, /no fixture for function=OVERVIEW/);

const missingKey = await harness.call('GET', '/query?function=GLOBAL_QUOTE&symbol=IBM');
assert.equal(missingKey.status, 200);
assert.match(missingKey.payload['Error Message'], /apikey is invalid or missing/);

const state = await harness.call('GET', '/inspect/state');
assert.equal(state.payload.requests.length, 4);

console.log('alpha-vantage smoke ok');
