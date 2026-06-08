import assert from 'node:assert/strict';
import { createHarness } from '../scripts/provider-smoke-harness.mjs';
import { contract, plugin } from './api-emulator.mjs';

const harness = createHarness(plugin);

assert.equal(contract.provider, 'govinfo');

const collection = await harness.call('GET', '/collections/BILLS/2026-01-01T00:00:00Z?pageSize=1&api_key=govinfo-emulator-key');
assert.equal(collection.payload.packages[0].packageId, 'BILLS-2026-05-24');

const summary = await harness.call('GET', '/packages/BILLS-119s99es/summary?api_key=govinfo-emulator-key');
assert.equal(summary.payload.packageId, 'BILLS-119s99es');

const mods = await harness.call('GET', '/packages/BILLS-119s99es/mods?api_key=govinfo-emulator-key');
assert.match(mods.payload, /Example GovInfo content/);

console.log('govinfo smoke ok');
