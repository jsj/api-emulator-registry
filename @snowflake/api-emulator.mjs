import { createToken, fixedNow, getState, readBody, routeError, setState } from '../scripts/provider-plugin-kit.mjs';
import { executeLakehouseSql, lakehouseTables, registerLakehouseRoutes } from '../scripts/lakehouse-workspace.mjs';

const STATE_KEY = 'snowflake:state';

function initialState(config = {}) {
  return {
    databases: config.databases ?? [{ name: 'EMULATOR_DB', kind: 'DATABASE', owner: 'ACCOUNTADMIN', created_on: fixedNow }],
    schemas: config.schemas ?? [{ database_name: 'EMULATOR_DB', name: 'PUBLIC', kind: 'SCHEMA', owner: 'ACCOUNTADMIN', created_on: fixedNow }],
    warehouses: config.warehouses ?? [{ name: 'COMPUTE_WH', state: 'STARTED', size: 'X-Small', type: 'STANDARD', auto_suspend: 600 }],
    users: config.users ?? [{ name: 'EMULATOR', login_name: 'EMULATOR', display_name: 'Snowflake Emulator', disabled: false }],
    statements: config.statements ?? [],
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

function snowflakeError(c, message, status = 400, code = '390100') {
  return c.json({ code, message, sqlState: '08001', statementHandle: null }, status);
}

function statementPayload(row) {
  const result = row.result;
  return {
    code: '090001',
    message: 'Statement executed successfully.',
    statementHandle: row.statementHandle,
    statementStatusUrl: `/api/v2/statements/${row.statementHandle}`,
    createdOn: row.createdOn,
    resultSetMetaData: {
      numRows: result.rows.length,
      format: 'jsonv2',
      rowType: result.columns.map((column) => ({ name: column.name.toUpperCase(), database: row.database, schema: row.schema, table: '', type: column.type.toLowerCase(), byteLength: 16777216, nullable: true, scale: null, precision: null, length: 16777216 })),
    },
    data: result.rows.map((values) => values.map((value) => String(value))),
  };
}

export const contract = {
  provider: 'snowflake',
  source: 'Snowflake SQL API and Snowflake REST API official documentation',
  docs: 'https://docs.snowflake.com/en/developer-guide/sql-api/index',
  baseUrls: ['https://<account_identifier>.snowflakecomputing.com'],
  scope: ['sql-statements', 'databases', 'schemas', 'warehouses', 'users', 'lakehouse-branches', 'inspection'],
  compatibilityOracle: 'Snowflake SQL API clients use account host plus Authorization and X-Snowflake-Authorization-Token-Type headers.',
  fidelity: 'stateful-snowflake-rest-subset',
};

export const plugin = {
  name: 'snowflake',
  register(app, store) {
    registerLakehouseRoutes(app, store, 'snowflake');
    app.post('/api/v2/statements', async (c) => {
      const s = state(store);
      const body = await readBody(c).catch(() => ({}));
      if (!body.statement) return snowflakeError(c, 'Missing required field: statement');
      let result;
      try {
        result = executeLakehouseSql(store, body.statement, { branch: body.branch ?? 'main' });
      } catch (error) {
        return snowflakeError(c, error.message);
      }
      const row = {
        statementHandle: createToken('sfqid', s.nextStatement++),
        statement: body.statement,
        database: body.database ?? 'EMULATOR_DB',
        schema: body.schema ?? 'PUBLIC',
        warehouse: body.warehouse ?? 'COMPUTE_WH',
        role: body.role ?? 'ACCOUNTADMIN',
        createdOn: fixedNow,
        status: 'SUCCESS',
        result,
      };
      s.statements.push(row);
      save(store, s);
      return c.json(statementPayload(row), 200, { 'x-snowflake-request-id': row.statementHandle });
    });
    app.get('/api/v2/statements/:statementHandle', (c) => {
      const row = state(store).statements.find((item) => item.statementHandle === c.req.param('statementHandle'));
      return row ? c.json(statementPayload(row), 200, { 'x-snowflake-request-id': row.statementHandle }) : snowflakeError(c, 'Statement not found', 404, '090105');
    });
    app.post('/api/v2/statements/:statementHandle/cancel', (c) => {
      const s = state(store);
      const row = s.statements.find((item) => item.statementHandle === c.req.param('statementHandle'));
      if (!row) return snowflakeError(c, 'Statement not found', 404, '090105');
      row.status = 'CANCELED';
      save(store, s);
      return c.json({ code: '090001', message: 'Statement canceled successfully.', statementHandle: row.statementHandle });
    });
    app.get('/api/v2/databases', (c) => c.json({ items: state(store).databases }));
    app.get('/api/v2/databases/:databaseName/schemas', (c) => c.json({ items: state(store).schemas.filter((item) => item.database_name === c.req.param('databaseName')) }));
    app.get('/api/v2/warehouses', (c) => c.json({ items: state(store).warehouses }));
    app.get('/api/v2/users', (c) => c.json({ items: state(store).users }));
    app.get('/api/v2/tables', (c) => c.json({ items: lakehouseTables(store).map((item) => ({ name: item.name.split('.').at(-1).toUpperCase(), database_name: 'EMULATOR_DB', schema_name: item.name.split('.').at(0).toUpperCase(), kind: 'TABLE', rows: item.row_count, columns: item.columns })) }));
    app.get('/inspect/contract', (c) => c.json(contract));
    app.get('/inspect/state', (c) => c.json(state(store)));
  },
};

export const label = 'Snowflake API emulator';
export const endpoints = contract.scope.join(', ');
export const capabilities = contract.scope;
export const initConfig = { snowflake: initialState() };
export default plugin;
