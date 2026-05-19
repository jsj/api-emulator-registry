import { fixedNow, readBody, routeError } from './provider-plugin-kit.mjs';

const STATE_KEY = 'lakehouse:state';

const baseTables = {
  'samples.customers': {
    columns: [
      { name: 'customer_id', type: 'INTEGER' },
      { name: 'name', type: 'VARCHAR' },
      { name: 'region', type: 'VARCHAR' },
    ],
    rows: [
      [1, 'Customer One', 'EMEA'],
      [2, 'Customer Two', 'AMER'],
      [3, 'Customer Three', 'AMER'],
    ],
  },
  'samples.orders': {
    columns: [
      { name: 'order_id', type: 'INTEGER' },
      { name: 'customer_id', type: 'INTEGER' },
      { name: 'amount', type: 'DOUBLE' },
      { name: 'status', type: 'VARCHAR' },
    ],
    rows: [
      [1001, 1, 125.5, 'paid'],
      [1002, 2, 88.25, 'paid'],
      [1003, 2, 19.99, 'pending'],
      [1004, 3, 240, 'paid'],
    ],
  },
  'samples.events': {
    columns: [
      { name: 'event_id', type: 'VARCHAR' },
      { name: 'customer_id', type: 'INTEGER' },
      { name: 'event_type', type: 'VARCHAR' },
      { name: 'event_time', type: 'TIMESTAMP' },
    ],
    rows: [
      ['evt_001', 1, 'signup', '2026-01-01T00:00:00.000Z'],
      ['evt_002', 2, 'checkout', '2026-01-01T00:01:00.000Z'],
      ['evt_003', 3, 'checkout', '2026-01-01T00:02:00.000Z'],
    ],
  },
};

function cloneTable(table) {
  return { columns: table.columns.map((column) => ({ ...column })), rows: table.rows.map((row) => [...row]) };
}

function initialState(config = {}) {
  return {
    engine: 'duckdb-compatible-js',
    database: 'EMULATOR_DB',
    catalog: 'samples',
    branches: {
      main: { name: 'main', parent: null, createdAt: fixedNow, tables: baseTables },
    },
    ...config,
  };
}

export function lakehouseState(store) {
  const current = store.getData?.(STATE_KEY);
  if (current) return current;
  const next = initialState();
  store.setData?.(STATE_KEY, next);
  return next;
}

function save(store, state) {
  store.setData?.(STATE_KEY, state);
  return state;
}

function normalizeName(name = '') {
  return name.replaceAll('"', '').replaceAll('`', '').trim().replace(/^main\./i, '').replace(/^public\./i, 'samples.').toLowerCase();
}

function tablesForBranch(state, branchName = 'main') {
  const branch = state.branches[branchName];
  if (!branch) throw new Error(`unknown branch ${branchName}`);
  if (!branch.parent) return branch.tables;
  return { ...tablesForBranch(state, branch.parent), ...branch.tables };
}

function writableTable(state, branchName, tableName) {
  const branch = state.branches[branchName];
  const normalized = normalizeName(tableName);
  if (!branch) throw new Error(`unknown branch ${branchName}`);
  if (!branch.tables[normalized]) {
    const inherited = tablesForBranch(state, branchName)[normalized];
    branch.tables[normalized] = inherited ? cloneTable(inherited) : { columns: [], rows: [] };
  }
  return branch.tables[normalized];
}

function table(state, branchName, tableName) {
  const normalized = normalizeName(tableName);
  const found = tablesForBranch(state, branchName)[normalized];
  if (!found) throw new Error(`unknown table ${tableName}`);
  return found;
}

function parseValue(value) {
  const trimmed = value.trim();
  if (/^'.*'$/.test(trimmed) || /^".*"$/.test(trimmed)) return trimmed.slice(1, -1).replaceAll("''", "'");
  if (/^null$/i.test(trimmed)) return null;
  const numeric = Number(trimmed);
  return Number.isNaN(numeric) ? trimmed : numeric;
}

function splitCsv(input) {
  const out = [];
  let current = '';
  let quote = null;
  for (const char of input) {
    if ((char === "'" || char === '"') && (!quote || quote === char)) quote = quote ? null : char;
    if (char === ',' && !quote) {
      out.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  if (current.trim()) out.push(current.trim());
  return out;
}

function projection(columns, rows, selectList) {
  const trimmed = selectList.trim();
  if (trimmed === '*') return { columns, rows };
  const names = splitCsv(trimmed).map((item) => item.replace(/\s+as\s+\w+$/i, '').trim());
  const indexes = names.map((name) => columns.findIndex((column) => column.name.toLowerCase() === name.toLowerCase()));
  return {
    columns: names.map((name, index) => columns[indexes[index]] ?? { name, type: 'VARCHAR' }),
    rows: rows.map((row) => indexes.map((index) => (index >= 0 ? row[index] : null))),
  };
}

function whereRows(columns, rows, where) {
  if (!where) return rows;
  const match = where.match(/^([\w."]+)\s*=\s*(.+)$/i);
  if (!match) return rows;
  const columnName = match[1].replaceAll('"', '').split('.').at(-1);
  const expected = parseValue(match[2]);
  const index = columns.findIndex((column) => column.name.toLowerCase() === columnName.toLowerCase());
  if (index < 0) return rows;
  return rows.filter((row) => String(row[index]) === String(expected));
}

function selectSql(state, sql, branchName, options = {}) {
  const normalized = sql.trim().replace(/;$/, '');
  if (/^select\s+current_user\(\)/i.test(normalized)) return { columns: [{ name: 'current_user()', type: 'VARCHAR' }], rows: [[options.currentUser ?? 'EMULATOR']] };
  if (/^select\s+current_database\(\)/i.test(normalized)) return { columns: [{ name: 'current_database()', type: 'VARCHAR' }], rows: [[state.database]] };
  if (/^select\s+1(\s+as\s+\w+)?$/i.test(normalized)) return { columns: [{ name: 'result', type: 'INTEGER' }], rows: [[1]] };
  const count = normalized.match(/^select\s+count\(\*\)(?:\s+as\s+(\w+))?\s+from\s+([\w."]+)(?:\s+where\s+(.+))?$/i);
  if (count) {
    const source = table(state, branchName, count[2]);
    const rows = whereRows(source.columns, source.rows, count[3]);
    return { columns: [{ name: count[1] ?? 'count', type: 'BIGINT' }], rows: [[rows.length]] };
  }
  const simple = normalized.match(/^select\s+(.+?)\s+from\s+([\w."]+)(?:\s+where\s+(.+?))?(?:\s+limit\s+(\d+))?$/i);
  if (!simple) throw new Error(`unsupported SQL: ${sql}`);
  const source = table(state, branchName, simple[2]);
  const rows = whereRows(source.columns, source.rows, simple[3]).slice(0, simple[4] ? Number(simple[4]) : undefined);
  return projection(source.columns, rows, simple[1]);
}

function createTableAs(state, sql, branchName) {
  const match = sql.trim().replace(/;$/, '').match(/^create\s+(?:or\s+replace\s+)?table\s+([\w."]+)\s+as\s+(select\s+.+)$/i);
  if (!match) return null;
  const result = selectSql(state, match[2], branchName);
  state.branches[branchName].tables[normalizeName(match[1])] = { columns: result.columns, rows: result.rows.map((row) => [...row]) };
  return { columns: [{ name: 'created', type: 'BOOLEAN' }], rows: [[true]] };
}

function insertInto(state, sql, branchName) {
  const match = sql.trim().replace(/;$/, '').match(/^insert\s+into\s+([\w."]+)\s*\(([^)]+)\)\s*values\s*\((.+)\)$/i);
  if (!match) return null;
  const target = writableTable(state, branchName, match[1]);
  const names = splitCsv(match[2]).map((name) => name.replaceAll('"', '').trim());
  if (target.columns.length === 0) target.columns = names.map((name) => ({ name, type: 'VARCHAR' }));
  const values = splitCsv(match[3]).map(parseValue);
  const row = target.columns.map((column) => {
    const index = names.findIndex((name) => name.toLowerCase() === column.name.toLowerCase());
    return index >= 0 ? values[index] : null;
  });
  target.rows.push(row);
  return { columns: [{ name: 'inserted', type: 'BIGINT' }], rows: [[1]] };
}

function showTables(state, branchName) {
  const rows = Object.keys(tablesForBranch(state, branchName)).sort().map((name) => [name.split('.').at(-1), name.split('.').at(0)]);
  return { columns: [{ name: 'name', type: 'VARCHAR' }, { name: 'schema', type: 'VARCHAR' }], rows };
}

export function executeLakehouseSql(store, sql, options = {}) {
  const state = lakehouseState(store);
  const branchName = options.branch ?? 'main';
  const normalized = sql.trim().replace(/;$/, '');
  let result;
  if (/^show\s+tables/i.test(normalized)) result = showTables(state, branchName);
  else if (/^show\s+warehouses/i.test(normalized)) result = { columns: [{ name: 'name', type: 'VARCHAR' }, { name: 'state', type: 'VARCHAR' }, { name: 'size', type: 'VARCHAR' }], rows: [['COMPUTE_WH', 'STARTED', 'X-Small']] };
  else result = createTableAs(state, normalized, branchName) ?? insertInto(state, normalized, branchName) ?? selectSql(state, normalized, branchName, options);
  save(store, state);
  return { branch: branchName, ...result };
}

export function createLakehouseBranch(store, name, parent = 'main') {
  const state = lakehouseState(store);
  if (!state.branches[parent]) throw new Error(`unknown parent branch ${parent}`);
  if (!state.branches[name]) state.branches[name] = { name, parent, createdAt: fixedNow, tables: {} };
  save(store, state);
  return state.branches[name];
}

export function diffLakehouseBranch(store, name, parent = 'main') {
  const state = lakehouseState(store);
  const parentTables = tablesForBranch(state, parent);
  const branchTables = tablesForBranch(state, name);
  const names = new Set([...Object.keys(parentTables), ...Object.keys(branchTables)]);
  const changedTables = [];
  const addedTables = [];
  for (const tableName of [...names].sort()) {
    if (!parentTables[tableName]) addedTables.push(tableName);
    else if ((parentTables[tableName]?.rows.length ?? 0) !== (branchTables[tableName]?.rows.length ?? 0)) {
      changedTables.push({ name: tableName, parentRows: parentTables[tableName].rows.length, branchRows: branchTables[tableName].rows.length });
    }
  }
  return { provider: 'lakehouse', parent, branch: name, schema: { addedTables }, data: { changedTables } };
}

export function lakehouseTables(store, branch = 'main') {
  const state = lakehouseState(store);
  return Object.entries(tablesForBranch(state, branch)).map(([name, value]) => ({ name, columns: value.columns, row_count: value.rows.length }));
}

export function registerLakehouseRoutes(app, store, provider) {
  app.get('/_emu/lakehouse/tables', (c) => c.json({ provider, branch: c.req.query?.('branch') ?? 'main', tables: lakehouseTables(store, c.req.query?.('branch') ?? 'main') }));
  app.post('/_emu/lakehouse/sql', async (c) => {
    const body = await readBody(c).catch(() => ({}));
    if (!body.sql) return routeError(c, 'sql is required');
    try {
      return c.json(executeLakehouseSql(store, body.sql, { branch: body.branch ?? 'main' }));
    } catch (error) {
      return routeError(c, error.message);
    }
  });
  app.post('/_emu/lakehouse/branches', async (c) => {
    const body = await readBody(c).catch(() => ({}));
    const name = body.name ?? body.branch;
    if (!name || !/^[a-zA-Z_][a-zA-Z0-9_]{0,62}$/.test(name)) return routeError(c, 'valid branch name is required');
    try {
      return c.json(createLakehouseBranch(store, name, body.parent ?? 'main'), 201);
    } catch (error) {
      return routeError(c, error.message);
    }
  });
  app.get('/_emu/lakehouse/branches/:branch/diff', (c) => {
    try {
      return c.json(diffLakehouseBranch(store, c.req.param('branch'), c.req.query?.('parent') ?? 'main'));
    } catch (error) {
      return routeError(c, error.message, 404, 'not_found');
    }
  });
}
