import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fixedNow, getState, readBody, setState } from '../scripts/provider-plugin-kit.mjs';

const STATE_KEY = 'robinhood-trading:state';
const FIXTURE_PATH = join(dirname(fileURLToPath(import.meta.url)), 'fixtures', 'sanitized.json');
const fixturePath = () => process.env.ROBINHOOD_EMULATOR_FIXTURE_PATH || FIXTURE_PATH;
const DAY_MS = 24 * 60 * 60 * 1000;
const REFRESH_TOKEN_TTL_DAYS = 7;
const EQUITY_ORDER_TYPES = ['market', 'limit', 'stop_limit'];
const OPTION_ORDER_TYPES = ['limit'];
const ROBINHOOD_TRADING_TOOLS = [
  'add_option_to_watchlist',
  'add_to_watchlist',
  'cancel_equity_order',
  'cancel_option_order',
  'create_watchlist',
  'follow_watchlist',
  'get_accounts',
  'get_equity_fundamentals',
  'get_equity_historicals',
  'get_equity_orders',
  'get_equity_positions',
  'get_equity_quotes',
  'get_equity_tradability',
  'get_index_quotes',
  'get_indexes',
  'get_option_chains',
  'get_option_instruments',
  'get_option_orders',
  'get_option_positions',
  'get_option_quotes',
  'get_option_watchlist',
  'get_popular_watchlists',
  'get_portfolio',
  'get_watchlist_items',
  'get_watchlists',
  'place_equity_order',
  'place_option_order',
  'remove_from_watchlist',
  'remove_option_from_watchlist',
  'review_equity_order',
  'review_option_order',
  'search',
  'unfollow_watchlist',
  'update_watchlist',
];

function sanitizedFixtureState() {
  try {
    return JSON.parse(readFileSync(fixturePath(), 'utf8'));
  } catch {
    return null;
  }
}

function defaultState(baseUrl = 'https://agent.robinhood.com/mcp/trading') {
  const fixture = sanitizedFixtureState();
  const defaults = {
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
    equityHistoricals: {
      AAPL: [
        { begins_at: '2025-12-29T14:30:00.000Z', open_price: '198.00', high_price: '201.50', low_price: '197.25', close_price: '200.00', volume: 42000000 },
        { begins_at: '2025-12-30T14:30:00.000Z', open_price: '200.10', high_price: '202.00', low_price: '199.10', close_price: '201.20', volume: 39000000 },
      ],
    },
    equityFundamentals: [
      {
        symbol: 'AAPL',
        instrument_id: 'instrument-aapl',
        market_cap: '3000000000000',
        pe_ratio: '31.5',
        dividend_yield: '0.005',
        description: 'Apple Inc. designs, manufactures, and markets smartphones, computers, tablets, wearables, and services.',
      },
    ],
    optionChains: {
      AAPL: {
        id: '7dd906e5-7d4b-4161-a3fe-2c3b62038482',
        underlying_symbol: 'AAPL',
        symbol: 'AAPL',
        can_open_position: true,
        expiration_dates: ['2026-01-16', '2026-02-20'],
        trade_value_multiplier: '100.0000',
        min_ticks: { above_tick: '0.05', below_tick: '0.01', cutoff_price: '3.00' },
        instruments: [
          {
            id: 'AAPL260116C00200000',
            chain_id: '7dd906e5-7d4b-4161-a3fe-2c3b62038482',
            symbol: 'AAPL',
            chain_symbol: 'AAPL',
            type: 'call',
            expiration_date: '2026-01-16',
            strike_price: '200.00',
            state: 'active',
            tradable: true,
          },
          {
            id: 'AAPL260116P00195000',
            chain_id: '7dd906e5-7d4b-4161-a3fe-2c3b62038482',
            symbol: 'AAPL',
            chain_symbol: 'AAPL',
            type: 'put',
            expiration_date: '2026-01-16',
            strike_price: '195.00',
            state: 'active',
            tradable: true,
          },
        ],
      },
    },
    optionQuotes: [
      {
        instrument_id: 'AAPL260116C00200000',
        symbol: 'AAPL',
        bid: '6.10',
        ask: '6.35',
        mark_price: '6.22',
        implied_volatility: '0.285',
        delta: '0.54',
        gamma: '0.036',
        theta: '-0.071',
        vega: '0.118',
        rho: '0.024',
        open_interest: 12450,
        volume: 980,
        updated_at: fixedNow,
      },
      {
        instrument_id: 'AAPL260116P00195000',
        symbol: 'AAPL',
        bid: '3.35',
        ask: '3.55',
        mark_price: '3.45',
        implied_volatility: '0.302',
        delta: '-0.34',
        gamma: '0.031',
        theta: '-0.052',
        vega: '0.104',
        rho: '-0.017',
        open_interest: 8420,
        volume: 610,
        updated_at: fixedNow,
      },
    ],
    optionPositions: [
      {
        id: 'opt_pos_aapl_call',
        option_id: 'AAPL260116C00200000',
        instrument_id: 'AAPL260116C00200000',
        chain_id: '7dd906e5-7d4b-4161-a3fe-2c3b62038482',
        account_number: 'RHAGENTIC001',
        symbol: 'AAPL',
        chain_symbol: 'AAPL',
        quantity: '1',
        type: 'long',
        option_type: 'call',
        expiration_date: '2026-01-16',
        side: 'long',
        average_entry_price: '5.80',
        current_price: '6.22',
        market_value: '622.00',
        unrealized_pl: '42.00',
        unrealized_pl_percent: '7.24',
      },
    ],
    optionOrders: [
      {
        id: 'rh_option_order_seed_1',
        account_number: 'RHAGENTIC001',
        option_id: 'AAPL260116C00200000',
        instrument_id: 'AAPL260116C00200000',
        chain_id: '7dd906e5-7d4b-4161-a3fe-2c3b62038482',
        chain_symbol: 'AAPL',
        symbol: 'AAPL',
        direction: 'debit',
        opening_strategy: 'long_call',
        closing_strategy: null,
        quantity: '1.00000',
        processed_quantity: '1.00000',
        price: '5.80000000',
        premium: '580.00000000',
        processed_premium: '580',
        state: 'filled',
        placed_agent: 'user',
        type: 'limit',
        created_at: '2026-01-02T15:00:00.000Z',
        updated_at: '2026-01-02T15:00:01.000Z',
        legs: [
          {
            option_id: 'AAPL260116C00200000',
            side: 'buy',
            position_effect: 'open',
            ratio_quantity: 1,
            expiration_date: '2026-01-16',
            strike_price: '200.0000',
            option_type: 'call',
          },
        ],
      },
      {
        id: 'rh_option_order_seed_2',
        account_number: 'RHAGENTIC001',
        option_id: 'AAPL260116C00200000',
        instrument_id: 'AAPL260116C00200000',
        chain_id: '7dd906e5-7d4b-4161-a3fe-2c3b62038482',
        chain_symbol: 'AAPL',
        symbol: 'AAPL',
        direction: 'credit',
        opening_strategy: null,
        closing_strategy: 'long_call',
        quantity: '1.00000',
        processed_quantity: '1.00000',
        price: '6.22000000',
        premium: '622.00000000',
        processed_premium: '622',
        state: 'filled',
        placed_agent: 'user',
        type: 'limit',
        created_at: '2026-01-05T15:00:00.000Z',
        updated_at: '2026-01-05T15:00:01.000Z',
        legs: [
          {
            option_id: 'AAPL260116C00200000',
            side: 'sell',
            position_effect: 'close',
            ratio_quantity: 1,
            expiration_date: '2026-01-16',
            strike_price: '200.0000',
            option_type: 'call',
          },
        ],
      },
    ],
    watchlists: [
      {
        id: 'watchlist-default',
        name: 'Agentic Watchlist',
        display_name: 'Agentic Watchlist',
        icon_emoji: null,
        symbols: ['AAPL'],
        currency_pair_ids: [],
        index_ids: [],
        option_ids: ['AAPL260116C00200000'],
        followed: true,
        owner_type: 'custom',
        allowed_object_types: ['instrument', 'currency_pair', 'index'],
      },
    ],
    indexes: [
      { id: 'index-spx', symbol: 'SPX', name: 'S&P 500 Index', mic: 'XSP' },
      { id: 'index-ndx', symbol: 'NDX', name: 'Nasdaq 100 Index', mic: 'XND' },
    ],
    indexQuotes: [
      { symbol: 'SPX', price: '5150.25', bid: '5150.00', ask: '5150.50', updated_at: fixedNow },
      { symbol: 'NDX', price: '18225.10', bid: '18224.75', ask: '18225.50', updated_at: fixedNow },
    ],
    currencyPairs: [
      { id: 'currency-pair-btc-usd', symbol: 'BTC-USD', name: 'Bitcoin' },
      { id: 'currency-pair-eth-usd', symbol: 'ETH-USD', name: 'Ethereum' },
    ],
    followedWatchlists: ['watchlist-default'],
    orders: [],
    nextId: 1,
    nextWatchlistId: 2,
    oauthRefreshTokens: {},
    fractionalOrderCount: 0,
    fractionalOrderLimit: 12,
  };
  return fixture ? { ...defaults, ...fixture, baseUrl } : defaults;
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
const watchlistGuide =
  "Distinguish lists by owner_type: 'custom' lists are writable with add_to_watchlist, remove_from_watchlist, and update_watchlist; Robinhood-curated lists are read-only and managed via follow_watchlist / unfollow_watchlist.";
const watchlistItemsGuide =
  'For instruments object_type=instrument and symbol is the ticker. For crypto object_type=currency_pair. The has_futures_contracts flag indicates whether futures items are present.';

function watchlistData(watchlist) {
  if (!watchlist) return null;
  const symbols = watchlist.symbols ?? [];
  const currencyPairIds = watchlist.currency_pair_ids ?? [];
  const indexIds = watchlist.index_ids ?? [];
  const optionIds = watchlist.option_ids ?? [];
  return {
    ...watchlist,
    symbols,
    currency_pair_ids: currencyPairIds,
    index_ids: indexIds,
    option_ids: optionIds,
    owner_type: watchlist.owner_type ?? 'custom',
    item_count: Number(watchlist.item_count ?? symbols.length + currencyPairIds.length + indexIds.length + optionIds.length),
    allowed_object_types: watchlist.allowed_object_types ?? ['instrument', 'currency_pair', 'index'],
  };
}

function watchlistItems(watchlist) {
  return [
    ...(watchlist?.symbols ?? []).map((symbol) => ({ type: 'equity', object_type: 'instrument', symbol })),
    ...(watchlist?.currency_pair_ids ?? []).map((objectId) => ({ type: 'crypto', object_type: 'currency_pair', object_id: objectId })),
    ...(watchlist?.index_ids ?? []).map((objectId) => ({ type: 'index', object_type: 'index', object_id: objectId })),
    ...(watchlist?.option_ids ?? []).map((instrumentId) => ({ type: 'option', object_type: 'option_strategy', instrument_id: instrumentId })),
  ];
}

function singleAssetWatchlistOperation(args) {
  const symbols = args.symbols !== undefined || args.symbol !== undefined ? requestedSymbols(args) : [];
  const currencyPairIds = requestedCurrencyPairIds(args);
  const indexIds = requestedIndexIds(args);
  if (currencyPairIds.length) {
    return { symbols: [], currency_pair_ids: currencyPairIds, index_ids: [], object_type: 'currency_pair' };
  }
  if (indexIds.length) {
    return { symbols: [], currency_pair_ids: [], index_ids: indexIds, object_type: 'index' };
  }
  return { symbols, currency_pair_ids: [], index_ids: [], object_type: 'instrument' };
}
const currentMs = () => new Date(fixedNow).getTime();
const isExpired = (isoTimestamp) => !isoTimestamp || new Date(isoTimestamp).getTime() <= currentMs();
const tokenExpiry = () => new Date(currentMs() + REFRESH_TOKEN_TTL_DAYS * DAY_MS).toISOString();

function isFractionalQuantity(quantity) {
  if (quantity === undefined || quantity === null || quantity === '') return false;
  const value = Number(quantity);
  return Number.isFinite(value) && !Number.isInteger(value);
}

function isFractionalOrder(args) {
  return isFractionalQuantity(args.quantity ?? args.qty) || args.dollar_amount !== undefined || args.notional !== undefined;
}

function requiresAgenticProfile(account) {
  return Boolean(account?.profile_required ?? account?.suitability_required ?? account?.investor_profile_required);
}

function validateTradingAccount(id, s, args) {
  const accountNumber = args.account_number ? String(args.account_number) : undefined;
  const account = accountNumber
    ? s.accounts.find((row) => String(row.account_number) === accountNumber)
    : s.accounts.find((row) => row.agentic_allowed && row.account_number);
  if (!account) return mcpError(id, 'No eligible Robinhood agentic account was found', 400);
  if (requiresAgenticProfile(account)) {
    return mcpError(id, 'Investor profile must be completed before agentic trading can place orders: robinhood://account/investor-profile', 400);
  }
  if (!account.agentic_allowed) return mcpError(id, 'Account is not enabled for agentic trading', 400);
  return null;
}

function validateOrderShape(id, args) {
  const orderType = normalizedEquityOrderType(args);
  if (!EQUITY_ORDER_TYPES.includes(orderType)) {
    return mcpError(id, `Unsupported equity order type "${args.type}"; supported order types: ${EQUITY_ORDER_TYPES.join(', ')}`, 400);
  }
  const hasLimitPrice = args.limit_price !== undefined || args.limitPrice !== undefined;
  const hasStopPrice = args.stop_price !== undefined || args.stopPrice !== undefined;
  if ((orderType === 'limit' || orderType === 'stop_limit') && !hasLimitPrice) {
    return mcpError(id, 'Limit orders require limit_price', 400);
  }
  if (orderType === 'stop_limit' && !hasStopPrice) {
    return mcpError(id, 'Stop-limit orders require stop_price', 400);
  }
  if ((orderType === 'limit' || orderType === 'stop_limit') && isFractionalQuantity(args.quantity ?? args.qty)) {
    return mcpError(id, 'Limit orders cannot include fractional share quantities; use whole-share limit orders or market dollar_amount orders', 400);
  }
  return null;
}

function validateOptionOrderShape(id, args) {
  const orderType = normalizedOptionOrderType(args);
  if (!OPTION_ORDER_TYPES.includes(orderType)) {
    return mcpError(id, `Unsupported option order type "${args.type}"; supported order types: ${OPTION_ORDER_TYPES.join(', ')}`, 400);
  }
  return null;
}

function normalizedEquityOrderType(args) {
  return String(args.type ?? 'market').trim().toLowerCase();
}

function normalizedOptionOrderType(args) {
  return String(args.type ?? 'limit').trim().toLowerCase();
}

function validateFractionalRateLimit(id, s, args) {
  if (!isFractionalOrder(args)) return null;
  if (Number(s.fractionalOrderCount ?? 0) >= Number(s.fractionalOrderLimit ?? 12)) {
    return mcpError(id, 'Fractional order rate limit exceeded; retry after the bucket resets or submit whole-share orders', 429);
  }
  return null;
}

function normalizeSymbol(value, fallback = 'AAPL') {
  return String(value ?? fallback).trim().toUpperCase();
}

function requestedSymbols(args, fallback = 'AAPL') {
  if (Array.isArray(args.symbols)) return args.symbols.map((symbol) => normalizeSymbol(symbol)).filter(Boolean);
  return String(args.symbol ?? fallback)
    .split(',')
    .map((symbol) => normalizeSymbol(symbol))
    .filter(Boolean);
}

function requestedOptionIds(args, s) {
  if (Array.isArray(args.instrument_ids)) return args.instrument_ids.map(String);
  if (Array.isArray(args.instrumentIds)) return args.instrumentIds.map(String);
  if (args.instrument_id) return [String(args.instrument_id)];
  if (args.instrumentId) return [String(args.instrumentId)];
  if (Array.isArray(args.ids)) return args.ids.map(String);
  if (Array.isArray(args.option_ids)) return args.option_ids.map(String);
  if (Array.isArray(args.optionIds)) return args.optionIds.map(String);
  if (args.option_ids) return splitList(args.option_ids);
  if (args.option_id) return splitList(args.option_id);
  if (args.optionId) return [String(args.optionId)];
  const symbols = new Set(requestedSymbols(args));
  return s.optionQuotes.filter((quote) => symbols.has(normalizeSymbol(quote.symbol))).map((quote) => quote.instrument_id ?? quote.option_id);
}

function requestedExplicitOptionIds(args) {
  if (Array.isArray(args.instrument_ids)) return args.instrument_ids.map(String);
  if (Array.isArray(args.instrumentIds)) return args.instrumentIds.map(String);
  if (args.instrument_ids) return splitList(args.instrument_ids);
  if (args.instrument_id) return splitList(args.instrument_id);
  if (args.instrumentId) return [String(args.instrumentId)];
  if (Array.isArray(args.option_ids)) return args.option_ids.map(String);
  if (Array.isArray(args.optionIds)) return args.optionIds.map(String);
  if (args.option_ids) return splitList(args.option_ids);
  if (args.option_id) return splitList(args.option_id);
  if (args.optionId) return [String(args.optionId)];
  return [];
}

function requestedCurrencyPairIds(args) {
  if (Array.isArray(args.currency_pair_ids)) return args.currency_pair_ids.map(String);
  if (Array.isArray(args.currencyPairIds)) return args.currencyPairIds.map(String);
  if (args.currency_pair_ids) return splitList(args.currency_pair_ids);
  if (args.currency_pair_id) return splitList(args.currency_pair_id);
  if (args.currencyPairId) return [String(args.currencyPairId)];
  return [];
}

function requestedIndexIds(args) {
  if (Array.isArray(args.index_ids)) return args.index_ids.map(String);
  if (Array.isArray(args.indexIds)) return args.indexIds.map(String);
  if (args.index_ids) return splitList(args.index_ids);
  if (args.index_id) return splitList(args.index_id);
  if (args.indexId) return [String(args.indexId)];
  return [];
}

function splitList(value) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (value === undefined || value === null || value === '') return [];
  return String(value).split(',').map((item) => item.trim()).filter(Boolean);
}

function allOptionChains(s) {
  return Object.values(s.optionChains ?? {}).map(({ instruments, contracts, expirations, ...chain }) => ({
    ...chain,
    expiration_dates: chain.expiration_dates ?? expirations ?? [],
  }));
}

function allOptionInstruments(s) {
  return Object.values(s.optionChains ?? {}).flatMap((chain) => chain.instruments ?? chain.contracts ?? []);
}

function requestedExpirationDates(args) {
  const value = args.expiration_dates ?? args.expirationDates ?? args.expiration_date ?? args.expirationDate;
  if (Array.isArray(value)) return value.map(String);
  if (value) return String(value).split(',').map((date) => date.trim()).filter(Boolean);
  return [];
}

function requestedChainIds(args) {
  if (Array.isArray(args.chain_ids)) return args.chain_ids.map(String);
  if (Array.isArray(args.chainIds)) return args.chainIds.map(String);
  if (Array.isArray(args.ids)) return args.ids.map(String);
  if (args.chain_ids) return splitList(args.chain_ids);
  if (args.chain_id) return [String(args.chain_id)];
  if (args.chainId) return [String(args.chainId)];
  if (args.id) return [String(args.id)];
  return [];
}

function filteredOptionChains(s, args) {
  const chainIds = new Set(requestedChainIds(args));
  const symbol = args.underlying_symbol ?? args.underlyingSymbol ?? args.symbol;
  const normalizedSymbol = symbol ? normalizeSymbol(symbol) : null;
  return allOptionChains(s).filter(
    (chain) =>
      (!chainIds.size || chainIds.has(String(chain.id))) &&
      (!normalizedSymbol || normalizeSymbol(chain.underlying_symbol ?? chain.symbol) === normalizedSymbol),
  );
}

function filteredOptionInstruments(s, args) {
  const chainIds = new Set(requestedChainIds(args));
  const instrumentIds = new Set(requestedOptionIds(args, s));
  const expirations = new Set(requestedExpirationDates(args));
  const chainSymbol = args.chain_symbol ?? args.chainSymbol ?? args.underlying_symbol ?? args.underlyingSymbol ?? args.symbol;
  const normalizedChainSymbol = chainSymbol ? normalizeSymbol(chainSymbol) : null;
  const type = args.type ? String(args.type).toLowerCase() : null;
  const state = args.state ? String(args.state).toLowerCase() : null;
  const strikePrice = args.strike_price ?? args.strikePrice;
  return allOptionInstruments(s).filter((instrument) => {
    const instrumentId = String(instrument.id ?? instrument.instrument_id ?? instrument.option_id);
    return (
      (!chainIds.size || chainIds.has(String(instrument.chain_id))) &&
      (!instrumentIds.size || instrumentIds.has(instrumentId)) &&
      (!expirations.size || expirations.has(String(instrument.expiration_date))) &&
      (!normalizedChainSymbol || normalizeSymbol(instrument.chain_symbol ?? instrument.symbol) === normalizedChainSymbol) &&
      (!type || String(instrument.type).toLowerCase() === type) &&
      (!state || String(instrument.state ?? 'active').toLowerCase() === state) &&
      (strikePrice === undefined || String(instrument.strike_price) === String(strikePrice))
    );
  });
}

function dateMs(value) {
  if (!value) return null;
  const text = String(value);
  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(text) ? `${text}T00:00:00.000Z` : text;
  const timestamp = new Date(normalized).getTime();
  return Number.isFinite(timestamp) ? timestamp : null;
}

function optionOrderChainId(order) {
  return String(order.chain_id ?? order.legs?.[0]?.chain_id ?? '');
}

function optionOrderOptionId(order) {
  return String(order.option_id ?? order.instrument_id ?? order.legs?.[0]?.option_id ?? '');
}

function optionPositionOptionId(position) {
  return String(position.option_id ?? position.instrument_id ?? '');
}

function filteredOptionOrders(s, args) {
  const accountNumber = String(args.account_number ?? '');
  const orderId = args.order_id ?? args.id;
  const state = args.state ? String(args.state).toLowerCase() : null;
  const chainIds = new Set(requestedChainIds(args));
  const createdAtGte = dateMs(args.created_at_gte);
  const underlyingType = args.underlying_type ? String(args.underlying_type).toLowerCase() : null;
  const placedAgent = args.placed_agent ? String(args.placed_agent).toLowerCase() : null;
  return (s.optionOrders ?? []).filter((order) => {
    const createdAt = dateMs(order.created_at ?? order.submitted_at);
    return (
      (!accountNumber || String(order.account_number) === accountNumber) &&
      (!orderId || String(order.id) === String(orderId)) &&
      (!state || String(order.state ?? order.status).toLowerCase() === state) &&
      (!chainIds.size || chainIds.has(optionOrderChainId(order))) &&
      (createdAtGte === null || (createdAt !== null && createdAt >= createdAtGte)) &&
      (!underlyingType || String(order.underlying_type ?? 'equity').toLowerCase() === underlyingType) &&
      (!placedAgent || String(order.placed_agent ?? 'user').toLowerCase() === placedAgent)
    );
  });
}

function filteredOptionPositions(s, args) {
  const accountNumber = String(args.account_number ?? '');
  const chainIds = new Set(requestedChainIds(args));
  const optionIds = new Set(requestedExplicitOptionIds(args));
  const type = args.type ? String(args.type).toLowerCase() : null;
  const optionType = args.option_type ? String(args.option_type).toLowerCase() : null;
  const expirationDate = args.expiration_date ? String(args.expiration_date) : null;
  const expirationDateGte = args.expiration_date_gte ? String(args.expiration_date_gte) : null;
  const expirationDateLte = args.expiration_date_lte ? String(args.expiration_date_lte) : null;
  const nonzero = args.nonzero === true || args.nonzero === 'true';
  return (s.optionPositions ?? []).filter((position) => {
    const quantity = Number(position.quantity ?? 0);
    const positionType = String(position.type ?? position.side ?? '').toLowerCase();
    return (
      (!accountNumber || String(position.account_number) === accountNumber) &&
      (!chainIds.size || chainIds.has(String(position.chain_id))) &&
      (!optionIds.size || optionIds.has(optionPositionOptionId(position))) &&
      (!type || positionType === type) &&
      (!optionType || String(position.option_type ?? position.type).toLowerCase() === optionType) &&
      (!expirationDate || String(position.expiration_date) === expirationDate) &&
      (!expirationDateGte || String(position.expiration_date) >= expirationDateGte) &&
      (!expirationDateLte || String(position.expiration_date) <= expirationDateLte) &&
      (!nonzero || quantity !== 0)
    );
  });
}

function findWatchlist(s, args) {
  const watchlistId = args.list_id ?? args.listId ?? args.watchlist_id ?? args.watchlistId ?? args.id;
  if (watchlistId) return s.watchlists.find((watchlist) => watchlist.id === String(watchlistId));
  const name = args.display_name ?? args.displayName ?? args.name;
  const normalizedName = name ? String(name).toLowerCase() : '';
  if (normalizedName) {
    return s.watchlists.find(
      (watchlist) =>
        String(watchlist.display_name ?? watchlist.name).toLowerCase() === normalizedName ||
        String(watchlist.name ?? '').toLowerCase() === normalizedName,
    );
  }
  return s.watchlists[0];
}

function upsertIntoArray(values, additions) {
  return [...new Set([...(values ?? []), ...additions])];
}

function removeFromArray(values, removals) {
  const blocked = new Set(removals);
  return (values ?? []).filter((value) => !blocked.has(value));
}

function optionOrder(id, s, args, status = 'accepted') {
  const instrumentId = args.instrument_id ?? args.instrumentId ?? args.option_id ?? args.optionId ?? 'AAPL260116C00200000';
  const chainId = args.chain_id ?? args.chainId ?? '7dd906e5-7d4b-4161-a3fe-2c3b62038482';
  const quantity = args.quantity ?? args.qty ?? '1';
  const side = args.side ?? 'buy';
  const positionEffect = args.position_effect ?? args.positionEffect ?? 'open';
  const price = args.limit_price ?? args.limitPrice ?? args.price ?? '6.25';
  const processedPremium = (Number(quantity) * Number(price) * 100).toFixed(2);
  return {
    id: `rh_option_order_${String(s.nextId++).padStart(6, '0')}`,
    account_number: args.account_number ?? 'RHAGENTIC001',
    option_id: instrumentId,
    instrument_id: instrumentId,
    chain_id: chainId,
    chain_symbol: normalizeSymbol(args.chain_symbol ?? args.chainSymbol ?? args.symbol),
    symbol: normalizeSymbol(args.symbol),
    direction: side === 'sell' ? 'credit' : 'debit',
    opening_strategy: positionEffect === 'open' ? 'long_call' : null,
    closing_strategy: positionEffect === 'close' ? 'long_call' : null,
    quantity,
    processed_quantity: quantity,
    price: String(price),
    premium: processedPremium,
    processed_premium: processedPremium,
    state: status,
    placed_agent: 'agent',
    type: normalizedOptionOrderType(args),
    limit_price: args.limit_price ?? args.limitPrice ?? '6.25',
    status,
    created_at: fixedNow,
    updated_at: fixedNow,
    submitted_at: fixedNow,
    legs: [
      {
        option_id: instrumentId,
        chain_id: chainId,
        side,
        position_effect: positionEffect,
        ratio_quantity: 1,
        expiration_date: args.expiration_date ?? '2026-01-16',
        strike_price: args.strike_price ?? '200.0000',
        option_type: args.option_type ?? args.optionType ?? 'call',
      },
    ],
  };
}

export function seedFromConfig(store, baseUrl = 'https://agent.robinhood.com/mcp/trading', config = {}) {
  return save(store, { ...defaultState(baseUrl), ...config });
}

export const contract = {
  provider: 'robinhood-trading',
  source: 'Robinhood Agentic Trading MCP documentation-informed subset plus observed read-only Streamable HTTP MCP contract, 2026-06-12',
  docs: 'https://robinhood.com/us/en/support/articles/trading-with-your-agent/',
  mcpUrl: 'https://agent.robinhood.com/mcp/trading',
  oauth: {
    authorizePath: '/oauth/authorize',
    tokenPath: '/oauth/token',
  },
  scope: [
    ...ROBINHOOD_TRADING_TOOLS,
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
      if (grantType === 'refresh_token') {
        const refreshToken = String(body.refresh_token ?? '');
        const savedRefreshToken = s.oauthRefreshTokens?.[refreshToken];
        if (!savedRefreshToken || isExpired(savedRefreshToken.expires_at)) return c.json({ error: 'invalid_grant' }, 400);
      }
      const agenticAccount = s.accounts.find((account) => account.agentic_allowed && account.account_number) ?? s.accounts[0];
      const nextRefreshToken = token('rh-refresh');
      s.oauthRefreshTokens = {
        ...(s.oauthRefreshTokens ?? {}),
        [nextRefreshToken]: {
          issued_at: fixedNow,
          expires_at: tokenExpiry(),
          account_id: agenticAccount?.account_number ?? null,
        },
      };
      save(store, s);
      return c.json({
        access_token: token('rh-access'),
        refresh_token: nextRefreshToken,
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
          const symbols = requestedSymbols(args);
          return c.json(mcpResult(id, { quotes: s.quotes.filter((quote) => symbols.includes(quote.symbol)) }));
        }
        case 'get_equity_historicals': {
          const symbols = requestedSymbols(args);
          return c.json(
            mcpResult(id, {
              historicals: Object.fromEntries(symbols.map((symbol) => [symbol, s.equityHistoricals?.[symbol] ?? []])),
              interval: args.interval ?? 'day',
              span: args.span ?? 'week',
            }),
          );
        }
        case 'get_equity_fundamentals': {
          const symbols = requestedSymbols(args);
          return c.json(mcpResult(id, { fundamentals: (s.equityFundamentals ?? []).filter((row) => symbols.includes(row.symbol)) }));
        }
        case 'get_equity_orders':
          return c.json(mcpResult(id, { orders: s.orders }));
        case 'get_equity_tradability':
          return c.json(mcpResult(id, { symbol: args.symbol ?? 'AAPL', tradable: true, fractionally_tradable: true }));
        case 'get_indexes':
          return c.json(mcpResult(id, { indexes: s.indexes ?? [] }));
        case 'get_index_quotes': {
          const symbols = requestedSymbols(args, 'SPX');
          return c.json(mcpResult(id, { quotes: (s.indexQuotes ?? []).filter((quote) => symbols.includes(quote.symbol)) }));
        }
        case 'review_equity_order': {
          const accountError = validateTradingAccount(id, s, args);
          if (accountError) return c.json(accountError.payload, accountError.status);
          const shapeError = validateOrderShape(id, args);
          if (shapeError) return c.json(shapeError.payload, shapeError.status);
          return c.json(mcpResult(id, { accepted: true, warnings: [], estimated_price: '200.00', estimated_notional: args.notional ?? null }));
        }
        case 'place_equity_order': {
          const accountError = validateTradingAccount(id, s, args);
          if (accountError) return c.json(accountError.payload, accountError.status);
          const shapeError = validateOrderShape(id, args);
          if (shapeError) return c.json(shapeError.payload, shapeError.status);
          const rateLimitError = validateFractionalRateLimit(id, s, args);
          if (rateLimitError) return c.json(rateLimitError.payload, rateLimitError.status);
          if (isFractionalOrder(args)) s.fractionalOrderCount = Number(s.fractionalOrderCount ?? 0) + 1;
          const order = {
            id: `rh_order_${String(s.nextId++).padStart(6, '0')}`,
            symbol: args.symbol ?? 'AAPL',
            side: args.side ?? 'buy',
            quantity: args.quantity ?? args.qty ?? '1',
            dollar_amount: args.dollar_amount,
            notional: args.notional,
            type: normalizedEquityOrderType(args),
            limit_price: args.limit_price ?? args.limitPrice,
            stop_price: args.stop_price ?? args.stopPrice,
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
        case 'get_option_chains':
          return c.json(mcpResult(id, { chains: filteredOptionChains(s, args) }));
        case 'get_option_instruments':
          return c.json(mcpResult(id, { instruments: filteredOptionInstruments(s, args) }));
        case 'get_option_quotes': {
          const optionIds = new Set(requestedOptionIds(args, s));
          return c.json(
            mcpResult(id, {
              quotes: s.optionQuotes.filter((quote) => optionIds.has(quote.instrument_id ?? quote.option_id)),
            }),
          );
        }
        case 'get_option_positions':
          return c.json(mcpResult(id, { positions: filteredOptionPositions(s, args), next: null }));
        case 'get_option_orders':
          return c.json(mcpResult(id, { orders: filteredOptionOrders(s, args), next: null }));
        case 'get_option_watchlist': {
          const watchlist = findWatchlist(s, args);
          const optionIds = new Set(watchlist?.option_ids ?? []);
          return c.json(
            mcpResult(id, {
              watchlist: watchlist ?? null,
              options: s.optionQuotes.filter((quote) => optionIds.has(quote.instrument_id ?? quote.option_id)),
            }),
          );
        }
        case 'get_popular_watchlists':
          return c.json(
            mcpResult(id, {
              watchlists: [
                { id: 'popular-tech', display_name: 'Popular Tech', symbols: ['AAPL', 'MSFT', 'NVDA'], followed: false },
                { id: 'popular-indexes', display_name: 'Major Indexes', symbols: ['SPX', 'NDX'], followed: false },
              ],
            }),
          );
        case 'review_option_order': {
          const accountError = validateTradingAccount(id, s, args);
          if (accountError) return c.json(accountError.payload, accountError.status);
          const shapeError = validateOptionOrderShape(id, args);
          if (shapeError) return c.json(shapeError.payload, shapeError.status);
          return c.json(mcpResult(id, { accepted: true, warnings: [], estimated_price: args.limit_price ?? '6.25', estimated_notional: '625.00' }));
        }
        case 'place_option_order': {
          const accountError = validateTradingAccount(id, s, args);
          if (accountError) return c.json(accountError.payload, accountError.status);
          const shapeError = validateOptionOrderShape(id, args);
          if (shapeError) return c.json(shapeError.payload, shapeError.status);
          const order = optionOrder(id, s, args);
          s.optionOrders.push(order);
          save(store, s);
          return c.json(mcpResult(id, order));
        }
        case 'cancel_option_order': {
          const order = s.optionOrders.find((row) => row.id === args.order_id || row.id === args.id);
          if (order) order.status = 'canceled';
          save(store, s);
          return c.json(mcpResult(id, { id: args.order_id ?? args.id, status: order ? 'canceled' : 'not_found' }));
        }
        case 'get_watchlists':
          return c.json(mcpResult(id, { data: { watchlists: s.watchlists.map(watchlistData) }, guide: watchlistGuide }));
        case 'get_watchlist_items': {
          const watchlist = findWatchlist(s, args);
          return c.json(
            mcpResult(id, {
              data: { items: watchlistItems(watchlist), has_futures_contracts: false },
              guide: watchlistItemsGuide,
            }),
          );
        }
        case 'create_watchlist': {
          const displayName = String(args.display_name ?? args.displayName ?? args.name ?? 'New Watchlist');
          const watchlist = {
            id: `watchlist-${String(s.nextWatchlistId++).padStart(3, '0')}`,
            name: displayName,
            display_name: displayName,
            icon_emoji: args.icon_emoji ?? args.iconEmoji ?? null,
            display_description: args.display_description ?? args.displayDescription ?? null,
            symbols: [],
            currency_pair_ids: [],
            index_ids: [],
            option_ids: [],
            followed: false,
            owner_type: 'custom',
            allowed_object_types: ['instrument', 'currency_pair', 'index'],
          };
          s.watchlists.push(watchlist);
          save(store, s);
          return c.json(
            mcpResult(id, {
              data: { watchlist: watchlistData(watchlist) },
              guide: 'On success the response includes the new list_id; pass it to add_to_watchlist to populate the list.',
            }),
          );
        }
        case 'update_watchlist': {
          const watchlist = findWatchlist(s, args);
          if (!watchlist) return c.json(mcpError(id, 'Watchlist not found', 404).payload, 404);
          const displayName = args.display_name ?? args.displayName ?? args.name;
          if (displayName) {
            watchlist.name = String(displayName);
            watchlist.display_name = String(displayName);
          }
          if (args.icon_emoji !== undefined || args.iconEmoji !== undefined) watchlist.icon_emoji = args.icon_emoji ?? args.iconEmoji;
          if (args.display_description !== undefined || args.displayDescription !== undefined) {
            watchlist.display_description = args.display_description ?? args.displayDescription;
          }
          if (Array.isArray(args.symbols)) watchlist.symbols = requestedSymbols(args, '');
          if (Array.isArray(args.currency_pair_ids) || Array.isArray(args.currencyPairIds)) watchlist.currency_pair_ids = requestedCurrencyPairIds(args);
          if (Array.isArray(args.index_ids) || Array.isArray(args.indexIds)) watchlist.index_ids = requestedIndexIds(args);
          if (Array.isArray(args.option_ids) || Array.isArray(args.optionIds)) watchlist.option_ids = requestedOptionIds(args, s);
          save(store, s);
          return c.json(mcpResult(id, { data: { watchlist: watchlistData(watchlist) }, guide: 'On success the response contains the full updated list.' }));
        }
        case 'add_to_watchlist': {
          const watchlist = findWatchlist(s, args);
          if (!watchlist) return c.json(mcpError(id, 'Watchlist not found', 404).payload, 404);
          const operation = singleAssetWatchlistOperation(args);
          watchlist.symbols = upsertIntoArray(watchlist.symbols, operation.symbols);
          watchlist.currency_pair_ids = upsertIntoArray(watchlist.currency_pair_ids, operation.currency_pair_ids);
          watchlist.index_ids = upsertIntoArray(watchlist.index_ids, operation.index_ids);
          save(store, s);
          return c.json(
            mcpResult(id, {
              data: { ...operation, list_id: watchlist.id, operation: 'create', status: 'ok' },
              guide: 'On success the response echoes the operations applied.',
            }),
          );
        }
        case 'add_option_to_watchlist': {
          const watchlist = findWatchlist(s, args);
          if (!watchlist) return c.json(mcpError(id, 'Watchlist not found', 404).payload, 404);
          watchlist.option_ids = upsertIntoArray(watchlist.option_ids, requestedOptionIds(args, s));
          save(store, s);
          return c.json(
            mcpResult(id, {
              data: {
                option_ids: requestedOptionIds(args, s),
                position_type: args.position_type ?? args.positionType ?? 'long',
                list_id: watchlist.id,
                operation: 'create',
                status: 'ok',
              },
              guide: 'Each option_id is added as a single-leg position with the supplied position_type.',
            }),
          );
        }
        case 'remove_from_watchlist': {
          const watchlist = findWatchlist(s, args);
          if (!watchlist) return c.json(mcpError(id, 'Watchlist not found', 404).payload, 404);
          const operation = singleAssetWatchlistOperation(args);
          watchlist.symbols = removeFromArray(watchlist.symbols, operation.symbols);
          watchlist.currency_pair_ids = removeFromArray(watchlist.currency_pair_ids, operation.currency_pair_ids);
          watchlist.index_ids = removeFromArray(watchlist.index_ids, operation.index_ids);
          save(store, s);
          return c.json(
            mcpResult(id, {
              data: { ...operation, list_id: watchlist.id, operation: 'delete', status: 'ok' },
              guide: 'On success the response echoes the operations applied.',
            }),
          );
        }
        case 'remove_option_from_watchlist': {
          const watchlist = findWatchlist(s, args);
          if (!watchlist) return c.json(mcpError(id, 'Watchlist not found', 404).payload, 404);
          const optionIds = requestedOptionIds(args, s);
          watchlist.option_ids = removeFromArray(watchlist.option_ids, optionIds);
          save(store, s);
          return c.json(
            mcpResult(id, {
              data: {
                option_ids: optionIds,
                position_type: args.position_type ?? args.positionType ?? 'long',
                list_id: watchlist.id,
                operation: 'delete',
                status: 'ok',
              },
              guide: 'Contracts not on the list are no-ops.',
            }),
          );
        }
        case 'follow_watchlist': {
          const watchlist = findWatchlist(s, args);
          if (!watchlist) return c.json(mcpError(id, 'Watchlist not found', 404).payload, 404);
          watchlist.followed = true;
          s.followedWatchlists = upsertIntoArray(s.followedWatchlists, [watchlist.id]);
          save(store, s);
          return c.json(
            mcpResult(id, {
              data: {
                follower: { list_id: watchlist.id, user_id: 'user-emulator', owner_type: watchlist.owner_type ?? 'custom', created_at: fixedNow },
                list_id: watchlist.id,
                action: 'followed',
                status: 'ok',
              },
              guide: 'Use only for curated lists; the user already owns their custom lists.',
            }),
          );
        }
        case 'unfollow_watchlist': {
          const watchlist = findWatchlist(s, args);
          if (!watchlist) return c.json(mcpError(id, 'Watchlist not found', 404).payload, 404);
          watchlist.followed = false;
          s.followedWatchlists = removeFromArray(s.followedWatchlists, [watchlist.id]);
          save(store, s);
          return c.json(mcpResult(id, { data: { list_id: watchlist.id, action: 'unfollowed', status: 'ok' }, guide: "404 means the user wasn't following that list." }));
        }
        case 'search': {
          const query = String(args.query ?? '').toLowerCase();
          const assetType = String(args.asset_type ?? args.assetType ?? 'instrument');
          if (assetType === 'currency_pair') {
            const currencyPairs = (s.currencyPairs ?? []).filter((row) => `${row.symbol} ${row.name}`.toLowerCase().includes(query));
            return c.json(mcpResult(id, { currency_pairs: currencyPairs.length ? currencyPairs : s.currencyPairs ?? [] }));
          }
          if (assetType === 'market_index') {
            const marketIndexes = (s.indexes ?? []).filter((row) => `${row.symbol} ${row.name}`.toLowerCase().includes(query));
            return c.json(mcpResult(id, { market_indexes: marketIndexes.length ? marketIndexes : s.indexes ?? [] }));
          }
          return c.json(mcpResult(id, { results: [{ instrument_id: 'instrument-aapl', symbol: 'AAPL', name: 'Apple Inc.' }] }));
        }
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
