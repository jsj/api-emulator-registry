const STATE_KEY = 'modal:state';
const MODAL_PROTO_PATH = new URL('./modal.proto', import.meta.url).pathname;

const nowSeconds = () => Math.floor(Date.now() / 1000);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function defaultState(baseUrl = 'http://127.0.0.1') {
  const createdAt = 1_700_000_000;
  return {
    workspace: {
      id: 'ws-emulator',
      name: 'emulator',
      dashboardUrl: `${baseUrl}/modal/dashboard`,
    },
    token: {
      id: 'ak-emulator',
      name: 'emulator-token',
      userId: 'u-emulator',
      username: 'ada',
      createdAt,
    },
    environments: [
      {
        id: 'env-main',
        name: 'main',
        webhookSuffix: 'main',
        default: true,
        createdAt,
      },
    ],
    apps: [
      {
        id: 'ap-aaaaaaaaaaaaaaaaaaaaaa',
        name: 'api-emulator',
        description: 'api-emulator',
        state: 'deployed',
        environmentName: 'main',
        createdAt,
        stoppedAt: null,
        runningTasks: 1,
      },
      {
        id: 'ap-bbbbbbbbbbbbbbbbbbbbbb',
        name: 'worker-dev',
        description: 'worker-dev',
        state: 'ephemeral',
        environmentName: 'main',
        createdAt: createdAt + 60,
        stoppedAt: null,
        runningTasks: 0,
      },
    ],
    secrets: [
      {
        id: 'st-emulator',
        label: 'api-key',
        environmentName: 'main',
        createdAt,
        lastUsedAt: createdAt + 3600,
        metadata: {
          name: 'api-key',
          creation_info: { created_at: createdAt, created_by: 'api-emulator' },
          keys: ['MODAL_API_KEY'],
        },
      },
    ],
    volumes: [
      {
        id: 'vo-emulator',
        label: 'cache',
        environmentName: 'main',
        createdAt,
        metadata: {
          version: 2,
          name: 'cache',
          creation_info: { created_at: createdAt, created_by: 'api-emulator' },
          sizeBytes: 0,
        },
      },
    ],
  };
}

function modalState(store, baseUrl) {
  const state = store.getData(STATE_KEY);
  if (state) return state;
  const seeded = defaultState(baseUrl);
  store.setData(STATE_KEY, seeded);
  return seeded;
}

function saveState(store, state) {
  store.setData(STATE_KEY, state);
}

function modalError(c, status, code, message) {
  return c.json({ error: { code, message } }, status);
}

async function readJson(c) {
  try {
    return await c.req.json();
  } catch {
    return {};
  }
}

function nextId(prefix, values) {
  const suffix = String(values.length + 1).padStart(22, '0');
  return `${prefix}-${suffix}`;
}

function appToWire(app) {
  return {
    app_id: app.id,
    name: app.name,
    description: app.description,
    state: app.state,
    environment_name: app.environmentName,
    created_at: app.createdAt,
    stopped_at: app.stoppedAt,
    n_running_tasks: app.runningTasks,
  };
}

function envToWire(environment) {
  return {
    environment_id: environment.id,
    name: environment.name,
    webhook_suffix: environment.webhookSuffix,
    created_at: environment.createdAt,
    default: environment.default,
    is_managed: false,
    max_concurrent_tasks: 0,
    max_concurrent_gpus: 0,
    current_concurrent_tasks: 0,
    current_concurrent_gpus: 0,
    effective_cycle_spend_limit: 0,
    current_cycle_usage: 0,
    spend_limit_reached: false,
    environment_type: 0,
  };
}

function secretToWire(secret) {
  return {
    secret_id: secret.id,
    label: secret.label,
    environment_name: secret.environmentName,
    created_at: secret.createdAt,
    last_used_at: secret.lastUsedAt,
    metadata: secret.metadata,
  };
}

function volumeToWire(volume) {
  return {
    volume_id: volume.id,
    label: volume.label,
    environment_name: volume.environmentName,
    created_at: volume.createdAt,
    metadata: volume.metadata,
  };
}

function registerRoutes(app, store) {
  app.get('/modal/inspect/state', (c) => c.json(clone(modalState(store))));

  app.post('/modal/inspect/reset', async (c) => {
    const body = await readJson(c);
    const state = { ...defaultState(body.base_url), ...body.state };
    saveState(store, state);
    return c.json(clone(state));
  });

  app.post('/modal/forge/inference', async (c) => {
    const body = await readJson(c);
    const args = body.args ?? {};
    const seed = Number(args.seed ?? 42);
    const script = String(body.script ?? '');
    const request = { script, args, createdAt: nowSeconds() };
    const current = modalState(store);
    current.lastInference = request;
    saveState(store, current);

    if (script.includes('qwen3_tts') || script.includes('chatterbox') || script.includes('higgs_tts')) {
      return c.json({
        status: 'success',
        output_path: '/tmp/forge-modal-emulator.wav',
        audio_base64: Buffer.from('modal-emulator-audio').toString('base64'),
        duration_seconds: 1.25,
        sample_rate: 24000,
        seed,
      });
    }
    if (script.includes('ltx23_video')) {
      return c.json({
        status: 'success',
        video_base64: Buffer.from('modal-emulator-video').toString('base64'),
        duration_seconds: Number(args.duration ?? 5),
        seed,
      });
    }
    if (script.includes('flux_image')) {
      return c.json({
        status: 'success',
        image_base64: Buffer.from('modal-emulator-image').toString('base64'),
        width: Number(args.width ?? 1024),
        height: Number(args.height ?? 1024),
        seed,
        model: args.model ?? 'black-forest-labs/FLUX.1-schnell',
      });
    }
    return modalError(c, 404, 'not_found', `no deterministic inference fixture for ${script}`);
  });

  app.get('/modal/v1/token/info', (c) => {
    const state = modalState(store);
    return c.json({
      token_id: state.token.id,
      token_name: state.token.name,
      workspace_id: state.workspace.id,
      workspace_name: state.workspace.name,
      user_identity: {
        user_id: state.token.userId,
        username: state.token.username,
      },
      created_at: state.token.createdAt,
    });
  });

  app.get('/modal/v1/workspace', (c) => {
    const { workspace } = modalState(store);
    return c.json({ workspace_id: workspace.id, workspace_name: workspace.name, dashboard_url: workspace.dashboardUrl });
  });

  app.get('/modal/v1/environments', (c) => {
    const state = modalState(store);
    return c.json({ items: state.environments.map(envToWire) });
  });

  app.post('/modal/v1/environments', async (c) => {
    const state = modalState(store);
    const body = await readJson(c);
    if (!body.name) return modalError(c, 400, 'invalid_argument', 'name is required');
    if (state.environments.some((item) => item.name === body.name)) return modalError(c, 409, 'already_exists', 'environment already exists');
    const environment = {
      id: nextId('env', state.environments),
      name: body.name,
      webhookSuffix: body.webhook_suffix ?? body.name,
      default: false,
      createdAt: nowSeconds(),
    };
    state.environments.push(environment);
    saveState(store, state);
    return c.json(envToWire(environment), 201);
  });

  app.get('/modal/v1/apps', (c) => {
    const state = modalState(store);
    const environmentName = c.req.query?.('environment_name');
    const apps = environmentName ? state.apps.filter((item) => item.environmentName === environmentName) : state.apps;
    return c.json({ apps: apps.map(appToWire) });
  });

  app.post('/modal/v1/apps', async (c) => {
    const state = modalState(store);
    const body = await readJson(c);
    const name = body.name ?? body.description;
    if (!name) return modalError(c, 400, 'invalid_argument', 'name or description is required');
    const appRecord = {
      id: nextId('ap', state.apps),
      name,
      description: body.description ?? name,
      state: body.state ?? 'ephemeral',
      environmentName: body.environment_name ?? 'main',
      createdAt: nowSeconds(),
      stoppedAt: null,
      runningTasks: body.n_running_tasks ?? 0,
    };
    state.apps.push(appRecord);
    saveState(store, state);
    return c.json(appToWire(appRecord), 201);
  });

  app.get('/modal/v1/apps/:app_id', (c) => {
    const appRecord = modalState(store).apps.find((item) => item.id === c.req.param('app_id') || item.name === c.req.param('app_id'));
    if (!appRecord) return modalError(c, 404, 'not_found', 'app not found');
    return c.json(appToWire(appRecord));
  });

  app.patch('/modal/v1/apps/:app_id', async (c) => {
    const state = modalState(store);
    const appRecord = state.apps.find((item) => item.id === c.req.param('app_id') || item.name === c.req.param('app_id'));
    if (!appRecord) return modalError(c, 404, 'not_found', 'app not found');
    const body = await readJson(c);
    if (body.state) appRecord.state = body.state;
    if (body.description) appRecord.description = body.description;
    if (body.n_running_tasks !== undefined) appRecord.runningTasks = body.n_running_tasks;
    if (body.state === 'stopped') appRecord.stoppedAt = nowSeconds();
    saveState(store, state);
    return c.json(appToWire(appRecord));
  });

  app.delete('/modal/v1/apps/:app_id', (c) => {
    const state = modalState(store);
    const appRecord = state.apps.find((item) => item.id === c.req.param('app_id') || item.name === c.req.param('app_id'));
    if (!appRecord) return modalError(c, 404, 'not_found', 'app not found');
    appRecord.state = 'stopped';
    appRecord.runningTasks = 0;
    appRecord.stoppedAt = nowSeconds();
    saveState(store, state);
    return c.json(appToWire(appRecord));
  });

  app.get('/modal/v1/secrets', (c) => {
    const state = modalState(store);
    const environmentName = c.req.query?.('environment_name');
    const secrets = environmentName ? state.secrets.filter((item) => item.environmentName === environmentName) : state.secrets;
    return c.json({ environment_name: environmentName ?? 'main', items: secrets.map(secretToWire) });
  });

  app.post('/modal/v1/secrets', async (c) => {
    const state = modalState(store);
    const body = await readJson(c);
    const label = body.label ?? body.name;
    if (!label) return modalError(c, 400, 'invalid_argument', 'label is required');
    const secret = {
      id: nextId('st', state.secrets),
      label,
      environmentName: body.environment_name ?? 'main',
      createdAt: nowSeconds(),
      lastUsedAt: 0,
      metadata: body.metadata ?? {
        name: label,
        creation_info: { created_at: nowSeconds(), created_by: 'api-emulator' },
        keys: Object.keys(body.values ?? {}),
      },
    };
    state.secrets.push(secret);
    saveState(store, state);
    return c.json(secretToWire(secret), 201);
  });

  app.get('/modal/v1/volumes', (c) => {
    const state = modalState(store);
    const environmentName = c.req.query?.('environment_name');
    const volumes = environmentName ? state.volumes.filter((item) => item.environmentName === environmentName) : state.volumes;
    return c.json({ environment_name: environmentName ?? 'main', items: volumes.map(volumeToWire) });
  });

  app.post('/modal/v1/volumes', async (c) => {
    const state = modalState(store);
    const body = await readJson(c);
    const label = body.label ?? body.name;
    if (!label) return modalError(c, 400, 'invalid_argument', 'label is required');
    const volume = {
      id: nextId('vo', state.volumes),
      label,
      environmentName: body.environment_name ?? 'main',
      createdAt: nowSeconds(),
      metadata: body.metadata ?? {
        version: 2,
        name: label,
        creation_info: { created_at: nowSeconds(), created_by: 'api-emulator' },
        sizeBytes: 0,
      },
    };
    state.volumes.push(volume);
    saveState(store, state);
    return c.json(volumeToWire(volume), 201);
  });
}

export const contract = {
  provider: 'modal',
  source: 'Modal Python client protobuf contract and CLI-compatible gRPC subset',
  protobuf: 'https://github.com/modal-labs/modal-client/blob/4f3dadd2e577fa16f00c361da37ee272d252ee9d/modal_proto/api.proto',
  upstreamRevision: '4f3dadd2e577fa16f00c361da37ee272d252ee9d',
  docs: 'https://modal.com/docs/reference',
  baseUrl: 'https://api.modal.com',
  scope: ['token-info', 'workspace', 'environments', 'apps', 'secrets', 'volumes', 'inspection'],
  grpcScope: {
    token: ['ClientHello', 'TokenInfoGet'],
    workspace: ['WorkspaceDashboardUrlGet', 'WorkspaceNameLookup'],
    environments: ['EnvironmentList', 'EnvironmentCreate', 'EnvironmentGetOrCreate', 'EnvironmentDelete', 'EnvironmentUpdate', 'EnvironmentGetBudget'],
    apps: ['AppList', 'AppLookup', 'AppGetOrCreate', 'AppCreate', 'AppGetByDeploymentName', 'AppGetLifecycle', 'AppGetTags', 'AppSetTags', 'AppHeartbeat', 'AppStop'],
    secrets: ['SecretList', 'SecretGetOrCreate', 'SecretDelete', 'SecretUpdate'],
    volumes: ['VolumeList', 'VolumeGetOrCreate', 'VolumeGetById', 'VolumeDelete', 'VolumeRename', 'VolumeHeartbeat', 'VolumeCommit'],
  },
  fidelity: 'protobuf-derived-control-plane-subset; no official REST OpenAPI is published',
};

function unaryResponse(response) {
  return (_call, callback) => callback(null, response());
}

function grpcError(code, message) {
  return Object.assign(new Error(message), { code });
}

function requireGrpcItem(items, predicate, label) {
  const item = items.find(predicate);
  if (!item) throw grpcError(5, `${label} not found`);
  return item;
}

function grpcUnary(handler) {
  return (call, callback) => {
    try {
      callback(null, handler(call.request ?? {}));
    } catch (error) {
      callback(error);
    }
  };
}

function emptyGrpc(handler = () => {}) {
  return grpcUnary((request) => {
    handler(request);
    return {};
  });
}

function appStateToProto(state) {
  return {
    ephemeral: 'APP_STATE_EPHEMERAL',
    detached: 'APP_STATE_DETACHED',
    deployed: 'APP_STATE_DEPLOYED',
    stopping: 'APP_STATE_STOPPING',
    stopped: 'APP_STATE_STOPPED',
  }[state] ?? 'APP_STATE_UNSPECIFIED';
}

export function grpc({ store }) {
  const currentState = () => modalState(store);
  const save = (state) => {
    saveState(store, state);
    return state;
  };
  const findApp = (request) => requireGrpcItem(
    currentState().apps,
    (app) => app.id === request.app_id || app.name === request.app_name || app.name === request.name,
    'app',
  );
  const appLifecycle = (app) => ({
    app_state: appStateToProto(app.state),
    created_at: app.createdAt,
    created_by: 'api-emulator',
    deployed_at: app.state === 'deployed' ? app.createdAt : 0,
    deployed_by: app.state === 'deployed' ? 'api-emulator' : '',
    version: 1,
    stopped_at: app.stoppedAt ?? 0,
  });
  return {
    protoPath: MODAL_PROTO_PATH,
    packageName: 'modal.client',
    serviceName: 'ModalClient',
    implementation: {
      ClientHello: unaryResponse(() => ({ image_builder_version: '2025.06' })),
      TokenInfoGet: unaryResponse(() => {
        const state = currentState();
        return {
          token_id: state.token.id,
          token_name: state.token.name,
          workspace_id: state.workspace.id,
          workspace_name: state.workspace.name,
          user_identity: { user_id: state.token.userId, username: state.token.username },
          created_at: { seconds: String(state.token.createdAt), nanos: 0 },
        };
      }),
      WorkspaceDashboardUrlGet: unaryResponse(() => ({ url: currentState().workspace.dashboardUrl })),
      WorkspaceNameLookup: unaryResponse(() => ({
        workspace_name: currentState().workspace.name,
        username: currentState().workspace.name,
      })),
      EnvironmentList: unaryResponse(() => ({ items: currentState().environments.map(envToWire) })),
      EnvironmentCreate: emptyGrpc((request) => {
        const state = currentState();
        if (state.environments.some((item) => item.name === request.name)) throw grpcError(6, 'environment already exists');
        state.environments.push({ id: nextId('env', state.environments), name: request.name, webhookSuffix: request.settings?.webhook_suffix || request.name, default: false, createdAt: nowSeconds() });
        save(state);
      }),
      EnvironmentGetOrCreate: grpcUnary((request) => {
        const state = currentState();
        let environment = state.environments.find((item) => item.name === request.deployment_name);
        if (!environment) {
          environment = { id: nextId('env', state.environments), name: request.deployment_name, webhookSuffix: request.deployment_name, default: false, createdAt: nowSeconds() };
          state.environments.push(environment);
          save(state);
        }
        return { environment_id: environment.id, metadata: { name: environment.name, settings: { webhook_suffix: environment.webhookSuffix }, environment_type: 0 } };
      }),
      EnvironmentDelete: emptyGrpc((request) => {
        const state = currentState();
        requireGrpcItem(state.environments, (item) => item.name === request.name, 'environment');
        state.environments = state.environments.filter((item) => item.name !== request.name);
        save(state);
      }),
      EnvironmentUpdate: grpcUnary((request) => {
        const state = currentState();
        const environment = requireGrpcItem(state.environments, (item) => item.name === request.current_name, 'environment');
        if (request.name?.value) environment.name = request.name.value;
        if (request.web_suffix?.value) environment.webhookSuffix = request.web_suffix.value;
        save(state);
        return envToWire(environment);
      }),
      EnvironmentGetBudget: grpcUnary(() => ({ effective_cycle_spend_limit: 0, current_cycle_usage: 0, spend_limit_reached: false })),
      AppList: grpcUnary((request) => ({
        apps: currentState().apps.filter((app) => !request.environment_name || app.environmentName === request.environment_name).map((app) => ({ ...appToWire(app), state: appStateToProto(app.state) })),
      })),
      AppLookup: grpcUnary((request) => ({ app_id: findApp(request).id })),
      AppGetOrCreate: grpcUnary((request) => {
        const state = currentState();
        let app = state.apps.find((item) => item.name === request.app_name && (!request.environment_name || item.environmentName === request.environment_name));
        if (!app) {
          app = { id: nextId('ap', state.apps), name: request.app_name, description: request.app_name, state: 'ephemeral', environmentName: request.environment_name || 'main', createdAt: nowSeconds(), stoppedAt: null, runningTasks: 0, tags: {} };
          state.apps.push(app);
          save(state);
        }
        return { app_id: app.id };
      }),
      AppCreate: grpcUnary((request) => {
        const state = currentState();
        const app = { id: nextId('ap', state.apps), name: request.description || 'app', description: request.description || 'app', state: 'ephemeral', environmentName: request.environment_name || 'main', createdAt: nowSeconds(), stoppedAt: null, runningTasks: 0, tags: request.tags ?? {} };
        state.apps.push(app);
        save(state);
        return { app_id: app.id, app_page_url: `${currentState().workspace.dashboardUrl}/apps/${app.id}`, app_logs_url: `${currentState().workspace.dashboardUrl}/apps/${app.id}/logs` };
      }),
      AppGetByDeploymentName: grpcUnary((request) => {
        const app = findApp({ name: request.name });
        return { app_id: app.id, environment_name: app.environmentName, lifecycle: appLifecycle(app) };
      }),
      AppGetLifecycle: grpcUnary((request) => ({ lifecycle: appLifecycle(findApp(request)) })),
      AppGetTags: grpcUnary((request) => ({ tags: findApp(request).tags ?? {} })),
      AppSetTags: emptyGrpc((request) => {
        const state = currentState();
        findApp(request).tags = request.tags ?? {};
        save(state);
      }),
      AppHeartbeat: emptyGrpc((request) => findApp(request)),
      AppStop: emptyGrpc((request) => {
        const state = currentState();
        const app = findApp(request);
        app.state = 'stopped';
        app.stoppedAt = nowSeconds();
        app.runningTasks = 0;
        save(state);
      }),
      SecretList: grpcUnary((request) => ({
        environment_name: request.environment_name || 'main',
        items: currentState().secrets.filter((secret) => !request.environment_name || secret.environmentName === request.environment_name).map(secretToWire),
      })),
      SecretGetOrCreate: grpcUnary((request) => {
        const state = currentState();
        let secret = state.secrets.find((item) => item.label === request.deployment_name && item.environmentName === (request.environment_name || 'main'));
        if (!secret) {
          secret = { id: nextId('st', state.secrets), label: request.deployment_name, environmentName: request.environment_name || 'main', createdAt: nowSeconds(), lastUsedAt: 0, values: request.env_dict ?? {}, metadata: { name: request.deployment_name, creation_info: { created_at: nowSeconds(), created_by: 'api-emulator' }, keys: Object.keys(request.env_dict ?? {}) } };
          state.secrets.push(secret);
          save(state);
        }
        return { secret_id: secret.id, metadata: secret.metadata };
      }),
      SecretDelete: emptyGrpc((request) => {
        const state = currentState();
        requireGrpcItem(state.secrets, (item) => item.id === request.secret_id, 'secret');
        state.secrets = state.secrets.filter((item) => item.id !== request.secret_id);
        save(state);
      }),
      SecretUpdate: emptyGrpc((request) => {
        const state = currentState();
        const secret = requireGrpcItem(state.secrets, (item) => item.id === request.secret_id, 'secret');
        secret.values ??= {};
        for (const update of request.updates ?? []) update.value === undefined ? delete secret.values[update.key] : secret.values[update.key] = update.value;
        secret.metadata.keys = Object.keys(secret.values);
        save(state);
      }),
      VolumeList: grpcUnary((request) => ({ environment_name: request.environment_name || 'main', items: currentState().volumes.filter((volume) => !request.environment_name || volume.environmentName === request.environment_name).map(volumeToWire) })),
      VolumeGetOrCreate: grpcUnary((request) => {
        const state = currentState();
        let volume = state.volumes.find((item) => item.label === request.deployment_name && item.environmentName === (request.environment_name || 'main'));
        if (!volume) {
          volume = { id: nextId('vo', state.volumes), label: request.deployment_name, environmentName: request.environment_name || 'main', createdAt: nowSeconds(), metadata: { version: request.version || 'VOLUME_FS_VERSION_2', name: request.deployment_name, creation_info: { created_at: nowSeconds(), created_by: 'api-emulator' }, sizeBytes: 0 } };
          state.volumes.push(volume);
          save(state);
        }
        return { volume_id: volume.id, version: volume.metadata.version, metadata: volume.metadata };
      }),
      VolumeGetById: grpcUnary((request) => {
        const volume = requireGrpcItem(currentState().volumes, (item) => item.id === request.volume_id, 'volume');
        return { volume_id: volume.id, metadata: volume.metadata };
      }),
      VolumeDelete: emptyGrpc((request) => {
        const state = currentState();
        requireGrpcItem(state.volumes, (item) => item.id === request.volume_id, 'volume');
        state.volumes = state.volumes.filter((item) => item.id !== request.volume_id);
        save(state);
      }),
      VolumeRename: emptyGrpc((request) => {
        const state = currentState();
        const volume = requireGrpcItem(state.volumes, (item) => item.id === request.volume_id, 'volume');
        volume.label = request.name;
        volume.metadata.name = request.name;
        save(state);
      }),
      VolumeHeartbeat: emptyGrpc((request) => requireGrpcItem(currentState().volumes, (item) => item.id === request.volume_id, 'volume')),
      VolumeCommit: grpcUnary(() => ({ skip_reload: false })),
    },
  };
}

export const plugin = {
  name: 'modal',
  register(app, store) {
    registerRoutes(app, store);
  },
};

export function seedFromConfig(store, baseUrl, config = {}) {
  const state = { ...defaultState(baseUrl), ...(config.modal ?? {}) };
  saveState(store, state);
}

export const label = 'Modal API emulator';
export const endpoints = 'token info, workspace, environments, apps, secrets, volumes, and inspect/reset';
export const capabilities = contract.scope;
export const initConfig = {
  modal: {
    token: { id: 'ak-emulator', name: 'emulator-token', userId: 'u-emulator', username: 'ada', createdAt: 1_700_000_000 },
  },
};
