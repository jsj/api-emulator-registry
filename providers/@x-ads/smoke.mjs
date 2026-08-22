import assert from 'node:assert/strict';
import { createHarness } from '../../scripts/provider-smoke-harness.mjs';
import { contract, plugin } from './api-emulator.mjs';

const harness = createHarness(plugin);
const call = (name, args = {}) => harness.call('POST', '/mcp', { jsonrpc: '2.0', id: name, method: 'tools/call', params: { name, arguments: args } });
const data = (response) => response.payload.result.structuredContent;

assert.equal(contract.provider, 'x-ads');
const initialized = await harness.call('POST', '/mcp', { jsonrpc: '2.0', id: 1, method: 'initialize', params: {} });
assert.equal(initialized.payload.result.serverInfo.name, 'x-ads-emulator');

const tools = await harness.call('POST', '/mcp', { jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} });
assert.equal(tools.payload.result.structuredContent.tools.length, 23);
assert.deepEqual(tools.payload.result.structuredContent.tools.map((tool) => tool.name), contract.scope);

const accounts = await call('list_ads_accounts');
assert.equal(data(accounts).accounts[0].id, 'ads-account-1');

const created = await call('create_campaign', { account_id: 'ads-account-1', name: 'Safe test', daily_budget_amount_local_micro: 10_000_000 });
assert.equal(data(created).campaign.entity_status, 'PAUSED');
const campaignId = data(created).campaign.id;

const lineItem = await call('create_line_item', { account_id: 'ads-account-1', campaign_id: campaignId, name: 'Clicks', objective: 'WEBSITE_CLICKS' });
assert.equal(data(lineItem).line_item.entity_status, 'PAUSED');

const post = await call('create_ad_post', { account_id: 'ads-account-1', text: 'Nullcast test creative' });
assert.equal(data(post).post.nullcast, true);

const activated = await call('activate_campaign', { campaign_id: campaignId });
assert.equal(data(activated).campaign.entity_status, 'ACTIVE');

console.log('x-ads smoke ok');
