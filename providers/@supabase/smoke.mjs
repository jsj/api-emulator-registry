import assert from 'node:assert/strict';
import { createHarness } from '../../scripts/provider-smoke-harness.mjs';
import { plugin } from './api-emulator.mjs';

// Exercise the actual provider, without the shared CLI suite's former projects shim.
const harness = createHarness(plugin);
const response = await harness.call('GET', '/v1/projects');
assert.equal(response.status, 200);
assert.equal(response.payload[0].id, 'project_emulator');
assert.equal(response.payload[0].status, 'ACTIVE_HEALTHY');
assert.equal(response.payload[0].database.host, '127.0.0.1');
const saved = harness.store.getData('supabase:state');
saved.projects = [{ ...saved.projects[0], id: 'project_seeded', ref: 'project_seeded', name: 'Seeded Project' }];
harness.store.setData('supabase:state', saved);
assert.equal((await harness.call('GET', '/v1/projects')).payload[0].id, 'project_seeded');
assert.equal((await createHarness(plugin).call('GET', '/v1/projects')).payload[0].id, 'project_emulator');
saved.projects = [];
assert.deepEqual((await harness.call('GET', '/v1/projects')).payload, []);
console.log('supabase management project-list smoke ok');
