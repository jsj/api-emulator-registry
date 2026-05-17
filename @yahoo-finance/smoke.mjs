import assert from 'node:assert/strict';
import { createHarness } from '../scripts/provider-smoke-harness.mjs';
import { contract, plugin } from './api-emulator.mjs';

const harness = createHarness(plugin);
assert.equal(contract.provider, 'yahoo-finance');

const crumb = await harness.call('GET', '/v1/test/getcrumb');
assert.equal(crumb.payload, 'yahoo_finance_emulator_crumb');

const chart = await harness.call('GET', '/v8/finance/chart/MSFT?range=5d&interval=1d');
assert.equal(chart.payload.chart.result[0].meta.symbol, 'MSFT');
assert.equal(chart.payload.chart.result[0].indicators.quote[0].close.at(-1), 420.42);
assert.equal(chart.payload.chart.result[0].events.splits[1714201200].splitRatio, '4:1');

const summary = await harness.call('GET', '/v10/finance/quoteSummary/MSFT?modules=financialData,quoteType,defaultKeyStatistics,assetProfile,summaryDetail,recommendationTrend,upgradeDowngradeHistory,calendarEvents,secFilings,institutionOwnership,fundOwnership,majorHoldersBreakdown,topHoldings,fundProfile');
assert.equal(summary.payload.quoteSummary.result[0].quoteType.symbol, 'MSFT');
assert.equal(summary.payload.quoteSummary.result[0].financialData.currentPrice.raw, 420.42);
assert.equal(summary.payload.quoteSummary.result[0].recommendationTrend.trend[0].buy, 20);
assert.equal(summary.payload.quoteSummary.result[0].secFilings.filings[0].type, '10-K');

const quote = await harness.call('GET', '/v7/finance/quote?symbols=MSFT,AAPL');
assert.equal(quote.payload.quoteResponse.result[0].longName, 'Microsoft Corporation');
assert.equal(quote.payload.quoteResponse.result[1].symbol, 'AAPL');

const timeseries = await harness.call('GET', '/ws/fundamentals-timeseries/v1/finance/timeseries/MSFT?type=trailingPegRatio,shares_out');
assert.equal(timeseries.payload.timeseries.result[0].trailingPegRatio[0].reportedValue.raw, 2.1);
assert.ok(timeseries.payload.timeseries.result[0].shares_out[0].reportedValue.raw > 0);

const financials = await harness.call('GET', '/ws/fundamentals-timeseries/v1/finance/timeseries/MSFT?type=annualTotalRevenue,quarterlyNetIncome,trailingOperatingCashFlow');
assert.equal(financials.payload.timeseries.result[0].annualTotalRevenue[0].reportedValue.raw, 100000000000);

const options = await harness.call('GET', '/v7/finance/options/MSFT');
assert.equal(options.payload.optionChain.result[0].options[0].calls[0].currency, 'USD');

const search = await harness.call('GET', '/v1/finance/search?q=MSFT&quotesCount=1');
assert.equal(search.payload.quotes[0].symbol, 'MSFT');

const lookup = await harness.call('GET', '/v1/finance/lookup?query=MSFT&type=stock&count=1');
assert.equal(lookup.payload.finance.result[0].documents[0].symbol, 'MSFT');

const predefined = await harness.call('GET', '/v1/finance/screener/predefined/saved?scrIds=most_actives');
assert.equal(predefined.payload.finance.result[0].id, 'most_actives');

const customScreen = await harness.call('POST', '/v1/finance/screener', { quoteType: 'EQUITY', query: { operator: 'gt', operands: ['percentchange', 3] } });
assert.equal(customScreen.payload.finance.result[0].quotes[0].symbol, 'AAPL');

const sector = await harness.call('GET', '/v1/finance/sectors/technology');
assert.equal(sector.payload.data.industries[0].key, 'software-infrastructure');

const industry = await harness.call('GET', '/v1/finance/industries/software-infrastructure');
assert.equal(industry.payload.data.topPerformingCompanies[0].symbol, 'MSFT');

const marketSummary = await harness.call('GET', '/v6/finance/quote/marketSummary?market=us');
assert.equal(marketSummary.payload.marketSummaryResponse.result[0].exchange, 'us');

const marketTime = await harness.call('GET', '/v6/finance/markettime?market=us');
assert.equal(marketTime.payload.finance.marketTimes[0].marketTime[0].status, 'open');

const visualization = await harness.call('POST', '/v1/finance/visualization', { entityIdType: 'sp_earnings' });
assert.equal(visualization.payload.finance.result[0].documents[0].rows[0][0], 'MSFT');

const news = await harness.call('POST', '/xhr/ncp?queryRef=newsAll&serviceKey=ncp_fin', { serviceConfig: { snippetCount: 1, s: ['MSFT'] } });
assert.equal(news.payload.data.tickerStream.stream[0].type, 'STORY');

const earnings = await harness.call('GET', '/calendar/earnings?symbol=MSFT');
assert.match(earnings.payload, /Microsoft Corporation/);

const valuation = await harness.call('GET', '/quote/MSFT/key-statistics');
assert.match(valuation.payload, /Trailing P\/E/);

const isin = await harness.call('GET', '/ajax/SearchController_Suggest?query=MSFT');
assert.match(isin.payload, /US5949181045/);

console.log('yahoo-finance smoke ok');
