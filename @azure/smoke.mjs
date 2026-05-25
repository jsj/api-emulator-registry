import assert from 'node:assert/strict';
import { createHarness } from '../scripts/provider-smoke-harness.mjs';
import { contract, plugin } from './api-emulator.mjs';

const harness = createHarness(plugin);
assert.equal(contract.provider, 'azure');

const subscriptionId = '00000000-0000-0000-0000-000000000000';
const subscriptions = await harness.call('GET', '/subscriptions?api-version=2020-01-01');
assert.equal(subscriptions.payload.value[0].displayName, 'Azure Emulator Subscription');

const locations = await harness.call('GET', `/subscriptions/${subscriptionId}/locations?api-version=2022-12-01`);
assert.equal(locations.payload.value[0].name, 'eastus');

const providers = await harness.call('GET', `/subscriptions/${subscriptionId}/providers/Microsoft.Resources?api-version=2021-04-01`);
assert.equal(providers.payload.namespace, 'Microsoft.Resources');

const list = await harness.call('GET', `/subscriptions/${subscriptionId}/resourcegroups?api-version=2021-04-01`);
assert.equal(list.payload.value[0].name, 'emulator-rg');

const resources = await harness.call('GET', `/subscriptions/${subscriptionId}/resources?api-version=2021-04-01`);
assert.equal(resources.payload.value[0].name, 'emulator-vm');

const created = await harness.call('PUT', `/subscriptions/${subscriptionId}/resourcegroups/smoke-rg?api-version=2021-04-01`, { location: 'westus2', tags: { smoke: 'true' } });
assert.equal(created.status, 201);
assert.equal(created.payload.properties.provisioningState, 'Succeeded');

const fetched = await harness.call('GET', `/subscriptions/${subscriptionId}/resourcegroups/smoke-rg?api-version=2021-04-01`);
assert.equal(fetched.payload.location, 'westus2');

const deployment = await harness.call('PUT', `/subscriptions/${subscriptionId}/resourcegroups/smoke-rg/providers/Microsoft.Resources/deployments/smoke-deployment?api-version=2021-04-01`, { properties: { mode: 'Incremental', template: { outputs: { ok: { type: 'String', value: 'yes' } } } } });
assert.equal(deployment.status, 201);
assert.equal(deployment.payload.properties.provisioningState, 'Succeeded');

const deploymentList = await harness.call('GET', `/subscriptions/${subscriptionId}/resourcegroups/smoke-rg/providers/Microsoft.Resources/deployments?api-version=2021-04-01`);
assert.equal(deploymentList.payload.value[0].name, 'smoke-deployment');

const deleted = await harness.call('DELETE', `/subscriptions/${subscriptionId}/resourcegroups/smoke-rg?api-version=2021-04-01`);
assert.equal(deleted.status, 204);

console.log('azure smoke ok');
