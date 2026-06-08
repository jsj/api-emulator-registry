import assert from 'node:assert/strict';
import { createHarness } from '../scripts/provider-smoke-harness.mjs';
import { contract, plugin } from './api-emulator.mjs';

const harness = createHarness(plugin);

assert.equal(contract.provider, 'courtlistener');

const search = await harness.call('GET', '/api/rest/v4/search/?q=Example&type=o&page_size=1', undefined, {
  Authorization: 'Token courtlistener-emulator-token',
});
assert.equal(search.status, 200);
assert.equal(search.payload.results[0].caseName, 'Example Pharma Securities Litigation');

const docket = await harness.call('GET', '/api/rest/v4/dockets/777/');
assert.equal(docket.payload.docketNumber, '1:26-cv-00001');

const recap = await harness.call('GET', '/api/rest/v4/recap-documents/888/');
assert.equal(recap.payload.is_available, true);

console.log('courtlistener smoke ok');
