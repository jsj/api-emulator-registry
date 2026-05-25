import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fixedNow, getState, readBody, setState } from '../scripts/provider-plugin-kit.mjs';

const STATE_KEY = 'robinhood-trading:state';
const FIXTURE_PATH = join(dirname(fileURLToPath(import.meta.url)), 'fixtures', 'sanitized.json');

function sanitizedFixtureState() {
  try {
    return JSON.parse(readFileSync(FIXTURE_PATH, 'utf8'));
  } catch {
    return null;
  }
}

function defaultState(baseUrl = 'https://agent.robinhood.com/mcp/trading') {
  const fixture = sanitizedFixtureState();
  if (fixture) return { baseUrl, ...fixture };
  return {
    baseUrl,
    accounts: [{ id: 'acct_agentic', account_number: 'RHAGENTIC001', status: 'active', type: 'agentic' }],
    portfolio: {
      total_value: '26000.00',
      buying_power: '10000.00',
      values_by_asset_class: { equities: '26000.00' },
      series: [24750, 25200, 26000],
      updated_at: fixedNow,
    },
    positions: [
      {
        id: 'pos_aapl',
        symbol: 'AAPL',
        quantity: '5',
        side: 'long',
        market_value: '1000.00',
        average_entry_price: '190.00',
        current_price: '200.00',
        unrealized_pl: '50.00',
        unrealized_pl_percent: '5.26',
      },
    ],
    quotes: [{ symbol: 'AAPL', price: '200.00', bid: '199.95', ask: '200.05', prior_close: '198.00', updated_at: fixedNow }],
    orders: [],
    nextId: 1,
  };
}

const state = (store) => getState(store, STATE_KEY, () => defaultState());
const save = (store, next) => setState(store, STATE_KEY, next);
const oauthClients = (store) =>
  getState(store, 'robinhood-trading:oauth-clients', () => [
    {
      client_id: 'robinhood-emulator-client',
      client_secret: 'robinhood-emulator-secret',
      redirect_uris: [
        'http://localhost/v1/broker-connections/robinhood/callback',
        'http://127.0.0.1:8787/v1/broker-connections/robinhood/callback',
      ],
    },
  ]);
const token = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 12)}`;
const mcpResult = (id, structuredContent) => ({
  jsonrpc: '2.0',
  id,
  result: { content: [{ type: 'text', text: JSON.stringify(structuredContent) }], structuredContent },
});
const mcpError = (id, message, status = 400, code = -32602) => ({ payload: { jsonrpc: '2.0', id, error: { code, message } }, status });

export function seedFromConfig(store, baseUrl = 'https://agent.robinhood.com/mcp/trading', config = {}) {
  return save(store, { ...defaultState(baseUrl), ...config });
}

export const contract = {
  provider: 'robinhood-trading',
  source: 'Robinhood Agentic Trading MCP documentation-informed subset',
  docs: 'https://robinhood.com/us/en/support/articles/trading-with-your-agent/',
  mcpUrl: 'https://agent.robinhood.com/mcp/trading',
  oauth: {
    authorizePath: '/oauth/authorize',
    tokenPath: '/oauth/token',
  },
  scope: [
    'get_accounts',
    'get_portfolio',
    'get_equity_positions',
    'get_equity_quotes',
    'get_equity_orders',
    'get_equity_tradability',
    'review_equity_order',
    'place_equity_order',
    'cancel_equity_order',
    'search',
  ],
  fidelity: 'stateful-streamable-http-mcp-emulator',
};

export const plugin = {
  name: 'robinhood-trading',
  register(app, store) {
    app.get('/oauth/authorize', (c) => {
      const clientId = c.req.query('client_id') ?? '';
      const redirectUri = c.req.query('redirect_uri') ?? '';
      const stateParam = c.req.query('state');
      const client = oauthClients(store).find((row) => row.client_id === clientId);
      if (!client) return c.json({ error: 'invalid_client' }, 400);
      if (redirectUri && !client.redirect_uris.includes(redirectUri)) {
        return c.json({ error: 'invalid_request', error_description: 'redirect_uri is not registered' }, 400);
      }

      const code = token('rh-code');
      setState(store, `robinhood-trading:oauth-code:${code}`, {
        client_id: clientId,
        redirect_uri: redirectUri,
        issued_at: fixedNow,
      });

      if (!redirectUri) return c.json({ code, state: stateParam ?? null });
      const url = new URL(redirectUri);
      url.searchParams.set('code', code);
      if (stateParam) url.searchParams.set('state', stateParam);
      return c.redirect ? c.redirect(url.toString(), 302) : c.body(null, 302, { location: url.toString() });
    });

    app.post('/oauth/token', async (c) => {
      const contentType = c.req.header('content-type') ?? '';
      const body = contentType.includes('application/json')
        ? await c.req.json().catch(() => ({}))
        : await c.req.parseBody().catch(async () => Object.fromEntries(new URLSearchParams(await c.req.text().catch(() => ''))));
      const grantType = String(body.grant_type ?? 'authorization_code');
      const clientId = String(body.client_id ?? '');
      const clientSecret = String(body.client_secret ?? '');
      const client = oauthClients(store).find((row) => row.client_id === clientId);
      if (!client || client.client_secret !== clientSecret) return c.json({ error: 'invalid_client' }, 401);

      if (grantType === 'authorization_code') {
        const code = String(body.code ?? '');
        const savedCode = getState(store, `robinhood-trading:oauth-code:${code}`, () => null);
        if (!code || !savedCode) return c.json({ error: 'invalid_grant' }, 400);
        const redirectUri = String(body.redirect_uri ?? '');
        if (savedCode.redirect_uri && redirectUri !== savedCode.redirect_uri) return c.json({ error: 'invalid_grant' }, 400);
      } else if (grantType !== 'refresh_token') {
        return c.json({ error: 'unsupported_grant_type' }, 400);
      }

      const s = state(store);
      const agenticAccount = s.accounts.find((account) => account.agentic_allowed && account.account_number) ?? s.accounts[0];
      return c.json({
        access_token: token('rh-access'),
        refresh_token: token('rh-refresh'),
        token_type: 'Bearer',
        expires_in: 3600,
        scope: 'trading',
        account_id: agenticAccount?.account_number ?? null,
      });
    });

    app.post('/mcp/trading', async (c) => {
      const s = state(store);
      const body = await readBody(c);
      const id = body.id ?? null;

      if (body.method === 'initialize') {
        return c.json(
          {
            jsonrpc: '2.0',
            id,
            result: {
              protocolVersion: '2025-06-18',
              capabilities: { tools: {} },
              serverInfo: { name: 'robinhood-trading-emulator', version: '0.1.0' },
            },
          },
          200,
          { 'mcp-session-id': 'rh-mcp-session-emulator' },
        );
      }

      if (body.method === 'notifications/initialized') return c.body(null, 202);

      if (body.method === 'tools/list') {
        return c.json(
          mcpResult(id, {
            tools: contract.scope.map((name) => ({ name })),
          }),
        );
      }

      if (body.method !== 'tools/call') {
        const result = mcpError(id, 'Method not found', 404, -32601);
        return c.json(result.payload, result.status);
      }

      const tool = body.params?.name;
      const args = body.params?.arguments ?? {};

      switch (tool) {
        case 'get_accounts':
          return c.json(mcpResult(id, { accounts: s.accounts }));
        case 'get_portfolio':
          return c.json(mcpResult(id, s.portfolio));
        case 'get_equity_positions':
          return c.json(mcpResult(id, { positions: s.positions }));
        case 'get_equity_quotes': {
          const symbols = Array.isArray(args.symbols) ? args.symbols : String(args.symbol ?? 'AAPL').split(',');
          return c.json(mcpResult(id, { quotes: s.quotes.filter((quote) => symbols.includes(quote.symbol)) }));
        }
        case 'get_equity_orders':
          return c.json(mcpResult(id, { orders: s.orders }));
        case 'get_equity_tradability':
          return c.json(mcpResult(id, { symbol: args.symbol ?? 'AAPL', tradable: true, fractionally_tradable: true }));
        case 'review_equity_order':
          return c.json(mcpResult(id, { accepted: true, warnings: [], estimated_price: '200.00', estimated_notional: args.notional ?? null }));
        case 'place_equity_order': {
          const order = {
            id: `rh_order_${String(s.nextId++).padStart(6, '0')}`,
            symbol: args.symbol ?? 'AAPL',
            side: args.side ?? 'buy',
            quantity: args.quantity ?? args.qty ?? '1',
            notional: args.notional,
            type: args.type ?? 'market',
            status: 'accepted',
            submitted_at: fixedNow,
          };
          s.orders.push(order);
          save(store, s);
          return c.json(mcpResult(id, order));
        }
        case 'cancel_equity_order': {
          const order = s.orders.find((row) => row.id === args.order_id || row.id === args.id);
          if (order) order.status = 'canceled';
          save(store, s);
          return c.json(mcpResult(id, { id: args.order_id ?? args.id, status: order ? 'canceled' : 'not_found' }));
        }
        case 'search':
          return c.json(mcpResult(id, { results: [{ symbol: 'AAPL', name: 'Apple Inc.' }] }));
        default: {
          const result = mcpError(id, `Unknown tool: ${tool}`);
          return c.json(result.payload, result.status);
        }
      }
    });
    app.get('/inspect/contract', (c) => c.json(contract));
    app.get('/inspect/state', (c) => c.json(state(store)));
  },
};

export const label = 'Robinhood Trading MCP emulator';
export const endpoints = contract.scope.join(', ');
export const initConfig = { robinhoodTrading: { mcpUrl: contract.mcpUrl } };
export default plugin;
