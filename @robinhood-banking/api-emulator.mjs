import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fixedNow, getState, readBody, setState } from '../scripts/provider-plugin-kit.mjs';

const STATE_KEY = 'robinhood-banking:state';
const FIXTURE_PATH = join(dirname(fileURLToPath(import.meta.url)), 'fixtures', 'sanitized.json');

function sanitizedFixtureState() {
  try {
    return JSON.parse(readFileSync(FIXTURE_PATH, 'utf8'));
  } catch {
    return null;
  }
}

function defaultState() {
  const fixture = sanitizedFixtureState();
  if (fixture) return fixture;
  return {
    cards: [
      {
        id: 'card_agentic_001',
        status: 'active',
        network: 'visa',
        last4: '4242',
        card_number: '4242424242424242',
        expiration_month: '12',
        expiration_year: '2030',
        cvv: '123',
        billing_zip: '94105',
      },
    ],
    settings: {
      card_id: 'card_agentic_001',
      approval_required: true,
      monthly_limit: '500.00',
      currency: 'USD',
      merchant_allowlist: [],
      merchant_blocklist: [],
    },
    transactions: [],
    nextId: 1,
  };
}

const state = (store) => getState(store, STATE_KEY, () => defaultState());
const save = (store, next) => setState(store, STATE_KEY, next);
const oauthClients = (store) =>
  getState(store, 'robinhood-banking:oauth-clients', () => [
    {
      client_id: 'robinhood-banking-emulator-client',
      client_secret: 'robinhood-banking-emulator-secret',
      redirect_uris: ['http://localhost/oauth/robinhood-banking/callback', 'http://127.0.0.1:8787/oauth/robinhood-banking/callback'],
    },
  ]);
const token = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 12)}`;
const mcpResult = (id, structuredContent) => ({
  jsonrpc: '2.0',
  id,
  result: { content: [{ type: 'text', text: JSON.stringify(structuredContent) }], structuredContent },
});
const mcpError = (id, message, status = 400, code = -32602) => ({ payload: { jsonrpc: '2.0', id, error: { code, message } }, status });

function activeCard(s) {
  return s.cards.find((card) => card.id === s.settings.card_id) ?? s.cards[0] ?? {};
}

function balancePayload(s) {
  const totalSpend = s.transactions.reduce((sum, txn) => sum + Math.round(Number(txn.amount ?? 0) * 100), 0);
  return {
    availableBalance: null,
    monthlyLimit: Number(s.settings.monthly_limit ?? 0),
    totalSpendMicro: totalSpend * 10_000,
  };
}

function cardCredsPayload(s) {
  const card = activeCard(s);
  return {
    billing: {
      address: {
        streetAddress: '1 Market St',
        locality: 'San Francisco',
        subdivision: 'CA',
        zip: card.billing_zip ?? '94105',
        zip4: null,
        countryCode: 'US',
      },
      email: 'agent@example.com',
      fullName: 'Example User',
      phoneNumber: '+15555550100',
    },
    cardNumber: card.card_number,
    cvv: card.cvv,
    embossedName: 'Example User',
    expirationDate: `${card.expiration_year ?? '2030'}-${card.expiration_month ?? '12'}-31`,
    id: card.id,
  };
}

function cardStatusPayload(s) {
  const card = activeCard(s);
  return {
    cardStatus: card.status === 'active' ? 'NORMAL' : String(card.status ?? 'UNKNOWN').toUpperCase(),
    status: 'UNSET',
  };
}

function transactionsPayload(s) {
  return {
    data: {
      transactionSearch: {
        cursor: '',
        items: s.transactions,
        total: s.transactions.length,
      },
    },
  };
}

export function seedFromConfig(store, _baseUrl = 'https://agent.robinhood.com/mcp/banking', config = {}) {
  return save(store, { ...defaultState(), ...config });
}

export const contract = {
  provider: 'robinhood-banking',
  source: 'Robinhood Banking MCP documentation-informed subset',
  mcpUrl: 'https://agent.robinhood.com/mcp/banking',
  oauth: {
    authorizePath: '/oauth/authorize',
    tokenPath: '/oauth/token',
  },
  scope: [
    'banking_get_agent_card_balance',
    'banking_get_agent_card_creds',
    'banking_get_agent_card_policy',
    'banking_get_agent_card_status',
    'banking_get_agent_card_transactions',
  ],
  fidelity: 'stateful-streamable-http-mcp-emulator',
};

export const plugin = {
  name: 'robinhood-banking',
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

      const code = token('rh-bank-code');
      setState(store, `robinhood-banking:oauth-code:${code}`, {
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
        const savedCode = getState(store, `robinhood-banking:oauth-code:${code}`, () => null);
        if (!code || !savedCode) return c.json({ error: 'invalid_grant' }, 400);
        const redirectUri = String(body.redirect_uri ?? '');
        if (savedCode.redirect_uri && redirectUri !== savedCode.redirect_uri) return c.json({ error: 'invalid_grant' }, 400);
      } else if (grantType !== 'refresh_token') {
        return c.json({ error: 'unsupported_grant_type' }, 400);
      }

      return c.json({
        access_token: token('rh-bank-access'),
        refresh_token: token('rh-bank-refresh'),
        token_type: 'Bearer',
        expires_in: 3600,
        scope: 'banking',
      });
    });

    app.post('/mcp/banking', async (c) => {
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
              serverInfo: { name: 'robinhood-banking-emulator', version: '0.1.0' },
            },
          },
          200,
          { 'mcp-session-id': 'rh-banking-mcp-session-emulator' },
        );
      }

      if (body.method === 'notifications/initialized') return c.body(null, 202);
      if (body.method === 'tools/list') return c.json(mcpResult(id, { tools: contract.scope.map((name) => ({ name })) }));
      if (body.method !== 'tools/call') {
        const result = mcpError(id, 'Method not found', 404, -32601);
        return c.json(result.payload, result.status);
      }

      switch (body.params?.name) {
        case 'banking_get_agent_card_balance':
          return c.json(mcpResult(id, balancePayload(s)));
        case 'banking_get_agent_card_creds':
          return c.json(mcpResult(id, cardCredsPayload(s)));
        case 'banking_get_agent_card_policy':
          return c.json(mcpResult(id, balancePayload(s)));
        case 'banking_get_agent_card_status':
          return c.json(mcpResult(id, cardStatusPayload(s)));
        case 'banking_get_agent_card_transactions':
          return c.json(mcpResult(id, transactionsPayload(s)));
        default: {
          const result = mcpError(id, `Unknown tool: ${body.params?.name}`);
          return c.json(result.payload, result.status);
        }
      }
    });

    app.get('/inspect/contract', (c) => c.json(contract));
    app.get('/inspect/state', (c) => c.json(state(store)));
  },
};

export const label = 'Robinhood Banking MCP emulator';
export const endpoints = contract.scope.join(', ');
export const initConfig = { robinhoodBanking: { mcpUrl: contract.mcpUrl } };
export default plugin;
