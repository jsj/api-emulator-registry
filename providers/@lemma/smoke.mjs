import assert from 'node:assert/strict';
import { createHarness } from '../../scripts/provider-smoke-harness.mjs';
import { contract, plugin } from './api-emulator.mjs';

const harness = createHarness(plugin);
const projectId = '00000000-0000-4000-8000-000000000001';
const traceId = '00000000-0000-4000-8000-000000000101';
const auth = { authorization: 'Bearer lemma_emulator_key', 'content-type': 'application/json' };

assert.equal(contract.provider, 'lemma');

const unauthorized = await harness.call('POST', '/traces/ingest', {});
assert.equal(unauthorized.status, 401);

const invalid = await harness.call('POST', '/traces/ingest', { project_id: projectId, trace: { spans: [] } }, auth);
assert.equal(invalid.status, 400);

const ingested = await harness.call('POST', '/traces/ingest', {
  project_id: projectId,
  trace: {
    id: traceId,
    name: 'support-agent',
    input: 'Where is my order?',
    output: 'It ships tomorrow.',
    spans: [{ id: 'span-search', name: 'search_orders', type: 'tool', input: { order_id: '1843' }, output: { status: 'ready' } }],
  },
}, auth);
assert.equal(ingested.status, 201);
assert.equal(ingested.payload.trace_id, traceId);

const status = await harness.call('GET', `/traces/ingest-status?project_id=${projectId}&otel_trace_id=${traceId}`, undefined, auth);
assert.equal(status.payload.status, 'ready');

const retry = await harness.call('POST', '/traces/ingest', {
  project_id: projectId,
  trace: { id: traceId, name: 'support-agent', spans: [{ id: 'span-search', name: 'search_orders', type: 'tool' }] },
}, auth);
assert.equal(retry.status, 201);

const inspected = await harness.call('GET', '/inspect/state');
assert.equal(inspected.payload.traces.length, 1);
assert.equal(inspected.payload.traces[0].spans.length, 1);

console.log('lemma smoke ok');
