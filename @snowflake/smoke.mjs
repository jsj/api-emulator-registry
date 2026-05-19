import assert from 'node:assert/strict';
import { createApp, Store, withServer } from '../scripts/cli-smoke-runtime.mjs';
import { contract, plugin } from './api-emulator.mjs';

const app = createApp();
const store = new Store();
plugin.register(app, store);

assert.equal(contract.provider, 'snowflake');

await withServer(app, async (baseUrl) => {
  const headers = {
    authorization: 'Bearer snowflake-emulator',
    'x-snowflake-authorization-token-type': 'KEYPAIR_JWT',
    'content-type': 'application/json',
  };

  const statement = await fetch(`${baseUrl}/api/v2/statements`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ statement: 'select current_user()', database: 'EMULATOR_DB', schema: 'PUBLIC', warehouse: 'COMPUTE_WH' }),
  });
  const executed = await statement.json();
  assert.equal(executed.data[0][0], 'EMULATOR');
  assert.match(executed.statementHandle, /^sfqid_/);

  const fetched = await fetch(`${baseUrl}/api/v2/statements/${executed.statementHandle}`, { headers });
  assert.equal((await fetched.json()).code, '090001');

  const databases = await fetch(`${baseUrl}/api/v2/databases`, { headers });
  assert.equal((await databases.json()).items[0].name, 'EMULATOR_DB');

  const schemas = await fetch(`${baseUrl}/api/v2/databases/EMULATOR_DB/schemas`, { headers });
  assert.equal((await schemas.json()).items[0].name, 'PUBLIC');

  const warehouses = await fetch(`${baseUrl}/api/v2/warehouses`, { headers });
  assert.equal((await warehouses.json()).items[0].state, 'STARTED');

  const count = await fetch(`${baseUrl}/api/v2/statements`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ statement: 'select count(*) as rows from samples.customers' }),
  });
  assert.equal((await count.json()).data[0][0], '3');

  const branch = await fetch(`${baseUrl}/_emu/lakehouse/branches`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ name: 'agent_branch_snowflake' }),
  });
  assert.equal((await branch.json()).parent, 'main');

  const insert = await fetch(`${baseUrl}/_emu/lakehouse/sql`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ branch: 'agent_branch_snowflake', sql: "insert into samples.customers (customer_id, name, region) values (4, 'Customer Four', 'AMER')" }),
  });
  assert.equal((await insert.json()).rows[0][0], 1);

  const diff = await fetch(`${baseUrl}/_emu/lakehouse/branches/agent_branch_snowflake/diff`, { headers });
  assert.equal((await diff.json()).data.changedTables[0].branchRows, 4);
});

console.log('snowflake smoke ok');
