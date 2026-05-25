import { fixedNow, getState, setState } from './provider-plugin-kit.mjs';

const requestId = (slug) => `${slug.replaceAll('-', '_')}_req_emulator`;

function page(items, c, keys = ['per_page', 'limit', 'page_size']) {
  const limitKey = keys.find((key) => c.req.query?.(key));
  const limit = Math.max(1, Math.min(100, Number(c.req.query?.(limitKey) ?? 50)));
  const pageNumber = Math.max(1, Number(c.req.query?.('page') ?? 1));
  const start = (pageNumber - 1) * limit;
  return { rows: items.slice(start, start + limit), limit, page: pageNumber, total: items.length };
}

function resource(kind, provider, id, name, region) {
  return {
    id,
    name,
    label: name,
    region,
    status: 'active',
    state: 'active',
    type: kind,
    created_at: fixedNow,
    created: fixedNow,
    metadata: { provider, environment: 'emulator' },
  };
}

export function createCloudProvider(definition) {
  const stateKey = `${definition.slug}:state`;
  const makeDefault = () => ({
    account: { id: `${definition.slug}_account_emulator`, name: `${definition.label} Emulator Account` },
    regions: definition.regions,
    zones: definition.zones ?? definition.regions.map((region) => ({ id: `${region.id}-a`, name: `${region.id}-a`, region: region.id })),
    servers: [
      {
        ...resource('server', definition.slug, `${definition.serverPrefix ?? 'srv'}_emulator_001`, 'emulator-server', definition.regions[0].id),
        image: definition.defaultImage ?? 'ubuntu-24.04',
        plan: definition.defaultPlan ?? 'shared-1vcpu-1gb',
        public_ip: '203.0.113.20',
        private_ip: '10.0.0.20',
      },
    ],
    networks: [resource('network', definition.slug, `${definition.networkPrefix ?? 'net'}_emulator_001`, 'emulator-network', definition.regions[0].id)],
    cdnServices: [
      {
        ...resource('cdn_service', definition.slug, `${definition.cdnPrefix ?? 'cdn'}_emulator_001`, 'emulator-cdn', definition.regions[0].id),
        domain: `emulator.${definition.slug}.example.com`,
        origin: 'origin.example.com',
        tls_enabled: true,
      },
    ],
    nextServer: 2,
  });
  const state = (store) => getState(store, stateKey, makeDefault);
  const save = (store, next) => setState(store, stateKey, next);
  const error = (c, status, code, message) => c.json(definition.error?.(code, message) ?? { error: { code, message } }, status);
  const ok = (c, body, status = 200) => c.json(body, status, { 'x-emulator-request-id': requestId(definition.slug) });
  const list = (c, items, key) => {
    const p = page(items, c);
    return ok(c, definition.wrapList?.(key, p) ?? { [key]: p.rows, meta: { total: p.total, page: p.page, per_page: p.limit } });
  };

  function find(items, id) {
    return items.find((item) => item.id === id || item.name === id || item.label === id);
  }

  async function createServer(c, store) {
    const s = state(store);
    const body = await c.req.json().catch(() => ({}));
    const server = {
      ...resource('server', definition.slug, `${definition.serverPrefix ?? 'srv'}_emulator_${String(s.nextServer++).padStart(3, '0')}`, body.name ?? body.label ?? 'emulator-created', body.region ?? body.region_id ?? definition.regions[0].id),
      image: body.image ?? body.image_id ?? definition.defaultImage ?? 'ubuntu-24.04',
      plan: body.plan ?? body.size ?? body.server_type ?? definition.defaultPlan ?? 'shared-1vcpu-1gb',
      public_ip: `203.0.113.${20 + s.servers.length}`,
      private_ip: `10.0.0.${20 + s.servers.length}`,
    };
    s.servers.push(server);
    save(store, s);
    return ok(c, definition.wrapOne?.('server', server) ?? { server }, 201);
  }

  const plugin = {
    name: definition.slug,
    register(app, store) {
      const prefix = definition.prefix;
      app.get(`${prefix}/account`, (c) => ok(c, definition.wrapOne?.('account', state(store).account) ?? { account: state(store).account }));
      app.get(`${prefix}/regions`, (c) => list(c, state(store).regions, 'regions'));
      app.get(`${prefix}/zones`, (c) => list(c, state(store).zones, 'zones'));
      app.get(`${prefix}/servers`, (c) => list(c, state(store).servers, 'servers'));
      app.post(`${prefix}/servers`, (c) => createServer(c, store));
      app.get(`${prefix}/servers/:id`, (c) => {
        const server = find(state(store).servers, c.req.param('id'));
        return server ? ok(c, definition.wrapOne?.('server', server) ?? { server }) : error(c, 404, 'not_found', 'Server not found.');
      });
      app.delete(`${prefix}/servers/:id`, (c) => {
        const s = state(store);
        const before = s.servers.length;
        s.servers = s.servers.filter((server) => server.id !== c.req.param('id'));
        save(store, s);
        return before === s.servers.length ? error(c, 404, 'not_found', 'Server not found.') : c.body(null, 204);
      });
      app.get(`${prefix}/networks`, (c) => list(c, state(store).networks, 'networks'));
      app.get(`${prefix}/cdn/services`, (c) => list(c, state(store).cdnServices, 'services'));
      app.get(`/${definition.slug}/inspect/state`, (c) => c.json(state(store)));
      for (const route of definition.extraRoutes ?? []) route(app, store, { state, save, ok, error, list });
    },
  };

  return {
    contract: {
      provider: definition.slug,
      source: definition.source,
      docs: definition.docs,
      baseUrl: definition.baseUrl,
      auth: definition.auth ?? 'Bearer token or provider API key',
      scope: ['account', 'regions', 'zones', 'servers', 'networks', 'cdn-services'],
      fidelity: 'stateful-cloud-core-rest-emulator',
    },
    plugin,
    seedFromConfig(store, _baseUrl, config = {}) {
      return save(store, { ...makeDefault(), ...config });
    },
    label: `${definition.label} API emulator`,
    endpoints: 'account, regions, zones, servers, networks, and CDN services',
    capabilities: ['account', 'regions', 'zones', 'servers', 'networks', 'cdn-services'],
    initConfig: { [definition.slug]: { region: definition.regions[0].id } },
  };
}
