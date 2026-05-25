import assert from 'node:assert/strict';
import { createHarness } from './provider-smoke-harness.mjs';

export async function runCloudProviderSmoke({ slug, prefix, plugin, contract }) {
  assert.equal(contract.provider, slug);
  const harness = createHarness(plugin);
  const account = await harness.call('GET', `${prefix}/account`);
  assert.equal(account.status, 200);
  const regions = await harness.call('GET', `${prefix}/regions`);
  assert.equal(regions.status, 200);
  const servers = await harness.call('GET', `${prefix}/servers`);
  assert.equal(servers.status, 200);
  const created = await harness.call('POST', `${prefix}/servers`, { name: `${slug}-created` }, { 'content-type': 'application/json' });
  assert.equal(created.status, 201);
  const networks = await harness.call('GET', `${prefix}/networks`);
  assert.equal(networks.status, 200);
  const cdn = await harness.call('GET', `${prefix}/cdn/services`);
  assert.equal(cdn.status, 200);
  console.log(`${slug} smoke ok`);
}
