import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fixedNow, getState, readBody, setState } from '../scripts/provider-plugin-kit.mjs';

const STATE_KEY = 'robinhood-banking:state';
const FIXTURE_PATH = join(dirname(fileURLToPath(import.meta.url)), 'fixtures', 'sanitized.json');
const TOOLS_CONTRACT_PATH = join(dirname(fileURLToPath(import.meta.url)), 'fixtures', 'tools-contract.sanitized.json');
const observedTools = JSON.parse(readFileSync(TOOLS_CONTRACT_PATH, 'utf8')).tools;

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
    feedback: [],
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
const mcpTextResult = (id, text) => ({ jsonrpc: '2.0', id, result: { content: [{ type: 'text', text }] } });
const mcpError = (id, message, status = 400, code = -32602) => ({ payload: { jsonrpc: '2.0', id, error: { code, message } }, status });

function validateArgs(args, allowed, required = []) {
  const unknown = Object.keys(args).find((key) => !allowed.includes(key));
  if (unknown) return `unknown argument: ${unknown}`;
  const missing = required.find((key) => typeof args[key] !== 'string' || !args[key].trim());
  if (missing) return `${missing} is required`;
  return null;
}

function selectCard(s, last4) {
  if (last4 !== undefined && !/^\d{4}$/.test(String(last4))) return { error: 'last4 must be exactly 4 digits' };
  if (last4 !== undefined) {
    const card = s.cards.find((candidate) => candidate.last4 === String(last4));
    return card ? { card } : { error: `no agent card ending in ${last4} found` };
  }
  if (s.cards.length > 1) return { error: `multiple agent cards found; specify last4: [${s.cards.map((card) => `****${card.last4}`).join(', ')}]` };
  return { card: s.cards.find((card) => card.id === s.settings.card_id) ?? s.cards[0] ?? {} };
}

function balancePayload(s, card) {
  const totalSpend = s.transactions
    .filter((txn) => !txn.card_id || txn.card_id === card.id)
    .reduce((sum, txn) => sum + Math.round(Number(txn.amount ?? 0) * 100), 0);
  return {
    availableBalance: null,
    monthlyLimit: Number(s.settings.monthly_limit ?? 0),
    totalSpendMicro: totalSpend * 10_000,
  };
}

function cardCredsPayload(card) {
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

function cardStatusPayload(card) {
  return {
    cardStatus: card.status === 'active' ? 'NORMAL' : String(card.status ?? 'UNKNOWN').toUpperCase(),
    status: 'UNSET',
  };
}

function transactionsPayload(s, card, args) {
  const limit = args.limit ?? 20;
  const offset = args.cursor ? Number(args.cursor) : 0;
  const allItems = s.transactions
    .filter((txn) => !txn.card_id || txn.card_id === card.id)
    .sort((a, b) => String(b.authorized_at ?? '').localeCompare(String(a.authorized_at ?? '')));
  const items = allItems.slice(offset, offset + limit);
  const nextCursor = offset + items.length < allItems.length ? String(offset + items.length) : '';
  const pending = allItems.find((txn) => txn.declineReason === 'AGENT_PENDING' && !['AUTHORIZED', 'UNAUTHORIZED'].includes(txn.ack_status));
  return {
    data: {
      transactionSearch: {
        cursor: nextCursor,
        items,
        total: allItems.length,
      },
    },
    ...(pending ? { required_next_action: { tool: 'banking_wait_for_agent_card_approval', transaction_id: pending.id } } : {}),
  };
}

const approvalGuide = 'AUTHORIZED means retry the merchant checkout once; UNAUTHORIZED means do not retry; UNKNOWN means approval is still pending.';

export function seedFromConfig(store, _baseUrl = 'https://banking-agent.robinhood.com/mcp/banking', config = {}) {
  return save(store, { ...defaultState(), ...config });
}

export const contract = {
  provider: 'robinhood-banking',
  source: 'Authenticated Robinhood Banking MCP tools/list contract, verified 2026-07-30',
  mcpUrl: 'https://banking-agent.robinhood.com/mcp/banking',
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
    'banking_submit_feedback',
    'banking_wait_for_agent_card_approval',
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
      if (body.method === 'tools/list') return c.json(mcpResult(id, { tools: observedTools }));
      if (body.method !== 'tools/call') {
        const result = mcpError(id, 'Method not found', 404, -32601);
        return c.json(result.payload, result.status);
      }

      const args = body.params?.arguments ?? {};
      const reject = (message) => {
        const result = mcpError(id, message);
        return c.json(result.payload, result.status);
      };
      const cardFor = (allowed, required = []) => {
        const invalid = validateArgs(args, allowed, required);
        if (invalid) return { error: invalid };
        return selectCard(s, args.last4);
      };

      switch (body.params?.name) {
        case 'banking_get_agent_card_balance': {
          const selected = cardFor(['last4']);
          return selected.error ? reject(selected.error) : c.json(mcpResult(id, balancePayload(s, selected.card)));
        }
        case 'banking_get_agent_card_creds': {
          const selected = cardFor(['last4', 'purchaseIntent'], ['purchaseIntent']);
          return selected.error ? reject(selected.error) : c.json(mcpResult(id, cardCredsPayload(selected.card)));
        }
        case 'banking_get_agent_card_policy': {
          const selected = cardFor(['last4']);
          return selected.error ? reject(selected.error) : c.json(mcpResult(id, balancePayload(s, selected.card)));
        }
        case 'banking_get_agent_card_status': {
          const selected = cardFor(['last4']);
          return selected.error ? reject(selected.error) : c.json(mcpResult(id, cardStatusPayload(selected.card)));
        }
        case 'banking_get_agent_card_transactions': {
          const selected = cardFor(['last4', 'limit', 'cursor']);
          if (selected.error) return reject(selected.error);
          if (args.limit !== undefined && (!Number.isInteger(args.limit) || args.limit < 1 || args.limit > 50)) return reject('limit must be an integer between 1 and 50');
          if (args.cursor !== undefined && !/^\d+$/.test(args.cursor)) return reject('cursor must be a pagination cursor from a previous response');
          return c.json(mcpResult(id, transactionsPayload(s, selected.card, args)));
        }
        case 'banking_submit_feedback': {
          const invalid = validateArgs(args, ['feedback', 'transaction_id'], ['feedback']);
          if (invalid) return reject(invalid);
          if (args.feedback.length > 1000) return reject('feedback must be at most 1000 characters');
          if (args.transaction_id && !s.transactions.some((txn) => txn.id === args.transaction_id)) return reject(`transaction ${args.transaction_id} not found`);
          const feedback = { id: `feedback_${String(s.nextId ?? 1).padStart(3, '0')}`, feedback: args.feedback, ...(args.transaction_id ? { transaction_id: args.transaction_id } : {}), created_at: fixedNow };
          save(store, { ...s, feedback: [...(s.feedback ?? []), feedback], nextId: (s.nextId ?? 1) + 1 });
          return c.json(mcpResult(id, { data: { feedback_id: feedback.id, status: 'received' }, guide: 'Feedback submitted to the Robinhood Banking emulator.' }));
        }
        case 'banking_wait_for_agent_card_approval': {
          const selected = cardFor(['last4', 'transaction_id', 'timeout_seconds']);
          if (selected.error) return reject(selected.error);
          if (args.timeout_seconds !== undefined && (!Number.isInteger(args.timeout_seconds) || args.timeout_seconds < 1 || args.timeout_seconds > 60)) return reject('timeout_seconds must be an integer between 1 and 60');
          const cardTransactions = s.transactions.filter((txn) => !txn.card_id || txn.card_id === selected.card.id);
          const transaction = args.transaction_id
            ? cardTransactions.find((txn) => txn.id === args.transaction_id)
            : cardTransactions.find((txn) => txn.declineReason === 'AGENT_PENDING' && !['AUTHORIZED', 'UNAUTHORIZED'].includes(txn.ack_status));
          if (!transaction || transaction.declineReason !== 'AGENT_PENDING') return c.json(mcpTextResult(id, 'No agent-card transaction is currently waiting for approval.'));
          const ackStatus = ['AUTHORIZED', 'UNAUTHORIZED'].includes(transaction.ack_status) ? transaction.ack_status : 'UNKNOWN';
          return c.json(mcpResult(id, { data: { transaction_id: transaction.id, ack_status: ackStatus, timed_out: ackStatus === 'UNKNOWN' }, guide: approvalGuide }));
        }
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
