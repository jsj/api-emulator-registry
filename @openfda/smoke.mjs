import assert from 'node:assert/strict';
import { createHarness } from '../scripts/provider-smoke-harness.mjs';
import { contract, plugin } from './api-emulator.mjs';

const harness = createHarness(plugin);

assert.equal(contract.provider, 'openfda');

const event = await harness.call('GET', '/drug/event.json?search=Mounjaro&limit=1&api_key=openfda-emulator-key');
assert.equal(event.status, 200);
assert.equal(event.payload.results[0].openfda.brand_name[0], 'MOUNJARO');

const label = await harness.call('GET', '/drug/label.json?search=openfda.brand_name:%22EXAMPLEDRUG%22&limit=1');
assert.equal(label.payload.results[0].openfda.manufacturer_name[0], 'Example Pharma Inc.');

const applications = await harness.call('GET', '/drug/drugsfda.json?search=openfda.brand_name:%22EXAMPLEDRUG%22&limit=1');
assert.equal(applications.payload.results[0].application_number, 'NDA123456');
assert.equal(applications.payload.results[0].submissions[0].application_docs[0].application_docs_title, 'Approval Letter');

const shortages = await harness.call('GET', '/drug/shortages.json?limit=1');
assert.equal(shortages.payload.results[0].status, 'Current');

console.log('openfda smoke ok');
