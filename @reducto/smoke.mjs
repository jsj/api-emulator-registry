import assert from 'node:assert/strict';
import { createApp, Store, withServer } from '../scripts/cli-smoke-runtime.mjs';
import { contract, plugin } from './api-emulator.mjs';

const app = createApp();
const store = new Store();
plugin.register(app, store);

assert.equal(contract.provider, 'reducto');

await withServer(app, async (baseUrl) => {
  const headers = {
    authorization: 'Bearer reducto-emulator-key',
    'content-type': 'application/json',
  };

  const version = await fetch(`${baseUrl}/version`);
  assert.equal(await version.text(), '2026.05-emulator');

  const upload = await fetch(`${baseUrl}/upload?extension=pdf`, { method: 'POST', headers });
  const uploaded = await upload.json();
  assert.match(uploaded.file_id, /^reducto:\/\/file_/);

  const parse = await fetch(`${baseUrl}/parse`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ input: uploaded.file_id }),
  });
  const parsed = await parse.json();
  assert.equal(parsed.result.type, 'full');
  assert.equal(parsed.usage.num_pages, 1);

  const asyncParse = await fetch(`${baseUrl}/parse_async`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ input: uploaded.file_id }),
  });
  const queued = await asyncParse.json();
  assert.match(queued.job_id, /^job_/);

  const job = await fetch(`${baseUrl}/job/${queued.job_id}`, { headers });
  const jobPayload = await job.json();
  assert.equal(jobPayload.status, 'Completed');
  assert.equal(jobPayload.result.job_id, queued.job_id);

  const extract = await fetch(`${baseUrl}/extract`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ input: uploaded.file_id, instructions: { schema: { total: 'number' } } }),
  });
  const extracted = await extract.json();
  assert.equal(extracted.result[0].total, 123.45);

  const discoveryExtract = await fetch(`${baseUrl}/extract`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      input: 'https://disclosures-clerk.house.gov/FinancialDisclosure',
      instructions: {
        schema: {
          type: 'object',
          properties: {
            filings: { type: 'array' },
            expectedFilingCount: { type: 'number' },
            expectedTransactionCount: { type: 'number' },
          },
        },
      },
    }),
  });
  const discovery = await discoveryExtract.json();
  assert.equal(discovery.result.expectedFilingCount, 1);
  assert.equal(discovery.result.filings[0].source, 'house');

  const split = await fetch(`${baseUrl}/split`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ input: uploaded.file_id }),
  });
  const splitPayload = await split.json();
  assert.equal(splitPayload.result.splits[0].name, 'Cover');

  const jobs = await fetch(`${baseUrl}/jobs?limit=2`, { headers });
  const jobsPayload = await jobs.json();
  assert.equal(jobsPayload.jobs.length, 2);

  const state = await fetch(`${baseUrl}/inspect/state`);
  const statePayload = await state.json();
  assert.equal(statePayload.uploads.length, 1);
  assert.ok(statePayload.jobs.length >= 4);
});

console.log('reducto smoke ok');
