import assert from 'node:assert/strict';
import { createHarness } from '../scripts/provider-smoke-harness.mjs';
import { contract, plugin } from './api-emulator.mjs';

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
