import assert from 'node:assert/strict';
import { createHarness } from '../../scripts/provider-smoke-harness.mjs';
import { contract, plugin, seedFromConfig } from './api-emulator.mjs';

const harness = createHarness(plugin);
const auth = { authorization: 'Bearer sc-emulator-test' };
const call = (method, path, body) => harness.call(method, path, body, auth);

assert.equal(contract.provider, 'shortcut');
assert.equal((await harness.call('GET', '/api/spreadsheets/verify')).status, 401);
assert.equal((await call('GET', '/api/spreadsheets/verify')).payload.success, true);
assert.equal((await call('GET', '/api/spreadsheets/skills')).payload.skills[0].id, 'default:spreadsheet');
assert.equal((await call('POST', '/api/spreadsheets', {})).status, 400);

const upload = await call('POST', '/api/spreadsheets/upload', 'sample input');
assert.match(upload.payload.fileId, /^[0-9a-f-]{36}$/);

const created = await call('POST', '/api/spreadsheets', { prompt: 'Create a budget', skills: ['default:spreadsheet'] });
assert.equal(created.status, 200);
const runId = created.payload.runId;
assert.equal(created.payload.status, 'queued');
assert.equal((await call('GET', '/api/spreadsheets')).payload.runs[0].runId, runId);
assert.equal((await call('GET', `/api/spreadsheets/${runId}/download`)).status, 409);
assert.equal((await call('GET', `/api/spreadsheets/${runId}`)).payload.status, 'running');
assert.equal((await call('GET', `/api/spreadsheets/${runId}`)).payload.status, 'finalizing');
const complete = await call('GET', `/api/spreadsheets/${runId}`);
assert.equal(complete.payload.status, 'completed');
assert.match(complete.payload.downloadUrl, /\/api\/spreadsheets\/run_emulator_1\/download$/);
assert.deepEqual(complete.payload.artifacts, ['result.xlsx']);
const download = await call('GET', `/api/spreadsheets/${runId}/download`);
assert.equal(download.status, 200);
assert.equal(download.payload.readUInt32LE(0), 0x04034b50);
assert.equal((await call('GET', `/api/spreadsheets/${runId}/artifacts/result.xlsx`)).status, 200);
assert.equal((await call('GET', `/api/spreadsheets/${runId}/artifacts/other.xlsx`)).status, 404);
assert.equal((await call('POST', `/api/spreadsheets/${runId}/cancel`)).status, 409);

const toCancel = await call('POST', '/api/spreadsheets', { prompt: 'Cancel me' });
assert.equal((await call('POST', `/api/spreadsheets/${toCancel.payload.runId}/cancel`)).payload.status, 'cancelled');
assert.equal((await call('GET', `/api/spreadsheets/${toCancel.payload.runId}`)).payload.status, 'cancelled');

seedFromConfig(harness.store, 'http://localhost', { shortcut: { outcomes: { 'Fail me': 'failed' } } });
const toFail = await call('POST', '/api/spreadsheets', { prompt: 'Fail me' });
await call('GET', `/api/spreadsheets/${toFail.payload.runId}`);
await call('GET', `/api/spreadsheets/${toFail.payload.runId}`);
assert.equal((await call('GET', `/api/spreadsheets/${toFail.payload.runId}`)).payload.status, 'failed');
assert.equal((await call('GET', '/api/spreadsheets/missing')).status, 404);

assert.equal((await call('GET', '/api/v1/team/usage-export')).status, 400);
assert.equal((await call('GET', '/api/v1/team/usage-export?team_id=team_emulator')).payload.totalRuns, 0);
assert.match((await call('GET', '/api/v1/team/usage-export?team_id=team_emulator&format=csv')).payload, /runId,status,creditsUsed/);

console.log('shortcut smoke ok');
