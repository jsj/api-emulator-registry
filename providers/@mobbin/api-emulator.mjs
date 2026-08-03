import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fixedNow, getState, readBody, routeError, setState } from '../../scripts/provider-plugin-kit.mjs';

const STATE_KEY = 'mobbin:state';
const TOOLS_CONTRACT_PATH = join(dirname(fileURLToPath(import.meta.url)), 'fixtures', 'tools-contract.sanitized.json');
const observedTools = JSON.parse(readFileSync(TOOLS_CONTRACT_PATH, 'utf8')).tools;

function defaultState(baseUrl = 'https://api.mobbin.com') {
  const screens = [
    {
      id: '58585b72-748a-47b2-90c3-179e92a963d4',
      image_url: 'https://mobbin.com/api/mcp/short/IgrOOaPc',
      mobbin_url: 'https://mobbin.com/screens/58585b72-748a-47b2-90c3-179e92a963d4',
      app_name: 'Ghost',
      platform: 'web',
      title: 'Dark membership analytics dashboard',
      tags: ['dashboard', 'analytics', 'members', 'sources', 'chart', 'dark'],
      created_at: fixedNow,
    },
    {
      id: '44a18f7a-5e3c-469c-86fa-3adc37d038a9',
      image_url: 'https://mobbin.com/api/mcp/short/vOHFUxGr',
      mobbin_url: 'https://mobbin.com/screens/44a18f7a-5e3c-469c-86fa-3adc37d038a9',
      app_name: 'June',
      platform: 'web',
      title: 'Product analytics home dashboard',
      tags: ['dashboard', 'analytics', 'activation', 'retention', 'cohorts', 'users'],
      created_at: fixedNow,
    },
    {
      id: 'c9020d16-6244-4d8b-9462-0a5c1175cac9',
      image_url: 'https://mobbin.com/api/mcp/short/SzHizSP5',
      mobbin_url: 'https://mobbin.com/screens/c9020d16-6244-4d8b-9462-0a5c1175cac9',
      app_name: 'Teachable',
      platform: 'web',
      title: 'Creator school dashboard',
      tags: ['dashboard', 'sales', 'signups', 'education', 'live feed', 'products'],
      created_at: fixedNow,
    },
    {
      id: '67c02e2c-718f-4cf2-9458-45a85086e9e2',
      image_url: 'https://mobbin.com/api/mcp/short/5jbJ0dDC',
      mobbin_url: 'https://mobbin.com/screens/67c02e2c-718f-4cf2-9458-45a85086e9e2',
      app_name: 'Outseta',
      platform: 'web',
      title: 'CRM billing engagement dashboard',
      tags: ['dashboard', 'crm', 'billing', 'engagement', 'activity', 'support'],
      created_at: fixedNow,
    },
    {
      id: 'a0ec4af5-4fb1-495b-b308-98ec9d98295a',
      image_url: 'https://mobbin.com/api/mcp/short/8WLF2usd',
      mobbin_url: 'https://mobbin.com/screens/a0ec4af5-4fb1-495b-b308-98ec9d98295a',
      app_name: 'Mintlify',
      platform: 'web',
      title: 'Documentation analytics dashboard',
      tags: ['dashboard', 'analytics', 'documentation', 'visitors', 'referrals', 'search'],
      created_at: fixedNow,
    },
  ];
  const flows = [
    {
      id: 'c4f7755a-36c6-4ddb-a4ad-5a76fa4f6c13',
      name: 'Personalized onboarding',
      actions: ['Create account', 'Choose interests', 'Finish onboarding'],
      mobbin_url: 'https://mobbin.com/flows/c4f7755a-36c6-4ddb-a4ad-5a76fa4f6c13',
      app_name: 'Duolingo',
      platform: 'ios',
      tags: ['onboarding', 'personalization', 'interests', 'account'],
      screens: [
        { screen_id: '2ab82046-c5a0-4a3e-b19c-d771b8b8a111', image_url: 'https://mobbin.com/api/mcp/short/flow01', position: 1 },
        { screen_id: 'd0362f8e-39ed-45bc-aac4-9c02793af222', image_url: 'https://mobbin.com/api/mcp/short/flow02', position: 2 },
        { screen_id: '3a4c4916-1d45-4990-b283-d5499b57a333', image_url: 'https://mobbin.com/api/mcp/short/flow03', position: 3 },
      ],
    },
    {
      id: 'c0538a6d-4363-4a70-8c62-14e92f78bf34',
      name: 'Checkout and payment',
      actions: ['Review cart', 'Select payment', 'Confirm order'],
      mobbin_url: 'https://mobbin.com/flows/c0538a6d-4363-4a70-8c62-14e92f78bf34',
      app_name: 'Shopify',
      platform: 'web',
      tags: ['checkout', 'cart', 'payment', 'order'],
      screens: [
        { screen_id: '91083608-122d-4ef8-bd1e-6a7e01f0a111', image_url: 'https://mobbin.com/api/mcp/short/flow11', position: 1 },
        { screen_id: '6d19b746-5846-4939-a544-f45c3083b222', image_url: 'https://mobbin.com/api/mcp/short/flow12', position: 2 },
      ],
    },
  ];
  const sections = [
    {
      id: '48d220ec-5f6f-4403-832e-c893866ee111',
      image_url: 'https://mobbin.com/api/mcp/short/section01',
      mobbin_url: 'https://mobbin.com/sections/48d220ec-5f6f-4403-832e-c893866ee111',
      site_name: 'Linear',
      title: 'Pricing plans comparison table',
      tags: ['pricing', 'plans', 'comparison', 'billing'],
    },
    {
      id: '804a8cd6-8c1b-4355-b670-632a0723a222',
      image_url: 'https://mobbin.com/api/mcp/short/section02',
      mobbin_url: 'https://mobbin.com/sections/804a8cd6-8c1b-4355-b670-632a0723a222',
      site_name: 'Vercel',
      title: 'Product hero with signup call to action',
      tags: ['hero', 'signup', 'call to action', 'product'],
    },
  ];
  return { baseUrl, screens, flows, sections };
}

function state(store) {
  return getState(store, STATE_KEY, () => defaultState());
}

export function seedFromConfig(store, baseUrl = 'https://api.mobbin.com', config = {}) {
  const seeded = defaultState(baseUrl);
  if (config.screens) seeded.screens = config.screens;
  if (config.flows) seeded.flows = config.flows;
  if (config.sections) seeded.sections = config.sections;
  return setState(store, STATE_KEY, seeded);
}

function screenPayload(screen) {
  return {
    id: screen.id,
    image_url: screen.image_url,
    mobbin_url: screen.mobbin_url,
    app_name: screen.app_name,
    platform: screen.platform,
  };
}

function searchScreens(s, body = {}) {
  const platform = body.platform;
  if (platform && !['ios', 'web'].includes(platform)) {
    return { error: { code: 'bad_request', message: 'platform must be ios or web' } };
  }
  const excluded = new Set(body.exclude_screen_ids ?? []);
  const query = String(body.query ?? '').toLowerCase();
  const terms = query.split(/\s+/).filter(Boolean);
  const limit = Math.max(1, Math.min(Number(body.limit ?? 20), 30));
  const screens = s.screens
    .filter((screen) => !platform || screen.platform === platform)
    .filter((screen) => !excluded.has(screen.id))
    .filter((screen) => {
      if (terms.length === 0) return true;
      const haystack = `${screen.app_name} ${screen.title} ${screen.tags.join(' ')}`.toLowerCase();
      return terms.some((term) => haystack.includes(term));
    })
    .slice(0, limit)
    .map(screenPayload);
  return { query: String(body.query ?? ''), screens };
}

function matchesQuery(row, query, fields) {
  const terms = String(query ?? '').toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const haystack = fields.map((field) => Array.isArray(row[field]) ? row[field].join(' ') : row[field] ?? '').join(' ').toLowerCase();
  return terms.some((term) => haystack.includes(term));
}

function searchFlows(s, body = {}) {
  const platform = body.platform;
  if (!['ios', 'web'].includes(platform)) return { error: { message: 'platform must be ios or web' } };
  const limit = Math.max(1, Math.min(Number(body.limit ?? 5), 10));
  const page = Math.max(1, Math.min(Number(body.page ?? 1), 20));
  const matching = s.flows.filter((flow) => flow.platform === platform).filter((flow) => matchesQuery(flow, body.query, ['name', 'app_name', 'actions', 'tags']));
  const start = (page - 1) * limit;
  const flows = matching.slice(start, start + limit).map(({ tags: _tags, ...flow }) => ({ ...flow, screen_count: flow.screens.length }));
  return { query: String(body.query ?? ''), page, has_next_page: start + limit < matching.length, flows };
}

function searchSections(s, body = {}) {
  const limit = Math.max(1, Math.min(Number(body.limit ?? 20), 30));
  const page = Math.max(1, Number(body.page ?? 1));
  const matching = s.sections.filter((section) => matchesQuery(section, body.query, ['site_name', 'title', 'tags']));
  const start = (page - 1) * limit;
  const sections = matching.slice(start, start + limit).map(({ title: _title, tags: _tags, ...section }) => section);
  return { query: String(body.query ?? ''), page, has_next_page: start + limit < matching.length, sections };
}

function protectedResourceMetadata() {
  return {
    resource: 'https://api.mobbin.com/mcp',
    authorization_servers: ['https://ujasntkfphywizsdaapi.supabase.co/auth/v1'],
    scopes_supported: ['openid'],
  };
}

function rpcResult(id, result) {
  return { jsonrpc: '2.0', id, result };
}

function rpcError(id, code, message) {
  return { jsonrpc: '2.0', id, error: { code, message } };
}

async function handleMcp(c, store) {
  const body = await readBody(c);
  const id = body.id ?? null;
  const method = body.method;
  if (method === 'initialize') {
    return c.json(rpcResult(id, {
      protocolVersion: body.params?.protocolVersion ?? '2025-06-18',
      capabilities: { tools: { listChanged: false } },
      serverInfo: { name: 'mobbin-api-emulator', version: '0.1.0' },
    }));
  }
  if (method === 'notifications/initialized') return c.json(rpcResult(id, {}));
  if (method === 'tools/list') return c.json(rpcResult(id, { tools: observedTools }));
  if (method === 'resources/list') return c.json(rpcResult(id, { resources: [] }));
  if (method === 'prompts/list') return c.json(rpcResult(id, { prompts: [] }));
  if (method === 'tools/call') {
    const name = body.params?.name;
    const handlers = { search_screens: searchScreens, search_flows: searchFlows, search_sections: searchSections };
    if (!handlers[name]) return c.json(rpcError(id, -32602, `Unknown tool: ${name}`));
    const result = handlers[name](state(store), body.params?.arguments ?? {});
    if (result.error) return c.json(rpcError(id, -32602, result.error.message));
    return c.json(rpcResult(id, {
      content: [{ type: 'text', text: JSON.stringify(result) }],
      structuredContent: result,
    }));
  }
  return c.json(rpcError(id, -32601, `Method not found: ${method}`));
}

export const contract = {
  provider: 'mobbin',
  source: 'Observed authenticated Mobbin MCP tools/list contract and public Screens Search API behavior',
  docs: 'https://api.mobbin.com/mcp',
  baseUrl: 'https://api.mobbin.com',
  scope: ['mcp', 'screens.search', 'flows.search', 'sections.search', 'oauth-protected-resource'],
  fidelity: 'deterministic-mcp-and-rest-subset',
};

export const plugin = {
  name: 'mobbin',
  register(app, store) {
    app.get('/.well-known/oauth-protected-resource/mcp', (c) => c.json(protectedResourceMetadata()));
    app.post('/v1/screens/search', async (c) => {
      const result = searchScreens(state(store), await readBody(c));
      if (result.error) return routeError(c, result.error.message, 400, result.error.code);
      return c.json(result);
    });
    app.post('/mcp', (c) => handleMcp(c, store));
    app.get('/mobbin/inspect/state', (c) => c.json(state(store)));
  },
};

export const label = 'Mobbin MCP and Screens API emulator';
export const endpoints = 'mcp screens, flows, and sections search; REST screens search; oauth metadata';
export const initConfig = { mobbin: { apiKey: 'mobbin_emulator_key' } };

export default plugin;
