import { fixedNow, getState, readBody, setState } from '../scripts/provider-plugin-kit.mjs';

const STATE_KEY = 'robinhood:state';

function defaultState(baseUrl = 'https://api.robinhood.com') {
  return {
    baseUrl,
    auth: {
      access_token: 'robinhood_emulator_access',
      refresh_token: 'robinhood_emulator_refresh',
      token_type: 'Bearer',
      scope: 'internal',
      mfa_required: false,
      expires_in: 31536000,
      user_id: 'user_emulator',
    },
    challenge: {
      id: 'challenge_emulator',
      user_id: 'user_emulator',
      type: 'sms',
      status: 'validated',
      remaining_attempts: 3,
      expires_at: fixedNow,
    },
    user: {
      id: 'user_emulator',
      username: 'emulator',
      email: 'emulator@example.test',
      first_name: 'Robin',
      last_name: 'Emulator',
      id_info: 'verified',
      international_info: 'not_required',
      basic_info: 'complete',
      investment_profile: 'complete',
    },
    accounts: [
      {
        id: 'acct_emulator',
        url: `${baseUrl}/accounts/acct_emulator/`,
        account_number: 'RH00000001',
        status: 'active',
        type: 'cash',
        buying_power: '10000.00',
        cash: '10000.00',
        portfolio_cash: '10000.00',
        currency: 'USD',
        created_at: fixedNow,
      },
    ],
    portfolios: [
      {
        account: `${baseUrl}/accounts/acct_emulator/`,
        market_value: '12631.25',
        equity: '22631.25',
        adjusted_equity_previous_close: '22500.00',
        withdrawable_amount: '10000.00',
        excess_margin: '10000.00',
        excess_maintenance: '10000.00',
        start_date: '2026-01-01',
      },
    ],
    positions: [
      {
        account: `${baseUrl}/accounts/acct_emulator/`,
        instrument: `${baseUrl}/instruments/hood-instrument-aapl/`,
        instrument_id: 'hood-instrument-aapl',
        symbol: 'AAPL',
        quantity: '5.00000000',
        average_buy_price: '180.00',
        created_at: fixedNow,
        updated_at: fixedNow,
      },
      {
        account: `${baseUrl}/accounts/acct_emulator/`,
        instrument: `${baseUrl}/instruments/hood-instrument-hood/`,
        instrument_id: 'hood-instrument-hood',
        symbol: 'HOOD',
        quantity: '25.00000000',
        average_buy_price: '28.00',
        created_at: fixedNow,
        updated_at: fixedNow,
      },
    ],
    instruments: [
      { id: 'hood-instrument-aapl', symbol: 'AAPL', simple_name: 'Apple', name: 'Apple Inc.', tradeable: true, tradability: 'tradable', type: 'stock' },
      { id: 'hood-instrument-hood', symbol: 'HOOD', simple_name: 'Robinhood', name: 'Robinhood Markets, Inc.', tradeable: true, tradability: 'tradable', type: 'stock' },
      { id: 'hood-instrument-msft', symbol: 'MSFT', simple_name: 'Microsoft', name: 'Microsoft Corporation', tradeable: true, tradability: 'tradable', type: 'stock' },
    ],
    holdings: [{ account_id: 'acct_emulator', asset_code: 'BTC', total_quantity: '0.12500000', quantity_available_for_trading: '0.12500000' }],
    currencyPairs: [{ id: 'BTC-USD', asset_currency: { code: 'BTC', name: 'Bitcoin' }, quote_currency: { code: 'USD', name: 'US Dollar' }, symbol: 'BTC-USD', tradability: 'tradable' }],
    quotes: [
      { symbol: 'BTC-USD', bid_inclusive_of_sell_spread: '65000.00', ask_inclusive_of_buy_spread: '65100.00', mark_price: '65050.00', last_trade_price: '65050.00' },
      { symbol: 'AAPL', last_trade_price: '202.00', previous_close: '200.00', ask_price: '202.10', bid_price: '201.90', trading_halted: false },
      { symbol: 'HOOD', last_trade_price: '44.25', previous_close: '43.10', ask_price: '44.30', bid_price: '44.20', trading_halted: false },
      { symbol: 'MSFT', last_trade_price: '425.00', previous_close: '421.50', ask_price: '425.20', bid_price: '424.90', trading_halted: false },
    ],
    watchlists: [{ name: 'Default', symbols: ['AAPL', 'HOOD', 'MSFT', 'BTC-USD'] }],
    notifications: [
      {
        id: 'notification_emulator',
        type: 'portfolio',
        title: 'Portfolio ready',
        message: 'Your emulator account is active.',
        read: false,
        destination: 'portfolio',
        created_at: fixedNow,
      },
    ],
    optionsAccounts: [
      {
        id: 'options_acct_emulator',
        account: `${baseUrl}/accounts/acct_emulator/`,
        state: 'approved',
        trading_level: 'level_2',
        cash_available: '10000.00',
        buying_power: '10000.00',
        created_at: fixedNow,
      },
    ],
    applications: [
      {
        id: 'application_emulator',
        state: 'approved',
        account_type: 'individual',
        user: `${baseUrl}/user/`,
        created_at: fixedNow,
        updated_at: fixedNow,
      },
    ],
    markets: [
      { acronym: 'XNYS', name: 'New York Stock Exchange', city: 'New York', country: 'US', timezone: 'America/New_York', todays_hours: '9:30 AM - 4:00 PM EDT', mic: 'XNYS', website: 'https://www.nyse.com' },
      { acronym: 'XNAS', name: 'Nasdaq', city: 'New York', country: 'US', timezone: 'America/New_York', todays_hours: '9:30 AM - 4:00 PM EDT', mic: 'XNAS', website: 'https://www.nasdaq.com' },
    ],
    achRelationships: [
      {
        id: 'ach_relationship_emulator',
        url: `${baseUrl}/ach/relationships/ach_relationship_emulator/`,
        bank_account_nickname: 'Emulator Checking',
        bank_account_type: 'checking',
        bank_account_number: '****0100',
        verified: true,
        verification_method: 'instant',
        created_at: fixedNow,
      },
    ],
    achTransfers: [],
    documents: [],
    orders: [],
    nextId: 1,
  };
}

const state = (store) => getState(store, STATE_KEY, () => defaultState());
const save = (store, next) => setState(store, STATE_KEY, next);
const page = (results) => ({ next: null, previous: null, results });
const error = (c, detail, status = 400) => c.json({ detail }, status);
const ok = (value = {}) => ({ status: 'ok', ...value });

function pairParam(c) {
  return c.req.query('symbol') ?? c.req.query('currency_pair_id') ?? c.req.query('asset_code') ?? 'BTC-USD';
}

function csv(value, fallback = []) {
  return value ? String(value).split(',').map((item) => item.trim()).filter(Boolean) : fallback;
}

function authPayload(s, body = {}) {
  const deviceToken = body.device_token ?? body.deviceToken ?? body.device_id ?? 'robinhood-emulator-device';
  return {
    ...s.auth,
    grant_type: body.grant_type ?? 'password',
    username: body.username ?? s.user.username,
    user: s.user,
    challenge: null,
    challenge_id: null,
    challenge_type: null,
    challenge_required: false,
    challenge_response_id: body.challenge_response_id ?? 'challenge_response_emulator',
    backup_code: null,
    device_token: deviceToken,
    device_id: deviceToken,
  };
}

function challengePayload(s, id = s.challenge.id) {
  return {
    ...s.challenge,
    id,
    challenge_response_id: 'challenge_response_emulator',
  };
}

function basicInfoPayload(s) {
  return {
    user: `${s.baseUrl}/user/`,
    phone_number: '+15555550100',
    date_of_birth: '1990-01-01',
    citizenship: 'USA',
    tax_id_ssn: 'XXX-XX-0000',
    address: {
      street_address: '1 Emulator Way',
      city: 'Menlo Park',
      state: 'CA',
      zipcode: '94025',
      country: 'USA',
    },
    updated_at: fixedNow,
  };
}

function investmentProfilePayload(s) {
  return {
    user: `${s.baseUrl}/user/`,
    annual_income: '100000_149999',
    investment_experience: 'good',
    investment_objective: 'growth',
    liquidity_needs: 'not_important',
    risk_tolerance: 'medium_risk_tolerance',
    source_of_funds: 'savings_personal_income',
    time_horizon: 'long_time_horizon',
    updated_at: fixedNow,
  };
}

function additionalInfoPayload(s) {
  return {
    user: `${s.baseUrl}/user/`,
    employment_status: 'employed',
    occupation: 'software_engineer',
    employer_name: 'Emulator',
    control_person: false,
    security_affiliated_employee: false,
    updated_at: fixedNow,
  };
}

function userIdPayload(s) {
  return {
    user: `${s.baseUrl}/user/`,
    status: 'verified',
    type: 'ssn',
    created_at: fixedNow,
    updated_at: fixedNow,
  };
}

function quotePayload(quote) {
  return {
    symbol: quote.symbol,
    last_trade_price: quote.last_trade_price ?? quote.mark_price,
    adjusted_previous_close: quote.previous_close ?? quote.mark_price,
    previous_close: quote.previous_close ?? quote.mark_price,
    ask_price: quote.ask_price ?? quote.ask_inclusive_of_buy_spread ?? quote.mark_price,
    bid_price: quote.bid_price ?? quote.bid_inclusive_of_sell_spread ?? quote.mark_price,
    trading_halted: quote.trading_halted ?? false,
    updated_at: fixedNow,
  };
}

function quoteForSymbol(s, symbol) {
  return quotePayload(s.quotes.find((quote) => quote.symbol === symbol) ?? { symbol, last_trade_price: '0.00', previous_close: '0.00' });
}

function enrichedPositions(s) {
  return s.positions.map((position) => ({
    ...position,
    quote: quoteForSymbol(s, position.symbol),
    instrument: s.instruments.find((instrument) => instrument.symbol === position.symbol) ?? position.instrument,
  }));
}

function watchlistPayload(s, watchlist = s.watchlists[0]) {
  return {
    id: 'watchlist_default',
    name: watchlist.name,
    display_name: watchlist.name,
    owner_type: 'custom',
    symbols: watchlist.symbols,
    instruments: watchlist.symbols
      .filter((symbol) => !symbol.includes('-'))
      .map((symbol) => s.instruments.find((instrument) => instrument.symbol === symbol))
      .filter(Boolean),
    quotes: watchlist.symbols.map((symbol) => quoteForSymbol(s, symbol)),
    updated_at: fixedNow,
  };
}

function userDefaultsPayload(s) {
  return {
    defaults: {
      account: s.accounts[0].url,
      account_id: s.accounts[0].id,
      portfolio: s.portfolios[0],
      watchlist: 'watchlist_default',
      currency: 'USD',
      home_sections: ['portfolio', 'positions', 'watchlist', 'crypto'],
    },
    user_defaults: {
      default_account: s.accounts[0].url,
      default_account_id: s.accounts[0].id,
      default_watchlist_id: 'watchlist_default',
      preferred_currency: 'USD',
      portfolio_modules: ['summary', 'positions', 'watchlist', 'crypto'],
      watchlist_symbols: s.watchlists[0].symbols,
    },
  };
}

function userSettingsPayload(s) {
  const settings = {
    home: { default_tab: 'investing', modules: ['portfolio', 'positions', 'watchlist', 'crypto'] },
    portfolio: { show_positions: true, show_chart: true, show_buying_power: true },
    watchlist: { default_watchlist_id: 'watchlist_default', symbols: s.watchlists[0].symbols },
    notifications: { push_enabled: true, inbox_badge_enabled: true },
  };
  return {
    settings,
    results: Object.entries(settings).map(([key, value]) => ({ key, value, updated_at: fixedNow })),
  };
}

function accountSwitcherPayload(s) {
  return {
    selected_account_id: s.accounts[0].id,
    accounts: s.accounts.map((account) => ({
      id: account.id,
      account_number: account.account_number,
      label: 'Individual',
      type: account.type,
      status: account.status,
      equity: s.portfolios[0].equity,
      buying_power: account.buying_power,
      currency: account.currency,
    })),
  };
}

function unifiedAccountsPayload(s) {
  return {
    default_account_id: s.accounts[0].id,
    accounts: s.accounts,
    portfolios: s.portfolios,
    positions: enrichedPositions(s),
    crypto_accounts: [{ id: 'crypto_acct_emulator', status: 'active', account_number: 'RHC0000001', currency: 'USD' }],
    options_accounts: s.optionsAccounts,
  };
}

function rhyAccountsPayload(s) {
  return {
    accounts: s.accounts.map((account) => ({
      ...account,
      portfolio: s.portfolios[0],
      positions: enrichedPositions(s),
      watchlists: [watchlistPayload(s)],
    })),
    primary_account_id: s.accounts[0].id,
  };
}

function rhyTabStatePayload(s) {
  return {
    selected_tab: 'investing',
    tabs: [
      { id: 'investing', title: 'Investing', enabled: true, account_id: s.accounts[0].id },
      { id: 'crypto', title: 'Crypto', enabled: true, account_id: 'crypto_acct_emulator' },
      { id: 'retirement', title: 'Retirement', enabled: false },
    ],
  };
}

function cryptoHomePayload(s) {
  return {
    account: { id: 'crypto_acct_emulator', status: 'active', currency: 'USD' },
    holdings: s.holdings,
    currency_pairs: s.currencyPairs,
    quotes: s.quotes.filter((quote) => quote.symbol.includes('-')).map(quotePayload),
    cards: [
      { id: 'btc_holding', title: 'Bitcoin', subtitle: '0.125 BTC', asset_code: 'BTC' },
    ],
  };
}

function discoveryListsPayload(s, ownerType = 'custom') {
  return page([{ ...watchlistPayload(s), owner_type: ownerType }]);
}

function profilePagePayload(s) {
  return {
    user: s.user,
    sections: [
      { id: 'account', title: 'Account', rows: [{ id: 'account_center', title: 'Account center', destination: 'account_center' }] },
      { id: 'transfers', title: 'Transfers', rows: [{ id: 'transfer_accounts', title: 'Transfer accounts', destination: 'transfer_accounts' }] },
      { id: 'documents', title: 'Documents', rows: [] },
    ],
  };
}

function transferAccountsPayload(s) {
  return {
    brokerage_accounts: s.accounts,
    ach_relationships: s.achRelationships,
    default_account_id: s.accounts[0].id,
    suggested_amounts: ['25.00', '100.00', '500.00', '1000.00'],
  };
}

function marketdataQuotesPayload(s, c) {
  const ids = csv(c.req.query('ids'));
  const symbols = csv(c.req.query('symbols') ?? c.req.query('symbol'), ids.length ? [] : s.quotes.map((quote) => quote.symbol));
  const quotes = symbols.map((symbol) => quoteForSymbol(s, symbol));
  if (ids.length) {
    quotes.push(...ids.map((id, index) => ({
      id,
      instrument_id: id,
      symbol: s.instruments[index % s.instruments.length]?.symbol ?? 'AAPL',
      last_trade_price: s.quotes[index % s.quotes.length]?.last_trade_price ?? '202.00',
      previous_close: s.quotes[index % s.quotes.length]?.previous_close ?? '200.00',
      trading_halted: false,
      updated_at: fixedNow,
    })));
  }
  return { results: quotes };
}

function homePayload(s) {
  return {
    user: s.user,
    account: s.accounts[0],
    portfolio: s.portfolios[0],
    positions: enrichedPositions(s),
    watchlists: [watchlistPayload(s)],
    onboarding: { state: 'complete', application: s.applications[0] },
    features: { portfolio: true, positions: true, watchlists: true, crypto: true, options: true },
    experiments: {
      ios_home_v2: { enabled: true, variant: 'treatment', value: 'modules' },
      portfolio_modules: { enabled: true, variant: 'treatment', value: 'summary_positions_watchlist' },
    },
    notifications: s.notifications,
    crypto: {
      accounts: s.accounts,
      holdings: s.holdings,
      currency_pairs: s.currencyPairs,
      quotes: s.quotes.filter((quote) => quote.symbol.includes('-')).map(quotePayload),
    },
    cards: [
      { id: 'portfolio', type: 'portfolio_summary', title: 'Portfolio', subtitle: '$22,631.25', value: s.portfolios[0].equity, action: 'open_portfolio' },
      { id: 'positions', type: 'positions', title: 'Positions', subtitle: '2 holdings', items: enrichedPositions(s), action: 'open_positions' },
      { id: 'watchlist', type: 'watchlist', title: 'Watchlist', subtitle: '4 symbols', items: watchlistPayload(s).quotes, action: 'open_watchlist' },
      { id: 'crypto', type: 'crypto', title: 'Crypto', subtitle: 'BTC-USD', items: cryptoHomePayload(s).holdings, action: 'open_crypto' },
    ],
  };
}

function mobileConfigPayload() {
  return {
    minimum_supported_version: '1.0.0',
    force_upgrade: false,
    features: { portfolio: true, positions: true, watchlists: true, crypto: true, options: true },
    experiments: { ios_home_v2: 'treatment', portfolio_modules: 'treatment' },
    endpoints: {
      api: 'https://api.robinhood.com',
      bonfire: 'https://bonfire.robinhood.com',
      nummus: 'https://nummus.robinhood.com',
      midlands: 'https://midlands.robinhood.com',
    },
  };
}

function marketHoursPayload(market = 'XNYS', date = '2026-05-16') {
  return {
    market,
    date,
    is_open: false,
    opens_at: '2026-05-18T13:30:00Z',
    closes_at: '2026-05-18T20:00:00Z',
    extended_opens_at: '2026-05-18T08:00:00Z',
    extended_closes_at: '2026-05-19T00:00:00Z',
    all_day_opens_at: '2026-05-18T00:00:00Z',
    all_day_closes_at: '2026-05-19T00:00:00Z',
    regular_hours_opens_at: '2026-05-18T13:30:00Z',
    regular_hours_closes_at: '2026-05-18T20:00:00Z',
    next_open_hours: {
      date: '2026-05-18',
      opens_at: '2026-05-18T13:30:00Z',
      closes_at: '2026-05-18T20:00:00Z',
      extended_opens_at: '2026-05-18T08:00:00Z',
      extended_closes_at: '2026-05-19T00:00:00Z',
      is_open: false,
    },
    previous_open_hours: {
      date: '2026-05-15',
      opens_at: '2026-05-15T13:30:00Z',
      closes_at: '2026-05-15T20:00:00Z',
      extended_opens_at: '2026-05-15T08:00:00Z',
      extended_closes_at: '2026-05-16T00:00:00Z',
      is_open: false,
    },
    timezone: 'America/New_York',
  };
}

function kaizenExperimentsPayload(c) {
  const names = csv(c.req.queries?.('names')?.join(',') ?? c.req.query('names'), ['ios_home_v2', 'portfolio_modules', 'watchlist_refresh', 'bonfire_account_defaults']);
  return {
    results: names.map((name) => ({ name, enabled: false, variant: 'control', value: null })),
    experiments: Object.fromEntries(names.map((name) => [name, { enabled: false, variant: 'control', value: null }])),
    entity_type: c.req.query('entityType') ?? 'Device Id',
  };
}

function vitalsPayload() {
  return {
    force_upgrade: false,
    upgrade_required: false,
    minimum_supported_version: '1.0.0',
    features: { portfolio_enabled: true, watchlists_enabled: true, crypto_enabled: true, options_enabled: true },
    vitals: { session_state: 'authenticated', account_state: 'active', market_data_state: 'ready' },
  };
}

function equityOrderPayload(s, body = {}) {
  const instrument = body.instrument ?? `${s.baseUrl}/instruments/hood-instrument-aapl/`;
  return {
    id: `equity_order_${String(s.nextId++).padStart(6, '0')}`,
    ref_id: body.ref_id ?? `ref_${s.nextId}`,
    account: body.account ?? `${s.baseUrl}/accounts/${s.accounts[0].id}/`,
    instrument,
    symbol: body.symbol ?? s.instruments.find((row) => instrument.includes(row.id))?.symbol ?? 'AAPL',
    side: body.side ?? 'buy',
    type: body.type ?? 'market',
    trigger: body.trigger ?? 'immediate',
    time_in_force: body.time_in_force ?? 'gfd',
    quantity: body.quantity ?? '1.00000000',
    state: 'queued',
    created_at: fixedNow,
    updated_at: fixedNow,
  };
}

export function seedFromConfig(store, baseUrl = 'https://api.robinhood.com', config = {}) {
  return save(store, { ...defaultState(baseUrl), ...config });
}

export const contract = {
  provider: 'robinhood',
  source: 'Robinhood Crypto Trading API documentation-informed subset plus deterministic mobile auth fakeout surfaces',
  docs: 'https://docs.robinhood.com/crypto/trading/',
  baseUrl: 'https://api.robinhood.com',
  scope: ['auth', 'user', 'brokerage_accounts', 'portfolio', 'positions', 'watchlists', 'quotes', 'crypto_accounts', 'crypto_holdings', 'crypto_orders', 'crypto_currency_pairs', 'crypto_marketdata'],
  fidelity: 'stateful-rest-emulator',
};

export const plugin = {
  name: 'robinhood',
  register(app, store) {
    app.post('/oauth2/token/', async (c) => c.json(authPayload(state(store), await readBody(c))));
    app.post('/oauth2/token', async (c) => c.json(authPayload(state(store), await readBody(c))));
    app.post('/api/v1/oauth2/token/', async (c) => c.json(authPayload(state(store), await readBody(c))));
    app.post('/webauthn/challenge/create/', (c) => c.json({ status: 'ok', challenge_id: 'webauthn_challenge_emulator', challenge: 'webauthn_challenge_emulator' }));
    app.post('/api-token-auth/', async (c) => c.json(authPayload(state(store), await readBody(c))));
    app.post('/api-token-refresh/', (c) => c.json(authPayload(state(store))));
    app.post('/api-token-logout/', (c) => c.json(ok()));
    app.post('/login/', async (c) => c.json(authPayload(state(store), await readBody(c))));
    app.post('/api/v1/login/', async (c) => c.json(authPayload(state(store), await readBody(c))));
    app.post('/challenge/', (c) => c.json(challengePayload(state(store)), 201));
    app.get('/challenge/:id/', (c) => c.json(challengePayload(state(store), c.req.param('id'))));
    app.post('/challenge/:id/respond/', (c) => c.json({
      ...challengePayload(state(store), c.req.param('id')),
      status: 'validated',
    }));
    app.get('/user', (c) => c.json(state(store).user));
    app.get('/user/', (c) => c.json(state(store).user));
    app.get('/api/v1/user/', (c) => c.json(state(store).user));
    app.get('/user/basic_info/', (c) => c.json(basicInfoPayload(state(store))));
    app.get('/api/v1/user/basic_info/', (c) => c.json(basicInfoPayload(state(store))));
    app.get('/user/investment_profile/', (c) => c.json(investmentProfilePayload(state(store))));
    app.get('/api/v1/user/investment_profile/', (c) => c.json(investmentProfilePayload(state(store))));
    app.get('/user/additional_info/', (c) => c.json(additionalInfoPayload(state(store))));
    app.get('/api/v1/user/additional_info/', (c) => c.json(additionalInfoPayload(state(store))));
    app.get('/user/id/', (c) => c.json(userIdPayload(state(store))));
    app.get('/api/v1/user/id/', (c) => c.json(userIdPayload(state(store))));
    app.get('/applications/', (c) => c.json(page(state(store).applications)));
    app.get('/api/v1/applications/', (c) => c.json(page(state(store).applications)));
    app.get('/notifications/', (c) => c.json(page(state(store).notifications)));
    app.get('/api/v1/notifications/', (c) => c.json(page(state(store).notifications)));
    app.get('/markets/', (c) => c.json(page(state(store).markets)));
    app.get('/api/v1/markets/', (c) => c.json(page(state(store).markets)));
    app.get('/markets/:market/hours/:date/', (c) => c.json(marketHoursPayload(c.req.param('market'), c.req.param('date'))));
    app.get('/api/v1/markets/:market/hours/:date/', (c) => c.json(marketHoursPayload(c.req.param('market'), c.req.param('date'))));
    app.get('/documents/', (c) => c.json(page(state(store).documents)));
    app.get('/api/v1/documents/', (c) => c.json(page(state(store).documents)));
    app.get('/ach/relationships', (c) => c.json(page(state(store).achRelationships)));
    app.get('/ach/relationships/', (c) => c.json(page(state(store).achRelationships)));
    app.get('/api/v1/ach/relationships/', (c) => c.json(page(state(store).achRelationships)));
    app.get('/ach/transfers/', (c) => c.json(page(state(store).achTransfers)));
    app.get('/api/v1/ach/transfers/', (c) => c.json(page(state(store).achTransfers)));
    app.get('/accounts', (c) => c.json(page(state(store).accounts)));
    app.get('/accounts/', (c) => c.json(page(state(store).accounts)));
    app.get('/api/v1/accounts/', (c) => c.json(page(state(store).accounts)));
    app.get('/accounts/:id/', (c) => {
      const row = state(store).accounts.find((account) => account.id === c.req.param('id'));
      return row ? c.json(row) : error(c, 'Not found.', 404);
    });
    app.get('/portfolios/', (c) => c.json(page(state(store).portfolios)));
    app.get('/api/v1/portfolios/', (c) => c.json(page(state(store).portfolios)));
    app.get('/positions/', (c) => c.json(page(state(store).positions)));
    app.get('/api/v1/positions/', (c) => c.json(page(state(store).positions)));
    app.get('/watchlists/', (c) => c.json(page(state(store).watchlists)));
    app.get('/api/v1/watchlists/', (c) => c.json(page(state(store).watchlists)));
    app.get('/discovery/lists/default/', (c) => c.json(watchlistPayload(state(store))));
    app.get('/discovery/lists/default', (c) => c.json(watchlistPayload(state(store))));
    app.get('/discovery/lists/', (c) => c.json(discoveryListsPayload(state(store), c.req.query('owner_type') ?? 'custom')));
    app.get('/discovery/lists', (c) => c.json(discoveryListsPayload(state(store), c.req.query('owner_type') ?? 'custom')));
    app.get('/quotes/', (c) => {
      const symbols = csv(c.req.query('symbols') ?? c.req.query('symbol'), state(store).quotes.map((quote) => quote.symbol));
      return c.json(page(state(store).quotes.filter((quote) => symbols.includes(quote.symbol)).map(quotePayload)));
    });
    app.get('/api/v1/quotes/', (c) => {
      const symbols = csv(c.req.query('symbols') ?? c.req.query('symbol'), state(store).quotes.map((quote) => quote.symbol));
      return c.json(page(state(store).quotes.filter((quote) => symbols.includes(quote.symbol)).map(quotePayload)));
    });
    app.get('/instruments/', (c) => {
      const symbols = csv(c.req.query('symbols') ?? c.req.query('symbol'), state(store).instruments.map((instrument) => instrument.symbol));
      return c.json(page(state(store).instruments.filter((instrument) => symbols.includes(instrument.symbol))));
    });
    app.get('/api/v1/instruments/', (c) => {
      const symbols = csv(c.req.query('symbols') ?? c.req.query('symbol'), state(store).instruments.map((instrument) => instrument.symbol));
      return c.json(page(state(store).instruments.filter((instrument) => symbols.includes(instrument.symbol))));
    });
    app.get('/api/mobile/home/', (c) => c.json(homePayload(state(store))));
    app.get('/api/mobile/config/', (c) => c.json(mobileConfigPayload()));
    app.get('/api/mobile/app_config/', (c) => c.json(mobileConfigPayload()));
    app.get('/api/mobile/bootstrap/', (c) => c.json({ config: mobileConfigPayload(), home: homePayload(state(store)) }));
    app.get('/kaizen/experiments/:entity', (c) => c.json(kaizenExperimentsPayload(c)));
    app.get('/kaizen/experiments/:entity/', (c) => c.json(kaizenExperimentsPayload(c)));
    app.get('/vitals/fetch', (c) => c.json(vitalsPayload()));
    app.get('/region', (c) => c.json({ region: 'US', country_code: 'US', locale: 'en_US', supported: true }));
    app.get('/region/', (c) => c.json({ region: 'US', country_code: 'US', locale: 'en_US', supported: true }));
    app.get('/accounts/v2/user_defaults', (c) => c.json(userDefaultsPayload(state(store))));
    app.get('/ceres/v1/user_settings', (c) => c.json(userSettingsPayload(state(store))));
    app.get('/discovery/analytics/ids', (c) => c.json({ analytics_id: 'analytics_emulator', device_id: 'robinhood-emulator-device' }));
    app.get('/discovery/analytics/ids/', (c) => c.json({ analytics_id: 'analytics_emulator', device_id: 'robinhood-emulator-device' }));
    app.get('/inbox/should_badge/', (c) => c.json({ should_badge: state(store).notifications.some((notification) => !notification.read), unread_count: state(store).notifications.filter((notification) => !notification.read).length }));
    app.get('/inbox/should_badge', (c) => c.json({ should_badge: state(store).notifications.some((notification) => !notification.read), unread_count: state(store).notifications.filter((notification) => !notification.read).length }));
    app.get('/push/pending_challenge/', (c) => c.json({ pending_challenge: null, pending_challenges: [] }));
    app.get('/push/pending_challenge', (c) => c.json({ pending_challenge: null, pending_challenges: [] }));
    app.get('/pathfinder/issues/', (c) => c.json(page([])));
    app.get('/pathfinder/issues', (c) => c.json(page([])));
    app.get('/subscription/subscriptions/', (c) => c.json(page([])));
    app.get('/subscription/subscriptions', (c) => c.json(page([])));
    app.get('/midlands/notifications/stack/', (c) => c.json({ stack: state(store).notifications, unread_count: state(store).notifications.filter((notification) => !notification.read).length }));
    app.get('/midlands/notifications/stack', (c) => c.json({ stack: state(store).notifications, unread_count: state(store).notifications.filter((notification) => !notification.read).length }));
    app.get('/profile/page/', (c) => c.json(profilePagePayload(state(store))));
    app.get('/profile/page', (c) => c.json(profilePagePayload(state(store))));
    app.get('/account_center/', (c) => c.json({ user: state(store).user, account: state(store).accounts[0], sections: profilePagePayload(state(store)).sections }));
    app.get('/account_center', (c) => c.json({ user: state(store).user, account: state(store).accounts[0], sections: profilePagePayload(state(store)).sections }));
    app.get('/transfer/accounts/', (c) => c.json(transferAccountsPayload(state(store))));
    app.get('/transfer/accounts', (c) => c.json(transferAccountsPayload(state(store))));
    app.get('/transfer/suggested_amounts/', (c) => c.json({ amounts: transferAccountsPayload(state(store)).suggested_amounts, default_amount: '100.00' }));
    app.get('/transfer/suggested_amounts', (c) => c.json({ amounts: transferAccountsPayload(state(store)).suggested_amounts, default_amount: '100.00' }));
    app.get('/application/spending/eligibility/', (c) => c.json({ eligible: true, status: 'eligible', reason: null }));
    app.get('/application/spending/eligibility', (c) => c.json({ eligible: true, status: 'eligible', reason: null }));
    app.get('/user_info/investment_profile/refresh/', (c) => c.json(investmentProfilePayload(state(store))));
    app.get('/user_info/investment_profile/refresh', (c) => c.json(investmentProfilePayload(state(store))));
    app.get('/social/user_profile/', (c) => c.json({ user: state(store).user, display_name: 'Robin Emulator', avatar_url: null }));
    app.get('/social/user_profile', (c) => c.json({ user: state(store).user, display_name: 'Robin Emulator', avatar_url: null }));
    app.get('/feature-discovery/features/:feature', (c) => c.json({ feature: c.req.param('feature'), enabled: true, discovered: true }));
    app.get('/onboarding/resume_application_enabled/', (c) => c.json({ enabled: false, resume_application_enabled: false }));
    app.get('/onboarding/resume_application_enabled', (c) => c.json({ enabled: false, resume_application_enabled: false }));
    app.get('/p2p/treatment/', (c) => c.json({ treatment: 'enabled', enabled: true }));
    app.get('/p2p/treatment', (c) => c.json({ treatment: 'enabled', enabled: true }));
    app.get('/pathfinder/support_chats/', (c) => c.json(page([])));
    app.get('/pathfinder/support_chats', (c) => c.json(page([])));
    app.get('/marketdata/quotes/', (c) => c.json(marketdataQuotesPayload(state(store), c)));
    app.get('/marketdata/quotes', (c) => c.json(marketdataQuotesPayload(state(store), c)));
    app.post('/webauthn/register/soft_request/', (c) => c.json({ status: 'ok', request_id: 'webauthn_soft_request_emulator', should_register: false }));
    app.get('/webauthn/register/soft_request/', (c) => c.json({ status: 'ok', request_id: 'webauthn_soft_request_emulator', should_register: false }));
    app.post('/track', (c) => c.json(ok()));
    app.post('/trackv2', (c) => c.json(ok()));
    app.post('/track_realtime', (c) => c.json(ok()));
    app.post('/api/:project/envelope/', (c) => c.text('', 200));
    app.post('/recaptcha/api3/:action', (c) => c.json(ok({ token: 'recaptcha_emulator_token' })));
    app.post('/bitdrift_public.protobuf.client.v1.ApiService/Mux', (c) => c.text('', 200));
    app.post('/v1/open', (c) => c.json(ok({ clicked_branch_link: false })));
    app.get('/config/app/:appId', (c) => c.json({ app_id: c.req.param('appId'), parameters: mobileConfigPayload() }));
    app.get('/midlands/tags/tag/:tag/', (c) => c.json({ tag: c.req.param('tag'), instruments: state(store).instruments }));
    app.post('/api/v1/push/register/', (c) => c.json(ok({ device_token: 'robinhood-emulator-device' })));
    app.get('/options/accounts/', (c) => c.json(page(state(store).optionsAccounts)));
    app.get('/api/v1/options/accounts/', (c) => c.json(page(state(store).optionsAccounts)));
    app.get('/home/account_switcher/v2/', (c) => c.json(accountSwitcherPayload(state(store))));
    app.get('/home/account_switcher/v2', (c) => c.json(accountSwitcherPayload(state(store))));
    app.get('/phoenix/accounts/unified', (c) => c.json(unifiedAccountsPayload(state(store))));
    app.get('/rhy/accounts/', (c) => c.json(rhyAccountsPayload(state(store))));
    app.get('/rhy/accounts', (c) => c.json(rhyAccountsPayload(state(store))));
    app.get('/rhy/tab_state/', (c) => c.json(rhyTabStatePayload(state(store))));
    app.get('/rhy/tab_state', (c) => c.json(rhyTabStatePayload(state(store))));
    app.get('/retirement_dashboard/state/', (c) => c.json({ enabled: false, accounts: [], cards: [] }));
    app.get('/retirement_dashboard/state', (c) => c.json({ enabled: false, accounts: [], cards: [] }));
    app.get('/crypto/home/:accountId/state', (c) => c.json({ ...cryptoHomePayload(state(store)), account_id: c.req.param('accountId') }));
    app.get('/crypto/home/cta_buttons/', (c) => c.json({ buttons: [{ id: 'buy_crypto', title: 'Buy', enabled: true }, { id: 'sell_crypto', title: 'Sell', enabled: true }] }));
    app.get('/crypto/home/cta_buttons', (c) => c.json({ buttons: [{ id: 'buy_crypto', title: 'Buy', enabled: true }, { id: 'sell_crypto', title: 'Sell', enabled: true }] }));
    app.get('/app-comms/surface/:surface', (c) => c.json({ surface: c.req.param('surface'), location: c.req.query('location') ?? null, messages: [] }));
    app.get('/app-comms/batch/surface/:surface', (c) => c.json({ surface: c.req.param('surface'), locations: csv(c.req.query('locations')), messages: [] }));
    app.get('/screeners/', (c) => c.json({ results: [{ id: 'popular', title: 'Popular stocks', instruments: state(store).instruments, filters: [] }] }));
    app.get('/screeners', (c) => c.json({ results: [{ id: 'popular', title: 'Popular stocks', instruments: state(store).instruments, filters: [] }] }));
    app.get('/lists/order/', (c) => c.json({ order: ['watchlist_default'], results: [{ id: 'watchlist_default', name: 'Default' }] }));
    app.get('/lists/order', (c) => c.json({ order: ['watchlist_default'], results: [{ id: 'watchlist_default', name: 'Default' }] }));
    app.get('/slip/updated-agreements-required/', (c) => c.json({ required: false, agreements: [] }));
    app.get('/slip/updated-agreements-required', (c) => c.json({ required: false, agreements: [] }));
    app.post('/accounts/remote-cache-wipe', (c) => c.json(ok({ account_id: state(store).accounts[0].id, cache_scope: 'mobile_home', wiped_at: fixedNow })));
    app.get('/accounts/remote-cache-wipe', (c) => c.json(ok({ account_id: state(store).accounts[0].id, cache_scope: 'mobile_home', wiped_at: fixedNow })));
    app.get('/orders/', (c) => c.json(page(state(store).orders)));
    app.get('/api/v1/orders/', (c) => c.json(page(state(store).orders)));
    app.post('/orders/', async (c) => {
      const s = state(store);
      const order = equityOrderPayload(s, await readBody(c));
      s.orders.push(order);
      save(store, s);
      return c.json(order, 201);
    });
    app.post('/api/v1/orders/', async (c) => {
      const s = state(store);
      const order = equityOrderPayload(s, await readBody(c));
      s.orders.push(order);
      save(store, s);
      return c.json(order, 201);
    });
    app.get('/orders/:id/', (c) => {
      const row = state(store).orders.find((order) => order.id === c.req.param('id'));
      return row ? c.json(row) : error(c, 'Not found.', 404);
    });
    app.get('/api/v1/crypto/trading/accounts/', (c) => c.json(page(state(store).accounts)));
    app.get('/api/v1/crypto/trading/holdings/', (c) => c.json(page(state(store).holdings)));
    app.get('/api/v1/crypto/trading/currency_pairs/', (c) => c.json(page(state(store).currencyPairs)));
    app.get('/api/v1/crypto/trading/orders/', (c) => c.json(page(state(store).orders)));
    app.post('/api/v1/crypto/trading/orders/', async (c) => {
      const s = state(store);
      const body = await readBody(c);
      const order = {
        id: `order_${String(s.nextId++).padStart(6, '0')}`,
        account_id: body.account_id ?? s.accounts[0].id,
        currency_pair_id: body.currency_pair_id ?? body.symbol ?? 'BTC-USD',
        side: body.side ?? 'buy',
        type: body.type ?? 'market',
        quantity: body.quantity ?? '0.00100000',
        state: 'queued',
        created_at: fixedNow,
        updated_at: fixedNow,
      };
      s.orders.push(order);
      save(store, s);
      return c.json(order, 201);
    });
    app.get('/api/v1/crypto/trading/orders/:id/', (c) => {
      const row = state(store).orders.find((order) => order.id === c.req.param('id'));
      return row ? c.json(row) : error(c, 'Not found.', 404);
    });
    app.get('/api/v1/crypto/marketdata/best_bid_ask/', (c) => {
      const symbol = pairParam(c);
      return c.json({ results: state(store).quotes.filter((quote) => quote.symbol === symbol || symbol === 'BTC') });
    });
    app.get('/api/v1/crypto/marketdata/estimated_price/', (c) => {
      const quote = state(store).quotes.find((row) => row.symbol === pairParam(c)) ?? state(store).quotes[0];
      return c.json({ results: [{ symbol: quote.symbol, side: c.req.query('side') ?? 'bid', price: quote.mark_price, quantity: c.req.query('quantity') ?? '0.00100000' }] });
    });
    app.get('/dns/fakeout-plan', (c) => c.json({
      provider: 'robinhood',
      hosts: ['api.robinhood.com', 'bonfire.robinhood.com', 'nummus.robinhood.com', 'midlands.robinhood.com'],
      routes: contract.scope,
      baseUrl: state(store).baseUrl,
    }));
    app.get('/inspect/contract', (c) => c.json(contract));
    app.get('/inspect/state', (c) => c.json(state(store)));
    app.post('/inspect/reset', (c) => c.json(save(store, defaultState(state(store).baseUrl))));
    if (app.use) {
      app.use('*', async (c, next) => {
        await next();
        if (c.res?.status && c.res.status !== 404) return;
        const s = state(store);
        const body = await readBody(c);
        return c.json(ok({
          fallback: true,
          path: c.req.path,
          method: c.req.method,
          auth: authPayload(s, body),
          user: s.user,
          home: homePayload(s),
          request: body,
        }));
      });
    }
  },
};

export const label = 'Robinhood API emulator';
export const endpoints = contract.scope.join(', ');
export const capabilities = ['auth', 'brokerage', 'portfolio', 'watchlists', 'crypto'];
export const initConfig = { robinhood: { apiKey: 'robinhood-emulator-key', accessToken: 'robinhood_emulator_access' } };
export default plugin;
