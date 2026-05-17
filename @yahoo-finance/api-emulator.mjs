import { getState, readBody, routeError, setState } from '../scripts/provider-plugin-kit.mjs';

const STATE_KEY = 'yahoo-finance:state';
const QUERY1_BASE_URL = 'https://query1.finance.yahoo.com';
const QUERY2_BASE_URL = 'https://query2.finance.yahoo.com';

const day = 24 * 60 * 60;
const marketOpen = 1_714_374_000;

function quote(symbol, overrides = {}) {
  const upper = symbol.toUpperCase();
  const price = overrides.price ?? 420.42;
  const previousClose = overrides.previousClose ?? price - 2.35;
  const marketCap = overrides.marketCap ?? 3_124_000_000_000;
  return {
    symbol: upper,
    shortName: overrides.shortName ?? `${upper} Corporation`,
    longName: overrides.longName ?? `${upper} Corporation`,
    quoteType: overrides.quoteType ?? 'EQUITY',
    currency: overrides.currency ?? 'USD',
    exchange: overrides.exchange ?? 'NMS',
    exchangeTimezoneName: 'America/New_York',
    regularMarketPrice: price,
    regularMarketPreviousClose: previousClose,
    regularMarketOpen: previousClose + 0.75,
    regularMarketDayHigh: price + 1.8,
    regularMarketDayLow: previousClose - 1.1,
    regularMarketVolume: overrides.volume ?? 22_500_000,
    marketCap,
    sharesOutstanding: overrides.sharesOutstanding ?? Math.round(marketCap / price),
    trailingPegRatio: overrides.trailingPegRatio ?? 2.1,
    industry: overrides.industry ?? 'Software',
    sector: overrides.sector ?? 'Technology',
    website: overrides.website ?? `https://www.${upper.toLowerCase()}.example`,
  };
}

function defaultState(baseUrl = QUERY2_BASE_URL) {
  return {
    baseUrl,
    crumb: 'yahoo_finance_emulator_crumb',
    quotes: {
      AAPL: quote('AAPL', { price: 189.98, previousClose: 188.52, marketCap: 2_915_000_000_000, shortName: 'Apple Inc.', longName: 'Apple Inc.', industry: 'Consumer Electronics' }),
      MSFT: quote('MSFT', { price: 420.42, previousClose: 418.07, marketCap: 3_124_000_000_000, shortName: 'Microsoft Corporation', longName: 'Microsoft Corporation' }),
      SPY: quote('SPY', { price: 589.5, previousClose: 586.5, marketCap: 540_000_000_000, shortName: 'SPDR S&P 500 ETF Trust', longName: 'SPDR S&P 500 ETF Trust', quoteType: 'ETF', industry: 'Exchange Traded Fund', sector: 'Financial Services' }),
    },
  };
}

const state = (store) => getState(store, STATE_KEY, () => defaultState());
const save = (store, next) => setState(store, STATE_KEY, next);

export function seedFromConfig(store, baseUrl = QUERY2_BASE_URL, config = {}) {
  return save(store, {
    ...defaultState(baseUrl),
    ...config,
    quotes: { ...defaultState(baseUrl).quotes, ...(config.quotes ?? {}) },
  });
}

function getQuote(store, symbol) {
  const upper = symbol.toUpperCase();
  return state(store).quotes[upper] ?? quote(upper, { price: 100.25, previousClose: 99.5, marketCap: 10_000_000_000 });
}

function raw(value, fmt = String(value)) {
  return { raw: value, fmt };
}

function fmtDate(time = marketOpen) {
  return new Date(time * 1000).toISOString().slice(0, 10);
}

function chartPayload(item, query) {
  const range = query('range') ?? '5d';
  const interval = query('interval') ?? '1d';
  const count = range === '1d' ? 6 : range === '5d' && interval.includes('h') ? 5 : 5;
  const step = interval.includes('h') ? 60 * 60 : day;
  const start = marketOpen - (count - 1) * step;
  const timestamps = Array.from({ length: count }, (_, index) => start + index * step);
  const closes = timestamps.map((_, index) => Number((item.regularMarketPreviousClose + index * 0.65).toFixed(2)));
  closes[closes.length - 1] = item.regularMarketPrice;
  const opens = closes.map((close, index) => Number((close - 0.42 + index * 0.03).toFixed(2)));
  const highs = closes.map((close) => Number((close + 1.15).toFixed(2)));
  const lows = closes.map((close) => Number((close - 1.35).toFixed(2)));
  return {
    chart: {
      result: [
        {
          meta: {
            currency: item.currency,
            symbol: item.symbol,
            exchangeName: item.exchange,
            fullExchangeName: 'NasdaqGS',
            instrumentType: item.quoteType,
            firstTradeDate: 511_108_200,
            regularMarketTime: timestamps[timestamps.length - 1],
            hasPrePostMarketData: true,
            gmtoffset: -14_400,
            timezone: 'EDT',
            exchangeTimezoneName: item.exchangeTimezoneName,
            regularMarketPrice: item.regularMarketPrice,
            chartPreviousClose: item.regularMarketPreviousClose,
            previousClose: item.regularMarketPreviousClose,
            scale: 3,
            priceHint: 2,
            currentTradingPeriod: {
              pre: { timezone: 'EDT', start: timestamps[timestamps.length - 1] - 19_800, end: timestamps[timestamps.length - 1], gmtoffset: -14_400 },
              regular: { timezone: 'EDT', start: timestamps[timestamps.length - 1], end: timestamps[timestamps.length - 1] + 23_400, gmtoffset: -14_400 },
              post: { timezone: 'EDT', start: timestamps[timestamps.length - 1] + 23_400, end: timestamps[timestamps.length - 1] + 37_800, gmtoffset: -14_400 },
            },
            tradingPeriods: [[{ timezone: 'EDT', start: timestamps[0], end: timestamps[0] + 23_400, gmtoffset: -14_400 }]],
            dataGranularity: interval,
            range,
            validRanges: ['1d', '5d', '1mo', '3mo', '6mo', '1y', '5y', 'max'],
          },
          timestamp: timestamps,
          indicators: {
            quote: [{ open: opens, high: highs, low: lows, close: closes, volume: timestamps.map((_, index) => item.regularMarketVolume + index * 1000) }],
            adjclose: [{ adjclose: closes }],
          },
          events: {
            dividends: {
              [timestamps[1]]: { amount: 0.57, date: timestamps[1] },
            },
            splits: {
              [timestamps[2]]: { date: timestamps[2], numerator: 4, denominator: 1, splitRatio: '4:1' },
            },
            capitalGains: {},
          },
        },
      ],
      error: null,
    },
  };
}

function quoteSummaryPayload(item) {
  const earningsTrend = {
    trend: [
      {
        period: '0q',
        endDate: fmtDate(),
        growth: raw(0.12, '12.00%'),
        earningsEstimate: { avg: raw(2.25), low: raw(2.0), high: raw(2.5), yearAgoEps: raw(2.1), numberOfAnalysts: raw(28), growth: raw(0.07) },
        revenueEstimate: { avg: raw(95_000_000_000), low: raw(90_000_000_000), high: raw(100_000_000_000), numberOfAnalysts: raw(26), yearAgoRevenue: raw(91_000_000_000), growth: raw(0.04) },
        epsTrend: { current: raw(2.25), '7daysAgo': raw(2.22), '30daysAgo': raw(2.2), '60daysAgo': raw(2.18), '90daysAgo': raw(2.15) },
        epsRevisions: { upLast7days: raw(3), upLast30days: raw(8), downLast7days: raw(1), downLast30days: raw(2) },
      },
      { period: '+1q', growth: raw(0.1), earningsEstimate: { avg: raw(2.4) }, revenueEstimate: { avg: raw(98_000_000_000) } },
    ],
  };
  return {
    quoteSummary: {
      result: [
        {
          financialData: {
            currentPrice: raw(item.regularMarketPrice, item.regularMarketPrice.toFixed(2)),
            targetHighPrice: raw(item.regularMarketPrice + 35, (item.regularMarketPrice + 35).toFixed(2)),
            targetLowPrice: raw(item.regularMarketPrice - 40, (item.regularMarketPrice - 40).toFixed(2)),
            targetMeanPrice: raw(item.regularMarketPrice + 18, (item.regularMarketPrice + 18).toFixed(2)),
            targetMedianPrice: raw(item.regularMarketPrice + 17, (item.regularMarketPrice + 17).toFixed(2)),
            recommendationMean: raw(1.8, '1.80'),
          },
          quoteType: { symbol: item.symbol, quoteType: item.quoteType, exchange: item.exchange, shortName: item.shortName, longName: item.longName },
          defaultKeyStatistics: { marketCap: raw(item.marketCap), sharesOutstanding: raw(item.sharesOutstanding), trailingPegRatio: raw(item.trailingPegRatio, item.trailingPegRatio.toFixed(2)) },
          assetProfile: { industry: item.industry, sector: item.sector, website: item.website, companyOfficers: [] },
          summaryDetail: {
            previousClose: raw(item.regularMarketPreviousClose, item.regularMarketPreviousClose.toFixed(2)),
            open: raw(item.regularMarketOpen, item.regularMarketOpen.toFixed(2)),
            dayHigh: raw(item.regularMarketDayHigh, item.regularMarketDayHigh.toFixed(2)),
            dayLow: raw(item.regularMarketDayLow, item.regularMarketDayLow.toFixed(2)),
            volume: raw(item.regularMarketVolume),
            currency: item.currency,
          },
          esgScores: {
            totalEsg: raw(20),
            environmentScore: raw(5),
            socialScore: raw(8),
            governanceScore: raw(7),
            ratingYear: 2026,
            ratingMonth: 1,
          },
          recommendationTrend: {
            trend: [{ period: '0m', strongBuy: 10, buy: 20, hold: 5, sell: 1, strongSell: 0 }],
          },
          upgradeDowngradeHistory: {
            history: [{ epochGradeDate: marketOpen, firm: 'Example Research', toGrade: 'Buy', fromGrade: 'Neutral', action: 'up' }],
          },
          calendarEvents: {
            dividendDate: marketOpen + 30 * day,
            exDividendDate: marketOpen + 20 * day,
            earnings: {
              earningsDate: [marketOpen + 10 * day],
              earningsHigh: raw(2.5),
              earningsLow: raw(2.0),
              earningsAverage: raw(2.25),
              revenueHigh: raw(100_000_000_000),
              revenueLow: raw(90_000_000_000),
              revenueAverage: raw(95_000_000_000),
            },
          },
          secFilings: {
            filings: [{ date: fmtDate(), epochDate: marketOpen, type: '10-K', title: 'Annual report', edgarUrl: 'https://example.com/10-k', exhibits: [] }],
          },
          earningsHistory: {
            history: [{ quarter: raw(marketOpen), epsActual: raw(2.3), epsEstimate: raw(2.25), epsDifference: raw(0.05), surprisePercent: raw(2.2) }],
          },
          earningsTrend,
          industryTrend: { estimates: [{ period: '0q', growth: raw(0.08) }] },
          sectorTrend: { estimates: [{ period: '0q', growth: raw(0.07) }] },
          indexTrend: { estimates: [{ period: '0q', growth: raw(0.05) }] },
          institutionOwnership: {
            ownershipList: [{ maxAge: 1, organization: 'Emulator Capital', pctHeld: raw(0.08), position: raw(100_000_000), value: raw(42_000_000_000), reportDate: raw(marketOpen) }],
          },
          fundOwnership: {
            ownershipList: [{ maxAge: 1, organization: 'Emulator Index Fund', pctHeld: raw(0.05), position: raw(75_000_000), value: raw(31_000_000_000), reportDate: raw(marketOpen) }],
          },
          majorDirectHolders: { holders: [{ maxAge: 1, name: 'Jane Emulator', relation: 'Director', positionDirect: raw(1000), reportDate: raw(marketOpen), valueDirect: raw(420_420) }] },
          majorHoldersBreakdown: { maxAge: 1, insidersPercentHeld: raw(0.01), institutionsPercentHeld: raw(0.72), institutionsFloatPercentHeld: raw(0.74), institutionsCount: raw(5100) },
          insiderTransactions: {
            transactions: [{ maxAge: 1, filerName: 'Jane Emulator', filerRelation: 'Director', filerUrl: 'https://example.com/insider', moneyText: 'Sale', transactionText: 'Sale', ownership: 'D', startDate: raw(marketOpen), shares: raw(1000), value: raw(item.regularMarketPrice * 1000) }],
          },
          insiderHolders: { holders: [{ maxAge: 1, name: 'Jane Emulator', relation: 'Director', url: 'https://example.com/insider', transactionDescription: 'Sale', latestTransDate: raw(marketOpen), positionDirect: raw(1000), positionDirectDate: raw(marketOpen), positionIndirect: raw(100), positionIndirectDate: raw(marketOpen) }] },
          netSharePurchaseActivity: { period: '6m', buyInfoCount: raw(10), buyInfoShares: raw(100_000), sellInfoCount: raw(7), sellInfoShares: raw(70_000), netInfoCount: raw(3), netInfoShares: raw(30_000), totalInsiderShares: raw(1_000_000), netPercentInsiderShares: raw(0.03), buyPercentInsiderShares: raw(0.1), sellPercentInsiderShares: raw(0.07) },
          summaryProfile: { longBusinessSummary: `${item.longName} is represented by the Yahoo Finance API emulator.` },
          topHoldings: {
            cashPosition: raw(0.02),
            stockPosition: raw(0.95),
            bondPosition: raw(0.01),
            otherPosition: raw(0.02),
            holdings: [{ symbol: 'MSFT', holdingName: 'Microsoft Corporation', holdingPercent: raw(0.12) }],
            equityHoldings: { priceToEarnings: raw(28), priceToBook: raw(9), priceToSales: raw(10) },
            bondHoldings: { maturity: raw(7), duration: raw(5) },
            bondRatings: [{ bb: raw(0.1) }, { aaa: raw(0.5) }],
            sectorWeightings: [{ technology: raw(0.32) }, { financialServices: raw(0.12) }],
          },
          fundProfile: {
            categoryName: 'Large Blend',
            family: 'Emulator Funds',
            legalType: item.quoteType === 'ETF' ? 'Exchange Traded Fund' : 'Open End Fund',
            feesExpensesInvestment: { annualReportExpenseRatio: raw(0.0009), netExpRatio: raw(0.0009) },
            feesExpensesInvestmentCat: { annualReportExpenseRatio: raw(0.01) },
          },
        },
      ],
      error: null,
    },
  };
}

function quoteResponsePayload(store, symbols) {
  return {
    quoteResponse: {
      result: symbols.map((symbol) => {
        const item = getQuote(store, symbol);
        return {
          symbol: item.symbol,
          shortName: item.shortName,
          longName: item.longName,
          quoteType: item.quoteType,
          currency: item.currency,
          exchange: item.exchange,
          exchangeTimezoneName: item.exchangeTimezoneName,
          regularMarketPrice: item.regularMarketPrice,
          regularMarketPreviousClose: item.regularMarketPreviousClose,
          regularMarketOpen: item.regularMarketOpen,
          regularMarketDayHigh: item.regularMarketDayHigh,
          regularMarketDayLow: item.regularMarketDayLow,
          regularMarketVolume: item.regularMarketVolume,
          marketCap: item.marketCap,
          sharesOutstanding: item.sharesOutstanding,
          trailingPegRatio: item.trailingPegRatio,
        };
      }),
      error: null,
    },
  };
}

function timeseriesPayload(item, query) {
  const types = (query('type') ?? query('types') ?? 'trailingPegRatio,shares_out').split(',').filter(Boolean);
  const timestamp = [marketOpen - day, marketOpen];
  const result = { meta: { symbol: [item.symbol], type: types }, timestamp };
  for (const type of types) {
    if (type === 'shares_out' || type === 'sharesOutstanding') continue;
    const value = type === 'trailingPegRatio' ? item.trailingPegRatio : type.toLowerCase().includes('revenue') ? 100_000_000_000 : type.toLowerCase().includes('income') ? 25_000_000_000 : 1_000_000_000;
    result[type] = [{ asOfDate: '2025-12-31', periodType: type.startsWith('quarterly') ? '3M' : type.startsWith('trailing') ? 'TTM' : '12M', reportedValue: raw(value, String(value)) }];
  }
  if (types.includes('shares_out') || types.includes('sharesOutstanding')) {
    result.shares_out = timestamp.map((time) => ({ date: time, reportedValue: raw(item.sharesOutstanding) }));
  }
  return { timeseries: { result: [result], error: null } };
}

function optionsPayload(item, query) {
  const expiration = Number(query('date') ?? marketOpen + 32 * day);
  const strike = Math.round(item.regularMarketPrice / 5) * 5;
  const contractBase = `${item.symbol}${new Date(expiration * 1000).toISOString().slice(2, 10).replaceAll('-', '')}`;
  const option = (side) => ({
    contractSymbol: `${contractBase}${side}${String(strike * 1000).padStart(8, '0')}`,
    lastTradeDate: marketOpen,
    strike,
    lastPrice: side === 'C' ? 3.5 : 2.9,
    bid: side === 'C' ? 3.4 : 2.8,
    ask: side === 'C' ? 3.6 : 3.0,
    change: 0.1,
    percentChange: 2.9,
    volume: 100,
    openInterest: 1000,
    impliedVolatility: 0.25,
    inTheMoney: false,
    contractSize: 'REGULAR',
    currency: item.currency,
  });
  return { optionChain: { result: [{ expirationDates: [expiration], quote: quoteResponsePayload({ getData: () => ({ quotes: { [item.symbol]: item } }) }, [item.symbol]).quoteResponse.result[0], options: [{ expirationDate: expiration, calls: [option('C')], puts: [option('P')] }] }], error: null } };
}

function searchPayload(store, query) {
  const q = (query('q') ?? query('query') ?? 'MSFT').toUpperCase();
  const symbols = Object.keys(state(store).quotes).filter((symbol) => symbol.includes(q) || getQuote(store, symbol).longName.toUpperCase().includes(q)).slice(0, Number(query('quotesCount') ?? query('count') ?? 5));
  const rows = (symbols.length ? symbols : [q]).map((symbol) => {
    const item = getQuote(store, symbol);
    return { symbol: item.symbol, shortname: item.shortName, longname: item.longName, quoteType: item.quoteType, exchange: item.exchange, exchDisp: 'NASDAQ' };
  });
  return { quotes: rows, news: [{ uuid: 'news-1', title: `${q} emulator news`, publisher: 'Example News', link: 'https://example.com/news', providerPublishTime: marketOpen, type: 'STORY' }], lists: [], researchReports: [], nav: [] };
}

function lookupPayload(store, query) {
  return { finance: { result: [{ documents: searchPayload(store, query).quotes.map((row) => ({ ...row, shortName: row.shortname, longName: row.longname })) }], error: null } };
}

function screenerPayload(store, id = 'custom') {
  return { finance: { result: [{ id, quotes: quoteResponsePayload(store, Object.keys(state(store).quotes)).quoteResponse.result }], error: null } };
}

function sectorPayload(key) {
  return {
    data: {
      name: key === 'technology' ? 'Technology' : key,
      symbol: 'XLK',
      overview: { companiesCount: 100, marketCap: raw(10_000_000_000_000), messageBoardId: `finmb_${key}`, description: `${key} sector`, industriesCount: 10, marketWeight: raw(0.3), employeeCount: raw(1_000_000) },
      topCompanies: [{ symbol: 'MSFT', name: 'Microsoft Corporation', rating: 'Buy', marketWeight: raw(0.1) }],
      topETFs: [{ symbol: 'XLK', name: 'Technology Select Sector SPDR Fund' }],
      topMutualFunds: [{ symbol: 'VITAX', name: 'Vanguard Information Technology Index' }],
      industries: [{ key: 'software-infrastructure', name: 'Software - Infrastructure', symbol: '^YH101', marketWeight: raw(0.2) }],
      researchReports: [],
    },
  };
}

function industryPayload(key) {
  return {
    data: {
      name: key === 'software-infrastructure' ? 'Software - Infrastructure' : key,
      symbol: '^YH101',
      sectorKey: 'technology',
      sectorName: 'Technology',
      overview: { companiesCount: 20, marketCap: raw(4_000_000_000_000), description: `${key} industry` },
      topCompanies: [{ symbol: 'MSFT', name: 'Microsoft Corporation', rating: 'Buy', marketWeight: raw(0.12) }],
      topPerformingCompanies: [{ symbol: 'MSFT', name: 'Microsoft Corporation', ytdReturn: raw(0.12), lastPrice: raw(420.42), targetPrice: raw(460) }],
      topGrowthCompanies: [{ symbol: 'MSFT', name: 'Microsoft Corporation', ytdReturn: raw(0.12), growthEstimate: raw(0.18) }],
      researchReports: [],
    },
  };
}

function visualizationPayload() {
  return {
    finance: {
      result: [
        {
          documents: [
            {
              columns: [{ label: 'Symbol' }, { label: 'Company Name' }, { label: 'Event Start Date' }, { label: 'EPS Estimate' }, { label: 'Reported EPS' }, { label: 'Surprise (%)' }],
              rows: [['MSFT', 'Microsoft Corporation', fmtDate(), 2.25, 2.3, 2.2]],
            },
          ],
        },
      ],
      error: null,
    },
  };
}

function newsPayload() {
  return { data: { tickerStream: { stream: [{ id: 'news-1', title: 'Yahoo Finance emulator news', publisher: 'Example News', link: 'https://example.com/news', providerPublishTime: marketOpen, type: 'STORY', ad: [] }] } } };
}

function earningsHtml(symbol) {
  const company = symbol === 'MSFT' ? 'Microsoft Corporation' : `${symbol} Corporation`;
  return `<html><body><table><thead><tr><th>Symbol</th><th>Company</th><th>Earnings Date</th><th>EPS Estimate</th><th>Reported EPS</th><th>Surprise (%)</th></tr></thead><tbody><tr><td>${symbol}</td><td>${company}</td><td>May 17, 2026 at 4 PM EDT</td><td>2.25</td><td>2.30</td><td>2.2</td></tr></tbody></table></body></html>`;
}

function valuationHtml(symbol) {
  return `<html><body><table><thead><tr><th>Metric</th><th>Current</th></tr></thead><tbody><tr><td>Market Cap</td><td>2.9T</td></tr><tr><td>Trailing P/E</td><td>30.0</td></tr><tr><td>Price/Sales</td><td>10.0</td></tr></tbody></table><p>${symbol}</p></body></html>`;
}

export const contract = {
  provider: 'yahoo-finance',
  source: 'Yahoo Finance query API surfaces used by ranaroussi/yfinance',
  docs: 'https://github.com/ranaroussi/yfinance',
  baseUrl: QUERY2_BASE_URL,
  scope: ['chart', 'quoteSummary', 'quote', 'fundamentals_timeseries', 'options', 'search', 'lookup', 'screener', 'sectors', 'industries', 'market', 'visualization', 'news', 'html_scrapes', 'crumb'],
  fidelity: 'yfinance-compatible-rest-emulator',
};

export const plugin = {
  name: 'yahoo-finance',
  register(app, store) {
    app.get('/', (c) => c.text('ok'));
    app.get('/consent', (c) => c.text('<html><form><input name="csrfToken" value="csrf"><input name="sessionId" value="session"></form></html>', 200, { 'set-cookie': 'A1=yahoo-finance-emulator; Path=/;' }));
    app.post('/v2/collectConsent', (c) => c.text('ok'));
    app.get('/copyConsent', (c) => c.text('ok'));
    app.get('/v1/test/getcrumb', (c) => c.text(state(store).crumb));
    app.get('/v8/finance/chart/:symbol', (c) => c.json(chartPayload(getQuote(store, c.req.param('symbol')), c.req.query)));
    app.get('/v10/finance/quoteSummary/:symbol', (c) => c.json(quoteSummaryPayload(getQuote(store, c.req.param('symbol')))));
    app.get('/v7/finance/quote', (c) => {
      const symbols = (c.req.query('symbols') ?? '').split(',').map((symbol) => symbol.trim()).filter(Boolean);
      if (symbols.length === 0) return routeError(c, 'symbols query parameter is required', 400, 'Bad Request');
      return c.json(quoteResponsePayload(store, symbols));
    });
    app.get('/ws/fundamentals-timeseries/v1/finance/timeseries/:symbol', (c) => c.json(timeseriesPayload(getQuote(store, c.req.param('symbol')), c.req.query)));
    app.get('/v7/finance/options/:symbol', (c) => c.json(optionsPayload(getQuote(store, c.req.param('symbol')), c.req.query)));
    app.get('/v1/finance/search', (c) => c.json(searchPayload(store, c.req.query)));
    app.get('/v1/finance/lookup', (c) => c.json(lookupPayload(store, c.req.query)));
    app.get('/v1/finance/screener/predefined/saved', (c) => c.json(screenerPayload(store, c.req.query('scrIds') ?? 'most_actives')));
    app.post('/v1/finance/screener', async (c) => {
      await readBody(c);
      return c.json(screenerPayload(store));
    });
    app.get('/v1/finance/sectors/:key', (c) => c.json(sectorPayload(c.req.param('key'))));
    app.get('/v1/finance/industries/:key', (c) => c.json(industryPayload(c.req.param('key'))));
    app.get('/v6/finance/quote/marketSummary', (c) => c.json({ marketSummaryResponse: { result: [{ exchange: c.req.query('market') ?? 'us', shortName: 'US Market', regularMarketPrice: raw(5000), regularMarketChange: raw(10), regularMarketChangePercent: raw(0.2) }], error: null } }));
    app.get('/v6/finance/markettime', (c) => c.json({ finance: { marketTimes: [{ marketTime: [{ timezone: [{ short: 'EDT', gmtoffset: -14_400_000 }], open: '2026-05-17T09:30:00-04:00', close: '2026-05-17T16:00:00-04:00', status: 'open', yfit_market_id: c.req.query('market') ?? 'us', time: '2026-05-17T12:00:00-04:00' }] }], error: null } }));
    app.post('/v1/finance/visualization', async (c) => {
      await readBody(c);
      return c.json(visualizationPayload());
    });
    app.post('/xhr/ncp', async (c) => {
      await readBody(c);
      return c.json(newsPayload());
    });
    app.get('/calendar/earnings', (c) => c.body(earningsHtml(c.req.query('symbol') ?? 'MSFT'), 200, { 'content-type': 'text/html' }));
    app.get('/quote/:symbol/key-statistics', (c) => c.body(valuationHtml(c.req.param('symbol')), 200, { 'content-type': 'text/html' }));
    app.get('/ajax/SearchController_Suggest', (c) => c.text(`${c.req.query('query') ?? 'MSFT'}|US5949181045|Microsoft Corporation`));
    app.get('/inspect/contract', (c) => c.json(contract));
    app.get('/inspect/state', (c) => c.json(state(store)));
  },
  seed(store) {
    seedFromConfig(store);
  },
};

export const label = 'Yahoo Finance query API emulator';
export const endpoints = contract.scope.join(', ');
export const initConfig = { yahooFinance: { symbols: ['MSFT', 'AAPL', 'SPY'], crumb: 'yahoo_finance_emulator_crumb' } };

export default plugin;
