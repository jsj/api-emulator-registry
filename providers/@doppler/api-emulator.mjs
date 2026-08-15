const fixedNow = '2026-05-15T12:00:00.000Z';

function initialState(config = {}) {
  return {
    projects: [
      {
        id: 'proj_emulator',
        name: 'Demo',
        slug: 'demo',
        description: 'Doppler emulator project',
        created_at: '2020-09-01T23:57:27.052Z',
      },
      { id: 'proj_example', name: 'Example Product', slug: 'example', description: 'Shared product secrets', created_at: fixedNow },
      { id: 'proj_example_web', name: 'Example Product Web', slug: 'example-web', description: 'Web surface secrets', created_at: fixedNow },
      { id: 'proj_example_worker', name: 'Example Product Worker', slug: 'example-worker', description: 'Worker surface secrets', created_at: fixedNow },
      { id: 'proj_example_ios', name: 'Example Product iOS', slug: 'example-ios', description: 'iOS surface secrets', created_at: fixedNow },
    ],
    configs: [
      {
        name: 'dev',
        project: 'demo',
        environment: 'dev',
        root: true,
        locked: false,
        initial_fetch_at: fixedNow,
        last_fetch_at: fixedNow,
        created_at: '2019-11-21T03:45:47.982Z',
      },
      ...['example', 'example-web', 'example-worker', 'example-ios'].flatMap((project) => [
        { name: 'dev', project, environment: 'dev', root: true, locked: false, initial_fetch_at: fixedNow, last_fetch_at: fixedNow, created_at: fixedNow },
        { name: 'prd', project, environment: 'prd', root: true, locked: true, initial_fetch_at: fixedNow, last_fetch_at: fixedNow, created_at: fixedNow },
      ]),
      { name: 'dev_personal', project: 'example-ios', environment: 'dev', root: false, locked: false, initial_fetch_at: fixedNow, last_fetch_at: fixedNow, created_at: fixedNow },
    ],
    secrets: {
      demo: {
        dev: {
          API_KEY: { raw: 'doppler-emulator-key', computed: 'doppler-emulator-key' },
          CLI_SMOKE_COMMAND_TIMEOUT_MS: { raw: '120000', computed: '120000' },
          DATABASE_URL: { raw: 'postgres://emulator.local/app', computed: 'postgres://emulator.local/app' },
          MCPORTER_OAUTH_TIMEOUT_MS: { raw: '300000', computed: '300000' },
          ROBINHOOD_MCP_FIXTURE_SYMBOLS: { raw: 'AAPL', computed: 'AAPL' },
          ROBINHOOD_MCP_HISTORICAL_END_TIME: { raw: '2026-06-22T00:00:00Z', computed: '2026-06-22T00:00:00Z' },
          ROBINHOOD_MCP_HISTORICAL_INTERVAL: { raw: 'day', computed: 'day' },
          ROBINHOOD_MCP_HISTORICAL_START_TIME: { raw: '2026-06-15T00:00:00Z', computed: '2026-06-15T00:00:00Z' },
          ROBINHOOD_MCP_SINCE: { raw: '2021-01-01', computed: '2021-01-01' },
          ROBINHOOD_MCP_TRADING_URL: { raw: 'https://agent.robinhood.com/mcp/trading', computed: 'https://agent.robinhood.com/mcp/trading' },
          ROBINHOOD_MCP_UNTIL: { raw: '2021-12-31', computed: '2021-12-31' },
        },
      },
      example: {
        dev: {
          SHARED_API_URL: { raw: 'https://dev.example.invalid', computed: 'https://dev.example.invalid' },
          SHARED_TOKEN: { raw: 'dev-shared-token', computed: 'dev-shared-token', visibility: 'masked' },
        },
        prd: {
          SHARED_API_URL: { raw: 'https://example.invalid', computed: 'https://example.invalid' },
          SHARED_TOKEN: { raw: 'prod-shared-token', computed: 'prod-shared-token', visibility: 'masked' },
        },
      },
      'example-web': {
        dev: {
          WEB_ORIGIN: { raw: 'http://localhost:3000', computed: 'http://localhost:3000' },
          SHARED_API_URL: { raw: '${SHARED_API_URL}', computed: 'https://dev.example.invalid', note: 'Computed reference fixture' },
        },
        prd: { WEB_ORIGIN: { raw: 'https://web.example.invalid', computed: 'https://web.example.invalid' } },
      },
      'example-worker': {
        dev: { WORKER_QUEUE: { raw: 'dev-jobs', computed: 'dev-jobs' } },
        prd: { WORKER_QUEUE: { raw: 'prod-jobs', computed: 'prod-jobs' } },
      },
      'example-ios': {
        dev: {
          IOS_BUNDLE_ID: { raw: 'dev.invalid.example.app', computed: 'dev.invalid.example.app' },
          IOS_SHARED: { raw: 'inherited-from-root', computed: 'inherited-from-root' },
        },
        dev_personal: {
          IOS_BUNDLE_ID: { raw: 'dev.personal.invalid.example.app', computed: 'dev.personal.invalid.example.app' },
          PERSONAL_DEVICE: { raw: 'simulator', computed: 'simulator' },
        },
        prd: { IOS_BUNDLE_ID: { raw: 'invalid.example.app', computed: 'invalid.example.app' } },
      },
    },
    ...config,
  };
}

function state(store) {
  const current = store.getData?.('doppler:state');
  if (current) return current;
  const next = initialState();
  store.setData?.('doppler:state', next);
  return next;
}

function saveState(store, next) {
  store.setData?.('doppler:state', next);
}

function ok(payload = {}) {
  return { ...payload, success: true };
}

function error(c, message, status = 404) {
  return c.json({ success: false, messages: [message], request_id: 'req_doppler_emulator', status_code: status }, status);
}

function page(c) {
  return Number(c.req.query('page') ?? 1);
}

function projectSecrets(current, project, config) {
  const own = current.secrets?.[project]?.[config];
  if (!own) return undefined;
  const metadata = current.configs.find((item) => item.project === project && item.name === config);
  if (metadata?.root !== false) return own;
  const root = current.configs.find((item) => item.project === project && item.environment === metadata.environment && item.root === true);
  return root ? { ...current.secrets?.[project]?.[root.name], ...own } : own;
}

function flatSecrets(secrets = {}) {
  return Object.fromEntries(Object.entries(secrets).map(([name, value]) => [name, value.computed ?? value.raw ?? '']));
}

export const contract = {
  provider: 'doppler',
  source: 'Doppler API v3 documentation and official CLI-compatible subset',
  docs: 'https://docs.doppler.com/reference/api',
  baseUrl: 'https://api.doppler.com/v3',
  scope: ['projects', 'configs', 'secrets', 'secret-download', 'inspection'],
  fidelity: 'stateful-rest-emulator',
};

export const plugin = {
  name: 'doppler',
  register(app, store) {
    app.get('/v3/projects', (c) => c.json(ok({ projects: state(store).projects, page: page(c) })));

    app.get('/v3/configs', (c) => {
      const project = c.req.query('project');
      const configs = state(store).configs.filter((config) => !project || config.project === project);
      return c.json(ok({ configs, page: page(c) }));
    });

    app.get('/v3/configs/config/secrets', (c) => {
      const project = c.req.query('project') ?? 'demo';
      const config = c.req.query('config') ?? 'dev';
      const secrets = projectSecrets(state(store), project, config);
      if (!secrets) return error(c, 'Config not found', 404);
      return c.json(ok({ secrets }));
    });

    app.get('/v3/configs/config/secret', (c) => {
      const project = c.req.query('project') ?? 'demo';
      const config = c.req.query('config') ?? 'dev';
      const name = c.req.query('name');
      const secrets = projectSecrets(state(store), project, config);
      if (!secrets?.[name]) return error(c, 'Secret not found', 404);
      return c.json(ok({ secret: { name, value: secrets[name] } }));
    });

    app.get('/v3/configs/config/secrets/download', (c) => {
      const project = c.req.query('project') ?? 'demo';
      const config = c.req.query('config') ?? 'dev';
      const secrets = projectSecrets(state(store), project, config);
      if (!secrets) return error(c, 'Config not found', 404);
      return c.json(flatSecrets(secrets));
    });

    app.get('/doppler/inspect/state', (c) => c.json(state(store)));
  },
};

export function seedFromConfig(store, _baseUrl, config = {}) {
  saveState(store, initialState(config));
}

export const label = 'Doppler API emulator';
export const endpoints = contract.scope.join(', ');
export const capabilities = contract.scope;
export const initConfig = { doppler: initialState() };
export default plugin;
