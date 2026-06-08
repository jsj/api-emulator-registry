import assert from 'node:assert/strict';
import { createHarness } from '../scripts/provider-smoke-harness.mjs';
import { contract, plugin } from './api-emulator.mjs';

const harness = createHarness(plugin);

assert.equal(contract.provider, 'uspto');

const assignments = await harness.call('GET', '/api/v1/patent/applications/18123456/assignment', undefined, {
  'X-API-KEY': 'uspto-emulator-key',
});
assert.equal(assignments.payload.patentFileWrapperDataBag[0].assigneeBag[0].name, 'Example Bio Inc.');

const trademark = await harness.call('GET', '/ts/cd/casestatus/sn97123456/info.json');
assert.equal(trademark.payload.caseFileHeader.markIdentification, 'EXAMPLEMARK');

console.log('uspto smoke ok');
