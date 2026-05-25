import { fixedNow, getState, readBody, setState } from '../scripts/provider-plugin-kit.mjs';

const STATE_KEY = 'render:state';

function defaultServiceDetails(type = 'web_service', body = {}) {
  if (type === 'static_site') {
    return {
      buildCommand: body.buildCommand ?? 'npm run build',
      publishPath: body.publishPath ?? 'dist',
      pullRequestPreviewsEnabled: 'yes',
    };
  }
  return {
    env: body.env ?? 'node',
    region: body.region ?? 'oregon',
    plan: body.plan ?? 'starter',
    numInstances: body.numInstances ?? 1,
    buildCommand: body.buildCommand ?? 'npm install',
    startCommand: body.startCommand ?? 'npm start',
    healthCheckPath: body.healthCheckPath ?? '/',
  };
}

function makeService(id, input = {}) {
  const type = input.type ?? 'web_service';
  return {
    id,
    name: input.name ?? 'emulator-web',
    type,
    ownerId: input.ownerId ?? 'tea-emulator',
    repo: input.repo ?? 'https://github.com/render-examples/express-hello-world',
    branch: input.branch ?? 'main',
    autoDeploy: input.autoDeploy ?? 'yes',
    createdAt: fixedNow,
    updatedAt: fixedNow,
    suspended: 'not_suspended',
    dashboardUrl: `https://dashboard.render.com/${type}/${id}`,
    serviceDetails: input.serviceDetails ?? defaultServiceDetails(type, input),
  };
}

function defaultState() {
  return {
    user: {
      email: 'ada@example.com',
      name: 'Ada Lovelace',
    },
    owners: [
      {
        id: 'tea-emulator',
        name: 'Emulator Team',
        email: 'team@example.com',
        type: 'team',
      },
      {
        id: 'usr-emulator',
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        type: 'user',
      },
    ],
    services: [
      makeService('srv-emulator-web', {
        name: 'emulator-web',
        type: 'web_service',
        ownerId: 'tea-emulator',
      }),
      makeService('srv-emulator-static', {
        name: 'emulator-static',
        type: 'static_site',
        ownerId: 'tea-emulator',
        serviceDetails: defaultServiceDetails('static_site'),
      }),
    ],
    nextService: 3,
  };
}

const state = (store) => getState(store, STATE_KEY, defaultState);
const save = (store, next) => setState(store, STATE_KEY, next);

function renderError(c, status, id, message) {
  return c.json({ id, message }, status);
}

function cursorPage(items, c, defaultLimit = 20) {
  const limit = Math.max(1, Math.min(Number(c.req.query('limit') ?? defaultLimit) || defaultLimit, 100));
  const cursor = c.req.query('cursor');
  const start = cursor ? Math.max(0, items.findIndex((item) => item.cursor === cursor) + 1) : 0;
  return items.slice(start, start + limit);
}

function withCursor(resourceName, items) {
  return items.map((item, index) => ({
    [resourceName]: item,
    cursor: Buffer.from(`${resourceName}:${item.id}:${index}`).toString('base64url'),
  }));
}

function ownerScopedServices(s, ownerId) {
  return ownerId ? s.services.filter((service) => service.ownerId === ownerId) : s.services;
}

export const contract = {
  provider: 'render',
  source: 'Render OpenAPI specification',
  docs: 'https://api-docs.render.com/docs/api-spec',
  baseUrl: 'https://api.render.com/v1',
  auth: 'Authorization: Bearer <api-key>',
  pagination: 'cursor',
  errorShape: { id: 'string', message: 'string' },
  scope: ['users', 'owners', 'services'],
  fidelity: 'stateful-rest-emulator',
};

export const plugin = {
  name: 'render',
  register(app, store) {
    for (const prefix of ['', '/v1']) {
      app.get(`${prefix}/users`, (c) => c.json(state(store).user));

      app.get(`${prefix}/owners`, (c) => {
        const owners = withCursor('owner', state(store).owners);
        return c.json(cursorPage(owners, c));
      });

      app.get(`${prefix}/services`, (c) => {
        const s = state(store);
        const services = withCursor('service', ownerScopedServices(s, c.req.query('ownerId')));
        return c.json(cursorPage(services, c));
      });

      app.post(`${prefix}/services`, async (c) => {
        const s = state(store);
        const body = await readBody(c).catch(() => ({}));
        if (!body.name) return renderError(c, 400, 'bad_request', 'name is required');
        if (!body.type) return renderError(c, 400, 'bad_request', 'type is required');
        if (!body.ownerId) return renderError(c, 400, 'bad_request', 'ownerId is required');
        if (!s.owners.some((owner) => owner.id === body.ownerId)) {
          return renderError(c, 404, 'not_found', 'Owner not found');
        }
        const service = makeService(`srv-emulator-${s.nextService++}`, body);
        s.services.push(service);
        save(store, s);
        return c.json(service, 201);
      });

      app.get(`${prefix}/services/:serviceId`, (c) => {
        const service = state(store).services.find((item) => item.id === c.req.param('serviceId'));
        if (!service) return renderError(c, 404, 'not_found', 'Service not found');
        return c.json(service);
      });

      app.post(`${prefix}/blueprints/validate`, async (c) => {
        await readBody(c).catch(() => ({}));
        return c.json({ valid: true, warnings: [] });
      });
    }

    app.get('/render/inspect/state', (c) => c.json(state(store)));
  },
};

export function seedFromConfig(store, _baseUrl, config = {}) {
  return save(store, { ...defaultState(), ...config });
}

export const label = 'Render API emulator';
export const endpoints = 'users, owners, services, and blueprint validation';
export const capabilities = contract.scope;
export const initConfig = { render: defaultState() };
export default plugin;
