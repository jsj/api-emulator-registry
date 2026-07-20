import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fixedNow, getState, readBody, setState } from '../scripts/provider-plugin-kit.mjs';

const STATE_KEY = 'robinhood-trading:state';
const FIXTURE_PATH = join(dirname(fileURLToPath(import.meta.url)), 'fixtures', 'sanitized.json');
const TOOLS_CONTRACT_PATH = join(dirname(fileURLToPath(import.meta.url)), 'fixtures', 'tools-contract.sanitized.json');
const observedTools = JSON.parse(readFileSync(TOOLS_CONTRACT_PATH, 'utf8')).tools;
const observedToolsByName = new Map(observedTools.map((tool) => [tool.name, tool]));
const fixturePath = () => process.env.ROBINHOOD_EMULATOR_FIXTURE_PATH || FIXTURE_PATH;
const DAY_MS = 24 * 60 * 60 * 1000;
const REFRESH_TOKEN_TTL_DAYS = 7;
const EQUITY_ORDER_TYPES = ['market', 'limit', 'stop_market', 'stop_limit'];
const OPTION_ORDER_TYPES = ['limit', 'market', 'stop_market', 'stop_limit'];
const ROBINHOOD_TRADING_TOOLS = [
  'add_option_to_watchlist',
  'add_to_watchlist',
  'cancel_equity_order',
  'cancel_option_order',
  'create_scan',
  'create_watchlist',
  'follow_watchlist',
  'get_accounts',
  'get_earnings_calendar',
  'get_earnings_results',
  'get_equity_fundamentals',
  'get_equity_historicals',
  'get_equity_price_book',
  'get_equity_technical_indicators',
  'get_equity_orders',
  'get_equity_positions',
  'get_equity_quotes',
  'get_equity_tax_lots',
  'get_equity_tradability',
  'get_financials',
  'get_index_quotes',
  'get_indexes',
  'get_option_chains',
  'get_option_historicals',
  'get_option_instruments',
  'get_option_level_upgrade_info',
  'get_option_orders',
  'get_option_positions',
  'get_option_quotes',
  'get_option_watchlist',
  'get_popular_watchlists',
  'get_portfolio',
  'get_pnl_trade_history',
  'get_realized_pnl',
  'get_scanner_filter_specs',
  'get_scans',
  'get_watchlist_items',
  'get_watchlists',
  'place_equity_order',
  'place_option_order',
  'remove_from_watchlist',
  'remove_option_from_watchlist',
  'review_equity_order',
  'review_option_order',
  'run_scan',
  'search',
  'unfollow_watchlist',
  'update_scan_config',
  'update_scan_filters',
  'update_watchlist',
];

const TOOL_INPUTS = {
  add_option_to_watchlist: { required: ['option_ids'], arrays: ['option_ids'], strings: ['position_type'] },
  add_to_watchlist: { required: ['list_id'], strings: ['list_id'], arrays: ['symbols', 'currency_pair_ids', 'index_ids'] },
  cancel_equity_order: { required: ['account_number', 'order_id'], strings: ['account_number', 'order_id'] },
  cancel_option_order: { required: ['account_number', 'order_id'], strings: ['account_number', 'order_id'] },
  create_scan: { strings: ['preset', 'title'], arrays: ['filters'] },
  create_watchlist: { required: ['display_name'], strings: ['display_name', 'icon_emoji', 'display_description'] },
  follow_watchlist: { required: ['list_id'], strings: ['list_id'] },
  get_accounts: {},
  get_earnings_calendar: { strings: ['start_date', 'filter'], integers: ['days'] },
  get_earnings_results: { required: ['symbol'], strings: ['symbol'] },
  get_equity_fundamentals: { required: ['symbols'], arrays: ['symbols'], strings: ['bounds'] },
  get_equity_historicals: { required: ['symbols', 'start_time'], arrays: ['symbols'], strings: ['start_time', 'end_time', 'interval', 'bounds', 'adjustment_type'] },
  get_equity_price_book: { required: ['symbols'], arrays: ['symbols'] },
  get_equity_technical_indicators: { required: ['symbol', 'type', 'interval', 'start_time'], strings: ['symbol', 'type', 'start_time', 'end_time', 'interval', 'bounds', 'adjustment_type', 'output', 'method'], integers: ['period', 'fast_period', 'slow_period', 'signal_period'], numbers: ['num_std', 'multiplier'] },
  get_equity_orders: { required: ['account_number'], strings: ['account_number', 'order_id', 'state', 'symbol', 'created_at_gte', 'placed_agent', 'cursor'] },
  get_equity_positions: { required: ['account_number'], strings: ['account_number', 'cursor'] },
  get_equity_quotes: { required: ['symbols'], arrays: ['symbols'] },
  get_equity_tax_lots: { required: ['account_number', 'symbol'], strings: ['account_number', 'symbol', 'cursor'] },
  get_equity_tradability: { required: ['account_number', 'symbols'], strings: ['account_number'], arrays: ['symbols'] },
  get_financials: { required: ['symbols'], arrays: ['symbols'], strings: ['period'], integers: ['limit'] },
  get_index_quotes: { required: ['instrument_ids'], arrays: ['instrument_ids'] },
  get_indexes: { strings: ['symbols'] },
  get_option_chains: { strings: ['ids', 'underlying_symbol'] },
  get_option_historicals: { required: ['instrument_ids', 'start_time'], arrays: ['instrument_ids'], strings: ['start_time', 'end_time', 'interval', 'bounds'] },
  get_option_instruments: { strings: ['chain_id', 'chain_symbol', 'expiration_dates', 'strike_price', 'type', 'state', 'tradability', 'ids', 'cursor'] },
  get_option_level_upgrade_info: { required: ['account_number'], strings: ['account_number'] },
  get_option_orders: { required: ['account_number'], strings: ['account_number', 'order_id', 'state', 'created_at_gte', 'chain_ids', 'underlying_type', 'placed_agent', 'cursor'] },
  get_option_positions: { required: ['account_number'], strings: ['account_number', 'chain_ids', 'option_ids', 'type', 'option_type', 'expiration_date', 'expiration_date_lte', 'expiration_date_gte', 'cursor'], booleans: ['nonzero'] },
  get_option_quotes: { required: ['instrument_ids'], arrays: ['instrument_ids'] },
  get_option_watchlist: {},
  get_popular_watchlists: {},
  get_portfolio: { required: ['account_number'], strings: ['account_number'] },
  get_pnl_trade_history: { required: ['account_number'], strings: ['account_number', 'span', 'symbol', 'cursor'] },
  get_realized_pnl: { required: ['account_number'], strings: ['account_number', 'span', 'start_date', 'end_date', 'display_currency', 'timezone'], arrays: ['asset_classes'] },
  get_scanner_filter_specs: {},
  get_scans: {},
  get_watchlist_items: { required: ['list_id'], strings: ['list_id'] },
  get_watchlists: {},
  place_equity_order: { required: ['account_number', 'symbol', 'side', 'type'], strings: ['account_number', 'symbol', 'side', 'type', 'quantity', 'dollar_amount', 'limit_price', 'stop_price', 'time_in_force', 'market_hours', 'ref_id'], arrays: ['tax_lots'] },
  place_option_order: { required: ['account_number', 'legs', 'quantity'], strings: ['account_number', 'type', 'quantity', 'price', 'stop_price', 'time_in_force', 'market_hours', 'ref_id'], arrays: ['legs'] },
  remove_from_watchlist: { required: ['list_id'], strings: ['list_id'], arrays: ['symbols', 'currency_pair_ids', 'index_ids'] },
  remove_option_from_watchlist: { required: ['option_ids'], arrays: ['option_ids'], strings: ['position_type'] },
  review_equity_order: { required: ['account_number', 'symbol', 'side', 'type'], strings: ['account_number', 'symbol', 'side', 'type', 'quantity', 'dollar_amount', 'limit_price', 'stop_price', 'time_in_force', 'market_hours'], arrays: ['tax_lots'] },
  review_option_order: { required: ['account_number', 'legs', 'quantity'], strings: ['account_number', 'type', 'quantity', 'price', 'stop_price', 'time_in_force', 'market_hours', 'chain_symbol', 'underlying_type'], arrays: ['legs'] },
  run_scan: { required: ['scan_id'], strings: ['scan_id'] },
  search: { required: ['query'], strings: ['query', 'asset_type'], integers: ['limit'] },
  unfollow_watchlist: { required: ['list_id'], strings: ['list_id'] },
  update_scan_config: { required: ['scan_id', 'sorting_column', 'sorting_direction'], strings: ['scan_id', 'sorting_column', 'sorting_direction'] },
  update_scan_filters: { required: ['scan_id', 'filters'], strings: ['scan_id'], arrays: ['filters'] },
  update_watchlist: { required: ['list_id'], strings: ['list_id', 'display_name', 'icon_emoji', 'display_description'] },
};

const TOOL_DATA_REQUIRED = {
  add_option_to_watchlist: ['option_ids', 'position_type', 'list_id', 'operation', 'status'],
  add_to_watchlist: ['object_type', 'list_id', 'operation', 'status'],
  cancel_equity_order: ['accepted'],
  cancel_option_order: ['accepted'],
  create_scan: ['result'],
  create_watchlist: ['watchlist'],
  follow_watchlist: ['list_id', 'action', 'status'],
  get_accounts: ['accounts'],
  get_earnings_calendar: ['results'],
  get_earnings_results: ['results'],
  get_equity_fundamentals: ['results'],
  get_equity_historicals: ['results'],
  get_equity_price_book: ['books'],
  get_equity_technical_indicators: ['symbol', 'interval', 'bounds', 'indicators'],
  get_equity_orders: ['orders'],
  get_equity_positions: ['positions'],
  get_equity_quotes: ['results'],
  get_equity_tax_lots: ['symbol', 'tax_lots'],
  get_equity_tradability: ['results'],
  get_financials: ['results'],
  get_index_quotes: ['quotes'],
  get_indexes: ['indexes'],
  get_option_chains: ['chains'],
  get_option_historicals: ['results'],
  get_option_instruments: ['instruments'],
  get_option_level_upgrade_info: ['upgrade_url', 'account_number'],
  get_option_orders: ['orders'],
  get_option_positions: ['positions'],
  get_option_quotes: ['results'],
  get_option_watchlist: ['items', 'list_id'],
  get_popular_watchlists: ['lists'],
  get_portfolio: ['total_value', 'equity_value', 'options_value', 'futures_value', 'event_contracts_value', 'crypto_value', 'cash', 'pending_deposits', 'mutual_funds_value', 'fixed_income_value', 'currency', 'buying_power'],
  get_pnl_trade_history: ['account_number', 'span', 'trades', 'next_cursor'],
  get_realized_pnl: ['account_number', 'window', 'display_currency', 'data_points', 'total_returns', 'total_rate_of_return'],
  get_scanner_filter_specs: ['filter_specs'],
  get_scans: ['scans'],
  get_watchlist_items: ['items', 'has_futures_contracts'],
  get_watchlists: ['watchlists'],
  place_equity_order: ['order'],
  place_option_order: ['order'],
  remove_from_watchlist: ['object_type', 'list_id', 'operation', 'status'],
  remove_option_from_watchlist: ['option_ids', 'position_type', 'list_id', 'operation', 'status'],
  review_equity_order: ['symbol', 'side', 'type', 'order_checks', 'quote_data'],
  review_option_order: ['account_number', 'type', 'quantity', 'legs', 'order_checks', 'option_quotes'],
  run_scan: ['result'],
  search: [],
  unfollow_watchlist: ['list_id', 'action', 'status'],
  update_scan_config: ['result'],
  update_scan_filters: ['result'],
  update_watchlist: ['watchlist'],
};

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
        { begins_at: '2025-12-29T00:00:00Z', open_price: '198.00', high_price: '201.50', low_price: '197.25', close_price: '200.00', volume: 42000000, session: 'reg' },
        { begins_at: '2025-12-30T00:00:00Z', open_price: '200.10', high_price: '202.00', low_price: '199.10', close_price: '201.20', volume: 39000000, session: 'reg' },
      ],
      SPY: [
        { begins_at: '2025-12-29T00:00:00Z', open_price: '585.00', high_price: '590.00', low_price: '584.25', close_price: '589.50', volume: 58000000, session: 'reg' },
        { begins_at: '2025-12-30T00:00:00Z', open_price: '589.75', high_price: '592.20', low_price: '588.90', close_price: '591.10', volume: 54000000, session: 'reg' },
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
    financials: {
      AAPL: [
        { fiscal_year: 2026, fiscal_quarter: 2, period_end_date: '2026-06-27', revenue: '94036000000', gross_profit: '43879000000', net_income: '23636000000', net_margin: '25.13' },
        { fiscal_year: 2026, fiscal_quarter: 1, period_end_date: '2026-03-28', revenue: '95359000000', gross_profit: '44754000000', net_income: '24780000000', net_margin: '25.99' },
      ],
    },
    scannerFilterSpecs: [
      { filter_type: 'FILTER_TYPE_RSI', display_name: 'RSI', filter_group: 'TECHNICAL', value_type: 'DECIMAL', unit_type: 'PLAIN', supported_predicates: ['>', '<', 'BETWEEN'], supported_lengths: [9, 14, 21, 50], supported_intervals: ['1m', '5m', '1h', '1d'], supported_plots: [] },
      { filter_type: 'FILTER_TYPE_PERCENT_CHANGE_FROM_CLOSE', display_name: '% Change From Close', filter_group: 'PRICE_VOLUME', value_type: 'DECIMAL', unit_type: 'PERCENTAGE', supported_predicates: ['>', '<', 'BETWEEN'], supported_lengths: [], supported_intervals: ['1d'], supported_plots: ['close'] },
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
    optionHistoricals: {
      AAPL260116C00200000: [
        { begins_at: '2026-01-02T14:30:00Z', open_price: '5.80', high_price: '6.40', low_price: '5.70', close_price: '6.22', volume: 980 },
        { begins_at: '2026-01-03T14:30:00Z', open_price: '6.20', high_price: '6.55', low_price: '6.05', close_price: '6.35', volume: 740 },
      ],
      AAPL260116P00195000: [
        { begins_at: '2026-01-02T14:30:00Z', open_price: '3.30', high_price: '3.70', low_price: '3.25', close_price: '3.45', volume: 610 },
      ],
    },
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
    earningsCalendar: [
      {
        symbol: 'AAPL',
        year: 2026,
        quarter: 1,
        eps: { estimate: '2.35', actual: null },
        report: { date: '2026-01-29', timing: 'pm', verified: true },
        company: { name: 'Apple Inc.', market_cap: '3000000000000' },
      },
      {
        symbol: 'MSFT',
        year: 2026,
        quarter: 2,
        eps: { estimate: '3.21', actual: null },
        report: { date: '2026-01-28', timing: 'pm', verified: true },
        company: { name: 'Microsoft Corporation', market_cap: '3200000000000' },
      },
    ],
    earningsResults: {
      AAPL: [
        {
          symbol: 'AAPL',
          year: 2026,
          quarter: 1,
          eps: { estimate: '2.35', actual: null },
          report: { date: '2026-01-29', timing: 'pm', verified: true },
          company: { name: 'Apple Inc.', market_cap: '3000000000000' },
        },
        {
          symbol: 'AAPL',
          year: 2025,
          quarter: 4,
          eps: { estimate: '1.94', actual: '1.97' },
          report: { date: '2025-10-30', timing: 'pm', verified: true },
          company: { name: 'Apple Inc.', market_cap: '3000000000000' },
        },
      ],
    },
    realizedPnl: [
      {
        account_number: 'RHAGENTIC001',
        start_time: '2025-10-01T04:00:00.000Z',
        end_time: '2025-11-01T03:59:59.999Z',
        realized_gain: '125.42',
        rate_of_realized_gain: '2.1',
        number_of_trades: 3,
      },
      {
        account_number: 'RHAGENTIC001',
        start_time: '2025-11-01T04:00:00.000Z',
        end_time: '2025-12-01T04:59:59.999Z',
        realized_gain: '-34.10',
        rate_of_realized_gain: '-0.6',
        number_of_trades: 1,
      },
    ],
    pnlTradeHistory: [
      {
        timestamp: '2025-10-21T15:15:00.000Z',
        account_number: 'RHAGENTIC001',
        symbol: 'AAPL',
        side: 'sell',
        quantity: '2',
        price: '228.00',
        realized_gain: '76.00',
      },
      {
        timestamp: '2025-11-14T16:00:00.000Z',
        account_number: 'RHAGENTIC001',
        symbol: 'AAPL',
        side: 'sell',
        quantity: '1',
        price: '7.0542',
        realized_gain: '125.42',
      },
    ],
    equityTaxLots: {
      AAPL: [
        { open_lot_id: 'tax-lot-aapl-1', open_tran_type: 'buy', order_id: 'rh_order_seed_1', quantity: '3', quantity_available: '3', is_selectable: true, cost_per_share: '190.00', tax_cost_basis: '570.00', open_date: '2024-06-10', term: 'lt' },
        { open_lot_id: 'tax-lot-aapl-2', open_tran_type: 'buy', order_id: 'rh_order_seed_2', quantity: '2', quantity_available: '2', is_selectable: true, cost_per_share: '195.00', tax_cost_basis: '390.00', open_date: '2025-12-15', term: 'st' },
      ],
    },
    scans: [
      {
        scan_id: 'scan-daily-gainers',
        title: 'Daily Gainers',
        preset: 'DAILY_GAINERS',
        filter_summary: [{ filter_type: '% Change', predicate: '>', values: ['5'], interval: '1d', length: 0, plot: 'close' }],
        filters: [{ filter_type: 'FILTER_TYPE_PERCENT_CHANGE', predicate: 'PREDICATE_GREATER_THAN', values: ['5'], interval: '1d', plot: 'close' }],
        columns: ['Symbol', '% Change', 'Volume', 'Price'],
        sorting: { column: '% Change', direction: 'desc' },
        cortex_managed: false,
        results: [
          { ticker: 'AAPL', instrument_id: 'instrument-aapl', instrument_type: 'STOCK', columns: { Symbol: 'AAPL', '% Change': '5.26%', Volume: '42,000,000', Price: '200.00' } },
          { ticker: 'NVDA', instrument_id: 'instrument-nvda', instrument_type: 'STOCK', columns: { Symbol: 'NVDA', '% Change': '4.80%', Volume: '55,000,000', Price: '125.50' } },
        ],
      },
    ],
    currencyPairs: [
      { id: 'currency-pair-btc-usd', symbol: 'BTC-USD', name: 'Bitcoin' },
      { id: 'currency-pair-eth-usd', symbol: 'ETH-USD', name: 'Ethereum' },
    ],
    followedWatchlists: ['watchlist-default'],
    orders: [],
    nextId: 1,
    nextWatchlistId: 2,
    nextScanId: 2,
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
const liveResult = (id, data, guide = 'Emulator response shaped to match the Robinhood Trading MCP tool contract.') => mcpResult(id, { data, guide });

function schemaDefault(schema) {
  const types = Array.isArray(schema?.type) ? schema.type : schema?.type ? [schema.type] : [];
  if (types.includes('null')) return null;
  if (types.includes('object')) return conformToSchema({}, schema);
  if (types.includes('array')) return [];
  if (types.includes('string')) return '';
  if (types.includes('integer') || types.includes('number')) return 0;
  if (types.includes('boolean')) return false;
  return null;
}

function valueMatchesSchemaType(value, schema) {
  const types = Array.isArray(schema?.type) ? schema.type : schema?.type ? [schema.type] : [];
  if (!types.length) return true;
  return types.some((type) =>
    (type === 'null' && value === null) ||
    (type === 'array' && Array.isArray(value)) ||
    (type === 'object' && value !== null && typeof value === 'object' && !Array.isArray(value)) ||
    (type === 'integer' && Number.isInteger(value)) ||
    (type === 'number' && typeof value === 'number' && Number.isFinite(value)) ||
    (type === 'string' && typeof value === 'string') ||
    (type === 'boolean' && typeof value === 'boolean'));
}

function conformToSchema(value, schema) {
  if (!schema || Object.keys(schema).length === 0) return value;
  if (!valueMatchesSchemaType(value, schema)) return schemaDefault(schema);
  if (value === null) return null;
  if (Array.isArray(value)) return value.map((item) => conformToSchema(item, schema.items));
  if (typeof value !== 'object') return value;
  const result = {};
  for (const [key, childSchema] of Object.entries(schema.properties ?? {})) {
    if (Object.hasOwn(value, key)) result[key] = conformToSchema(value[key], childSchema);
    else if ((schema.required ?? []).includes(key)) result[key] = schemaDefault(childSchema);
  }
  if (schema.additionalProperties !== false) {
    for (const [key, child] of Object.entries(value)) {
      if (!Object.hasOwn(result, key) && !schema.properties?.[key]) result[key] = conformToSchema(child, schema.additionalProperties);
    }
  }
  return result;
}

function liveToolResult(id, tool, data, guide) {
  const schema = observedToolsByName.get(tool)?.outputSchema?.properties?.data;
  return liveResult(id, conformToSchema(data, schema), guide);
}
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

function schemaProperty(name, spec) {
  if (spec.arrays?.includes(name)) {
    const itemType = ['filters', 'legs'].includes(name) ? 'object' : 'string';
    return { type: ['null', 'array'], items: { type: itemType } };
  }
  if (spec.integers?.includes(name)) return { type: 'integer' };
  if (spec.numbers?.includes(name)) return { type: 'number' };
  if (spec.booleans?.includes(name)) return { type: 'boolean' };
  return { type: 'string' };
}

function toolSchema(name) {
  const observed = observedToolsByName.get(name);
  if (observed) return observed;
  const spec = TOOL_INPUTS[name] ?? {};
  const propertyNames = [...new Set([...(spec.strings ?? []), ...(spec.arrays ?? []), ...(spec.integers ?? []), ...(spec.numbers ?? []), ...(spec.booleans ?? [])])];
  return {
    name,
    inputSchema: {
      type: 'object',
      properties: Object.fromEntries(propertyNames.map((property) => [property, schemaProperty(property, spec)])),
      required: spec.required ?? [],
      additionalProperties: false,
    },
    outputSchema: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: Object.fromEntries((TOOL_DATA_REQUIRED[name] ?? []).map((property) => [property, {}])),
          required: TOOL_DATA_REQUIRED[name] ?? [],
          additionalProperties: true,
        },
        guide: { type: 'string' },
      },
      required: ['data', 'guide'],
      additionalProperties: false,
    },
  };
}

function requireArgs(id, tool, args) {
  for (const key of TOOL_INPUTS[tool]?.required ?? []) {
    if (args[key] === undefined || args[key] === null || args[key] === '') return mcpError(id, `${key} is required`, 400);
  }
  return null;
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
  if ((orderType === 'stop_market' || orderType === 'stop_limit') && !hasStopPrice) {
    return mcpError(id, `${orderType === 'stop_market' ? 'Stop-market' : 'Stop-limit'} orders require stop_price`, 400);
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
  const hasPrice = args.price !== undefined || args.limit_price !== undefined || args.limitPrice !== undefined;
  const hasStopPrice = args.stop_price !== undefined || args.stopPrice !== undefined;
  if ((orderType === 'limit' || orderType === 'stop_limit') && !hasPrice) return mcpError(id, 'Limit option orders require price', 400);
  if ((orderType === 'stop_market' || orderType === 'stop_limit') && !hasStopPrice) return mcpError(id, 'Stop option orders require stop_price', 400);
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

function parseRfc3339(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T/.test(value)) return null;
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : null;
}

function equityHistoricalResults(s, args) {
  const symbols = requestedSymbols(args);
  const interval = String(args.interval ?? '5minute');
  const bounds = String(args.bounds ?? 'regular');
  const startTime = parseRfc3339(args.start_time ?? args.startTime);
  const endTime = args.end_time || args.endTime ? parseRfc3339(args.end_time ?? args.endTime) : null;
  const savedResults = Array.isArray(s.equityHistoricalResults) ? s.equityHistoricalResults : null;

  return symbols.map((symbol) => {
    const saved = savedResults?.find((row) => normalizeSymbol(row.symbol) === symbol);
    const bars = saved?.bars ?? s.equityHistoricals?.[symbol] ?? [];
    const filteredBars = bars.filter((bar) => {
      const beginsAt = Date.parse(bar.begins_at);
      if (!Number.isFinite(beginsAt)) return true;
      if (startTime !== null && beginsAt < startTime) return false;
      if (endTime !== null && beginsAt >= endTime) return false;
      return true;
    });
    return {
      symbol,
      interval: saved?.interval ?? interval,
      bounds: saved?.bounds ?? bounds,
      bars: filteredBars,
    };
  });
}

function equityTechnicalIndicatorResult(s, args) {
  const symbol = normalizeSymbol(args.symbol);
  const type = String(args.type).trim().toLowerCase();
  const interval = String(args.interval ?? 'day');
  const bars = equityHistoricalResults(s, { ...args, symbols: [symbol] })[0]?.bars ?? [];
  const closes = bars.map((bar) => Number(bar.close_price)).filter(Number.isFinite);
  const period = Math.max(1, Number(args.period ?? 14));
  const average = closes.length ? closes.slice(-period).reduce((sum, value) => sum + value, 0) / Math.min(period, closes.length) : null;
  const series = bars.map((bar, index) => ({
    begins_at: bar.begins_at,
    value: type === 'sma' || type === 'ema' ? average : Number(bar.close_price),
    ...(type === 'macd' ? { macd: Number(bar.close_price), signal: average, histogram: Number(bar.close_price) - average } : {}),
    ...(type === 'bollinger_bands' ? { upper: average + Number(args.num_std ?? 2), middle: average, lower: average - Number(args.num_std ?? 2) } : {}),
    ...(index === 0 ? { index } : {}),
  }));
  return { symbol, interval, bounds: String(args.bounds ?? 'regular'), indicators: [{ type, params: { period }, series }] };
}

function pnlTradeHistoryResult(s, args) {
  const accountNumber = String(args.account_number);
  const symbol = args.symbol ? normalizeSymbol(args.symbol) : null;
  const trades = (s.pnlTradeHistory ?? []).filter((trade) => {
    return String(trade.account_number) === accountNumber && (!symbol || normalizeSymbol(trade.symbol) === symbol);
  });
  return { account_number: accountNumber, span: String(args.span ?? 'week'), trades, next_cursor: '' };
}

function equityTaxLotsResult(s, args) {
  const symbol = normalizeSymbol(args.symbol);
  return { symbol, tax_lots: s.equityTaxLots?.[symbol] ?? [], next: '' };
}

function optionHistoricalResults(s, args) {
  const optionIds = requestedExplicitOptionIds(args);
  const interval = String(args.interval ?? 'day');
  const bounds = String(args.bounds ?? 'regular');
  const startTime = parseRfc3339(args.start_time ?? args.startTime);
  const endTime = args.end_time || args.endTime ? parseRfc3339(args.end_time ?? args.endTime) : null;
  const instruments = allOptionInstruments(s);

  return optionIds.map((instrumentId) => {
    const instrument = instruments.find((row) => String(row.id ?? row.instrument_id ?? row.option_id) === String(instrumentId));
    const bars = s.optionHistoricals?.[instrumentId] ?? [];
    const filteredBars = bars.filter((bar) => {
      const beginsAt = Date.parse(bar.begins_at);
      if (!Number.isFinite(beginsAt)) return true;
      if (startTime !== null && beginsAt < startTime) return false;
      if (endTime !== null && beginsAt >= endTime) return false;
      return true;
    });
    return {
      instrument_id: instrumentId,
      occ_symbol: instrument?.occ_symbol ?? instrument?.occSymbol ?? instrumentId,
      symbol: normalizeSymbol(instrument?.symbol ?? instrument?.chain_symbol ?? 'AAPL'),
      interval,
      bounds,
      bars: filteredBars,
    };
  });
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

function dateOnlyMs(value) {
  if (!value) return null;
  const timestamp = Date.parse(`${String(value).slice(0, 10)}T00:00:00.000Z`);
  return Number.isFinite(timestamp) ? timestamp : null;
}

function earningsInWindow(s, args) {
  const startDate = String(args.start_date ?? fixedNow.slice(0, 10));
  const days = Number(args.days ?? 7);
  const windowDays = Number.isFinite(days) && days !== 0 ? Math.max(-31, Math.min(31, days)) : 7;
  const start = dateOnlyMs(startDate);
  const end = start === null ? null : start + (windowDays > 0 ? windowDays : 0) * DAY_MS;
  const lower = windowDays < 0 && start !== null ? start + windowDays * DAY_MS : start;
  const upper = windowDays < 0 ? start : end;
  const highMarketCapOnly = String(args.filter ?? '') === 'high_market_cap';

  return (s.earningsCalendar ?? []).filter((event) => {
    const reportDate = dateOnlyMs(event.report?.date);
    const marketCap = Number(event.company?.market_cap ?? event.market_cap ?? 0);
    return (
      reportDate !== null &&
      (lower === null || reportDate >= lower) &&
      (upper === null || reportDate <= upper) &&
      (!highMarketCapOnly || marketCap > 1_000_000_000)
    );
  });
}

function realizedPnlResult(s, args) {
  const accountNumber = String(args.account_number ?? '');
  const displayCurrency = String(args.display_currency ?? 'USD');
  const span = args.start_date || args.end_date ? `${args.start_date ?? ''}..${args.end_date ?? ''}` : String(args.span ?? '3month');
  const start = args.start_date ? dateOnlyMs(args.start_date) : null;
  const end = args.end_date ? dateOnlyMs(args.end_date) + DAY_MS : null;
  const dataPoints = (s.realizedPnl ?? []).filter((point) => {
    const pointStart = dateMs(point.start_time);
    return (
      (!accountNumber || String(point.account_number) === accountNumber) &&
      (start === null || (pointStart !== null && pointStart >= start)) &&
      (end === null || (pointStart !== null && pointStart < end))
    );
  });
  const totalRealizedGain = dataPoints.reduce((sum, point) => sum + Number(point.realized_gain ?? 0), 0).toFixed(2);
  const totalTrades = dataPoints.reduce((sum, point) => sum + Number(point.number_of_trades ?? 0), 0);
  return {
    account_number: accountNumber,
    window: span,
    display_currency: displayCurrency,
    data_points: dataPoints,
    total_returns: totalRealizedGain,
    total_rate_of_return: dataPoints.reduce((sum, point) => sum + Number(point.rate_of_realized_gain ?? 0), 0).toFixed(2),
    totals: {
      realized_gain: totalRealizedGain,
      number_of_trades: totalTrades,
    },
  };
}

function portfolioData(portfolio) {
  return {
    total_value: String(portfolio.total_value ?? '0.00'),
    equity_value: String(portfolio.equity_value ?? portfolio.values_by_asset_class?.equities ?? portfolio.total_value ?? '0.00'),
    options_value: String(portfolio.options_value ?? portfolio.values_by_asset_class?.options ?? '0.00'),
    futures_value: String(portfolio.futures_value ?? '0.00'),
    event_contracts_value: String(portfolio.event_contracts_value ?? '0.00'),
    crypto_value: String(portfolio.crypto_value ?? portfolio.values_by_asset_class?.crypto ?? '0.00'),
    cash: String(portfolio.cash ?? portfolio.buying_power ?? '0.00'),
    pending_deposits: String(portfolio.pending_deposits ?? '0.00'),
    mutual_funds_value: String(portfolio.mutual_funds_value ?? '0.00'),
    fixed_income_value: String(portfolio.fixed_income_value ?? '0.00'),
    currency: portfolio.currency ?? 'USD',
    buying_power: String(portfolio.buying_power ?? '0.00'),
    crypto_buying_power: String(portfolio.crypto_buying_power ?? '0.00'),
  };
}

function equityReviewData(args) {
  return {
    symbol: normalizeSymbol(args.symbol),
    side: args.side ?? 'buy',
    type: normalizedEquityOrderType(args),
    quantity: args.quantity ?? args.qty ?? null,
    dollar_amount: args.dollar_amount ?? null,
    limit_price: args.limit_price ?? args.limitPrice ?? null,
    stop_price: args.stop_price ?? args.stopPrice ?? null,
    order_checks: [],
    quote_data: { symbol: normalizeSymbol(args.symbol), last_trade_price: '200.00', bid: '199.95', ask: '200.05' },
    market_data_disclosure: 'emulator',
  };
}

function optionLegs(args) {
  if (Array.isArray(args.legs) && args.legs.length) return args.legs;
  return [
    {
      option_id: args.option_id ?? args.optionId ?? args.instrument_id ?? args.instrumentId ?? 'AAPL260116C00200000',
      side: args.side ?? 'buy',
      position_effect: args.position_effect ?? args.positionEffect ?? 'open',
      ratio_quantity: 1,
    },
  ];
}

function optionReviewData(args) {
  const legs = optionLegs(args);
  return {
    account_number: args.account_number ?? 'RHAGENTIC001',
    type: normalizedOptionOrderType(args),
    quantity: args.quantity ?? args.qty ?? '1',
    price: args.price ?? args.limit_price ?? args.limitPrice ?? null,
    stop_price: args.stop_price ?? args.stopPrice ?? null,
    time_in_force: args.time_in_force ?? args.timeInForce ?? 'gfd',
    market_hours: args.market_hours ?? args.marketHours ?? 'regular_hours',
    legs,
    order_checks: [],
    option_quotes: legs.map((leg) => ({ option_id: leg.option_id, bid: '6.10', ask: '6.35', mark_price: '6.22' })),
    fees: [],
    collateral: null,
  };
}

function scanFiltersForSummary(filters) {
  return (filters ?? []).map((filter) => ({
    filter_type: String(filter.filter_type ?? '').replace(/^FILTER_TYPE_/, '').replaceAll('_', ' ') || 'Custom',
    predicate: String(filter.predicate ?? '').replace(/^PREDICATE_/, '') || 'IS',
    values: filter.values ?? [],
    interval: filter.interval ?? '',
    length: filter.length ?? 0,
    plot: filter.plot ?? '',
  }));
}

function scanResult(scan) {
  const results = scan.results ?? [];
  return {
    scan_id: scan.scan_id,
    scan_title: scan.title ?? scan.scan_title ?? 'Saved Scan',
    total_items: Number(scan.total_items ?? results.length),
    results,
    sorting: scan.sorting ?? { column: 'Symbol', direction: 'asc' },
    filters: scan.filters ?? [],
    filter_summary: scan.filter_summary ?? scanFiltersForSummary(scan.filters),
  };
}

function scanData(scan) {
  return {
    scan_id: scan.scan_id,
    title: scan.title ?? scan.scan_title ?? 'Saved Scan',
    filter_summary: scan.filter_summary ?? scanFiltersForSummary(scan.filters),
    filters: scan.filters ?? [],
    column_count: Number(scan.column_count ?? scan.columns?.length ?? 0),
    columns: scan.columns ?? [],
    sorting: scan.sorting ?? { column: 'Symbol', direction: 'asc' },
    cortex_managed: Boolean(scan.cortex_managed),
  };
}

function findScan(s, args) {
  const scanId = args.scan_id ?? args.scanId ?? args.id;
  return (s.scans ?? []).find((scan) => String(scan.scan_id) === String(scanId));
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
  const firstLeg = optionLegs(args)[0] ?? {};
  const instrumentId = firstLeg.option_id ?? args.instrument_id ?? args.instrumentId ?? args.option_id ?? args.optionId ?? 'AAPL260116C00200000';
  const chainId = args.chain_id ?? args.chainId ?? '7dd906e5-7d4b-4161-a3fe-2c3b62038482';
  const quantity = args.quantity ?? args.qty ?? '1';
  const side = firstLeg.side ?? args.side ?? 'buy';
  const positionEffect = firstLeg.position_effect ?? firstLeg.positionEffect ?? args.position_effect ?? args.positionEffect ?? 'open';
  const price = args.price ?? args.limit_price ?? args.limitPrice ?? '6.25';
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
    limit_price: args.price ?? args.limit_price ?? args.limitPrice ?? '6.25',
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
  source: 'Observed authenticated Robinhood Agentic Trading MCP tools/list contract, verified 2026-07-20',
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
            tools: contract.scope.map(toolSchema),
          }),
        );
      }

      if (body.method !== 'tools/call') {
        const result = mcpError(id, 'Method not found', 404, -32601);
        return c.json(result.payload, result.status);
      }

      const tool = body.params?.name;
      const args = body.params?.arguments ?? {};
      const argError = requireArgs(id, tool, args);
      if (argError) return c.json(argError.payload, argError.status);

      switch (tool) {
        case 'get_accounts':
          return c.json(liveToolResult(id, tool, { accounts: s.accounts }, 'Use account_number from this response for trading and portfolio tools.'));
        case 'get_portfolio':
          return c.json(liveToolResult(id, tool, portfolioData(s.portfolio), 'Portfolio balances for the requested brokerage account.'));
        case 'get_equity_positions':
          return c.json(liveToolResult(id, tool, { positions: s.positions, next: null }, 'Open equity positions for the requested account.'));
        case 'get_earnings_calendar':
          return c.json(liveToolResult(id, tool, { results: earningsInWindow(s, args) }, 'Each entry is one earnings event within the requested window.'));
        case 'get_earnings_results': {
          const symbol = normalizeSymbol(args.symbol);
          return c.json(liveToolResult(id, tool, { results: s.earningsResults?.[symbol] ?? (s.earningsCalendar ?? []).filter((row) => normalizeSymbol(row.symbol) === symbol) }, 'Entries are sorted historical first, upcoming last.'));
        }
        case 'get_equity_quotes': {
          const symbols = requestedSymbols(args);
          const results = symbols.map((symbol) => {
            const row = s.quotes.find((quote) => normalizeSymbol(quote.symbol) === symbol);
            if (!row) return null;
            const timestamp = row.updated_at ?? fixedNow;
            return {
              quote: {
                symbol,
                last_trade_price: String(row.price),
                venue_last_trade_time: timestamp,
                last_non_reg_trade_price: null,
                venue_last_non_reg_trade_time: null,
                adjusted_previous_close: String(row.prior_close),
                previous_close: String(row.prior_close),
                previous_close_date: timestamp.slice(0, 10),
                bid_price: String(row.bid),
                venue_bid_time: timestamp,
                ask_price: String(row.ask),
                venue_ask_time: timestamp,
                has_traded: true,
                state: 'active',
              },
              close: null,
            };
          });
          return c.json(liveToolResult(id, tool, { results }, 'Real-time equity quotes for requested symbols.'));
        }
        case 'get_equity_price_book': {
          const symbols = requestedSymbols(args);
          if (symbols.length > 4) {
            const error = mcpError(id, 'symbols must contain at most 4 items', 400);
            return c.json(error.payload, error.status);
          }
          const books = [];
          const errors = [];
          for (const symbol of symbols) {
            const quote = (s.quotes ?? []).find((row) => normalizeSymbol(row.symbol) === symbol);
            if (!quote) {
              errors.push({ symbol, error: 'Symbol did not resolve to an available equity price book.' });
              continue;
            }
            const ask = Number(quote.ask ?? quote.price);
            const bid = Number(quote.bid ?? quote.price);
            books.push({
              symbol,
              updated_at: quote.updated_at ?? fixedNow,
              asks: [
                { price: ask.toFixed(6), quantity: 140 },
                { price: (ask + 0.01).toFixed(6), quantity: 270 },
                { price: (ask + 0.02).toFixed(6), quantity: 209 },
              ],
              bids: [
                { price: bid.toFixed(6), quantity: 100 },
                { price: (bid - 0.01).toFixed(6), quantity: 5 },
                { price: (bid - 0.02).toFixed(6), quantity: 30 },
              ],
            });
          }
          return c.json(liveToolResult(id, tool, { books, errors }, 'asks are lowest-first and bids are highest-first; quantity is resting share size. A symbol appears in books or errors, never both.'));
        }
        case 'get_equity_tax_lots':
          return c.json(liveToolResult(id, tool, equityTaxLotsResult(s, args), 'Open tax lots for the requested equity holding, newest acquired first.'));
        case 'get_equity_historicals': {
          if (!parseRfc3339(args.start_time ?? args.startTime)) {
            const error = mcpError(id, "start_time must be RFC3339 (e.g. '2026-01-01T00:00:00Z')", 400);
            return c.json(error.payload, error.status);
          }
          if ((args.end_time || args.endTime) && !parseRfc3339(args.end_time ?? args.endTime)) {
            const error = mcpError(id, "end_time must be RFC3339 (e.g. '2026-01-08T00:00:00Z')", 400);
            return c.json(error.payload, error.status);
          }
          return c.json(liveToolResult(id, tool, { results: equityHistoricalResults(s, args) }, "Bars are left-edge labeled in UTC; convert to the user's timezone for presentation."));
        }
        case 'get_equity_technical_indicators': {
          if (!parseRfc3339(args.start_time)) {
            const error = mcpError(id, "start_time must be RFC3339 (e.g. '2026-01-01T00:00:00Z')", 400);
            return c.json(error.payload, error.status);
          }
          return c.json(liveToolResult(id, tool, equityTechnicalIndicatorResult(s, args), 'Technical-indicator values are computed from the returned equity historical bars.'));
        }
        case 'get_equity_fundamentals': {
          const symbols = requestedSymbols(args);
          return c.json(liveToolResult(id, tool, { results: (s.equityFundamentals ?? []).filter((row) => symbols.includes(row.symbol)) }, 'Fundamentals for requested equity symbols.'));
        }
        case 'get_financials': {
          const symbols = requestedSymbols(args);
          const period = args.period ?? 'quarterly';
          const limit = Math.min(Number(args.limit ?? 4), 40);
          const results = symbols.map((symbol) => ({ symbol, period, financials: (s.financials?.[symbol] ?? []).slice(0, limit) }));
          return c.json(liveToolResult(id, tool, { results }, 'Financial periods are most-recent-first; net_margin is already a percentage.'));
        }
        case 'get_equity_orders':
          return c.json(liveToolResult(id, tool, { orders: s.orders, next: null }, 'Equity orders for the requested account.'));
        case 'get_equity_tradability': {
          const symbols = requestedSymbols(args);
          return c.json(liveToolResult(id, tool, { results: symbols.map((symbol) => ({ symbol, tradeable: true, fractional_tradability: 'tradable' })) }, 'Tradability by requested symbol.'));
        }
        case 'get_indexes':
          return c.json(liveToolResult(id, tool, { indexes: s.indexes ?? [] }, 'Market indexes matching the requested symbols.'));
        case 'get_index_quotes': {
          const ids = new Set(requestedExplicitOptionIds(args));
          const symbols = new Set((s.indexes ?? []).filter((index) => ids.has(String(index.id))).map((index) => index.symbol));
          return c.json(liveToolResult(id, tool, { quotes: (s.indexQuotes ?? []).filter((quote) => symbols.has(quote.symbol) || ids.has(String(quote.instrument_id ?? quote.id))) }, 'Index quotes for requested instrument_ids.'));
        }
        case 'review_equity_order': {
          const accountError = validateTradingAccount(id, s, args);
          if (accountError) return c.json(accountError.payload, accountError.status);
          const shapeError = validateOrderShape(id, args);
          if (shapeError) return c.json(shapeError.payload, shapeError.status);
          return c.json(liveToolResult(id, tool, equityReviewData(args), 'Review only; no order was placed.'));
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
            instrument_id: `instrument-${normalizeSymbol(args.symbol).toLowerCase()}`,
            symbol: args.symbol ?? 'AAPL',
            side: args.side ?? 'buy',
            quantity: args.quantity ?? args.qty ?? '1',
            dollar_amount: args.dollar_amount,
            notional: args.notional,
            type: normalizedEquityOrderType(args),
            price: args.limit_price ?? args.limitPrice ?? null,
            limit_price: args.limit_price ?? args.limitPrice,
            stop_price: args.stop_price ?? args.stopPrice,
            status: 'accepted',
            state: 'accepted',
            trigger: ['stop_market', 'stop_limit'].includes(normalizedEquityOrderType(args)) ? 'stop' : 'immediate',
            created_at: fixedNow,
            submitted_at: fixedNow,
          };
          s.orders.push(order);
          save(store, s);
          return c.json(liveToolResult(id, tool, { order }, 'Order accepted by emulator state.'));
        }
        case 'cancel_equity_order': {
          const order = s.orders.find((row) => row.id === args.order_id || row.id === args.id);
          if (order) order.status = 'canceled';
          save(store, s);
          return c.json(liveToolResult(id, tool, { accepted: Boolean(order) }, 'accepted=true means the cancel request was accepted.'));
        }
        case 'get_option_chains':
          return c.json(liveToolResult(id, tool, { chains: filteredOptionChains(s, args), next: null }, 'Option chains for requested underlyings or ids.'));
        case 'get_option_instruments':
          return c.json(liveToolResult(id, tool, { instruments: filteredOptionInstruments(s, args), next: null }, 'Option instruments matching the requested filters.'));
        case 'get_option_level_upgrade_info': {
          const accountNumber = String(args.account_number);
          const account = s.accounts.find((row) => String(row.account_number) === accountNumber);
          if (!account) return c.json(mcpError(id, 'Account not found', 404).payload, 404);
          return c.json(liveToolResult(id, tool, {
            upgrade_url: `https://applink.robinhood.com/upgrade_options?account_number=${encodeURIComponent(accountNumber)}`,
            account_number: accountNumber,
          }, 'Present upgrade_url to the user. After approval, call get_accounts again to refresh option_level.'));
        }
        case 'get_option_quotes': {
          const optionIds = new Set(requestedOptionIds(args, s));
          const results = s.optionQuotes.filter((row) => optionIds.has(row.instrument_id ?? row.option_id)).map((row) => ({
            quote: {
              instrument_id: row.instrument_id,
              ask_price: row.ask,
              ask_size: 1,
              bid_price: row.bid,
              bid_size: 1,
              mark_price: row.mark_price,
              adjusted_mark_price: row.mark_price,
              implied_volatility: row.implied_volatility,
              delta: row.delta,
              gamma: row.gamma,
              rho: row.rho,
              theta: row.theta,
              vega: row.vega,
              open_interest: row.open_interest,
              volume: row.volume,
              updated_at: row.updated_at,
            },
            close: null,
          }));
          return c.json(liveToolResult(id, tool, { results }, 'Option quotes for requested instrument_ids.'));
        }
        case 'get_option_historicals': {
          if (!parseRfc3339(args.start_time ?? args.startTime)) {
            const error = mcpError(id, "start_time must be RFC3339 (e.g. '2026-01-01T00:00:00Z')", 400);
            return c.json(error.payload, error.status);
          }
          if ((args.end_time || args.endTime) && !parseRfc3339(args.end_time ?? args.endTime)) {
            const error = mcpError(id, "end_time must be RFC3339 (e.g. '2026-01-08T00:00:00Z')", 400);
            return c.json(error.payload, error.status);
          }
          return c.json(liveToolResult(id, tool, { results: optionHistoricalResults(s, args) }, 'Bars are left-edge labeled in UTC. instrument_ids must be option contract UUIDs from get_option_instruments.'));
        }
        case 'get_option_positions':
          return c.json(liveToolResult(id, tool, { positions: filteredOptionPositions(s, args), next: null }, 'Option positions for the requested account.'));
        case 'get_option_orders':
          return c.json(liveToolResult(id, tool, { orders: filteredOptionOrders(s, args), next: null }, 'Option orders for the requested account.'));
        case 'get_realized_pnl':
          return c.json(liveToolResult(id, tool, realizedPnlResult(s, args), 'Realized P&L over the requested window.'));
        case 'get_pnl_trade_history':
          return c.json(liveToolResult(id, tool, pnlTradeHistoryResult(s, args), 'Trade-by-trade realized P&L history for the requested account.'));
        case 'get_scans':
          return c.json(liveToolResult(id, tool, { scans: (s.scans ?? []).map(scanData) }, 'Cortex-managed scans are read-only via MCP. Use run_scan to execute a saved scan.'));
        case 'get_scanner_filter_specs':
          return c.json(liveToolResult(id, tool, { filter_specs: s.scannerFilterSpecs ?? [] }, 'Use filter_type and supported predicates, intervals, lengths, and plots exactly as returned.'));
        case 'run_scan': {
          const scan = findScan(s, args);
          if (!scan) return c.json(mcpError(id, 'Scan not found', 404).payload, 404);
          return c.json(liveToolResult(id, tool, { result: scanResult(scan) }, 'Results are live market scan rows in the scan sort order.'));
        }
        case 'create_scan': {
          const filters = Array.isArray(args.filters) ? args.filters : [];
          const preset = String(args.preset ?? (filters.length ? 'INITIAL' : 'DAILY_GAINERS'));
          const title = String(args.title ?? preset.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase()));
          const scan = {
            scan_id: `scan-${String(s.nextScanId++).padStart(3, '0')}`,
            title,
            preset,
            filters,
            filter_summary: scanFiltersForSummary(filters),
            columns: ['Symbol', '% Change', 'Volume', 'Price'],
            sorting: { column: '% Change', direction: 'desc' },
            cortex_managed: false,
            results: (s.scans?.[0]?.results ?? []).map((row) => ({ ...row, columns: { ...row.columns } })),
          };
          s.scans = [...(s.scans ?? []), scan];
          save(store, s);
          return c.json(liveToolResult(id, tool, { result: scanResult(scan) }, 'Created saved scanner in emulator state.'));
        }
        case 'update_scan_filters': {
          const scan = findScan(s, args);
          if (!scan) return c.json(mcpError(id, 'Scan not found', 404).payload, 404);
          if (scan.cortex_managed) return c.json(mcpError(id, 'Cortex-managed scans are read-only via MCP', 400).payload, 400);
          scan.filters = Array.isArray(args.filters) ? args.filters : [];
          scan.filter_summary = scanFiltersForSummary(scan.filters);
          save(store, s);
          return c.json(liveToolResult(id, tool, { result: scanResult(scan) }, 'Filters replaced on the saved scan.'));
        }
        case 'update_scan_config': {
          const scan = findScan(s, args);
          if (!scan) return c.json(mcpError(id, 'Scan not found', 404).payload, 404);
          if (scan.cortex_managed) return c.json(mcpError(id, 'Cortex-managed scans are read-only via MCP', 400).payload, 400);
          const sortingColumn = String(args.sorting_column ?? args.sortingColumn ?? '');
          const sortingDirection = String(args.sorting_direction ?? args.sortingDirection ?? 'asc').toLowerCase();
          const columns = scan.columns ?? Object.keys(scan.results?.[0]?.columns ?? {});
          if (sortingColumn && columns.length && !columns.includes(sortingColumn)) {
            return c.json(mcpError(id, `sorting_column must match a visible column. Available columns: ${columns.join(', ')}`, 400).payload, 400);
          }
          scan.sorting = { column: sortingColumn || scan.sorting?.column || 'Symbol', direction: sortingDirection === 'desc' ? 'desc' : 'asc' };
          save(store, s);
          return c.json(liveToolResult(id, tool, { result: scanResult(scan) }, 'Sort configuration updated on the saved scan.'));
        }
        case 'get_option_watchlist': {
          const watchlist = findWatchlist(s, args);
          const optionIds = new Set(watchlist?.option_ids ?? []);
          const items = s.optionQuotes.filter((quote) => optionIds.has(quote.instrument_id ?? quote.option_id)).map((quote) => ({
            id: `option-watchlist-${quote.instrument_id}`,
            name: `${quote.symbol} option`,
            chain_symbol: quote.symbol,
            contract_type: 'call',
            expiration_date: '2026-06-22',
            strike_price: '225.0000',
            option_ids: [quote.instrument_id],
          }));
          return c.json(liveToolResult(id, tool, { list_id: watchlist?.id ?? null, items }, 'Options watchlist items.'));
        }
        case 'get_popular_watchlists':
          return c.json(
            liveToolResult(
              id,
              tool,
              {
                lists: [
                { id: 'popular-tech', display_name: 'Popular Tech', symbols: ['AAPL', 'MSFT', 'NVDA'], followed: false },
                { id: 'popular-indexes', display_name: 'Major Indexes', symbols: ['SPX', 'NDX'], followed: false },
                ],
                next: null,
              },
              'Popular Robinhood-curated watchlists.',
            ),
          );
        case 'review_option_order': {
          const accountError = validateTradingAccount(id, s, args);
          if (accountError) return c.json(accountError.payload, accountError.status);
          const shapeError = validateOptionOrderShape(id, args);
          if (shapeError) return c.json(shapeError.payload, shapeError.status);
          return c.json(liveToolResult(id, tool, optionReviewData(args), 'Review only; no option order was placed.'));
        }
        case 'place_option_order': {
          const accountError = validateTradingAccount(id, s, args);
          if (accountError) return c.json(accountError.payload, accountError.status);
          const shapeError = validateOptionOrderShape(id, args);
          if (shapeError) return c.json(shapeError.payload, shapeError.status);
          const order = optionOrder(id, s, args);
          s.optionOrders.push(order);
          save(store, s);
          return c.json(liveToolResult(id, tool, { order }, 'Option order accepted by emulator state.'));
        }
        case 'cancel_option_order': {
          const order = s.optionOrders.find((row) => row.id === args.order_id || row.id === args.id);
          if (order) order.status = 'canceled';
          save(store, s);
          return c.json(liveToolResult(id, tool, { accepted: Boolean(order) }, 'accepted=true means the cancel request was accepted.'));
        }
        case 'get_watchlists':
          return c.json(liveToolResult(id, tool, { watchlists: s.watchlists.map(watchlistData) }, watchlistGuide));
        case 'get_watchlist_items': {
          const watchlist = findWatchlist(s, args);
          return c.json(liveToolResult(id, tool, { items: watchlistItems(watchlist), has_futures_contracts: false }, watchlistItemsGuide));
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
          return c.json(liveToolResult(id, tool, { watchlist: watchlistData(watchlist) }, 'On success the response includes the new list_id; pass it to add_to_watchlist to populate the list.'));
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
          return c.json(liveToolResult(id, tool, { watchlist: watchlistData(watchlist) }, 'On success the response contains the full updated list.'));
        }
        case 'add_to_watchlist': {
          const watchlist = findWatchlist(s, args);
          if (!watchlist) return c.json(mcpError(id, 'Watchlist not found', 404).payload, 404);
          const operation = singleAssetWatchlistOperation(args);
          watchlist.symbols = upsertIntoArray(watchlist.symbols, operation.symbols);
          watchlist.currency_pair_ids = upsertIntoArray(watchlist.currency_pair_ids, operation.currency_pair_ids);
          watchlist.index_ids = upsertIntoArray(watchlist.index_ids, operation.index_ids);
          save(store, s);
          return c.json(liveToolResult(id, tool, { ...operation, list_id: watchlist.id, operation: 'create', status: 'ok' }, 'On success the response echoes the operations applied.'));
        }
        case 'add_option_to_watchlist': {
          const watchlist = findWatchlist(s, args);
          if (!watchlist) return c.json(mcpError(id, 'Watchlist not found', 404).payload, 404);
          watchlist.option_ids = upsertIntoArray(watchlist.option_ids, requestedOptionIds(args, s));
          save(store, s);
          return c.json(
            liveToolResult(
              id,
              tool,
              {
                option_ids: requestedOptionIds(args, s),
                position_type: args.position_type ?? args.positionType ?? 'long',
                list_id: watchlist.id,
                operation: 'create',
                status: 'ok',
              },
              'Each option_id is added as a single-leg position with the supplied position_type.',
            ),
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
          return c.json(liveToolResult(id, tool, { ...operation, list_id: watchlist.id, operation: 'delete', status: 'ok' }, 'On success the response echoes the operations applied.'));
        }
        case 'remove_option_from_watchlist': {
          const watchlist = findWatchlist(s, args);
          if (!watchlist) return c.json(mcpError(id, 'Watchlist not found', 404).payload, 404);
          const optionIds = requestedOptionIds(args, s);
          watchlist.option_ids = removeFromArray(watchlist.option_ids, optionIds);
          save(store, s);
          return c.json(
            liveToolResult(
              id,
              tool,
              {
                option_ids: optionIds,
                position_type: args.position_type ?? args.positionType ?? 'long',
                list_id: watchlist.id,
                operation: 'delete',
                status: 'ok',
              },
              'Contracts not on the list are no-ops.',
            ),
          );
        }
        case 'follow_watchlist': {
          const watchlist = findWatchlist(s, args);
          if (!watchlist) return c.json(mcpError(id, 'Watchlist not found', 404).payload, 404);
          watchlist.followed = true;
          s.followedWatchlists = upsertIntoArray(s.followedWatchlists, [watchlist.id]);
          save(store, s);
          return c.json(
            liveToolResult(
              id,
              tool,
              {
                follower: { list_id: watchlist.id, user_id: 'user-emulator', owner_type: watchlist.owner_type ?? 'custom', created_at: fixedNow },
                list_id: watchlist.id,
                action: 'followed',
                status: 'ok',
              },
              'Use only for curated lists; the user already owns their custom lists.',
            ),
          );
        }
        case 'unfollow_watchlist': {
          const watchlist = findWatchlist(s, args);
          if (!watchlist) return c.json(mcpError(id, 'Watchlist not found', 404).payload, 404);
          watchlist.followed = false;
          s.followedWatchlists = removeFromArray(s.followedWatchlists, [watchlist.id]);
          save(store, s);
          return c.json(liveToolResult(id, tool, { list_id: watchlist.id, action: 'unfollowed', status: 'ok' }, "404 means the user wasn't following that list."));
        }
        case 'search': {
          const query = String(args.query ?? '').toLowerCase();
          const assetType = String(args.asset_type ?? args.assetType ?? 'instrument');
          if (assetType === 'currency_pair') {
            const currencyPairs = (s.currencyPairs ?? []).filter((row) => `${row.symbol} ${row.name}`.toLowerCase().includes(query));
            return c.json(liveToolResult(id, tool, { currency_pairs: currencyPairs.length ? currencyPairs : s.currencyPairs ?? [] }, 'Search results for the requested asset type.'));
          }
          if (assetType === 'market_index') {
            const marketIndexes = (s.indexes ?? []).filter((row) => `${row.symbol} ${row.name}`.toLowerCase().includes(query));
            return c.json(liveToolResult(id, tool, { market_indexes: marketIndexes.length ? marketIndexes : s.indexes ?? [] }, 'Search results for the requested asset type.'));
          }
          return c.json(liveToolResult(id, tool, { results: [{ instrument_id: 'instrument-aapl', symbol: 'AAPL', name: 'Apple Inc.' }] }, 'Search results for the requested asset type.'));
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
