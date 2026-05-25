import assert from 'node:assert/strict';
import { createHarness } from '../scripts/provider-smoke-harness.mjs';
import { contract, plugin } from './api-emulator.mjs';

const harness = createHarness(plugin);
assert.equal(contract.provider, 'robinhood-banking');

const initialized = await harness.call('POST', '/mcp/banking', {
  jsonrpc: '2.0',
  id: 'init',
  method: 'initialize',
  params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'smoke', version: '1.0.0' } },
});
assert.equal(initialized.payload.result.serverInfo.name, 'robinhood-banking-emulator');
assert.equal(initialized.headers['mcp-session-id'], 'rh-banking-mcp-session-emulator');

const oauthAuthorize = await harness.call(
  'GET',
  '/oauth/authorize?client_id=robinhood-banking-emulator-client&redirect_uri=http%3A%2F%2Flocalhost%2Foauth%2Frobinhood-banking%2Fcallback&state=s1',
);
assert.equal(oauthAuthorize.status, 302);
const callbackUrl = new URL(oauthAuthorize.headers.location);
assert.equal(callbackUrl.pathname, '/oauth/robinhood-banking/callback');
assert.equal(callbackUrl.searchParams.get('state'), 's1');
const code = callbackUrl.searchParams.get('code');
assert.ok(code?.startsWith('rh-bank-code-'));

const oauthToken = await harness.call(
  'POST',
  '/oauth/token',
  new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: 'http://localhost/oauth/robinhood-banking/callback',
    client_id: 'robinhood-banking-emulator-client',
    client_secret: 'robinhood-banking-emulator-secret',
  }).toString(),
  { 'content-type': 'application/x-www-form-urlencoded' },
);
assert.equal(oauthToken.payload.token_type, 'Bearer');
assert.ok(oauthToken.payload.access_token.startsWith('rh-bank-access-'));
assert.ok(oauthToken.payload.refresh_token.startsWith('rh-bank-refresh-'));

const refreshToken = await harness.call(
  'POST',
  '/oauth/token',
  new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: oauthToken.payload.refresh_token,
    client_id: 'robinhood-banking-emulator-client',
    client_secret: 'robinhood-banking-emulator-secret',
  }).toString(),
  { 'content-type': 'application/x-www-form-urlencoded' },
);
assert.ok(refreshToken.payload.access_token.startsWith('rh-bank-access-'));

const tools = await harness.call('POST', '/mcp/banking', {
  jsonrpc: '2.0',
  id: 'tools',
  method: 'tools/list',
  params: {},
});
assert.ok(tools.payload.result.structuredContent.tools.some((tool) => tool.name === 'banking_get_agent_card_creds'));

const balance = await harness.call('POST', '/mcp/banking', {
  jsonrpc: '2.0',
  id: 'balance',
  method: 'tools/call',
  params: { name: 'banking_get_agent_card_balance', arguments: {} },
});
assert.equal(typeof balance.payload.result.structuredContent.monthlyLimit, 'number');

const creds = await harness.call('POST', '/mcp/banking', {
  jsonrpc: '2.0',
  id: 'creds',
  method: 'tools/call',
  params: { name: 'banking_get_agent_card_creds', arguments: {} },
});
assert.equal(creds.payload.result.structuredContent.cardNumber, '4242424242424242');

const status = await harness.call('POST', '/mcp/banking', {
  jsonrpc: '2.0',
  id: 'status',
  method: 'tools/call',
  params: { name: 'banking_get_agent_card_status', arguments: {} },
});
assert.equal(status.payload.result.structuredContent.cardStatus, 'NORMAL');

const transactions = await harness.call('POST', '/mcp/banking', {
  jsonrpc: '2.0',
  id: 'transactions',
  method: 'tools/call',
  params: { name: 'banking_get_agent_card_transactions', arguments: {} },
});
assert.ok(Array.isArray(transactions.payload.result.structuredContent.data.transactionSearch.items));

console.log('robinhood-banking smoke ok');
