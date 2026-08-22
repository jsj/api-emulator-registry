import { fixedNow, getState, readBody, setState } from '../../scripts/provider-plugin-kit.mjs';

const STATE_KEY = 'x-ads:state';
const TOOLS = [
  'list_ads_accounts', 'list_campaigns', 'get_campaign', 'list_line_items',
  'list_funding_instruments', 'list_promoted_posts', 'list_targeting_criteria',
  'list_account_posts', 'get_active_entities', 'get_account_stats',
  'get_campaign_reach', 'search_targeting_interests', 'search_targeting_locations',
  'create_campaign', 'update_campaign', 'activate_campaign', 'create_line_item',
  'update_line_item', 'activate_line_item', 'add_targeting_criterion',
  'remove_targeting', 'create_ad_post', 'promote_post',
];

const READ_TOOLS = new Set(TOOLS.slice(0, 13));
const uuid = (prefix, n) => `${prefix}_${String(n).padStart(6, '0')}`;

function initialState(config = {}) {
  return {
    accounts: config.accounts ?? [{ id: 'ads-account-1', name: 'X Ads Emulator', currency: 'USD', timezone: 'America/New_York' }],
    campaigns: config.campaigns ?? [{ id: 'campaign_000001', account_id: 'ads-account-1', name: 'Existing campaign', entity_status: 'PAUSED', daily_budget_amount_local_micro: 10_000_000, created_at: fixedNow }],
    lineItems: config.lineItems ?? [],
    fundingInstruments: config.fundingInstruments ?? [{ id: 'funding_000001', account_id: 'ads-account-1', type: 'CREDIT_CARD', currency: 'USD' }],
    posts: config.posts ?? [{ id: 'post_000001', account_id: 'ads-account-1', text: 'Hello from the X Ads emulator', nullcast: true }],
    promotedPosts: config.promotedPosts ?? [],
    targetingCriteria: config.targetingCriteria ?? [],
    nextCampaign: 2,
    nextLineItem: 1,
    nextTargeting: 1,
    nextPost: 2,
    nextPromotion: 1,
  };
}

const state = (store) => getState(store, STATE_KEY, () => initialState());
const save = (store, value) => setState(store, STATE_KEY, value);
const result = (id, data) => ({ jsonrpc: '2.0', id, result: { content: [{ type: 'text', text: JSON.stringify(data) }], structuredContent: data } });
const rpcError = (id, message, code = -32602) => ({ jsonrpc: '2.0', id, error: { code, message } });

function toolDefinition(name) {
  return {
    name,
    description: `${name.replaceAll('_', ' ')} via the X Ads MCP emulator.`,
    inputSchema: { type: 'object', properties: {}, additionalProperties: true },
    outputSchema: { type: 'object', additionalProperties: true },
  };
}

function accountId(args) {
  return String(args.account_id ?? args.accountId ?? 'ads-account-1');
}

function callTool(current, name, args) {
  const account = accountId(args);
  switch (name) {
    case 'list_ads_accounts': return { accounts: current.accounts };
    case 'list_campaigns': return { campaigns: current.campaigns.filter((row) => row.account_id === account) };
    case 'get_campaign': return { campaign: current.campaigns.find((row) => row.id === String(args.campaign_id ?? args.campaignId)) ?? null };
    case 'list_line_items': return { line_items: current.lineItems.filter((row) => row.account_id === account) };
    case 'list_funding_instruments': return { funding_instruments: current.fundingInstruments.filter((row) => row.account_id === account) };
    case 'list_promoted_posts': return { promoted_posts: current.promotedPosts.filter((row) => row.account_id === account) };
    case 'list_targeting_criteria': return { targeting_criteria: current.targetingCriteria.filter((row) => row.account_id === account) };
    case 'list_account_posts': return { posts: current.posts.filter((row) => row.account_id === account) };
    case 'get_active_entities': return { campaigns: current.campaigns.filter((row) => row.entity_status === 'ACTIVE'), line_items: current.lineItems.filter((row) => row.entity_status === 'ACTIVE') };
    case 'get_account_stats': return { account_id: account, impressions: 12500, clicks: 320, spend_micro: 4_250_000, start_time: args.start_time ?? null, end_time: args.end_time ?? null };
    case 'get_campaign_reach': return { campaign_id: String(args.campaign_id ?? ''), estimated_reach: 42000 };
    case 'search_targeting_interests': return { interests: [{ id: 'interest_technology', name: String(args.query ?? 'Technology'), audience_size: 1250000 }] };
    case 'search_targeting_locations': return { locations: [{ id: 'location_us', name: String(args.query ?? 'United States'), location_type: 'COUNTRY' }] };
    case 'create_campaign': {
      const campaign = { id: uuid('campaign', current.nextCampaign++), account_id: account, name: String(args.name ?? 'Untitled campaign'), entity_status: 'PAUSED', daily_budget_amount_local_micro: Number(args.daily_budget_amount_local_micro ?? args.daily_budget_micro ?? 0), created_at: fixedNow };
      current.campaigns.push(campaign);
      return { campaign };
    }
    case 'update_campaign': {
      const campaign = current.campaigns.find((row) => row.id === String(args.campaign_id));
      if (!campaign) return { campaign: null };
      for (const key of ['name', 'daily_budget_amount_local_micro']) if (args[key] !== undefined) campaign[key] = args[key];
      return { campaign };
    }
    case 'activate_campaign': {
      const campaign = current.campaigns.find((row) => row.id === String(args.campaign_id));
      if (campaign) campaign.entity_status = 'ACTIVE';
      return { campaign };
    }
    case 'create_line_item': {
      const lineItem = { id: uuid('line_item', current.nextLineItem++), account_id: account, campaign_id: String(args.campaign_id), name: String(args.name ?? 'Untitled line item'), entity_status: 'PAUSED', objective: args.objective ?? 'WEBSITE_CLICKS', bid_amount_local_micro: Number(args.bid_amount_local_micro ?? 0), created_at: fixedNow };
      current.lineItems.push(lineItem);
      return { line_item: lineItem };
    }
    case 'update_line_item': {
      const lineItem = current.lineItems.find((row) => row.id === String(args.line_item_id));
      if (!lineItem) return { line_item: null };
      for (const key of ['name', 'objective', 'bid_amount_local_micro']) if (args[key] !== undefined) lineItem[key] = args[key];
      return { line_item: lineItem };
    }
    case 'activate_line_item': {
      const lineItem = current.lineItems.find((row) => row.id === String(args.line_item_id));
      if (lineItem) lineItem.entity_status = 'ACTIVE';
      return { line_item: lineItem };
    }
    case 'add_targeting_criterion': {
      const criterion = { id: uuid('targeting', current.nextTargeting++), account_id: account, line_item_id: String(args.line_item_id), targeting_type: args.targeting_type, targeting_value: args.targeting_value };
      current.targetingCriteria.push(criterion);
      return { targeting_criterion: criterion };
    }
    case 'remove_targeting': {
      const id = String(args.targeting_criterion_id ?? args.id);
      const removed = current.targetingCriteria.some((row) => row.id === id);
      current.targetingCriteria = current.targetingCriteria.filter((row) => row.id !== id);
      return { removed };
    }
    case 'create_ad_post': {
      const post = { id: uuid('post', current.nextPost++), account_id: account, text: String(args.text ?? ''), nullcast: true };
      current.posts.push(post);
      return { post };
    }
    case 'promote_post': {
      const promoted = { id: uuid('promoted_post', current.nextPromotion++), account_id: account, line_item_id: String(args.line_item_id), post_id: String(args.post_id), entity_status: 'PAUSED' };
      current.promotedPosts.push(promoted);
      return { promoted_post: promoted };
    }
    default: return null;
  }
}

export function seedFromConfig(store, _baseUrl = 'https://ads-api.x.com/mcp', config = {}) {
  return save(store, initialState(config));
}

export const contract = {
  provider: 'x-ads',
  source: 'Official X Ads MCP documentation, verified 2026-08-22',
  docs: 'https://docs.x.com/x-ads-api/mcp',
  mcpUrl: 'https://ads-api.x.com/mcp',
  auth: 'OAuth2 bearer token with ads.read and optional ads.write',
  scope: TOOLS,
  fidelity: 'stateful-streamable-http-mcp-emulator',
};

export const plugin = {
  name: 'x-ads',
  register(app, store) {
    app.post('/mcp', async (c) => {
      const body = await readBody(c);
      const id = body.id ?? null;
      if (body.method === 'initialize') return c.json({ jsonrpc: '2.0', id, result: { protocolVersion: '2025-06-18', capabilities: { tools: {} }, serverInfo: { name: 'x-ads-emulator', version: '0.1.0' } } }, 200, { 'mcp-session-id': 'x-ads-emulator-session' });
      if (body.method === 'notifications/initialized') return c.body(null, 202);
      if (body.method === 'tools/list') return c.json(result(id, { tools: TOOLS.map(toolDefinition) }));
      if (body.method !== 'tools/call') return c.json(rpcError(id, 'Method not found', -32601), 404);
      const name = body.params?.name;
      if (!TOOLS.includes(name)) return c.json(rpcError(id, `Unknown tool: ${name}`), 400);
      const current = state(store);
      const data = callTool(current, name, body.params?.arguments ?? {});
      if (!READ_TOOLS.has(name)) save(store, current);
      return c.json(result(id, data));
    });
    app.get('/inspect/state', (c) => c.json(state(store)));
  },
  seed(store) { seedFromConfig(store); },
};

export const label = 'X Ads MCP emulator';
export const endpoints = contract.scope.join(', ');
export const capabilities = contract.scope;
export const initConfig = { xAds: initialState() };
export default plugin;
