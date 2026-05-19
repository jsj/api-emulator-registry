import assert from 'node:assert/strict';
import { createApp, Store, withServer } from '../scripts/cli-smoke-runtime.mjs';
import { contract, plugin } from './api-emulator.mjs';

const app = createApp();
const store = new Store();
plugin.register(app, store);

assert.equal(contract.provider, 'spark');

await withServer(app, async (baseUrl) => {
  const applications = await fetch(`${baseUrl}/api/v1/applications`);
  const apps = await applications.json();
  assert.equal(apps[0].name, 'api-emulator-spark');

  const jobs = await fetch(`${baseUrl}/api/v1/applications/${apps[0].id}/jobs`);
  assert.equal((await jobs.json())[0].status, 'SUCCEEDED');

  const stages = await fetch(`${baseUrl}/api/v1/applications/${apps[0].id}/stages`);
  assert.equal((await stages.json())[0].status, 'COMPLETE');

  const submission = await fetch(`${baseUrl}/v1/submissions/create`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ appResource: 'local:///opt/spark/examples.jar', mainClass: 'org.example.Main' }),
  });
  const created = await submission.json();
  assert.match(created.driverId, /^driver_/);

  const status = await fetch(`${baseUrl}/v1/submissions/status/${created.driverId}`);
  assert.equal((await status.json()).state, 'RUNNING');

  const killed = await fetch(`${baseUrl}/v1/submissions/kill/${created.driverId}`, { method: 'POST' });
  assert.equal((await killed.json()).success, true);

  const sql = await fetch(`${baseUrl}/api/v1/applications/${apps[0].id}/sql`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ sql: 'select count(*) as rows from samples.events' }),
  });
  assert.equal((await sql.json()).rows[0][0], 3);

  const branch = await fetch(`${baseUrl}/_emu/lakehouse/branches`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name: 'agent_branch_spark' }),
  });
  assert.equal((await branch.json()).parent, 'main');

  const create = await fetch(`${baseUrl}/_emu/lakehouse/sql`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ branch: 'agent_branch_spark', sql: 'create table samples.paid_orders as select * from samples.orders where status = \'paid\'' }),
  });
  assert.equal((await create.json()).rows[0][0], true);

  const diff = await fetch(`${baseUrl}/_emu/lakehouse/branches/agent_branch_spark/diff`);
  assert.equal((await diff.json()).schema.addedTables[0], 'samples.paid_orders');
});

console.log('spark smoke ok');
