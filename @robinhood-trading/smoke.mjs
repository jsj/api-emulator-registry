import assert from 'node:assert/strict';
import { createHarness } from '../scripts/provider-smoke-harness.mjs';
import { contract, plugin, seedFromConfig } from './api-emulator.mjs';

const harness = createHarness(plugin);
assert.equal(contract.provider, 'robinhood-trading');

const initialized = await harness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'init',
  method: 'initialize',
  params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'smoke', version: '1.0.0' } },
});
assert.equal(initialized.payload.result.serverInfo.name, 'robinhood-trading-emulator');
assert.equal(initialized.headers['mcp-session-id'], 'rh-mcp-session-emulator');

const tools = await harness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'tools',
  method: 'tools/list',
  params: {},
});
assert.equal(tools.payload.result.structuredContent.tools.length, 33);
assert.ok(tools.payload.result.structuredContent.tools.some((tool) => tool.name === 'place_equity_order'));
assert.ok(tools.payload.result.structuredContent.tools.some((tool) => tool.name === 'get_option_chains'));
assert.ok(tools.payload.result.structuredContent.tools.some((tool) => tool.name === 'get_option_instruments'));
assert.ok(tools.payload.result.structuredContent.tools.some((tool) => tool.name === 'add_option_to_watchlist'));

const oauthAuthorize = await harness.call('GET', '/oauth/authorize?client_id=robinhood-emulator-client&redirect_uri=http%3A%2F%2Flocalhost%2Fv1%2Fbroker-connections%2Frobinhood%2Fcallback&state=s1');
assert.equal(oauthAuthorize.status, 302);
const callbackUrl = new URL(oauthAuthorize.headers.location);
assert.equal(callbackUrl.pathname, '/v1/broker-connections/robinhood/callback');
assert.equal(callbackUrl.searchParams.get('state'), 's1');
const code = callbackUrl.searchParams.get('code');
assert.ok(code?.startsWith('rh-code-'));

const oauthToken = await harness.call('POST', '/oauth/token', new URLSearchParams({
  grant_type: 'authorization_code',
  code,
  redirect_uri: 'http://localhost/v1/broker-connections/robinhood/callback',
  client_id: 'robinhood-emulator-client',
  client_secret: 'robinhood-emulator-secret',
}).toString(), { 'content-type': 'application/x-www-form-urlencoded' });
assert.equal(oauthToken.payload.token_type, 'Bearer');
assert.ok(oauthToken.payload.access_token.startsWith('rh-access-'));
assert.ok(oauthToken.payload.refresh_token.startsWith('rh-refresh-'));

const refreshToken = await harness.call('POST', '/oauth/token', new URLSearchParams({
  grant_type: 'refresh_token',
  refresh_token: oauthToken.payload.refresh_token,
  client_id: 'robinhood-emulator-client',
  client_secret: 'robinhood-emulator-secret',
}).toString(), { 'content-type': 'application/x-www-form-urlencoded' });
assert.ok(refreshToken.payload.access_token.startsWith('rh-access-'));

const unknownRefreshToken = await harness.call('POST', '/oauth/token', new URLSearchParams({
  grant_type: 'refresh_token',
  refresh_token: 'rh-refresh-unknown',
  client_id: 'robinhood-emulator-client',
  client_secret: 'robinhood-emulator-secret',
}).toString(), { 'content-type': 'application/x-www-form-urlencoded' });
assert.equal(unknownRefreshToken.status, 400);
assert.equal(unknownRefreshToken.payload.error, 'invalid_grant');

const expiredRefreshHarness = createHarness(plugin);
seedFromConfig(expiredRefreshHarness.store, undefined, {
  oauthRefreshTokens: {
    'rh-refresh-expired': {
      issued_at: '2025-12-24T00:00:00.000Z',
      expires_at: '2025-12-31T00:00:00.000Z',
      account_id: 'RHAGENTIC001',
    },
  },
});
const expiredRefreshToken = await expiredRefreshHarness.call('POST', '/oauth/token', new URLSearchParams({
  grant_type: 'refresh_token',
  refresh_token: 'rh-refresh-expired',
  client_id: 'robinhood-emulator-client',
  client_secret: 'robinhood-emulator-secret',
}).toString(), { 'content-type': 'application/x-www-form-urlencoded' });
assert.equal(expiredRefreshToken.status, 400);
assert.equal(expiredRefreshToken.payload.error, 'invalid_grant');

const portfolio = await harness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'portfolio',
  method: 'tools/call',
  params: { name: 'get_portfolio', arguments: {} },
});
assert.ok(Number.isFinite(Number(portfolio.payload.result.structuredContent.buying_power)));

const positions = await harness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'positions',
  method: 'tools/call',
  params: { name: 'get_equity_positions', arguments: {} },
});
assert.ok(Array.isArray(positions.payload.result.structuredContent.positions));

const nonAgenticOrder = await harness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'non-agentic-order',
  method: 'tools/call',
  params: { name: 'place_equity_order', arguments: { account_number: 'RHACCOUNT001', symbol: 'AAPL', side: 'buy', quantity: 1 } },
});
assert.equal(nonAgenticOrder.status, 400);
assert.match(nonAgenticOrder.payload.error.message, /not enabled for agentic trading/);

const profileGateHarness = createHarness(plugin);
seedFromConfig(profileGateHarness.store, undefined, {
  accounts: [{ id: 'acct_profile_gate', account_number: 'RHPROFILE001', status: 'active', agentic_allowed: true, suitability_required: true }],
  orders: [],
  nextId: 1,
});
const profileGateOrder = await profileGateHarness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'profile-gate-order',
  method: 'tools/call',
  params: { name: 'place_equity_order', arguments: { account_number: 'RHPROFILE001', symbol: 'AAPL', side: 'buy', quantity: 1 } },
});
assert.equal(profileGateOrder.status, 400);
assert.match(profileGateOrder.payload.error.message, /Investor profile must be completed/);

const fractionalLimitOrder = await harness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'fractional-limit-order',
  method: 'tools/call',
  params: { name: 'place_equity_order', arguments: { account_number: 'RHAGENTIC001', symbol: 'AAPL', side: 'buy', type: 'limit', quantity: '0.5', limit_price: '200.00' } },
});
assert.equal(fractionalLimitOrder.status, 400);
assert.match(fractionalLimitOrder.payload.error.message, /Limit orders cannot include fractional/);

const fractionalRateLimitHarness = createHarness(plugin);
seedFromConfig(fractionalRateLimitHarness.store, undefined, {
  accounts: [{ id: 'acct_agentic', account_number: 'RHAGENTIC001', status: 'active', agentic_allowed: true }],
  fractionalOrderCount: 0,
  fractionalOrderLimit: 0,
  orders: [],
  nextId: 1,
});
const fractionalRateLimitOrder = await fractionalRateLimitHarness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'fractional-rate-limit-order',
  method: 'tools/call',
  params: { name: 'place_equity_order', arguments: { account_number: 'RHAGENTIC001', symbol: 'AAPL', side: 'buy', type: 'market', dollar_amount: '5.00' } },
});
assert.equal(fractionalRateLimitOrder.status, 429);
assert.match(fractionalRateLimitOrder.payload.error.message, /Fractional order rate limit exceeded/);

const order = await harness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'order',
  method: 'tools/call',
  params: { name: 'place_equity_order', arguments: { symbol: 'AAPL', side: 'buy', quantity: 1 } },
});
assert.equal(order.payload.result.structuredContent.status, 'accepted');

const cancel = await harness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'cancel',
  method: 'tools/call',
  params: { name: 'cancel_equity_order', arguments: { order_id: order.payload.result.structuredContent.id } },
});
assert.equal(cancel.payload.result.structuredContent.status, 'canceled');

const chain = await harness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'chain',
  method: 'tools/call',
  params: { name: 'get_option_chains', arguments: { underlying_symbol: 'AAPL' } },
});
assert.equal(chain.payload.result.structuredContent.chains[0].underlying_symbol, 'AAPL');
assert.ok(chain.payload.result.structuredContent.chains[0].expiration_dates.includes('2026-01-16'));

const instruments = await harness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'option-instruments',
  method: 'tools/call',
  params: {
    name: 'get_option_instruments',
    arguments: { chain_id: chain.payload.result.structuredContent.chains[0].id, expiration_dates: '2026-01-16', type: 'call', state: 'active' },
  },
});
assert.ok(instruments.payload.result.structuredContent.instruments.some((instrument) => instrument.id === 'AAPL260116C00200000'));

const optionQuotes = await harness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'option-quotes',
  method: 'tools/call',
  params: { name: 'get_option_quotes', arguments: { instrument_ids: ['AAPL260116C00200000'] } },
});
assert.equal(optionQuotes.payload.result.structuredContent.quotes[0].instrument_id, 'AAPL260116C00200000');
assert.equal(optionQuotes.payload.result.structuredContent.quotes[0].delta, '0.54');
assert.equal(optionQuotes.payload.result.structuredContent.quotes[0].gamma, '0.036');

const optionOrders = await harness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'option-orders',
  method: 'tools/call',
  params: {
    name: 'get_option_orders',
    arguments: {
      account_number: 'RHAGENTIC001',
      state: 'filled',
      created_at_gte: '2026-01-03',
      chain_ids: chain.payload.result.structuredContent.chains[0].id,
    },
  },
});
assert.deepEqual(optionOrders.payload.result.structuredContent.orders.map((row) => row.id), ['rh_option_order_seed_2']);
assert.equal(optionOrders.payload.result.structuredContent.next, null);
assert.equal(optionOrders.payload.result.structuredContent.orders[0].processed_premium, '622');

const optionPositions = await harness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'option-positions',
  method: 'tools/call',
  params: {
    name: 'get_option_positions',
    arguments: {
      account_number: 'RHAGENTIC001',
      nonzero: true,
      option_type: 'call',
      expiration_date_gte: '2026-01-01',
      expiration_date_lte: '2026-01-31',
    },
  },
});
assert.deepEqual(optionPositions.payload.result.structuredContent.positions.map((row) => row.option_id), ['AAPL260116C00200000']);
assert.equal(optionPositions.payload.result.structuredContent.next, null);

const optionOrder = await harness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'option-order',
  method: 'tools/call',
  params: {
    name: 'place_option_order',
    arguments: { account_number: 'RHAGENTIC001', option_id: 'AAPL260116C00200000', symbol: 'AAPL', side: 'buy', quantity: 1 },
  },
});
assert.equal(optionOrder.payload.result.structuredContent.status, 'accepted');

const cancelOptionOrder = await harness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'cancel-option-order',
  method: 'tools/call',
  params: { name: 'cancel_option_order', arguments: { order_id: optionOrder.payload.result.structuredContent.id } },
});
assert.equal(cancelOptionOrder.payload.result.structuredContent.status, 'canceled');

const watchlist = await harness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'watchlist',
  method: 'tools/call',
  params: { name: 'create_watchlist', arguments: { display_name: 'Options Rollout', symbols: ['MSFT'], option_ids: ['AAPL260116C00200000'] } },
});
assert.equal(watchlist.payload.result.structuredContent.display_name, 'Options Rollout');

const addedOption = await harness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'add-option-watchlist',
  method: 'tools/call',
  params: {
    name: 'add_option_to_watchlist',
    arguments: { watchlist_id: watchlist.payload.result.structuredContent.id, option_id: 'AAPL260116P00195000' },
  },
});
assert.ok(addedOption.payload.result.structuredContent.option_ids.includes('AAPL260116P00195000'));

const watchlistItems = await harness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'watchlist-items',
  method: 'tools/call',
  params: { name: 'get_watchlist_items', arguments: { list_id: watchlist.payload.result.structuredContent.id } },
});
assert.ok(watchlistItems.payload.result.structuredContent.items.some((item) => item.instrument_id === 'AAPL260116P00195000'));

console.log('robinhood-trading smoke ok');
