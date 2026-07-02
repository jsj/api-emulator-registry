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
  return current.secrets?.[project]?.[config];
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
