import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fixedNow } from '../../scripts/provider-plugin-kit.mjs';

const PROVIDER_DIR = dirname(dirname(fileURLToPath(import.meta.url)));
const RAW_DIR = resolve(process.argv[2] ?? join(PROVIDER_DIR, '..', '..', '.emu', 'robinhood-trading', 'raw', 'latest'));
const OUT_PATH = resolve(process.argv[3] ?? join(PROVIDER_DIR, 'fixtures', 'sanitized.json'));

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function parseMaybeJson(value) {
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function structuredPayload(raw) {
  const result = raw?.result ?? raw;
  if (result?.data !== undefined) return result.data;
  if (result?.structuredContent !== undefined) return result.structuredContent;
  const text = result?.content?.find?.((block) => block?.type === 'text' && typeof block.text === 'string')?.text;
  const parsed = parseMaybeJson(text ?? raw);
  return parsed?.data ?? parsed;
}

function loadTool(name) {
  const path = join(RAW_DIR, `${name}.json`);
  try {
    return structuredPayload(readJson(path));
  } catch {
    return null;
  }
}

function firstArray(payload, keys) {
  if (Array.isArray(payload)) return payload;
  for (const key of keys) {
    if (Array.isArray(payload?.[key])) return payload[key];
  }
  return [];
}

function money(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed.toFixed(2) : fallback;
}

function currentQuote(entry) {
  if (!entry) return null;
  if (entry.quote) return entry.quote;
  return entry;
}

function sanitizeAccounts(accountsPayload) {
  const accounts = firstArray(accountsPayload, ['accounts', 'results']);
  if (!accounts.length) {
    return [{ id: 'acct_agentic', account_number: 'RHAGENTIC001', status: 'active', type: 'agentic' }];
  }
  return accounts.map((account, index) => ({
    id: `acct_${index + 1}`,
    account_number: account.agentic_allowed ? 'RHAGENTIC001' : `RHACCOUNT${String(index + 1).padStart(3, '0')}`,
    status: account.state ?? 'active',
    type: account.type ?? 'cash',
    brokerage_account_type: account.brokerage_account_type,
    nickname: account.agentic_allowed ? 'Agentic' : account.nickname ? `Account ${index + 1}` : undefined,
    is_default: Boolean(account.is_default),
    agentic_allowed: Boolean(account.agentic_allowed),
    management_type: account.management_type,
  }));
}

function sanitizePositions(positionsPayload) {
  const positions = firstArray(positionsPayload, ['positions', 'results']);
  if (!positions.length) return [];
  return positions.map((position, index) => ({
    id: `pos_${index + 1}`,
    symbol: position.symbol ?? position.instrument?.symbol ?? `SYM${index + 1}`,
    quantity: String(position.quantity ?? position.quantity_available_for_trading ?? '0'),
    side: position.side ?? 'long',
    market_value: money(position.market_value ?? position.equity ?? position.current_value, '0.00'),
    average_entry_price: money(position.average_entry_price ?? position.average_buy_price, '0.00'),
    current_price: money(position.current_price ?? position.price, '0.00'),
    unrealized_pl: money(position.unrealized_pl ?? position.unrealized_gain_loss, '0.00'),
    unrealized_pl_percent: money(position.unrealized_pl_percent ?? position.unrealized_gain_loss_percent, '0.00'),
  }));
}

function sanitizeOrders(ordersPayload) {
  const orders = firstArray(ordersPayload, ['orders', 'results']);
  return orders.slice(0, 10).map((order, index) => ({
    id: `order_${index + 1}`,
    symbol: order.symbol ?? order.instrument?.symbol ?? 'AAPL',
    side: order.side ?? 'buy',
    quantity: String(order.quantity ?? order.cumulative_quantity ?? '1'),
    type: order.type ?? 'market',
    status: order.state ?? order.status ?? 'filled',
    submitted_at: fixedNow,
  }));
}

function sanitizeOptionChains(chainsPayload, instrumentsPayload) {
  const chains = firstArray(chainsPayload, ['chains', 'results']);
  const instruments = firstArray(instrumentsPayload, ['instruments', 'results']);
  if (!chains.length) return undefined;
  return Object.fromEntries(
    chains.slice(0, 3).map((chain, index) => {
      const symbol = chain.underlying_symbol ?? chain.symbol ?? `OPT${index + 1}`;
      const id = chain.id ?? `chain_${index + 1}`;
      return [
        symbol,
        {
          id,
          underlying_symbol: symbol,
          symbol,
          can_open_position: Boolean(chain.can_open_position ?? true),
          expiration_dates: (chain.expiration_dates ?? []).slice(0, 6),
          trade_value_multiplier: String(chain.trade_value_multiplier ?? '100.0000'),
          min_ticks: chain.min_ticks,
          instruments: instruments.slice(0, 20).map((instrument, instrumentIndex) => ({
            id: instrument.id ?? instrument.instrument_id ?? instrument.option_id ?? `OPT_${index + 1}_${instrumentIndex + 1}`,
            chain_id: id,
            symbol,
            chain_symbol: symbol,
            type: instrument.type ?? 'call',
            expiration_date: instrument.expiration_date ?? chain.expiration_dates?.[0],
            strike_price: String(instrument.strike_price ?? '200.00'),
            state: instrument.state ?? 'active',
            tradable: Boolean(instrument.tradable ?? true),
          })),
        },
      ];
    }),
  );
}

function sanitizeOptionQuotes(quotesPayload) {
  const quotes = firstArray(quotesPayload, ['quotes', 'results']);
  return quotes.slice(0, 20).map((quote, index) => ({
    instrument_id: quote.instrument_id ?? quote.id ?? quote.option_id ?? `OPTQUOTE_${index + 1}`,
    symbol: quote.symbol ?? quote.chain_symbol ?? 'AAPL',
    bid: money(quote.bid_price ?? quote.bid, '0.00'),
    ask: money(quote.ask_price ?? quote.ask, '0.00'),
    mark_price: money(quote.mark_price ?? quote.mark, '0.00'),
    implied_volatility: String(quote.implied_volatility ?? quote.implied_volatility_previous_close ?? '0'),
    delta: String(quote.delta ?? '0'),
    gamma: String(quote.gamma ?? '0'),
    theta: String(quote.theta ?? '0'),
    vega: String(quote.vega ?? '0'),
    rho: String(quote.rho ?? '0'),
    open_interest: Number(quote.open_interest ?? 0),
    volume: Number(quote.volume ?? 0),
    updated_at: fixedNow,
  }));
}

function sanitizeWatchlists(watchlistsPayload) {
  const watchlists = firstArray(watchlistsPayload, ['watchlists', 'results']);
  return watchlists.slice(0, 10).map((watchlist, index) => ({
    id: `watchlist_${index + 1}`,
    name: watchlist.display_name ?? watchlist.name ?? `Watchlist ${index + 1}`,
    display_name: watchlist.display_name ?? watchlist.name ?? `Watchlist ${index + 1}`,
    icon_emoji: null,
    display_description: watchlist.display_description ? `Watchlist ${index + 1}` : null,
    symbols: firstArray(watchlist, ['symbols', 'items']).map((item) => (typeof item === 'string' ? item : item.symbol)).filter(Boolean).slice(0, 20),
    option_ids: [],
    followed: Boolean(watchlist.followed),
  }));
}

const portfolioRaw = loadTool('get_portfolio') ?? {};
const accountsRaw = loadTool('get_accounts') ?? {};
const positionsRaw = loadTool('get_equity_positions') ?? {};
const ordersRaw = loadTool('get_equity_orders') ?? {};
const quotesRaw = firstArray(loadTool('get_equity_quotes'), ['quotes', 'results']);
const tradabilityRaw = loadTool('get_equity_tradability') ?? {};
const optionChains = sanitizeOptionChains(loadTool('get_option_chains'), loadTool('get_option_instruments'));
const optionQuotes = sanitizeOptionQuotes(loadTool('get_option_quotes'));
const watchlists = sanitizeWatchlists(loadTool('get_watchlists'));
const quote = currentQuote(quotesRaw[0]);
const close = quotesRaw[0]?.close;
const quoteSymbol = quote?.symbol ?? tradabilityRaw.results?.[0]?.symbol ?? tradabilityRaw.symbol ?? 'AAPL';
const buyingPower = typeof portfolioRaw.buying_power === 'object' ? portfolioRaw.buying_power.buying_power : portfolioRaw.buying_power;

const sanitized = {
  accounts: sanitizeAccounts(accountsRaw),
  portfolio: {
    total_value: money(portfolioRaw.total_value ?? portfolioRaw.equity ?? portfolioRaw.portfolio_value, '26000.00'),
    buying_power: money(buyingPower ?? portfolioRaw.cash, '10000.00'),
    values_by_asset_class: {
      equities: money(portfolioRaw.equity_value ?? portfolioRaw.equities, '0.00'),
      options: money(portfolioRaw.options_value, '0.00'),
      cash: money(portfolioRaw.cash, '0.00'),
    },
    series: [24750, 25200, 26000],
    updated_at: fixedNow,
  },
  positions: sanitizePositions(positionsRaw),
  quotes: [
    {
      symbol: quoteSymbol,
      price: money(quote?.last_trade_price ?? quote?.last_non_reg_trade_price ?? quote?.price ?? quote?.last_price ?? quote?.ask, '200.00'),
      bid: money(quote?.bid_price ?? quote?.bid, '199.95'),
      ask: money(quote?.ask_price ?? quote?.ask, '200.05'),
      prior_close: money(close?.price ?? quote?.adjusted_previous_close ?? quote?.previous_close ?? quote?.prior_close, '198.00'),
      updated_at: fixedNow,
    },
  ],
  ...(optionChains ? { optionChains } : {}),
  ...(optionQuotes.length ? { optionQuotes } : {}),
  ...(watchlists.length ? { watchlists } : {}),
  orders: sanitizeOrders(ordersRaw),
  nextId: 1,
};

mkdirSync(dirname(OUT_PATH), { recursive: true });
writeFileSync(OUT_PATH, `${JSON.stringify(sanitized, null, 2)}\n`);
console.log(`wrote sanitized fixture: ${OUT_PATH}`);
