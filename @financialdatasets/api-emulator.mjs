import { getState, setState } from '../scripts/provider-plugin-kit.mjs';

const STATE_KEY = 'financialdatasets:state';
const BASE_URL = 'https://api.financialdatasets.ai/';

function baseRecord(ticker, reportPeriod = '2025-09-30', fiscalPeriod = '2025-Q3') {
  return {
    ticker,
    report_period: reportPeriod,
    fiscal_period: fiscalPeriod,
    period: 'quarterly',
    currency: 'USD',
    accession_number: ticker === 'AAPL' ? '0000320193-25-000079' : '0000789019-25-000089',
    filing_url: `https://www.sec.gov/Archives/edgar/data/${ticker === 'AAPL' ? '320193' : '789019'}/emulator/${ticker.toLowerCase()}-10q.htm`,
  };
}

function company({ ticker, name, cik, industry, sector, exchange, location }) {
  return {
    ticker,
    name,
    cik,
    industry,
    sector,
    category: 'Domestic Common Stock',
    exchange,
    is_active: true,
    location,
    sec_filings_url: `https://www.sec.gov/cgi-bin/browse-edgar?CIK=${cik}`,
    sic_code: ticker === 'AAPL' ? '3571' : '7372',
    sic_industry: industry,
    sic_sector: sector,
  };
}

function prices(ticker, base) {
  return [
    { open: base, close: base + 1.25, high: base + 2.1, low: base - 0.8, volume: 51234500, time: '2026-01-02T14:30:00Z' },
    { open: base + 1.3, close: base + 2.4, high: base + 3.0, low: base + 0.9, volume: 48900120, time: '2026-01-05T14:30:00Z' },
  ].map((price) => ({ ...price, ticker }));
}

function defaultState(baseUrl = BASE_URL) {
  const companies = {
    AAPL: company({
      ticker: 'AAPL',
      name: 'Apple Inc.',
      cik: '0000320193',
      industry: 'Electronic Computers',
      sector: 'Technology',
      exchange: 'NASDAQ',
      location: 'California, USA',
    }),
    MSFT: company({
      ticker: 'MSFT',
      name: 'Microsoft Corporation',
      cik: '0000789019',
      industry: 'Services-Prepackaged Software',
      sector: 'Technology',
      exchange: 'NASDAQ',
      location: 'Washington, USA',
    }),
  };

  const incomeStatements = {
    AAPL: [
      {
        ...baseRecord('AAPL'),
        revenue: 94930000000,
        cost_of_revenue: 51051000000,
        gross_profit: 43879000000,
        operating_expense: 15443000000,
        selling_general_and_administrative_expenses: 7520000000,
        research_and_development: 7923000000,
        operating_income: 28436000000,
        interest_expense: 931000000,
        ebit: 28436000000,
        income_tax_expense: 4384000000,
        net_income_discontinued_operations: 0,
        net_income_non_controlling_interests: 0,
        net_income: 23434000000,
        net_income_common_stock: 23434000000,
        preferred_dividends_impact: 0,
        consolidated_income: 23434000000,
        earnings_per_share: 1.58,
        earnings_per_share_diluted: 1.57,
        dividends_per_common_share: 0.26,
        weighted_average_shares: 14840000000,
        weighted_average_shares_diluted: 14920000000,
      },
    ],
    MSFT: [
      {
        ...baseRecord('MSFT'),
        revenue: 65585000000,
        cost_of_revenue: 19827000000,
        gross_profit: 45758000000,
        operating_expense: 16856000000,
        selling_general_and_administrative_expenses: 7894000000,
        research_and_development: 8962000000,
        operating_income: 28902000000,
        interest_expense: 512000000,
        ebit: 28902000000,
        income_tax_expense: 5123000000,
        net_income_discontinued_operations: 0,
        net_income_non_controlling_interests: 0,
        net_income: 23579000000,
        net_income_common_stock: 23579000000,
        preferred_dividends_impact: 0,
        consolidated_income: 23579000000,
        earnings_per_share: 3.18,
        earnings_per_share_diluted: 3.17,
        dividends_per_common_share: 0.83,
        weighted_average_shares: 7425000000,
        weighted_average_shares_diluted: 7440000000,
      },
    ],
  };

  const balanceSheets = {
    AAPL: [
      {
        ...baseRecord('AAPL'),
        total_assets: 364980000000,
        current_assets: 143566000000,
        cash_and_equivalents: 29943000000,
        inventory: 7286000000,
        current_investments: 31590000000,
        trade_and_non_trade_receivables: 66243000000,
        non_current_assets: 221414000000,
        property_plant_and_equipment: 45680000000,
        goodwill_and_intangible_assets: 0,
        investments: 132000000000,
        non_current_investments: 100410000000,
        outstanding_shares: 14840000000,
        tax_assets: 19499000000,
        total_liabilities: 308030000000,
        current_liabilities: 145308000000,
        current_debt: 12952000000,
        trade_and_non_trade_payables: 68960000000,
        deferred_revenue: 8249000000,
        deposit_liabilities: 0,
        non_current_liabilities: 162722000000,
        non_current_debt: 85750000000,
        tax_liabilities: 19300000000,
        shareholders_equity: 56950000000,
        retained_earnings: -19154000000,
        accumulated_other_comprehensive_income: -7172000000,
        total_debt: 98702000000,
      },
    ],
    MSFT: [
      {
        ...baseRecord('MSFT'),
        total_assets: 512163000000,
        current_assets: 184257000000,
        cash_and_equivalents: 34704000000,
        inventory: 1246000000,
        current_investments: 108540000000,
        trade_and_non_trade_receivables: 39121000000,
        non_current_assets: 327906000000,
        property_plant_and_equipment: 148989000000,
        goodwill_and_intangible_assets: 118723000000,
        investments: 115000000000,
        non_current_investments: 6453000000,
        outstanding_shares: 7425000000,
        tax_assets: 22120000000,
        total_liabilities: 243686000000,
        current_liabilities: 125286000000,
        current_debt: 1746000000,
        trade_and_non_trade_payables: 26072000000,
        deferred_revenue: 65223000000,
        deposit_liabilities: 0,
        non_current_liabilities: 118400000000,
        non_current_debt: 42428000000,
        tax_liabilities: 25520000000,
        shareholders_equity: 268477000000,
        retained_earnings: 188255000000,
        accumulated_other_comprehensive_income: -5472000000,
        total_debt: 44174000000,
      },
    ],
  };

  const cashFlowStatements = {
    AAPL: [
      {
        ...baseRecord('AAPL'),
        net_income: 23434000000,
        depreciation_and_amortization: 2911000000,
        share_based_compensation: 2893000000,
        net_cash_flow_from_operations: 28858000000,
        capital_expenditure: -3214000000,
        business_acquisitions_and_disposals: 0,
        investment_acquisitions_and_disposals: 824000000,
        net_cash_flow_from_investing: -2390000000,
        issuance_or_repayment_of_debt_securities: -2500000000,
        issuance_or_purchase_of_equity_shares: -24000000000,
        dividends_and_other_cash_distributions: -3860000000,
        net_cash_flow_from_financing: -30360000000,
        change_in_cash_and_equivalents: -3892000000,
        effect_of_exchange_rate_changes: 0,
        ending_cash_balance: 29943000000,
        free_cash_flow: 25644000000,
      },
    ],
    MSFT: [
      {
        ...baseRecord('MSFT'),
        net_income: 23579000000,
        depreciation_and_amortization: 6821000000,
        share_based_compensation: 2953000000,
        net_cash_flow_from_operations: 34152000000,
        capital_expenditure: -14923000000,
        business_acquisitions_and_disposals: -900000000,
        investment_acquisitions_and_disposals: 4812000000,
        net_cash_flow_from_investing: -11011000000,
        issuance_or_repayment_of_debt_securities: -1140000000,
        issuance_or_purchase_of_equity_shares: -2800000000,
        dividends_and_other_cash_distributions: -6178000000,
        net_cash_flow_from_financing: -10118000000,
        change_in_cash_and_equivalents: 13023000000,
        effect_of_exchange_rate_changes: 0,
        ending_cash_balance: 34704000000,
        free_cash_flow: 19229000000,
      },
    ],
  };

  return {
    baseUrl,
    acceptedApiKeys: ['financialdatasets-emulator-key', 'test-key', 'demo-key'],
    requests: [],
    companies,
    prices: { AAPL: prices('AAPL', 226.45), MSFT: prices('MSFT', 426.12) },
    snapshots: {
      AAPL: { ticker: 'AAPL', price: 229.87, day_change: 2.11, day_change_percent: 0.93, time: '2026-01-05T21:00:00Z', time_milliseconds: 1767646800000 },
      MSFT: { ticker: 'MSFT', price: 428.52, day_change: 1.44, day_change_percent: 0.34, time: '2026-01-05T21:00:00Z', time_milliseconds: 1767646800000 },
    },
    incomeStatements,
    balanceSheets,
    cashFlowStatements,
    filings: [
      { cik: 320193, accession_number: '0000320193-25-000079', filing_type: '10-Q', report_date: '2025-09-30', filing_date: '2025-10-31', ticker: 'AAPL', url: 'https://www.sec.gov/Archives/edgar/data/320193/emulator/aapl-10q.htm' },
      { cik: 789019, accession_number: '0000789019-25-000089', filing_type: '10-Q', report_date: '2025-09-30', filing_date: '2025-10-29', ticker: 'MSFT', url: 'https://www.sec.gov/Archives/edgar/data/789019/emulator/msft-10q.htm' },
    ],
    news: [
      { ticker: 'AAPL', title: 'Apple reports emulator quarter with services growth', source: 'Financial Datasets Emulator', date: '2026-01-05', url: 'https://financialdatasets.ai/emulator/news/aapl-services-growth' },
      { ticker: 'MSFT', title: 'Microsoft cloud demand remains steady in emulator data', source: 'Financial Datasets Emulator', date: '2026-01-05', url: 'https://financialdatasets.ai/emulator/news/msft-cloud-demand' },
    ],
    interestRates: [
      { bank: 'FED', name: 'Federal Reserve', rate: 4.5, date: '2026-01-01' },
      { bank: 'ECB', name: 'European Central Bank', rate: 3.25, date: '2026-01-01' },
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
    companies: { ...seeded.companies, ...(config.companies ?? {}) },
    prices: { ...seeded.prices, ...(config.prices ?? {}) },
    snapshots: { ...seeded.snapshots, ...(config.snapshots ?? {}) },
    filings: config.filings ?? seeded.filings,
    news: config.news ?? seeded.news,
  });
}

function query(c, name, fallback = '') {
  return c.req.query?.(name) ?? fallback;
}

function upper(value) {
  return String(value ?? '').toUpperCase();
}

function record(current, endpoint, params = {}) {
  current.requests.push({ endpoint, params, requestedAt: new Date().toISOString() });
}

function error(c, message = 'Invalid API key', status = 401, code = 'unauthorized') {
  return c.json({ error: { message, code } }, status);
}

function requireApiKey(c, current) {
  const value = c.req.header?.('X-API-KEY') ?? c.req.header?.('x-api-key') ?? c.req.header?.('Authorization')?.replace(/^Bearer\s+/i, '');
  if (current.acceptedApiKeys.includes(value)) return null;
  return error(c);
}

function limit(c, fallback = 100) {
  return Math.max(1, Math.min(Number(query(c, 'limit', String(fallback))) || fallback, 1000));
}

function requireTicker(c, current) {
  const ticker = upper(query(c, 'ticker'));
  if (!ticker) return { problem: error(c, 'ticker is required', 400, 'bad_request') };
  if (!current.companies[ticker]) return { problem: error(c, `No data for ticker ${ticker}`, 404, 'not_found') };
  return { ticker };
}

function filterByTicker(items, ticker) {
  return ticker ? items.filter((item) => upper(item.ticker) === ticker) : items;
}

function financialRows(c, store, key, responseKey) {
  const current = state(store);
  const auth = requireApiKey(c, current);
  if (auth) return auth;
  const { ticker, problem } = requireTicker(c, current);
  if (problem) return problem;
  const period = query(c, 'period');
  const rows = (current[key][ticker] ?? []).filter((item) => !period || item.period === period).slice(0, limit(c, 4));
  record(current, `/financials/${responseKey.replaceAll('_', '-')}`, { ticker, period });
  save(store, current);
  return c.json({ [responseKey]: rows });
}

function registerFinancialDatasetsRoutes(app, store) {
  app.get('/prices/tickers', (c) => {
    const current = state(store);
    record(current, '/prices/tickers');
    save(store, current);
    return c.json({ resource: 'prices', tickers: Object.keys(current.companies) });
  });

  app.get('/prices/snapshot/tickers', (c) => {
    const current = state(store);
    record(current, '/prices/snapshot/tickers');
    save(store, current);
    return c.json({ resource: 'price_snapshot', tickers: Object.keys(current.snapshots) });
  });

  app.get('/company/facts/tickers', (c) => {
    const current = state(store);
    record(current, '/company/facts/tickers');
    save(store, current);
    return c.json({ resource: 'company_facts', tickers: Object.keys(current.companies) });
  });

  app.get('/company/facts/ciks', (c) => {
    const current = state(store);
    record(current, '/company/facts/ciks');
    save(store, current);
    return c.json({ resource: 'company_facts', ciks: Object.values(current.companies).map((item) => item.cik) });
  });

  app.get('/prices', (c) => {
    const current = state(store);
    const auth = requireApiKey(c, current);
    if (auth) return auth;
    const { ticker, problem } = requireTicker(c, current);
    if (problem) return problem;
    record(current, '/prices', { ticker, interval: query(c, 'interval'), start_date: query(c, 'start_date'), end_date: query(c, 'end_date') });
    save(store, current);
    return c.json({ ticker, prices: current.prices[ticker] ?? [] });
  });

  app.get('/prices/snapshot', (c) => {
    const current = state(store);
    const auth = requireApiKey(c, current);
    if (auth) return auth;
    const { ticker, problem } = requireTicker(c, current);
    if (problem) return problem;
    record(current, '/prices/snapshot', { ticker });
    save(store, current);
    return c.json({ snapshot: current.snapshots[ticker] });
  });

  app.get('/prices/snapshot/market', (c) => {
    const current = state(store);
    const auth = requireApiKey(c, current);
    if (auth) return auth;
    record(current, '/prices/snapshot/market');
    save(store, current);
    return c.json({ snapshots: Object.values(current.snapshots) });
  });

  app.get('/company/facts', (c) => {
    const current = state(store);
    const auth = requireApiKey(c, current);
    if (auth) return auth;
    const ticker = upper(query(c, 'ticker')) || Object.keys(current.companies).find((symbol) => current.companies[symbol].cik === query(c, 'cik'));
    if (!ticker || !current.companies[ticker]) return error(c, 'ticker or cik is required', 400, 'bad_request');
    record(current, '/company/facts', { ticker, cik: query(c, 'cik') });
    save(store, current);
    return c.json({ company_facts: current.companies[ticker] });
  });

  app.get('/financials/income-statements', (c) => financialRows(c, store, 'incomeStatements', 'income_statements'));
  app.get('/financials/balance-sheets', (c) => financialRows(c, store, 'balanceSheets', 'balance_sheets'));
  app.get('/financials/cash-flow-statements', (c) => financialRows(c, store, 'cashFlowStatements', 'cash_flow_statements'));

  app.get('/financials', (c) => {
    const current = state(store);
    const auth = requireApiKey(c, current);
    if (auth) return auth;
    const { ticker, problem } = requireTicker(c, current);
    if (problem) return problem;
    record(current, '/financials', { ticker, period: query(c, 'period') });
    save(store, current);
    return c.json({
      financials: {
        income_statements: current.incomeStatements[ticker] ?? [],
        balance_sheets: current.balanceSheets[ticker] ?? [],
        cash_flow_statements: current.cashFlowStatements[ticker] ?? [],
      },
    });
  });

  app.get('/filings', (c) => {
    const current = state(store);
    const auth = requireApiKey(c, current);
    if (auth) return auth;
    const ticker = upper(query(c, 'ticker'));
    const cik = query(c, 'cik');
    const filingType = query(c, 'filing_type');
    const filings = current.filings
      .filter((item) => (!ticker || upper(item.ticker) === ticker) && (!cik || String(item.cik) === String(cik).replace(/^0+/, '')) && (!filingType || item.filing_type === filingType))
      .slice(0, limit(c, 100));
    record(current, '/filings', { ticker, cik, filing_type: filingType });
    save(store, current);
    return c.json({ filings });
  });

  app.get('/filings/tickers', (c) => c.json({ resource: 'filings', tickers: Object.keys(state(store).companies) }));
  app.get('/filings/ciks', (c) => c.json({ resource: 'filings', ciks: Object.values(state(store).companies).map((item) => item.cik) }));
  app.get('/filings/types', (c) => c.json({ filing_types: ['10-K', '10-Q', '8-K'] }));

  app.get('/news', (c) => {
    const current = state(store);
    const auth = requireApiKey(c, current);
    if (auth) return auth;
    const ticker = upper(query(c, 'ticker'));
    const news = filterByTicker(current.news, ticker).slice(0, limit(c, 20));
    record(current, '/news', { ticker });
    save(store, current);
    return c.json({ news });
  });

  app.get('/macro/interest-rates/banks', (c) => c.json({ resource: 'interest_rates', banks: state(store).interestRates.map((item) => item.bank) }));
  app.get('/macro/interest-rates', (c) => {
    const current = state(store);
    const auth = requireApiKey(c, current);
    if (auth) return auth;
    const bank = upper(query(c, 'bank'));
    const interestRates = current.interestRates.filter((item) => !bank || item.bank === bank);
    record(current, '/macro/interest-rates', { bank });
    save(store, current);
    return c.json({ interest_rates: interestRates });
  });
  app.get('/macro/interest-rates/snapshot', (c) => {
    const current = state(store);
    const auth = requireApiKey(c, current);
    if (auth) return auth;
    const bank = upper(query(c, 'bank'));
    const interestRates = current.interestRates.filter((item) => !bank || item.bank === bank).slice(0, 1);
    record(current, '/macro/interest-rates/snapshot', { bank });
    save(store, current);
    return c.json({ interest_rates: interestRates });
  });
}

export const contract = {
  provider: 'financialdatasets',
  source: 'Financial Datasets OpenAPI 3.0.1 contract',
  docs: 'https://docs.financialdatasets.ai/introduction',
  baseUrl: BASE_URL,
  auth: { type: 'apiKey', header: 'X-API-KEY' },
  scope: ['ticker-discovery', 'prices', 'price-snapshots', 'company-facts', 'financial-statements', 'filings', 'news', 'interest-rates'],
  fidelity: 'deterministic-subset',
};

export const plugin = {
  name: 'financialdatasets',
  register(app, store) {
    registerFinancialDatasetsRoutes(app, store);
    app.get('/inspect/contract', (c) => c.json(contract));
    app.get('/inspect/state', (c) => c.json(state(store)));
  },
};

export const label = 'Financial Datasets API emulator';
export const endpoints = 'prices, snapshots, company facts, financial statements, SEC filings, news, interest rates';
export const initConfig = { financialdatasets: { apiKey: 'financialdatasets-emulator-key' } };
