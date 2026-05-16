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

function homePayload(s) {
  return {
    user: s.user,
    account: s.accounts[0],
    portfolio: s.portfolios[0],
    positions: s.positions,
    watchlists: s.watchlists,
    onboarding: { state: 'complete', application: s.applications[0] },
    features: {},
    experiments: {},
    notifications: [],
    crypto: {
      accounts: s.accounts,
      holdings: s.holdings,
      currency_pairs: s.currencyPairs,
      quotes: s.quotes.filter((quote) => quote.symbol.includes('-')),
    },
    cards: [
      { id: 'portfolio', title: 'Portfolio', subtitle: '$22,631.25', action: 'open_portfolio' },
      { id: 'watchlist', title: 'Watchlist', subtitle: '4 symbols', action: 'open_watchlist' },
    ],
  };
}

function mobileConfigPayload() {
  return {
    minimum_supported_version: '1.0.0',
    force_upgrade: false,
    features: {},
    experiments: {},
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
  const names = csv(c.req.queries?.('names')?.join(',') ?? c.req.query('names'));
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
    features: {},
    vitals: {},
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
    app.get('/notifications/', (c) => c.json(page([])));
    app.get('/api/v1/notifications/', (c) => c.json(page([])));
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
    app.get('/accounts/v2/user_defaults', (c) => c.json({ defaults: {}, user_defaults: {} }));
    app.get('/discovery/analytics/ids', (c) => c.json({ analytics_id: 'analytics_emulator', device_id: 'robinhood-emulator-device' }));
    app.get('/discovery/analytics/ids/', (c) => c.json({ analytics_id: 'analytics_emulator', device_id: 'robinhood-emulator-device' }));
    app.post('/track', (c) => c.json(ok()));
    app.post('/trackv2', (c) => c.json(ok()));
    app.post('/api/:project/envelope/', (c) => c.text('', 200));
    app.post('/recaptcha/api3/:action', (c) => c.json(ok({ token: 'recaptcha_emulator_token' })));
    app.post('/bitdrift_public.protobuf.client.v1.ApiService/Mux', (c) => c.text('', 200));
    app.post('/v1/open', (c) => c.json(ok({ clicked_branch_link: false })));
    app.get('/config/app/:appId', (c) => c.json({ app_id: c.req.param('appId'), parameters: {} }));
    app.get('/midlands/tags/tag/:tag/', (c) => c.json({ tag: c.req.param('tag'), instruments: state(store).instruments }));
    app.post('/api/v1/push/register/', (c) => c.json(ok({ device_token: 'robinhood-emulator-device' })));
    app.get('/options/accounts/', (c) => c.json(page([])));
    app.get('/api/v1/options/accounts/', (c) => c.json(page([])));
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
