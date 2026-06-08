import assert from 'node:assert/strict';
import { createHarness } from '../scripts/provider-smoke-harness.mjs';
import { contract, plugin } from './api-emulator.mjs';

const harness = createHarness(plugin);

assert.equal(contract.provider, 'congress');

const bills = await harness.call('GET', '/v3/bill/119/hr?format=json&limit=1&api_key=congress-emulator-key');
assert.equal(bills.payload.bills[0].number, '1234');

const detail = await harness.call('GET', '/v3/bill/119/s/99?format=json&api_key=congress-emulator-key');
assert.equal(detail.payload.bill.title, 'Example Drug Pricing Act');

console.log('congress smoke ok');
