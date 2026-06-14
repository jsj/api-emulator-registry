import assert from 'node:assert/strict';
import { createHarness } from '../scripts/provider-smoke-harness.mjs';
import { contract, plugin } from './api-emulator.mjs';

const harness = createHarness(plugin);
const headers = { 'X-API-KEY': 'financialdatasets-emulator-key' };

assert.equal(contract.provider, 'financialdatasets');
assert.equal(contract.auth.header, 'X-API-KEY');

const missingKey = await harness.call('GET', '/prices?ticker=AAPL&interval=day&start_date=2026-01-01&end_date=2026-01-06');
assert.equal(missingKey.status, 401);
assert.equal(missingKey.payload.error.code, 'unauthorized');

const tickers = await harness.call('GET', '/prices/tickers');
assert.equal(tickers.status, 200);
assert.deepEqual(tickers.payload.tickers, ['AAPL', 'MSFT']);

const prices = await harness.call('GET', '/prices?ticker=AAPL&interval=day&start_date=2026-01-01&end_date=2026-01-06', undefined, headers);
assert.equal(prices.status, 200);
assert.equal(prices.payload.ticker, 'AAPL');
assert.equal(prices.payload.prices.length, 2);
assert.equal(prices.payload.prices[0].volume, 51234500);

const snapshot = await harness.call('GET', '/prices/snapshot?ticker=MSFT', undefined, headers);
assert.equal(snapshot.status, 200);
assert.equal(snapshot.payload.snapshot.ticker, 'MSFT');
assert.equal(snapshot.payload.snapshot.price, 428.52);

const facts = await harness.call('GET', '/company/facts?ticker=AAPL', undefined, headers);
assert.equal(facts.status, 200);
assert.equal(facts.payload.company_facts.cik, '0000320193');
assert.equal(facts.payload.company_facts.exchange, 'NASDAQ');

const income = await harness.call('GET', '/financials/income-statements?ticker=AAPL&period=quarterly&limit=1', undefined, headers);
assert.equal(income.status, 200);
assert.equal(income.payload.income_statements[0].revenue, 94930000000);
assert.equal(income.payload.income_statements[0].earnings_per_share_diluted, 1.57);

const financials = await harness.call('GET', '/financials?ticker=AAPL&period=quarterly', undefined, headers);
assert.equal(financials.status, 200);
assert.equal(financials.payload.financials.balance_sheets[0].total_assets, 364980000000);
assert.equal(financials.payload.financials.cash_flow_statements[0].free_cash_flow, 25644000000);

const filings = await harness.call('GET', '/filings?ticker=AAPL&filing_type=10-Q&limit=1', undefined, headers);
assert.equal(filings.status, 200);
assert.equal(filings.payload.filings[0].accession_number, '0000320193-25-000079');

const news = await harness.call('GET', '/news?ticker=MSFT&limit=1', undefined, headers);
assert.equal(news.status, 200);
assert.match(news.payload.news[0].title, /cloud demand/);

const rates = await harness.call('GET', '/macro/interest-rates/snapshot?bank=FED', undefined, headers);
assert.equal(rates.status, 200);
assert.equal(rates.payload.interest_rates[0].rate, 4.5);

const missingTicker = await harness.call('GET', '/prices?ticker=NOPE&interval=day&start_date=2026-01-01&end_date=2026-01-06', undefined, headers);
assert.equal(missingTicker.status, 404);
assert.equal(missingTicker.payload.error.code, 'not_found');

const state = await harness.call('GET', '/inspect/state');
assert.ok(state.payload.requests.some((request) => request.endpoint === '/prices'));

console.log('financialdatasets smoke ok');
