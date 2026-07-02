import assert from 'node:assert/strict';
import { createHarness } from '../scripts/provider-smoke-harness.mjs';
import { contract, plugin, seedFromConfig } from './api-emulator.mjs';

const harness = createHarness(plugin);
const calledToolNames = new Set();

async function callHarness(method, path, body = undefined, headers = {}) {
  const toolName = body?.method === 'tools/call' ? body?.params?.name : null;
  if (toolName) calledToolNames.add(toolName);
  const response = await harness.call(method, path, body, headers);
  if (toolName && response.status === 200) {
    const structuredContent = response.payload?.result?.structuredContent;
    assert.ok(structuredContent && typeof structuredContent === 'object', `${toolName} returns structuredContent`);
    assert.ok(Object.hasOwn(structuredContent, 'data'), `${toolName} returns structuredContent.data`);
    assert.equal(typeof structuredContent.guide, 'string', `${toolName} returns structuredContent.guide`);
  }
  return response;
}

const data = (response) => response.payload.result.structuredContent.data;

assert.equal(contract.provider, 'robinhood-trading');

const initialized = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'init',
  method: 'initialize',
  params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'smoke', version: '1.0.0' } },
});
assert.equal(initialized.payload.result.serverInfo.name, 'robinhood-trading-emulator');
assert.equal(initialized.headers['mcp-session-id'], 'rh-mcp-session-emulator');

const tools = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'tools',
  method: 'tools/list',
  params: {},
});
assert.equal(tools.payload.result.structuredContent.tools.length, 43);
assert.ok(tools.payload.result.structuredContent.tools.every((tool) => tool.inputSchema && tool.outputSchema));
assert.ok(tools.payload.result.structuredContent.tools.some((tool) => tool.name === 'place_equity_order'));
assert.ok(tools.payload.result.structuredContent.tools.some((tool) => tool.name === 'create_scan'));
assert.ok(tools.payload.result.structuredContent.tools.some((tool) => tool.name === 'get_earnings_calendar'));
assert.ok(tools.payload.result.structuredContent.tools.some((tool) => tool.name === 'get_option_historicals'));
assert.ok(tools.payload.result.structuredContent.tools.some((tool) => tool.name === 'get_realized_pnl'));
assert.ok(tools.payload.result.structuredContent.tools.some((tool) => tool.name === 'get_equity_fundamentals'));
assert.ok(tools.payload.result.structuredContent.tools.some((tool) => tool.name === 'get_equity_historicals'));
assert.ok(tools.payload.result.structuredContent.tools.some((tool) => tool.name === 'get_option_chains'));
assert.ok(tools.payload.result.structuredContent.tools.some((tool) => tool.name === 'get_option_instruments'));
assert.ok(tools.payload.result.structuredContent.tools.some((tool) => tool.name === 'add_option_to_watchlist'));
assert.ok(tools.payload.result.structuredContent.tools.some((tool) => tool.name === 'follow_watchlist'));
assert.ok(tools.payload.result.structuredContent.tools.some((tool) => tool.name === 'unfollow_watchlist'));
assert.ok(!tools.payload.result.structuredContent.tools.some((tool) => tool.name === 'follow_list'));
assert.ok(!tools.payload.result.structuredContent.tools.some((tool) => tool.name === 'unfollow_list'));

const oauthAuthorize = await callHarness('GET', '/oauth/authorize?client_id=robinhood-emulator-client&redirect_uri=http%3A%2F%2Flocalhost%2Fv1%2Fbroker-connections%2Frobinhood%2Fcallback&state=s1');
assert.equal(oauthAuthorize.status, 302);
const callbackUrl = new URL(oauthAuthorize.headers.location);
assert.equal(callbackUrl.pathname, '/v1/broker-connections/robinhood/callback');
assert.equal(callbackUrl.searchParams.get('state'), 's1');
const code = callbackUrl.searchParams.get('code');
assert.ok(code?.startsWith('rh-code-'));

const oauthToken = await callHarness('POST', '/oauth/token', new URLSearchParams({
  grant_type: 'authorization_code',
  code,
  redirect_uri: 'http://localhost/v1/broker-connections/robinhood/callback',
  client_id: 'robinhood-emulator-client',
  client_secret: 'robinhood-emulator-secret',
}).toString(), { 'content-type': 'application/x-www-form-urlencoded' });
assert.equal(oauthToken.payload.token_type, 'Bearer');
assert.ok(oauthToken.payload.access_token.startsWith('rh-access-'));
assert.ok(oauthToken.payload.refresh_token.startsWith('rh-refresh-'));

const refreshToken = await callHarness('POST', '/oauth/token', new URLSearchParams({
  grant_type: 'refresh_token',
  refresh_token: oauthToken.payload.refresh_token,
  client_id: 'robinhood-emulator-client',
  client_secret: 'robinhood-emulator-secret',
}).toString(), { 'content-type': 'application/x-www-form-urlencoded' });
assert.ok(refreshToken.payload.access_token.startsWith('rh-access-'));

const unknownRefreshToken = await callHarness('POST', '/oauth/token', new URLSearchParams({
  grant_type: 'refresh_token',
  refresh_token: 'rh-refresh-unknown',
  client_id: 'robinhood-emulator-client',
  client_secret: 'robinhood-emulator-secret',
}).toString(), { 'content-type': 'application/x-www-form-urlencoded' });
assert.equal(unknownRefreshToken.status, 400);
assert.equal(unknownRefreshToken.payload.error, 'invalid_grant');

const expiredRefreshHarness = createHarness(plugin);
seedFromConfig(expiredRefreshHarness.store, undefined, {
  oauthRefreshTokens: {
    'rh-refresh-expired': {
      issued_at: '2025-12-24T00:00:00.000Z',
      expires_at: '2025-12-31T00:00:00.000Z',
      account_id: 'RHAGENTIC001',
    },
  },
});
const expiredRefreshToken = await expiredRefreshHarness.call('POST', '/oauth/token', new URLSearchParams({
  grant_type: 'refresh_token',
  refresh_token: 'rh-refresh-expired',
  client_id: 'robinhood-emulator-client',
  client_secret: 'robinhood-emulator-secret',
}).toString(), { 'content-type': 'application/x-www-form-urlencoded' });
assert.equal(expiredRefreshToken.status, 400);
assert.equal(expiredRefreshToken.payload.error, 'invalid_grant');

const accounts = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'accounts',
  method: 'tools/call',
  params: { name: 'get_accounts', arguments: {} },
});
assert.ok(data(accounts).accounts.some((account) => account.account_number === 'RHAGENTIC001'));

const portfolio = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'portfolio',
  method: 'tools/call',
  params: { name: 'get_portfolio', arguments: { account_number: 'RHAGENTIC001' } },
});
assert.ok(Number.isFinite(Number(data(portfolio).buying_power)));

const positions = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'positions',
  method: 'tools/call',
  params: { name: 'get_equity_positions', arguments: { account_number: 'RHAGENTIC001' } },
});
assert.ok(Array.isArray(data(positions).positions));

const quotes = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'equity-quotes',
  method: 'tools/call',
  params: { name: 'get_equity_quotes', arguments: { symbols: ['AAPL'] } },
});
assert.equal(data(quotes).results[0].symbol, 'AAPL');

const tradability = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'equity-tradability',
  method: 'tools/call',
  params: { name: 'get_equity_tradability', arguments: { account_number: 'RHAGENTIC001', symbols: ['AAPL'] } },
});
assert.equal(data(tradability).results[0].symbol, 'AAPL');
assert.equal(data(tradability).results[0].tradable, true);

const indexes = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'indexes',
  method: 'tools/call',
  params: { name: 'get_indexes', arguments: {} },
});
const spxIndex = data(indexes).indexes.find((index) => index.symbol === 'SPX');
assert.ok(spxIndex);

const indexQuotes = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'index-quotes',
  method: 'tools/call',
  params: { name: 'get_index_quotes', arguments: { instrument_ids: [spxIndex.id] } },
});
assert.equal(data(indexQuotes).quotes[0].symbol, 'SPX');

const search = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'search',
  method: 'tools/call',
  params: { name: 'search', arguments: { query: 'Apple' } },
});
assert.equal(data(search).results[0].symbol, 'AAPL');

const realizedPnl = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'realized-pnl',
  method: 'tools/call',
  params: { name: 'get_realized_pnl', arguments: { account_number: 'RHAGENTIC001', span: '3month' } },
});
assert.equal(data(realizedPnl).account_number, 'RHAGENTIC001');
assert.ok(Array.isArray(data(realizedPnl).data_points));

const earningsCalendar = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'earnings-calendar',
  method: 'tools/call',
  params: { name: 'get_earnings_calendar', arguments: { start_date: '2026-01-28', days: 2, filter: 'high_market_cap' } },
});
assert.ok(data(earningsCalendar).results.some((event) => event.symbol === 'AAPL'));

const earningsResults = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'earnings-results',
  method: 'tools/call',
  params: { name: 'get_earnings_results', arguments: { symbol: 'aapl' } },
});
assert.equal(data(earningsResults).results[0].symbol, 'AAPL');

const fundamentals = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'fundamentals',
  method: 'tools/call',
  params: { name: 'get_equity_fundamentals', arguments: { symbols: ['AAPL'] } },
});
assert.equal(data(fundamentals).results[0].symbol, 'AAPL');

const missingHistoricalStart = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'missing-historical-start',
  method: 'tools/call',
  params: { name: 'get_equity_historicals', arguments: { symbols: ['AAPL'] } },
});
assert.equal(missingHistoricalStart.status, 400);
assert.match(missingHistoricalStart.payload.error.message, /start_time/);

const historicals = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'historicals',
  method: 'tools/call',
  params: {
    name: 'get_equity_historicals',
    arguments: { symbols: ['AAPL', 'SPY'], start_time: '2025-12-29T00:00:00Z', end_time: '2026-01-01T00:00:00Z', interval: 'day' },
  },
});
const historicalResults = data(historicals).results;
assert.equal(historicalResults[0].symbol, 'AAPL');
assert.equal(historicalResults[0].interval, 'day');
assert.ok(historicalResults[0].bars.length > 0);
assert.ok(historicalResults.some((result) => result.symbol === 'SPY'));

const scans = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'scans',
  method: 'tools/call',
  params: { name: 'get_scans', arguments: {} },
});
const scan = data(scans).scans[0];
assert.equal(scan.scan_id, 'scan-daily-gainers');

const runScan = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'run-scan',
  method: 'tools/call',
  params: { name: 'run_scan', arguments: { scan_id: scan.scan_id } },
});
assert.ok(data(runScan).result.results.some((row) => row.ticker === 'AAPL'));

const createdScan = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'created-scan',
  method: 'tools/call',
  params: {
    name: 'create_scan',
    arguments: {
      preset: 'INITIAL',
      title: 'High RSI + High Volume',
      filters: [{ filter_type: 'FILTER_TYPE_RSI', predicate: 'PREDICATE_GREATER_THAN', values: ['70'], interval: '1d', length: 14 }],
    },
  },
});
const createdScanId = data(createdScan).result.scan_id;
assert.ok(createdScanId.startsWith('scan-'));

const updatedScanFilters = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'updated-scan-filters',
  method: 'tools/call',
  params: {
    name: 'update_scan_filters',
    arguments: { scan_id: createdScanId, filters: [{ filter_type: 'FILTER_TYPE_VOLUME', predicate: 'PREDICATE_GREATER_THAN', values: ['1000000'], interval: '1d' }] },
  },
});
assert.equal(data(updatedScanFilters).result.filters[0].filter_type, 'FILTER_TYPE_VOLUME');

const updatedScanConfig = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'updated-scan-config',
  method: 'tools/call',
  params: { name: 'update_scan_config', arguments: { scan_id: createdScanId, sorting_column: 'Volume', sorting_direction: 'asc' } },
});
assert.equal(data(updatedScanConfig).result.sorting.column, 'Volume');

const nonAgenticOrder = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'non-agentic-order',
  method: 'tools/call',
  params: { name: 'place_equity_order', arguments: { account_number: 'RHACCOUNT001', symbol: 'AAPL', side: 'buy', type: 'market', quantity: '1' } },
});
assert.equal(nonAgenticOrder.status, 400);
assert.match(nonAgenticOrder.payload.error.message, /not enabled for agentic trading/);

const profileGateHarness = createHarness(plugin);
seedFromConfig(profileGateHarness.store, undefined, {
  accounts: [{ id: 'acct_profile_gate', account_number: 'RHPROFILE001', status: 'active', agentic_allowed: true, suitability_required: true }],
  orders: [],
  nextId: 1,
});
const profileGateOrder = await profileGateHarness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'profile-gate-order',
  method: 'tools/call',
  params: { name: 'place_equity_order', arguments: { account_number: 'RHPROFILE001', symbol: 'AAPL', side: 'buy', type: 'market', quantity: '1' } },
});
assert.equal(profileGateOrder.status, 400);
assert.match(profileGateOrder.payload.error.message, /Investor profile must be completed/);

const fractionalLimitOrder = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'fractional-limit-order',
  method: 'tools/call',
  params: { name: 'place_equity_order', arguments: { account_number: 'RHAGENTIC001', symbol: 'AAPL', side: 'buy', type: 'limit', quantity: '0.5', limit_price: '200.00' } },
});
assert.equal(fractionalLimitOrder.status, 400);
assert.match(fractionalLimitOrder.payload.error.message, /Limit orders cannot include fractional/);

const wholeShareLimitOrder = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'whole-share-limit-order',
  method: 'tools/call',
  params: { name: 'place_equity_order', arguments: { account_number: 'RHAGENTIC001', symbol: 'AAPL', side: 'buy', type: 'limit', quantity: '1', limit_price: '200.00' } },
});
assert.equal(wholeShareLimitOrder.status, 200);
assert.equal(data(wholeShareLimitOrder).order.type, 'limit');
assert.equal(data(wholeShareLimitOrder).order.limit_price, '200.00');

const missingStopLimitPriceOrder = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'missing-stop-limit-price-order',
  method: 'tools/call',
  params: { name: 'place_equity_order', arguments: { account_number: 'RHAGENTIC001', symbol: 'AAPL', side: 'sell', type: 'stop_limit', quantity: '1', stop_price: '180.00' } },
});
assert.equal(missingStopLimitPriceOrder.status, 400);
assert.match(missingStopLimitPriceOrder.payload.error.message, /limit_price/);

const wholeShareStopLimitOrder = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'whole-share-stop-limit-order',
  method: 'tools/call',
  params: {
    name: 'place_equity_order',
    arguments: { account_number: 'RHAGENTIC001', symbol: 'AAPL', side: 'sell', type: 'stop_limit', quantity: '1', stop_price: '180.00', limit_price: '179.00' },
  },
});
assert.equal(wholeShareStopLimitOrder.status, 200);
assert.equal(data(wholeShareStopLimitOrder).order.type, 'stop_limit');
assert.equal(data(wholeShareStopLimitOrder).order.stop_price, '180.00');
assert.equal(data(wholeShareStopLimitOrder).order.limit_price, '179.00');

const unsupportedEquityOrderType = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'unsupported-equity-order-type',
  method: 'tools/call',
  params: { name: 'place_equity_order', arguments: { account_number: 'RHAGENTIC001', symbol: 'AAPL', side: 'buy', type: 'trailing_stop', quantity: '1' } },
});
assert.equal(unsupportedEquityOrderType.status, 400);
assert.match(unsupportedEquityOrderType.payload.error.message, /Unsupported equity order type/);

const fractionalRateLimitHarness = createHarness(plugin);
seedFromConfig(fractionalRateLimitHarness.store, undefined, {
  accounts: [{ id: 'acct_agentic', account_number: 'RHAGENTIC001', status: 'active', agentic_allowed: true }],
  fractionalOrderCount: 0,
  fractionalOrderLimit: 0,
  orders: [],
  nextId: 1,
});
const fractionalRateLimitOrder = await fractionalRateLimitHarness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'fractional-rate-limit-order',
  method: 'tools/call',
  params: { name: 'place_equity_order', arguments: { account_number: 'RHAGENTIC001', symbol: 'AAPL', side: 'buy', type: 'market', dollar_amount: '5.00' } },
});
assert.equal(fractionalRateLimitOrder.status, 429);
assert.match(fractionalRateLimitOrder.payload.error.message, /Fractional order rate limit exceeded/);

const reviewedOrder = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'review-equity-order',
  method: 'tools/call',
  params: { name: 'review_equity_order', arguments: { account_number: 'RHAGENTIC001', symbol: 'AAPL', side: 'buy', type: 'market', quantity: '1' } },
});
assert.equal(data(reviewedOrder).symbol, 'AAPL');
assert.ok(Array.isArray(data(reviewedOrder).order_checks));

const order = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'order',
  method: 'tools/call',
  params: { name: 'place_equity_order', arguments: { account_number: 'RHAGENTIC001', symbol: 'AAPL', side: 'buy', type: 'market', quantity: '1' } },
});
assert.equal(data(order).order.status, 'accepted');

const cancel = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'cancel',
  method: 'tools/call',
  params: { name: 'cancel_equity_order', arguments: { account_number: 'RHAGENTIC001', order_id: data(order).order.id } },
});
assert.equal(data(cancel).accepted, true);

const equityOrders = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'equity-orders',
  method: 'tools/call',
  params: { name: 'get_equity_orders', arguments: { account_number: 'RHAGENTIC001' } },
});
assert.ok(data(equityOrders).orders.some((row) => row.id === data(order).order.id));

const chain = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'chain',
  method: 'tools/call',
  params: { name: 'get_option_chains', arguments: { underlying_symbol: 'AAPL' } },
});
const selectedChain = data(chain).chains[0];
const selectedExpirationDate = selectedChain.expiration_dates[0];
assert.equal(selectedChain.underlying_symbol, 'AAPL');
assert.ok(selectedExpirationDate);

const instruments = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'option-instruments',
  method: 'tools/call',
  params: {
    name: 'get_option_instruments',
    arguments: { chain_id: selectedChain.id, expiration_dates: selectedExpirationDate, type: 'call', state: 'active' },
  },
});
const selectedInstrument = data(instruments).instruments[0];
assert.equal(selectedInstrument.chain_id, selectedChain.id);
assert.equal(selectedInstrument.expiration_date, selectedExpirationDate);

const optionQuotes = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'option-quotes',
  method: 'tools/call',
  params: { name: 'get_option_quotes', arguments: { instrument_ids: [selectedInstrument.id] } },
});
assert.equal(data(optionQuotes).results[0].instrument_id, selectedInstrument.id);
assert.equal(data(optionQuotes).results[0].delta, '0');
assert.equal(data(optionQuotes).results[0].gamma, '0');

const missingOptionHistoricalStart = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'missing-option-historical-start',
  method: 'tools/call',
  params: { name: 'get_option_historicals', arguments: { instrument_ids: [selectedInstrument.id] } },
});
assert.equal(missingOptionHistoricalStart.status, 400);
assert.match(missingOptionHistoricalStart.payload.error.message, /start_time/);

const optionHistoricals = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'option-historicals',
  method: 'tools/call',
  params: { name: 'get_option_historicals', arguments: { instrument_ids: [selectedInstrument.id], start_time: '2026-01-01T00:00:00Z', interval: 'day' } },
});
assert.equal(data(optionHistoricals).results[0].instrument_id, selectedInstrument.id);
assert.ok(Array.isArray(data(optionHistoricals).results[0].bars));

const optionOrders = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'option-orders',
  method: 'tools/call',
  params: {
    name: 'get_option_orders',
    arguments: {
      account_number: 'RHAGENTIC001',
      state: 'filled',
      created_at_gte: '2026-01-03',
      chain_ids: selectedChain.id,
    },
  },
});
assert.ok(Array.isArray(data(optionOrders).orders));
assert.equal(data(optionOrders).next, null);

const optionPositions = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'option-positions',
  method: 'tools/call',
  params: {
    name: 'get_option_positions',
    arguments: {
      account_number: 'RHAGENTIC001',
      nonzero: true,
      option_type: 'call',
      expiration_date_gte: selectedExpirationDate,
      expiration_date_lte: selectedExpirationDate,
    },
  },
});
assert.ok(Array.isArray(data(optionPositions).positions));
assert.equal(data(optionPositions).next, null);

const reviewedOptionOrder = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'review-option-order',
  method: 'tools/call',
  params: {
    name: 'review_option_order',
    arguments: { account_number: 'RHAGENTIC001', legs: [{ option_id: selectedInstrument.id, side: 'buy', position_effect: 'open' }], type: 'limit', quantity: '1', price: '6.25' },
  },
});
assert.equal(data(reviewedOptionOrder).account_number, 'RHAGENTIC001');
assert.ok(Array.isArray(data(reviewedOptionOrder).option_quotes));

const optionOrder = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'option-order',
  method: 'tools/call',
  params: {
    name: 'place_option_order',
    arguments: { account_number: 'RHAGENTIC001', legs: [{ option_id: selectedInstrument.id, side: 'buy', position_effect: 'open' }], type: 'limit', quantity: '1', price: '6.25' },
  },
});
assert.equal(data(optionOrder).order.status, 'accepted');

const unsupportedOptionOrderType = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'unsupported-option-order-type',
  method: 'tools/call',
  params: {
    name: 'place_option_order',
    arguments: { account_number: 'RHAGENTIC001', legs: [{ option_id: selectedInstrument.id, side: 'buy', position_effect: 'open' }], type: 'trailing_stop', quantity: '1', price: '6.25' },
  },
});
assert.equal(unsupportedOptionOrderType.status, 400);
assert.match(unsupportedOptionOrderType.payload.error.message, /Unsupported option order type/);

const cancelOptionOrder = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'cancel-option-order',
  method: 'tools/call',
  params: { name: 'cancel_option_order', arguments: { account_number: 'RHAGENTIC001', order_id: data(optionOrder).order.id } },
});
assert.equal(data(cancelOptionOrder).accepted, true);

const popularWatchlists = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'popular-watchlists',
  method: 'tools/call',
  params: { name: 'get_popular_watchlists', arguments: {} },
});
assert.ok(data(popularWatchlists).lists.some((list) => list.id === 'popular-tech'));

const watchlists = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'watchlists',
  method: 'tools/call',
  params: { name: 'get_watchlists', arguments: {} },
});
assert.ok(Array.isArray(data(watchlists).watchlists));

const watchlist = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'watchlist',
  method: 'tools/call',
  params: { name: 'create_watchlist', arguments: { display_name: 'Options Rollout' } },
});
const watchlistData = data(watchlist).watchlist;
assert.equal(watchlistData.display_name, 'Options Rollout');

const metadataOnlyWatchlist = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'metadata-only-watchlist',
  method: 'tools/call',
  params: {
    name: 'create_watchlist',
    arguments: {
      display_name: 'Anti-Aging Peptides',
      display_description: '15 companies across the peptide value chain',
      icon_emoji: '🧬',
    },
  },
});
const metadataOnlyWatchlistData = data(metadataOnlyWatchlist).watchlist;
assert.equal(metadataOnlyWatchlistData.display_name, 'Anti-Aging Peptides');
assert.equal(metadataOnlyWatchlistData.display_description, '15 companies across the peptide value chain');
assert.equal(metadataOnlyWatchlistData.icon_emoji, '🧬');
assert.deepEqual(metadataOnlyWatchlistData.symbols, []);
assert.deepEqual(metadataOnlyWatchlistData.option_ids, []);

const updatedWatchlist = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'updated-watchlist',
  method: 'tools/call',
  params: {
    name: 'update_watchlist',
    arguments: {
      list_id: metadataOnlyWatchlistData.id,
      display_name: 'Peptide Supply Chain',
      icon_emoji: 'P',
    },
  },
});
assert.equal(data(updatedWatchlist).watchlist.display_name, 'Peptide Supply Chain');
metadataOnlyWatchlistData.display_name = data(updatedWatchlist).watchlist.display_name;

const addMixedWatchlistItems = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'add-mixed-watchlist-items',
  method: 'tools/call',
  params: {
    name: 'add_to_watchlist',
    arguments: {
      list_id: metadataOnlyWatchlistData.id,
      symbols: ['NVO', 'LLY', 'PFE', 'AMGN', 'ABBV'],
    },
  },
});
assert.deepEqual(data(addMixedWatchlistItems).symbols, ['NVO', 'LLY', 'PFE', 'AMGN', 'ABBV']);
assert.equal(data(addMixedWatchlistItems).object_type, 'instrument');

const addCryptoWatchlistItems = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'add-crypto-watchlist-items',
  method: 'tools/call',
  params: {
    name: 'add_to_watchlist',
    arguments: {
      list_id: metadataOnlyWatchlistData.id,
      currency_pair_ids: ['currency-pair-btc-usd'],
    },
  },
});
assert.deepEqual(data(addCryptoWatchlistItems).currency_pair_ids, ['currency-pair-btc-usd']);
assert.equal(data(addCryptoWatchlistItems).object_type, 'currency_pair');

const addIndexWatchlistItems = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'add-index-watchlist-items',
  method: 'tools/call',
  params: {
    name: 'add_to_watchlist',
    arguments: {
      list_id: metadataOnlyWatchlistData.id,
      index_ids: ['index-spx'],
    },
  },
});
assert.deepEqual(data(addIndexWatchlistItems).index_ids, ['index-spx']);
assert.equal(data(addIndexWatchlistItems).object_type, 'index');

const mixedWatchlistItems = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'mixed-watchlist-items',
  method: 'tools/call',
  params: { name: 'get_watchlist_items', arguments: { list_id: metadataOnlyWatchlistData.id } },
});
assert.ok(data(mixedWatchlistItems).items.some((item) => item.symbol === 'NVO' && item.object_type === 'instrument'));
assert.ok(data(mixedWatchlistItems).items.some((item) => item.object_id === 'currency-pair-btc-usd' && item.object_type === 'currency_pair'));
assert.ok(data(mixedWatchlistItems).items.some((item) => item.object_id === 'index-spx' && item.object_type === 'index'));

const removedMixedWatchlistItem = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'remove-mixed-watchlist-item',
  method: 'tools/call',
  params: {
    name: 'remove_from_watchlist',
    arguments: { list_id: metadataOnlyWatchlistData.id, symbols: ['NVO'] },
  },
});
assert.deepEqual(data(removedMixedWatchlistItem).symbols, ['NVO']);
assert.equal(data(removedMixedWatchlistItem).operation, 'delete');

const addedOption = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'add-option-watchlist',
  method: 'tools/call',
  params: {
    name: 'add_option_to_watchlist',
    arguments: { option_ids: [selectedInstrument.id] },
  },
});
assert.ok(data(addedOption).option_ids.includes(selectedInstrument.id));

const watchlistItems = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'watchlist-items',
  method: 'tools/call',
  params: { name: 'get_option_watchlist', arguments: {} },
});
assert.ok(data(watchlistItems).items.some((item) => item.instrument_id === selectedInstrument.id));

const removedOption = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'remove-option-watchlist',
  method: 'tools/call',
  params: {
    name: 'remove_option_from_watchlist',
    arguments: { option_ids: [selectedInstrument.id] },
  },
});
assert.ok(data(removedOption).option_ids.includes(selectedInstrument.id));
assert.equal(data(removedOption).operation, 'delete');

const followedList = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'follow-list',
  method: 'tools/call',
  params: { name: 'follow_watchlist', arguments: { list_id: watchlistData.id } },
});
assert.equal(data(followedList).action, 'followed');

const unfollowedList = await callHarness('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'unfollow-list',
  method: 'tools/call',
  params: { name: 'unfollow_watchlist', arguments: { list_id: watchlistData.id } },
});
assert.equal(data(unfollowedList).action, 'unfollowed');

assert.deepEqual(contract.scope.filter((name) => !calledToolNames.has(name)), []);

console.log('robinhood-trading smoke ok');
