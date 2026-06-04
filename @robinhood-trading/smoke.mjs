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
assert.ok(tools.payload.result.structuredContent.tools.some((tool) => tool.name === 'place_equity_order'));

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

console.log('robinhood-trading smoke ok');
