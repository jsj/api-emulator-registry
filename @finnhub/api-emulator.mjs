import { getState, routeError, setState } from '../scripts/provider-plugin-kit.mjs';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const STATE_KEY = 'finnhub:state';
const BASE_URL = 'https://finnhub.io/api/v1';
const PROVIDER_DIR = dirname(fileURLToPath(import.meta.url));
const fixture = JSON.parse(readFileSync(join(PROVIDER_DIR, 'fixtures', 'sanitized.json'), 'utf8'));

function newsItem(id, category, headline, related = '') {
  return {
    category,
    datetime: 1_714_374_000 - id,
    headline,
    id,
    image: `https://static.finnhub.io/emulator/news/${id}.jpg`,
    related,
    source: 'Finnhub Emulator',
    summary: `${headline} This deterministic article is served by the Finnhub API emulator.`,
    url: `https://example.com/finnhub/news/${id}`,
  };
}

function defaultState(baseUrl = BASE_URL) {
  return {
    baseUrl,
    acceptedTokens: ['finnhub-emulator-token', 'demo-token'],
    requests: [],
    marketNews: {
      general: [
        newsItem(5085164, 'technology', 'Square surges after reporting stronger revenue'),
        newsItem(5085113, 'business', 'Consumer staples demand remains resilient'),
        newsItem(5084850, 'top news', 'Autonomous vehicle supplier announces new platform'),
      ],
      forex: [
        newsItem(4085164, 'forex', 'Dollar steadies as traders await central bank decision'),
        newsItem(4085113, 'forex', 'Euro gains after stronger services data'),
      ],
      crypto: [
        newsItem(3085164, 'crypto', 'Bitcoin liquidity improves during US session', 'BTC'),
        newsItem(3085113, 'crypto', 'Ether developers prepare testnet upgrade', 'ETH'),
      ],
      merger: [
        newsItem(2085164, 'merger', 'Industrial software firms announce all-stock merger', 'SOFT,DATA'),
      ],
      ...(fixture.marketNews ?? {}),
    },
    companyNews: {
      AAPL: [
        newsItem(25286, 'company news', 'Apple supplier commentary points to steady device demand', 'AAPL'),
        newsItem(25287, 'company news', 'Analysts highlight services growth at Apple', 'AAPL'),
        newsItem(25341, 'company news', 'Apple product teardown shows updated component mix', 'AAPL'),
      ],
      MSFT: [
        newsItem(35286, 'company news', 'Microsoft cloud demand remains durable', 'MSFT'),
        newsItem(35287, 'company news', 'Microsoft expands AI developer tooling', 'MSFT'),
      ],
      ...(fixture.companyNews ?? {}),
    },
  };
}

const state = (store) => getState(store, STATE_KEY, () => defaultState());
const save = (store, next) => setState(store, STATE_KEY, next);

export function seedFromConfig(store, baseUrl = BASE_URL, config = {}) {
  const seeded = defaultState(baseUrl);
  return save(store, {
    ...seeded,
    ...config,
    marketNews: { ...seeded.marketNews, ...(config.marketNews ?? {}) },
    companyNews: { ...seeded.companyNews, ...(config.companyNews ?? {}) },
    acceptedTokens: config.acceptedTokens ?? seeded.acceptedTokens,
  });
}

function query(c, name, fallback = '') {
  return c.req.query?.(name) ?? fallback;
}

function token(c) {
  return query(c, 'token') || c.req.header?.('X-Finnhub-Token') || c.req.header?.('x-finnhub-token') || '';
}

function requireAuth(c, current) {
  const value = token(c);
  if (!value || current.acceptedTokens.includes(value)) return null;
  return routeError(c, "You don't have access to this resource.", 401, 'unauthorized');
}

function record(current, endpoint, params = {}) {
  current.requests.push({ endpoint, params, requestedAt: new Date().toISOString() });
}

function marketNews(c, store) {
  const current = state(store);
  const auth = requireAuth(c, current);
  if (auth) return auth;
  const category = query(c, 'category');
  if (!category) return routeError(c, 'category query parameter is required', 400, 'missing_category');
  const items = current.marketNews[category];
  if (!items) return routeError(c, 'Unsupported category. Use general, forex, crypto, or merger.', 400, 'invalid_category');
  const minId = Math.max(0, Number(query(c, 'minId', '0')) || 0);
  record(current, '/news', { category, minId });
  save(store, current);
  return c.json(items.filter((item) => item.id > minId));
}

function companyNews(c, store) {
  const current = state(store);
  const auth = requireAuth(c, current);
  if (auth) return auth;
  const symbol = query(c, 'symbol').toUpperCase();
  const from = query(c, 'from');
  const to = query(c, 'to');
  if (!symbol) return routeError(c, 'symbol query parameter is required', 400, 'missing_symbol');
  if (!from || !to) return routeError(c, 'from and to query parameters are required', 400, 'missing_date_range');
  record(current, '/company-news', { symbol, from, to });
  save(store, current);
  return c.json(current.companyNews[symbol] ?? [newsItem(900001, 'company news', `${symbol} announces emulator coverage update`, symbol)]);
}

function registerFinnhubRoutes(app, store, prefix = '') {
  app.get(`${prefix}/news`, (c) => marketNews(c, store));
  app.get(`${prefix}/company-news`, (c) => companyNews(c, store));
}

export const contract = {
  provider: 'finnhub',
  source: 'Finnhub REST API market-news documentation and Swagger schema',
  docs: 'https://finnhub.io/docs/api/market-news',
  baseUrl: BASE_URL,
  scope: ['market-news', 'company-news'],
  fidelity: 'deterministic-subset',
};

export const plugin = {
  name: 'finnhub',
  register(app, store) {
    registerFinnhubRoutes(app, store);
    registerFinnhubRoutes(app, store, '/api/v1');
    app.get('/inspect/contract', (c) => c.json(contract));
    app.get('/inspect/state', (c) => c.json(state(store)));
  },
};

export const label = 'Finnhub API emulator';
export const endpoints = 'news, company-news';
export const initConfig = { finnhub: { token: 'finnhub-emulator-token' } };
