import { registerRoutes } from './src/routes/http.mjs';

export const contract = {
  provider: 'polymarket',
  source: 'Official @polymarket/client@0.10.0 and jsj/polymarket-cli@8e8f8c0c5b4714b4098c73946f2ef0de3e012488 (official Rust SDK v0.5.1; local host override patch)',
  docs: 'https://docs.polymarket.com',
  scope: ['gamma-markets', 'gamma-events', 'gamma-search', 'clob-prices', 'clob-orderbooks', 'clob-resting-orders', 'data-position-fixtures'],
  fidelity: 'sdk-tested-rest-subset',
};

export const plugin = {
  name: 'polymarket',
  register(app, store) {
    registerRoutes(app, store);
  },
};

export const label = 'Polymarket Gamma, CLOB and Data API emulator';
export const endpoints = 'gamma markets/events/search, clob books/prices/orders, data positions/value';
export const initConfig = { polymarket: {} };
