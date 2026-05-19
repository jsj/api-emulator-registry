import { createToken, fixedNow, getState, readBody, routeError, setState } from '../scripts/provider-plugin-kit.mjs';
import { executeLakehouseSql, lakehouseTables, registerLakehouseRoutes } from '../scripts/lakehouse-workspace.mjs';

const STATE_KEY = 'databricks:state';

function initialState(config = {}) {
  return {
    currentUser: config.currentUser ?? { id: '100000', userName: 'emulator_user', displayName: 'Databricks Emulator', active: true },
    clusters: config.clusters ?? [{ cluster_id: 'dbc-cluster-0001', cluster_name: 'emulator-cluster', spark_version: '15.4.x-scala2.12', node_type_id: 'i3.xlarge', state: 'RUNNING', creator_user_name: 'emulator_user' }],
    jobs: config.jobs ?? [{ job_id: 1, creator_user_name: 'emulator_user', settings: { name: 'emulator-job', tasks: [{ task_key: 'main', notebook_task: { notebook_path: '/Shared/Emulator' } }] }, created_time: 1770000000000 }],
    runs: config.runs ?? [],
    warehouses: config.warehouses ?? [{ id: 'wh-emulator', name: 'emulator-warehouse', cluster_size: 'Small', state: 'RUNNING', warehouse_type: 'PRO' }],
    workspaceObjects: config.workspaceObjects ?? [{ object_type: 'DIRECTORY', path: '/Shared', object_id: 1001 }, { object_type: 'NOTEBOOK', path: '/Shared/Emulator', object_id: 1002, language: 'PYTHON' }],
    statements: config.statements ?? [],
    nextJob: config.nextJob ?? 2,
    nextRun: config.nextRun ?? 1,
    nextStatement: config.nextStatement ?? 1,
    ...config,
  };
}

function state(store) {
  return getState(store, STATE_KEY, () => initialState());
}

function save(store, next) {
  return setState(store, STATE_KEY, next);
}

export function seedFromConfig(store, _baseUrl, config = {}) {
  return save(store, initialState(config));
}

function maybeAuth(c) {
  const auth = c.req.header?.('authorization') ?? '';
  if (auth && !auth.startsWith('Bearer ')) return routeError(c, 'Invalid access token', 401, 'unauthenticated');
  return null;
}

function statementResult(id, statement, store) {
  const query = statement.result ?? executeLakehouseSql(store, statement.statement_text ?? statement.statement ?? 'select 1', { branch: statement.branch ?? 'main', currentUser: 'emulator_user' });
  return {
    statement_id: id,
    status: { state: 'SUCCEEDED' },
    manifest: {
      format: 'JSON_ARRAY',
      schema: { column_count: query.columns.length, columns: query.columns.map((column, position) => ({ name: column.name, type_text: column.type, type_name: column.type, position })) },
      total_chunk_count: 1,
      chunks: [{ chunk_index: 0, row_offset: 0, row_count: query.rows.length }],
      total_row_count: query.rows.length,
    },
    result: { chunk_index: 0, row_offset: 0, row_count: query.rows.length, data_array: query.rows.map((row) => row.map((value) => String(value))) },
  };
}

export const contract = {
  provider: 'databricks',
  source: 'Databricks official REST API reference and Databricks CLI base URL configuration',
  docs: 'https://docs.databricks.com/api/workspace/introduction',
  baseUrls: ['https://<workspace>.cloud.databricks.com', 'https://<workspace>.azuredatabricks.net'],
  scope: ['scim-me', 'clusters', 'jobs', 'runs', 'workspace', 'sql-warehouses', 'sql-statements', 'lakehouse-branches', 'inspection'],
  compatibilityOracle: 'Databricks CLI and SDKs use DATABRICKS_HOST with DATABRICKS_TOKEN.',
  fidelity: 'stateful-databricks-rest-subset',
};

export const plugin = {
  name: 'databricks',
  register(app, store) {
    registerLakehouseRoutes(app, store, 'databricks');
    app.get('/api/2.0/preview/scim/v2/Me', (c) => {
      const authError = maybeAuth(c);
      if (authError) return authError;
      const user = state(store).currentUser;
      return c.json({ schemas: ['urn:ietf:params:scim:schemas:core:2.0:User'], id: user.id, userName: user.userName, displayName: user.displayName, active: user.active });
    });
    app.get('/api/2.0/clusters/list', (c) => c.json({ clusters: state(store).clusters }));
    app.get('/api/2.0/clusters/get', (c) => {
      const cluster = state(store).clusters.find((item) => item.cluster_id === c.req.query('cluster_id'));
      return cluster ? c.json(cluster) : routeError(c, 'Cluster not found', 404, 'RESOURCE_DOES_NOT_EXIST');
    });
    app.get('/api/2.1/jobs/list', (c) => c.json({ jobs: state(store).jobs, has_more: false }));
    app.get('/api/2.0/jobs/list', (c) => c.json({ jobs: state(store).jobs, has_more: false }));
    app.post('/api/2.1/jobs/create', async (c) => {
      const s = state(store);
      const body = await readBody(c).catch(() => ({}));
      const row = { job_id: s.nextJob++, creator_user_name: s.currentUser.userName, settings: body, created_time: Date.parse(fixedNow) };
      s.jobs.push(row);
      save(store, s);
      return c.json({ job_id: row.job_id });
    });
    app.post('/api/2.1/jobs/run-now', async (c) => {
      const s = state(store);
      const body = await readBody(c).catch(() => ({}));
      const run = { run_id: s.nextRun++, job_id: Number(body.job_id), state: { life_cycle_state: 'TERMINATED', result_state: 'SUCCESS', state_message: 'Emulated run complete' }, start_time: Date.parse(fixedNow), run_name: 'emulator-run' };
      s.runs.push(run);
      save(store, s);
      return c.json({ run_id: run.run_id, number_in_job: 1 });
    });
    app.get('/api/2.1/jobs/runs/get', (c) => {
      const run = state(store).runs.find((item) => String(item.run_id) === String(c.req.query('run_id')));
      return run ? c.json(run) : routeError(c, 'Run not found', 404, 'RESOURCE_DOES_NOT_EXIST');
    });
    app.get('/api/2.0/workspace/list', (c) => {
      const path = c.req.query('path') ?? '/';
      return c.json({ objects: state(store).workspaceObjects.filter((item) => item.path === path || item.path.startsWith(`${path}/`)) });
    });
    app.get('/api/2.0/sql/warehouses', (c) => c.json({ warehouses: state(store).warehouses }));
    app.post('/api/2.0/sql/statements', async (c) => {
      const s = state(store);
      const body = await readBody(c).catch(() => ({}));
      const id = createToken('stmt', s.nextStatement++);
      let result;
      try {
        result = executeLakehouseSql(store, body.statement ?? body.statement_text ?? 'select 1', { branch: body.branch ?? 'main', currentUser: s.currentUser.userName });
      } catch (error) {
        return routeError(c, error.message, 400, 'BAD_REQUEST');
      }
      const row = { statement_id: id, created_at: fixedNow, ...body, result };
      s.statements.push(row);
      save(store, s);
      return c.json(statementResult(id, row, store), 201);
    });
    app.get('/api/2.0/sql/statements/:statementId', (c) => {
      const row = state(store).statements.find((item) => item.statement_id === c.req.param('statementId'));
      return row ? c.json(statementResult(row.statement_id, row, store)) : routeError(c, 'Statement not found', 404, 'RESOURCE_DOES_NOT_EXIST');
    });
    app.get('/api/2.1/unity-catalog/tables', (c) => c.json({ tables: lakehouseTables(store).map((item) => ({ name: item.name.split('.').at(-1), full_name: item.name, table_type: 'MANAGED', data_source_format: 'DELTA', columns: item.columns })) }));
    app.get('/inspect/contract', (c) => c.json(contract));
    app.get('/inspect/state', (c) => c.json(state(store)));
  },
};

export const label = 'Databricks API emulator';
export const endpoints = contract.scope.join(', ');
export const capabilities = contract.scope;
export const initConfig = { databricks: initialState() };
export default plugin;
