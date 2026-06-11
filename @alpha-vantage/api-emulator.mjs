import { getState, setState } from '../scripts/provider-plugin-kit.mjs';

const STATE_KEY = 'alpha-vantage:state';
const BASE_URL = 'https://www.alphavantage.co';

const quote = (symbol, values = {}) => ({
  '01. symbol': symbol,
  '02. open': values.open ?? '273.8200',
  '03. high': values.high ?? '280.5100',
  '04. low': values.low ?? '271.3300',
  '05. price': values.price ?? '272.3600',
  '06. volume': values.volume ?? '5497137',
  '07. latest trading day': values.latestTradingDay ?? '2026-06-10',
  '08. previous close': values.previousClose ?? '277.4900',
  '09. change': values.change ?? '-5.1300',
  '10. change percent': values.changePercent ?? '-1.8487%',
});

const dailySeries = (symbol, rows = {}) => ({
  'Meta Data': {
    '1. Information': 'Daily Prices (open, high, low, close) and Volumes',
    '2. Symbol': symbol,
    '3. Last Refreshed': '2026-06-10',
    '4. Output Size': 'Compact',
    '5. Time Zone': 'US/Eastern',
  },
  'Time Series (Daily)': {
    '2026-06-10': {
      '1. open': '273.8200',
      '2. high': '280.5100',
      '3. low': '271.3300',
      '4. close': '272.3600',
      '5. volume': '5497137',
    },
    '2026-06-09': {
      '1. open': '284.4200',
      '2. high': '286.9100',
      '3. low': '276.2100',
      '4. close': '277.4900',
      '5. volume': '4219108',
    },
    ...rows,
  },
});

function defaultState(baseUrl = BASE_URL) {
  return {
    baseUrl,
    acceptedApiKeys: ['alpha-vantage-emulator-key', 'demo'],
    requests: [],
    quotes: {
      IBM: quote('IBM'),
      AAPL: quote('AAPL', {
        open: '203.5000',
        high: '205.3400',
        low: '201.1100',
        price: '204.7500',
        volume: '46298122',
        previousClose: '202.6700',
        change: '2.0800',
        changePercent: '1.0263%',
      }),
      MSFT: quote('MSFT', {
        open: '477.1600',
        high: '481.0000',
        low: '472.9800',
        price: '478.2400',
        volume: '18954012',
        previousClose: '475.9200',
        change: '2.3200',
        changePercent: '0.4875%',
      }),
    },
    daily: {
      IBM: dailySeries('IBM'),
      AAPL: dailySeries('AAPL', {
        '2026-06-10': {
          '1. open': '203.5000',
          '2. high': '205.3400',
          '3. low': '201.1100',
          '4. close': '204.7500',
          '5. volume': '46298122',
        },
      }),
    },
    matches: [
      {
        '1. symbol': 'TSCO.LON',
        '2. name': 'Tesco PLC',
        '3. type': 'Equity',
        '4. region': 'United Kingdom',
        '5. marketOpen': '08:00',
        '6. marketClose': '16:30',
        '7. timezone': 'UTC+01',
        '8. currency': 'GBX',
        '9. matchScore': '0.7273',
      },
      {
        '1. symbol': 'TSCDF',
        '2. name': 'Tesco PLC',
        '3. type': 'Equity',
        '4. region': 'United States',
        '5. marketOpen': '09:30',
        '6. marketClose': '16:00',
        '7. timezone': 'UTC-04',
        '8. currency': 'USD',
        '9. matchScore': '0.7143',
      },
      {
        '1. symbol': 'IBM',
        '2. name': 'International Business Machines Corp',
        '3. type': 'Equity',
        '4. region': 'United States',
        '5. marketOpen': '09:30',
        '6. marketClose': '16:00',
        '7. timezone': 'UTC-04',
        '8. currency': 'USD',
        '9. matchScore': '1.0000',
      },
    ],
    markets: [
      {
        market_type: 'Equity',
        region: 'United States',
        primary_exchanges: 'NASDAQ, NYSE, AMEX',
        local_open: '09:30',
        local_close: '16:00',
        current_status: 'open',
        notes: 'Regular trading hours',
      },
      {
        market_type: 'Equity',
        region: 'United Kingdom',
        primary_exchanges: 'London Stock Exchange',
        local_open: '08:00',
        local_close: '16:30',
        current_status: 'closed',
        notes: 'Regular trading hours',
      },
      {
        market_type: 'Forex',
        region: 'Global',
        primary_exchanges: 'Global forex market',
        local_open: '00:00',
        local_close: '23:59',
        current_status: 'open',
        notes: 'Forex market is open 24 hours on weekdays',
      },
    ],
  };
}

const state = (store) => getState(store, STATE_KEY, () => defaultState());
const save = (store, next) => setState(store, STATE_KEY, next);

export function seedFromConfig(store, baseUrl = BASE_URL, config = {}) {
  const seeded = defaultState(baseUrl);
  return save(store, {
    ...seeded,
    ...config,
    acceptedApiKeys: config.acceptedApiKeys ?? seeded.acceptedApiKeys,
    quotes: { ...seeded.quotes, ...(config.quotes ?? {}) },
    daily: { ...seeded.daily, ...(config.daily ?? {}) },
    matches: config.matches ?? seeded.matches,
    markets: config.markets ?? seeded.markets,
  });
}

function query(c, name, fallback = '') {
  return c.req.query?.(name) ?? fallback;
}

function alphaError(c, message, status = 200) {
  return c.json({ 'Error Message': message }, status);
}

function information(c, message) {
  return c.json({ Information: message });
}

function requireApiKey(c, current) {
  const apiKey = query(c, 'apikey');
  if (apiKey && current.acceptedApiKeys.includes(apiKey)) return null;
  return alphaError(
    c,
    'the parameter apikey is invalid or missing. Please claim your free API key on (https://www.alphavantage.co/support/#api-key). It should take less than 20 seconds.',
  );
}

function record(current, functionName, params = {}) {
  current.requests.push({ function: functionName, params, requestedAt: new Date().toISOString() });
}

function globalQuote(c, store, current) {
  const symbol = query(c, 'symbol').toUpperCase();
  if (!symbol) return alphaError(c, 'Invalid API call. Please retry or visit the documentation (https://www.alphavantage.co/documentation/) for GLOBAL_QUOTE.');
  record(current, 'GLOBAL_QUOTE', { symbol });
  save(store, current);
  return c.json({ 'Global Quote': current.quotes[symbol] ?? quote(symbol) });
}

function timeSeriesDaily(c, store, current) {
  const symbol = query(c, 'symbol').toUpperCase();
  if (!symbol) return alphaError(c, 'Invalid API call. Please retry or visit the documentation (https://www.alphavantage.co/documentation/) for TIME_SERIES_DAILY.');
  record(current, 'TIME_SERIES_DAILY', { symbol, outputsize: query(c, 'outputsize', 'compact') });
  save(store, current);
  return c.json(current.daily[symbol] ?? dailySeries(symbol));
}

function symbolSearch(c, store, current) {
  const keywords = query(c, 'keywords').trim().toLowerCase();
  if (!keywords) return alphaError(c, 'Invalid API call. Please retry or visit the documentation (https://www.alphavantage.co/documentation/) for SYMBOL_SEARCH.');
  record(current, 'SYMBOL_SEARCH', { keywords });
  save(store, current);
  const bestMatches = current.matches.filter((match) => {
    const symbol = match['1. symbol'].toLowerCase();
    const name = match['2. name'].toLowerCase();
    return symbol.includes(keywords) || name.includes(keywords);
  });
  return c.json({ bestMatches });
}

function marketStatus(c, store, current) {
  record(current, 'MARKET_STATUS');
  save(store, current);
  return c.json({ endpoint: 'Global Market Open & Close Status', markets: current.markets });
}

function queryEndpoint(c, store) {
  const current = state(store);
  const auth = requireApiKey(c, current);
  if (auth) return auth;

  const functionName = query(c, 'function').toUpperCase();
  if (functionName === 'GLOBAL_QUOTE') return globalQuote(c, store, current);
  if (functionName === 'TIME_SERIES_DAILY') return timeSeriesDaily(c, store, current);
  if (functionName === 'SYMBOL_SEARCH') return symbolSearch(c, store, current);
  if (functionName === 'MARKET_STATUS') return marketStatus(c, store, current);

  if (!functionName) {
    return alphaError(c, 'Invalid API call. Please retry or visit the documentation (https://www.alphavantage.co/documentation/) for the API function parameter.');
  }

  return information(
    c,
    `The Alpha Vantage API emulator has no fixture for function=${functionName}. Supported functions: GLOBAL_QUOTE, TIME_SERIES_DAILY, SYMBOL_SEARCH, MARKET_STATUS.`,
  );
}

export const contract = {
  provider: 'alpha-vantage',
  source: 'Alpha Vantage API documentation and public response examples',
  docs: 'https://www.alphavantage.co/documentation/',
  baseUrl: BASE_URL,
  scope: ['global-quote', 'time-series-daily', 'symbol-search', 'market-status'],
  fidelity: 'deterministic-subset',
};

export const plugin = {
  name: 'alpha-vantage',
  register(app, store) {
    app.get('/query', (c) => queryEndpoint(c, store));
    app.get('/inspect/contract', (c) => c.json(contract));
    app.get('/inspect/state', (c) => c.json(state(store)));
  },
};

export const label = 'Alpha Vantage API emulator';
export const endpoints = 'query?function=GLOBAL_QUOTE|TIME_SERIES_DAILY|SYMBOL_SEARCH|MARKET_STATUS';
export const initConfig = { 'alpha-vantage': { apiKey: 'alpha-vantage-emulator-key' } };

export default plugin;
