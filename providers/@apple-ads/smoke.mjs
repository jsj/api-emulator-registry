import assert from 'node:assert/strict';
import { createApp, Store, withServer } from '../../scripts/cli-smoke-runtime.mjs';
import { contract, plugin } from './api-emulator.mjs';

assert.equal(contract.provider, 'apple-ads');
assert.deepEqual(contract.baseUrls, ['https://api.ads.apple.com/v1/']);
assert.equal(contract.operationCount, 78);

const app = createApp();
const store = new Store();
plugin.register(app, store);

await withServer(app, async (baseUrl) => {
  const auth = await (await fetch(`${baseUrl}/auth/local`, { method: 'POST' })).json();
  const headers = { authorization: `Bearer ${auth.accessToken}`, 'x-ap-context': `adAccountId=${auth.adAccountId}`, 'content-type': 'application/json' };

  assert.equal((await fetch(`${baseUrl}/v1/campaigns/444555666`)).status, 401);
  assert.equal((await fetch(`${baseUrl}/v1/campaigns/444555666`, { headers: { authorization: headers.authorization, 'x-ap-context': 'orgId=123' } })).status, 400);

  const campaign = await (await fetch(`${baseUrl}/v1/campaigns/444555666`, { headers })).json();
  assert.equal(campaign.result.promotedObjectType, 'APPSTORE_APP');
  const queried = await (await fetch(`${baseUrl}/v1/campaigns/query`, { method: 'POST', headers, body: JSON.stringify({ filters: [{ field: 'status', operator: 'EQUALS', value: 'ENABLED' }] }) })).json();
  assert.equal(queried.result.length, 1);

  const created = await (await fetch(`${baseUrl}/v1/keywords`, { method: 'POST', headers, body: JSON.stringify({ adGroupId: 555666777, text: 'trip planner', status: 'ENABLED', matchType: 'EXACT', bid: { amount: '2.50', currency: 'USD' } }) })).json();
  assert.equal(created.result.campaignId, 444555666);
  const bulk = await (await fetch(`${baseUrl}/v1/keywords/bulk-create`, { method: 'POST', headers, body: JSON.stringify({ allowPartialSuccess: true, items: [{ correlationId: 7, data: { adGroupId: 555666777, text: 'flight finder', matchType: 'BROAD' } }] }) })).json();
  assert.equal(bulk.result[0].correlationId, 7);
  assert.equal(bulk.result[0].success, true);

  const popularity = await (await fetch(`${baseUrl}/v1/insights/apps/search-term-popularity/query`, { method: 'POST', headers, body: '{}' })).json();
  assert.equal(popularity.result.rows[0].searchPopularity1to100, 88);
  const recommendations = await (await fetch(`${baseUrl}/v1/recommendations/keywords/query`, { method: 'POST', headers, body: '{}' })).json();
  assert.equal(recommendations.result[0].popularity, 85);
  const change = await (await fetch(`${baseUrl}/v1/change-history/Campaign.444555666.txn_abc123def456`, { headers })).json();
  assert.equal(change.dataType, 'ChangeDetail');

  const inspected = await (await fetch(`${baseUrl}/inspect/state`)).json();
  assert.ok(inspected.keywords.some((row) => row.text === 'trip planner'));
});

console.log('apple-ads platform api v1 emulator smoke ok');
