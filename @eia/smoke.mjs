import assert from 'node:assert/strict';
import { createHarness } from '../scripts/provider-smoke-harness.mjs';
import { contract, plugin } from './api-emulator.mjs';

const harness = createHarness(plugin);

assert.equal(contract.provider, 'eia');

const electricity = await harness.call('GET', '/v2/electricity/retail-sales/data/?data[]=price&frequency=monthly&api_key=eia-emulator-key');
assert.equal(electricity.payload.response.data[0].price, '14.2');

const stocks = await harness.call('GET', '/v2/petroleum/stoc/wstk/data/?data[]=value&frequency=weekly&api_key=eia-emulator-key');
assert.equal(stocks.payload.response.data[0].value, '421000');

console.log('eia smoke ok');
