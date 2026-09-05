import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { CRYPTO_TOOL_NAMES, cryptoDefaults, handleCryptoTool } from './crypto-tools.mjs';
const tools = JSON.parse(readFileSync(new URL('./fixtures/tools-contract.sanitized.json', import.meta.url))).tools;
const account = { rhs_account_number: '900000006' };
const args = { ...account, symbol: 'BTC', side: 'buy', type: 'limit', quantity: '0.001', limit_price: '10000.00' };
function state() { return { ...cryptoDefaults(), nextId: 1, accounts: [{ ...account, account_number: 'RHAGENTIC001', agentic_allowed: true }] }; }
function schemaCheck(value, schema) {
  if (!schema) return;
  const types = [schema.type].flat().filter(Boolean);
  if (types.length) assert.ok(types.some((type) => type === 'null' ? value === null : type === 'array' ? Array.isArray(value) : type === 'object' ? value !== null && typeof value === 'object' && !Array.isArray(value) : type === 'integer' ? Number.isInteger(value) : typeof value === type), `Invalid schema type ${JSON.stringify(value)}`);
  if (value === null) return;
  if (Array.isArray(value)) return value.forEach((row) => schemaCheck(row, schema.items));
  if (typeof value !== 'object') return;
  for (const key of schema.required ?? []) assert.ok(Object.hasOwn(value, key), `Missing ${key}`);
  for (const [key, item] of Object.entries(value)) { if (schema.additionalProperties === false) assert.ok(schema.properties?.[key], `Unexpected ${key}`); schemaCheck(item, schema.properties?.[key]); }
}
function call(s, name, input = {}) {
  const result = handleCryptoTool(name, input, s, tools);
  assert.ok(result && !result.error, `${name}: ${result?.error}`);
  schemaCheck(result.data, tools.find((row) => row.name === name).outputSchema.properties.data);
  return result.data;
}

test('all eight crypto tools match captured schemas and support preview/place/list/cancel', () => {
  const s = state();
  assert.equal(CRYPTO_TOOL_NAMES.length, 8);
  assert.equal(call(s, 'get_crypto_account_onboarding_info').already_onboarded, true);
  assert.equal(call(s, 'get_currency_pairs').results.length, 2);
  assert.equal(call(s, 'get_crypto_quotes', { symbols: ['BTC-USD', 'ETHUSD'] }).results[0].symbol, 'BTCUSD');
  assert.deepEqual(call(s, 'get_crypto_positions', account).results, []);
  const before = structuredClone(s);
  const preview = call(s, 'preview_crypto_order', args);
  assert.equal(preview.order.net_rounded_estimated_notional, '10.00');
  assert.deepEqual(s, before);
  const placed = call(s, 'place_crypto_order', args).order;
  assert.equal(placed.speculative, false);
  assert.equal(placed.state, 'queued');
  assert.deepEqual(call(s, 'get_crypto_orders', { ...account, state_group: 'open' }).results, [placed]);
  assert.equal(call(s, 'cancel_crypto_order', { ...account, order_id: placed.id }).accepted, true);
  assert.equal(call(s, 'get_crypto_orders', { ...account, order_id: placed.id }).results[0].state, 'canceled');
  assert.equal(call(s, 'get_crypto_orders', { ...account, state_group: 'open' }).results.length, 0);
  assert.match(handleCryptoTool('cancel_crypto_order', { ...account, order_id: placed.id }, s, tools).error, /eligible/);
});

test('dollar sizing and time in force follow crypto order type', () => {
  const s = state();
  for (const [type, prices, expectedPrice, tif] of [
    ['market', {}, 80001, 'gtc'], ['limit', { limit_price: '10000' }, 10000, 'gtc'],
    ['stop_loss', { stop_price: '20000' }, 20000, 'gfd'], ['stop_limit', { stop_price: '20000', limit_price: '10000' }, 10000, 'gfd'],
  ]) {
    const result = call(s, 'preview_crypto_order', { ...account, symbol: 'BTCUSD', side: 'buy', type, dollar_amount: '100', ...prices });
    assert.ok(Math.abs(Number(result.order.quantity) - 100 / expectedPrice) < 0.00000001);
    assert.equal(result.order.time_in_force, tif);
  }
});

test('invalid crypto orders are rejected without state changes', () => {
  const s = state();
  const cases = [
    { rhs_account_number: 'RHAGENTIC001' }, { side: 'short' }, { type: 'stop_market' }, { quantity: undefined },
    { dollar_amount: '10' }, { quantity: '0' }, { quantity: '-1' }, { quantity: 'NaN' }, { quantity: 'Infinity' },
    { quantity: 1 }, { quantity: '1e-3' }, { quantity: '0.000000001' }, { quantity: '1001' },
    { limit_price: undefined }, { limit_price: '0' }, { stop_price: '100' }, { limit_price: '10000.001' },
    { time_in_force: 'ioc' }, { time_in_force: 'gfd' }, { symbol: 'UNKNOWN' }, { surprise: true },
  ];
  for (const patch of cases) {
    const input = Object.fromEntries(Object.entries({ ...args, ...patch }).filter(([, value]) => value !== undefined));
    const before = structuredClone(s);
    assert.ok(handleCryptoTool('place_crypto_order', input, s, tools).error, JSON.stringify(patch));
    assert.deepEqual(s, before);
  }
  s.currencyPairs[0].halted = true;
  assert.match(handleCryptoTool('preview_crypto_order', args, s, tools).error, /tradable/);
});

test('account ownership, permissions, balances, reservations, and idempotent retry', () => {
  const s = state();
  s.accounts.push({ rhs_account_number: '900000007', agentic_allowed: true });
  s.cryptoAccounts.push({ ...s.cryptoAccounts[0], rhs_account_number: '900000007', account_id: 'other-crypto', crypto_account_number: 'RHCOTHER' });
  s.cryptoAccounts[0].buying_power = '10';
  const ref_id = '00000000-0000-4000-8000-000000000123';
  const order = call(s, 'place_crypto_order', { ...args, ref_id }).order;
  assert.equal(call(s, 'place_crypto_order', { ...args, ref_id }).order.id, order.id);
  assert.equal(s.cryptoOrders.length, 1);
  assert.match(handleCryptoTool('place_crypto_order', args, s, tools).error, /buying power/);
  assert.deepEqual(call(s, 'get_crypto_orders', { rhs_account_number: '900000007' }).results, []);
  assert.match(handleCryptoTool('cancel_crypto_order', { rhs_account_number: '900000007', order_id: order.id }, s, tools).error, /not found/);
  call(s, 'cancel_crypto_order', { ...account, order_id: order.id });
  call(s, 'place_crypto_order', args);
  s.accounts[0].agentic_allowed = false;
  assert.match(handleCryptoTool('preview_crypto_order', args, s, tools).error, /not accessible/);
});

test('sell reservations are visible in positions and released on cancellation', () => {
  const s = state();
  s.cryptoPositions.push({ account_id: 'crypto-account-6', currency_pair_id: s.currencyPairs[0].id, currency: { code: 'BTC', name: 'Bitcoin', type: 'cryptocurrency' }, quantity: '0.001', quantity_transferable: '0.001', quantity_held_for_sell: '0' });
  const order = call(s, 'place_crypto_order', { ...args, side: 'sell' }).order;
  const position = call(s, 'get_crypto_positions', account).results[0];
  assert.equal(position.quantity_held_for_sell, '0.001');
  assert.equal(position.quantity_transferable, '0');
  assert.match(handleCryptoTool('place_crypto_order', { ...args, side: 'sell' }, s, tools).error, /Insufficient/);
  call(s, 'cancel_crypto_order', { ...account, order_id: order.id });
  assert.equal(call(s, 'get_crypto_positions', account).results[0].quantity_held_for_sell, '0');
});

test('fee-priced buy sizing stays within requested notional', () => {
  const s = state(); s.cryptoAccounts[0].fee_rate = '0.0035';
  const preview = call(s, 'preview_crypto_order', { ...account, symbol: 'BTC', side: 'buy', type: 'limit', dollar_amount: '100', limit_price: '10000' });
  assert.equal(preview.fee_rate, '0.35%');
  assert.equal(preview.estimated_fee, '0.35');
  assert.ok(Number(preview.order.net_rounded_estimated_notional) <= 100.01);
});

test('currency catalog pagination and malformed input', () => {
  const s = state();
  const first = call(s, 'get_currency_pairs', { limit: 1 });
  const cursor = new URL(first.next).searchParams.get('cursor');
  const second = call(s, 'get_currency_pairs', { limit: 1, cursor });
  assert.notEqual(first.results[0].id, second.results[0].id);
  assert.equal(second.next, undefined);
  assert.ok(handleCryptoTool('get_currency_pairs', { cursor: '-1' }, s, tools).error);
  assert.ok(handleCryptoTool('get_crypto_quotes', { symbols: ['BTC-USD'], timezone: 'not-a-zone' }, s, tools).error);
  s.cryptoAccounts = [];
  assert.equal(call(s, 'get_crypto_account_onboarding_info').already_onboarded, false);
});

test('public live market captures match today’s tool schemas', () => {
  const fixture = JSON.parse(readFileSync(new URL('./fixtures/crypto-observed.sanitized.json', import.meta.url)));
  assert.equal(fixture.captured_at.slice(0, 10), '2026-09-05');
  for (const [name, results] of [['get_currency_pairs', fixture.currency_pairs], ['get_crypto_quotes', fixture.quotes]]) {
    assert.ok(results.length >= 2);
    schemaCheck({ results }, tools.find((row) => row.name === name).outputSchema.properties.data);
  }
});

test('order polling uses instants, rejects conflicting filters, and sees cancellation updates', () => {
  const s = state();
  const order = call(s, 'place_crypto_order', args).order;
  const created = order.created_at;
  for (const date of [created, created.replace('.000Z', 'Z'), created.replace('.000Z', '')]) assert.equal(call(s, 'get_crypto_orders', { ...account, created_at_gte: date }).results.length, 1);
  assert.ok(handleCryptoTool('get_crypto_orders', { ...account, state: 'queued', state_group: 'open' }, s, tools).error);
  assert.ok(handleCryptoTool('get_crypto_orders', { ...account, updated_at_gte: 'garbage' }, s, tools).error);
  call(s, 'cancel_crypto_order', { ...account, order_id: order.id });
  assert.ok(Date.parse(order.updated_at) > Date.parse(created));
  assert.equal(call(s, 'get_crypto_orders', { ...account, updated_at_gte: order.updated_at }).results.length, 1);
});

test('seeded assets preserve quantity precision finer than eight decimals', () => {
  const s = state();
  s.currencyPairs[0].min_order_size = '0.000000001';
  s.currencyPairs[0].min_order_quantity_increment = '0.000000001';
  const preview = call(s, 'preview_crypto_order', { ...args, quantity: '0.000000015', limit_price: '1000000000' });
  assert.equal(preview.order.quantity, '0.000000015');
  assert.equal(preview.order.net_rounded_estimated_notional, '15.00');
  const dollars = call(s, 'preview_crypto_order', { ...account, symbol: 'BTC', side: 'buy', type: 'limit', dollar_amount: '15', limit_price: '1000000000' });
  assert.equal(dollars.order.quantity, '0.000000015');
});

test('separate emulator stores do not share crypto orders or reservations', async () => {
  const { createHarness } = await import('../../scripts/provider-smoke-harness.mjs');
  const { plugin } = await import('./api-emulator.mjs');
  const a = createHarness(plugin), b = createHarness(plugin);
  const request = (harness, name, input) => harness.call('POST', '/mcp/trading', { jsonrpc: '2.0', id: name, method: 'tools/call', params: { name, arguments: input } });
  const placed = await request(a, 'place_crypto_order', args);
  assert.equal(placed.status, 200);
  const order = placed.payload.result.structuredContent.data.order;
  const other = await request(b, 'get_crypto_orders', account);
  assert.deepEqual(other.payload.result.structuredContent.data.results, []);
  assert.equal((await request(b, 'cancel_crypto_order', { ...account, order_id: order.id })).status, 400);
  const owner = await request(a, 'get_crypto_orders', account);
  assert.equal(owner.payload.result.structuredContent.data.results[0].state, 'queued');
});
