import assert from 'node:assert/strict';
import { createApp, Store, withServer } from '../scripts/cli-smoke-runtime.mjs';
import { contract, plugin } from './api-emulator.mjs';

const app = createApp();
const store = new Store();
plugin.register(app, store);

assert.equal(contract.provider, 'databricks');

await withServer(app, async (baseUrl) => {
  const headers = { authorization: 'Bearer dapi-emulator', 'content-type': 'application/json' };

  const me = await fetch(`${baseUrl}/api/2.0/preview/scim/v2/Me`, { headers });
  assert.equal((await me.json()).userName, 'emulator_user');

  const clusters = await fetch(`${baseUrl}/api/2.0/clusters/list`, { headers });
  assert.equal((await clusters.json()).clusters[0].state, 'RUNNING');

  const created = await fetch(`${baseUrl}/api/2.1/jobs/create`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ name: 'smoke-job', tasks: [{ task_key: 'main', notebook_task: { notebook_path: '/Shared/Emulator' } }] }),
  });
  const job = await created.json();
  assert.equal(job.job_id, 2);

  const runNow = await fetch(`${baseUrl}/api/2.1/jobs/run-now`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ job_id: job.job_id }),
  });
  const run = await runNow.json();
  assert.equal(run.run_id, 1);

  const runGet = await fetch(`${baseUrl}/api/2.1/jobs/runs/get?run_id=${run.run_id}`, { headers });
  assert.equal((await runGet.json()).state.result_state, 'SUCCESS');

  const warehouses = await fetch(`${baseUrl}/api/2.0/sql/warehouses`, { headers });
  assert.equal((await warehouses.json()).warehouses[0].id, 'wh-emulator');

  const statement = await fetch(`${baseUrl}/api/2.0/sql/statements`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ warehouse_id: 'wh-emulator', statement: 'select current_user()' }),
  });
  const statementPayload = await statement.json();
  assert.equal(statementPayload.result.data_array[0][0], 'emulator_user');

  const count = await fetch(`${baseUrl}/api/2.0/sql/statements`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ warehouse_id: 'wh-emulator', statement: 'select count(*) as rows from samples.orders' }),
  });
  const countPayload = await count.json();
  assert.equal(countPayload.result.data_array[0][0], '4');

  const branch = await fetch(`${baseUrl}/_emu/lakehouse/branches`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ name: 'agent_branch_databricks' }),
  });
  assert.equal((await branch.json()).parent, 'main');

  const insert = await fetch(`${baseUrl}/_emu/lakehouse/sql`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ branch: 'agent_branch_databricks', sql: "insert into samples.orders (order_id, customer_id, amount, status) values (1005, 1, 42.5, 'paid')" }),
  });
  assert.equal((await insert.json()).rows[0][0], 1);

  const diff = await fetch(`${baseUrl}/_emu/lakehouse/branches/agent_branch_databricks/diff`, { headers });
  assert.equal((await diff.json()).data.changedTables[0].branchRows, 5);
});

console.log('databricks smoke ok');
