import { createToken, fixedNow, getState, readBody, routeError, setState } from '../scripts/provider-plugin-kit.mjs';
import { executeLakehouseSql, lakehouseTables, registerLakehouseRoutes } from '../scripts/lakehouse-workspace.mjs';

const STATE_KEY = 'spark:state';

function initialState(config = {}) {
  return {
    applications: config.applications ?? [
      { id: 'app-202605190001', name: 'api-emulator-spark', coresGranted: 2, maxCores: 2, coresPerExecutor: 1, memoryPerExecutorMB: 1024, attempts: [{ attemptId: '1', startTime: fixedNow, endTime: null, lastUpdated: fixedNow, duration: 5000, sparkUser: 'emulator', completed: false }] },
    ],
    jobs: config.jobs ?? [{ jobId: 1, name: 'count at smoke.py:1', status: 'SUCCEEDED', numTasks: 1, numActiveTasks: 0, numCompletedTasks: 1, numFailedTasks: 0, submissionTime: fixedNow, completionTime: fixedNow }],
    stages: config.stages ?? [{ stageId: 0, attemptId: 0, name: 'emulator stage', status: 'COMPLETE', numTasks: 1, numCompleteTasks: 1, numFailedTasks: 0 }],
    submissions: config.submissions ?? [],
    nextDriver: config.nextDriver ?? 1,
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

function findApp(c, s) {
  const appId = c.req.param('appId');
  return s.applications.find((item) => item.id === appId);
}

export const contract = {
  provider: 'spark',
  source: 'Apache Spark official monitoring REST API and standalone submission REST API documentation',
  docs: 'https://spark.apache.org/docs/latest/monitoring.html#rest-api',
  baseUrls: ['http://localhost:4040', 'http://localhost:6066'],
  scope: ['applications', 'jobs', 'stages', 'executors', 'environment', 'submissions', 'sql', 'lakehouse-branches', 'inspection'],
  compatibilityOracle: 'Spark UI and standalone submission clients use plain HTTP base URLs.',
  fidelity: 'stateful-spark-rest-subset',
};

export const plugin = {
  name: 'spark',
  register(app, store) {
    registerLakehouseRoutes(app, store, 'spark');
    app.get('/api/v1/applications', (c) => c.json(state(store).applications));
    app.get('/api/v1/applications/:appId', (c) => {
      const result = findApp(c, state(store));
      return result ? c.json(result) : routeError(c, `unknown application ${c.req.param('appId')}`, 404, 'not_found');
    });
    app.get('/api/v1/applications/:appId/jobs', (c) => {
      const result = findApp(c, state(store));
      return result ? c.json(state(store).jobs) : routeError(c, `unknown application ${c.req.param('appId')}`, 404, 'not_found');
    });
    app.get('/api/v1/applications/:appId/jobs/:jobId', (c) => {
      const result = findApp(c, state(store));
      if (!result) return routeError(c, `unknown application ${c.req.param('appId')}`, 404, 'not_found');
      const job = state(store).jobs.find((item) => String(item.jobId) === c.req.param('jobId'));
      return job ? c.json(job) : routeError(c, 'job not found', 404, 'not_found');
    });
    app.get('/api/v1/applications/:appId/stages', (c) => {
      const result = findApp(c, state(store));
      return result ? c.json(state(store).stages) : routeError(c, `unknown application ${c.req.param('appId')}`, 404, 'not_found');
    });
    app.get('/api/v1/applications/:appId/executors', (c) => {
      const result = findApp(c, state(store));
      if (!result) return routeError(c, `unknown application ${c.req.param('appId')}`, 404, 'not_found');
      return c.json([{ id: 'driver', hostPort: '127.0.0.1:4040', isActive: true, rddBlocks: 0, memoryUsed: 0, diskUsed: 0, totalCores: 2, maxTasks: 2, activeTasks: 0, failedTasks: 0, completedTasks: 1 }]);
    });
    app.get('/api/v1/applications/:appId/environment', (c) => {
      const result = findApp(c, state(store));
      if (!result) return routeError(c, `unknown application ${c.req.param('appId')}`, 404, 'not_found');
      return c.json({ sparkProperties: [['spark.app.name', result.name], ['spark.master', 'local[*]']], systemProperties: [], classpathEntries: [] });
    });
    app.get('/api/v1/applications/:appId/sql', (c) => {
      const result = findApp(c, state(store));
      if (!result) return routeError(c, `unknown application ${c.req.param('appId')}`, 404, 'not_found');
      return c.json(lakehouseTables(store).map((item, index) => ({ id: index, description: `SELECT * FROM ${item.name}`, status: 'COMPLETED', planDescription: `Scan ${item.name}`, submissionTime: fixedNow, duration: 5, successJobIds: [1], rows: item.row_count })));
    });
    app.post('/api/v1/applications/:appId/sql', async (c) => {
      const appRecord = findApp(c, state(store));
      if (!appRecord) return routeError(c, `unknown application ${c.req.param('appId')}`, 404, 'not_found');
      const body = await readBody(c).catch(() => ({}));
      if (!body.sql) return routeError(c, 'sql is required');
      try {
        const result = executeLakehouseSql(store, body.sql, { branch: body.branch ?? 'main' });
        return c.json({ id: Date.now(), status: 'COMPLETED', description: body.sql, columns: result.columns, rows: result.rows, branch: result.branch });
      } catch (error) {
        return routeError(c, error.message);
      }
    });

    app.post('/v1/submissions/create', async (c) => {
      const s = state(store);
      const body = await readBody(c).catch(() => ({}));
      const driverId = createToken('driver', s.nextDriver++);
      const row = { driverId, submissionId: driverId, action: 'CreateSubmissionResponse', success: true, message: 'Driver successfully submitted as ' + driverId, serverSparkVersion: '4.1.1', appResource: body.appResource, mainClass: body.mainClass };
      s.submissions.push({ ...row, state: 'RUNNING', createdAt: fixedNow });
      save(store, s);
      return c.json(row);
    });
    app.get('/v1/submissions/status/:driverId', (c) => {
      const row = state(store).submissions.find((item) => item.driverId === c.req.param('driverId'));
      if (!row) return routeError(c, 'driver not found', 404, 'not_found');
      return c.json({ action: 'SubmissionStatusResponse', driverId: row.driverId, workerId: 'worker-0001', state: row.state, success: true, serverSparkVersion: '4.1.1' });
    });
    app.post('/v1/submissions/kill/:driverId', (c) => {
      const s = state(store);
      const row = s.submissions.find((item) => item.driverId === c.req.param('driverId'));
      if (!row) return routeError(c, 'driver not found', 404, 'not_found');
      row.state = 'KILLED';
      save(store, s);
      return c.json({ action: 'KillSubmissionResponse', driverId: row.driverId, success: true, message: 'Kill request submitted' });
    });
    app.get('/inspect/contract', (c) => c.json(contract));
    app.get('/inspect/state', (c) => c.json(state(store)));
  },
};

export const label = 'Apache Spark API emulator';
export const endpoints = contract.scope.join(', ');
export const capabilities = contract.scope;
export const initConfig = { spark: initialState() };
export default plugin;
