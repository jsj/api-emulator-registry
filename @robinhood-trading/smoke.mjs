import assert from 'node:assert/strict';
import { createHarness } from '../scripts/provider-smoke-harness.mjs';
import { contract, plugin, seedFromConfig } from './api-emulator.mjs';

const harness = createHarness(plugin);
assert.equal(contract.provider, 'robinhood-trading');

const initialized = await harness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'init',
  method: 'initialize',
  params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'smoke', version: '1.0.0' } },
});
assert.equal(initialized.payload.result.serverInfo.name, 'robinhood-trading-emulator');
assert.equal(initialized.headers['mcp-session-id'], 'rh-mcp-session-emulator');

const tools = await harness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'tools',
  method: 'tools/list',
  params: {},
});
assert.equal(tools.payload.result.structuredContent.tools.length, 34);
assert.ok(tools.payload.result.structuredContent.tools.some((tool) => tool.name === 'place_equity_order'));
assert.ok(tools.payload.result.structuredContent.tools.some((tool) => tool.name === 'get_equity_fundamentals'));
assert.ok(tools.payload.result.structuredContent.tools.some((tool) => tool.name === 'get_equity_historicals'));
assert.ok(tools.payload.result.structuredContent.tools.some((tool) => tool.name === 'get_option_chains'));
assert.ok(tools.payload.result.structuredContent.tools.some((tool) => tool.name === 'get_option_instruments'));
assert.ok(tools.payload.result.structuredContent.tools.some((tool) => tool.name === 'add_option_to_watchlist'));
assert.ok(tools.payload.result.structuredContent.tools.some((tool) => tool.name === 'follow_watchlist'));
assert.ok(tools.payload.result.structuredContent.tools.some((tool) => tool.name === 'unfollow_watchlist'));
assert.ok(!tools.payload.result.structuredContent.tools.some((tool) => tool.name === 'follow_list'));
assert.ok(!tools.payload.result.structuredContent.tools.some((tool) => tool.name === 'unfollow_list'));

const oauthAuthorize = await harness.call('GET', '/oauth/authorize?client_id=robinhood-emulator-client&redirect_uri=http%3A%2F%2Flocalhost%2Fv1%2Fbroker-connections%2Frobinhood%2Fcallback&state=s1');
assert.equal(oauthAuthorize.status, 302);
const callbackUrl = new URL(oauthAuthorize.headers.location);
assert.equal(callbackUrl.pathname, '/v1/broker-connections/robinhood/callback');
assert.equal(callbackUrl.searchParams.get('state'), 's1');
const code = callbackUrl.searchParams.get('code');
assert.ok(code?.startsWith('rh-code-'));

const oauthToken = await harness.call('POST', '/oauth/token', new URLSearchParams({
  grant_type: 'authorization_code',
  code,
  redirect_uri: 'http://localhost/v1/broker-connections/robinhood/callback',
  client_id: 'robinhood-emulator-client',
  client_secret: 'robinhood-emulator-secret',
}).toString(), { 'content-type': 'application/x-www-form-urlencoded' });
assert.equal(oauthToken.payload.token_type, 'Bearer');
assert.ok(oauthToken.payload.access_token.startsWith('rh-access-'));
assert.ok(oauthToken.payload.refresh_token.startsWith('rh-refresh-'));

const refreshToken = await harness.call('POST', '/oauth/token', new URLSearchParams({
  grant_type: 'refresh_token',
  refresh_token: oauthToken.payload.refresh_token,
  client_id: 'robinhood-emulator-client',
  client_secret: 'robinhood-emulator-secret',
}).toString(), { 'content-type': 'application/x-www-form-urlencoded' });
assert.ok(refreshToken.payload.access_token.startsWith('rh-access-'));

const unknownRefreshToken = await harness.call('POST', '/oauth/token', new URLSearchParams({
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

const portfolio = await harness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'portfolio',
  method: 'tools/call',
  params: { name: 'get_portfolio', arguments: {} },
});
assert.ok(Number.isFinite(Number(portfolio.payload.result.structuredContent.buying_power)));

const positions = await harness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'positions',
  method: 'tools/call',
  params: { name: 'get_equity_positions', arguments: {} },
});
assert.ok(Array.isArray(positions.payload.result.structuredContent.positions));

const fundamentals = await harness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'fundamentals',
  method: 'tools/call',
  params: { name: 'get_equity_fundamentals', arguments: { symbols: ['AAPL'] } },
});
assert.equal(fundamentals.payload.result.structuredContent.fundamentals[0].symbol, 'AAPL');

const missingHistoricalStart = await harness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'missing-historical-start',
  method: 'tools/call',
  params: { name: 'get_equity_historicals', arguments: { symbols: ['AAPL'] } },
});
assert.equal(missingHistoricalStart.status, 400);
assert.match(missingHistoricalStart.payload.error.message, /start_time/);

const historicals = await harness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'historicals',
  method: 'tools/call',
  params: {
    name: 'get_equity_historicals',
    arguments: { symbols: ['AAPL', 'SPY'], start_time: '2025-12-29T00:00:00Z', end_time: '2026-01-01T00:00:00Z', interval: 'day' },
  },
});
const historicalResults = historicals.payload.result.structuredContent.data.results;
assert.equal(historicalResults[0].symbol, 'AAPL');
assert.equal(historicalResults[0].interval, 'day');
assert.ok(historicalResults[0].bars.length > 0);
assert.ok(historicalResults.some((result) => result.symbol === 'SPY'));

const nonAgenticOrder = await harness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'non-agentic-order',
  method: 'tools/call',
  params: { name: 'place_equity_order', arguments: { account_number: 'RHACCOUNT001', symbol: 'AAPL', side: 'buy', quantity: 1 } },
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
  params: { name: 'place_equity_order', arguments: { account_number: 'RHPROFILE001', symbol: 'AAPL', side: 'buy', quantity: 1 } },
});
assert.equal(profileGateOrder.status, 400);
assert.match(profileGateOrder.payload.error.message, /Investor profile must be completed/);

const fractionalLimitOrder = await harness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'fractional-limit-order',
  method: 'tools/call',
  params: { name: 'place_equity_order', arguments: { account_number: 'RHAGENTIC001', symbol: 'AAPL', side: 'buy', type: 'limit', quantity: '0.5', limit_price: '200.00' } },
});
assert.equal(fractionalLimitOrder.status, 400);
assert.match(fractionalLimitOrder.payload.error.message, /Limit orders cannot include fractional/);

const wholeShareLimitOrder = await harness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'whole-share-limit-order',
  method: 'tools/call',
  params: { name: 'place_equity_order', arguments: { account_number: 'RHAGENTIC001', symbol: 'AAPL', side: 'buy', type: 'limit', quantity: '1', limit_price: '200.00' } },
});
assert.equal(wholeShareLimitOrder.status, 200);
assert.equal(wholeShareLimitOrder.payload.result.structuredContent.type, 'limit');
assert.equal(wholeShareLimitOrder.payload.result.structuredContent.limit_price, '200.00');

const missingStopLimitPriceOrder = await harness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'missing-stop-limit-price-order',
  method: 'tools/call',
  params: { name: 'place_equity_order', arguments: { account_number: 'RHAGENTIC001', symbol: 'AAPL', side: 'sell', type: 'stop_limit', quantity: '1', stop_price: '180.00' } },
});
assert.equal(missingStopLimitPriceOrder.status, 400);
assert.match(missingStopLimitPriceOrder.payload.error.message, /limit_price/);

const wholeShareStopLimitOrder = await harness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'whole-share-stop-limit-order',
  method: 'tools/call',
  params: {
    name: 'place_equity_order',
    arguments: { account_number: 'RHAGENTIC001', symbol: 'AAPL', side: 'sell', type: 'stop_limit', quantity: '1', stop_price: '180.00', limit_price: '179.00' },
  },
});
assert.equal(wholeShareStopLimitOrder.status, 200);
assert.equal(wholeShareStopLimitOrder.payload.result.structuredContent.type, 'stop_limit');
assert.equal(wholeShareStopLimitOrder.payload.result.structuredContent.stop_price, '180.00');
assert.equal(wholeShareStopLimitOrder.payload.result.structuredContent.limit_price, '179.00');

const unsupportedEquityOrderType = await harness.call('POST', '/mcp/trading', {
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

const order = await harness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'order',
  method: 'tools/call',
  params: { name: 'place_equity_order', arguments: { symbol: 'AAPL', side: 'buy', quantity: 1 } },
});
assert.equal(order.payload.result.structuredContent.status, 'accepted');

const cancel = await harness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'cancel',
  method: 'tools/call',
  params: { name: 'cancel_equity_order', arguments: { order_id: order.payload.result.structuredContent.id } },
});
assert.equal(cancel.payload.result.structuredContent.status, 'canceled');

const chain = await harness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'chain',
  method: 'tools/call',
  params: { name: 'get_option_chains', arguments: { underlying_symbol: 'AAPL' } },
});
const selectedChain = chain.payload.result.structuredContent.chains[0];
const selectedExpirationDate = selectedChain.expiration_dates[0];
assert.equal(selectedChain.underlying_symbol, 'AAPL');
assert.ok(selectedExpirationDate);

const instruments = await harness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'option-instruments',
  method: 'tools/call',
  params: {
    name: 'get_option_instruments',
    arguments: { chain_id: selectedChain.id, expiration_dates: selectedExpirationDate, type: 'call', state: 'active' },
  },
});
const selectedInstrument = instruments.payload.result.structuredContent.instruments[0];
assert.equal(selectedInstrument.chain_id, selectedChain.id);
assert.equal(selectedInstrument.expiration_date, selectedExpirationDate);

const optionQuotes = await harness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'option-quotes',
  method: 'tools/call',
  params: { name: 'get_option_quotes', arguments: { instrument_ids: [selectedInstrument.id] } },
});
assert.equal(optionQuotes.payload.result.structuredContent.quotes[0].instrument_id, selectedInstrument.id);
assert.equal(optionQuotes.payload.result.structuredContent.quotes[0].delta, '0');
assert.equal(optionQuotes.payload.result.structuredContent.quotes[0].gamma, '0');

const optionOrders = await harness.call('POST', '/mcp/trading', {
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
assert.ok(Array.isArray(optionOrders.payload.result.structuredContent.orders));
assert.equal(optionOrders.payload.result.structuredContent.next, null);

const optionPositions = await harness.call('POST', '/mcp/trading', {
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
assert.ok(Array.isArray(optionPositions.payload.result.structuredContent.positions));
assert.equal(optionPositions.payload.result.structuredContent.next, null);

const optionOrder = await harness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'option-order',
  method: 'tools/call',
  params: {
    name: 'place_option_order',
    arguments: { account_number: 'RHAGENTIC001', option_id: selectedInstrument.id, symbol: 'AAPL', side: 'buy', quantity: 1 },
  },
});
assert.equal(optionOrder.payload.result.structuredContent.status, 'accepted');

const unsupportedOptionOrderType = await harness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'unsupported-option-order-type',
  method: 'tools/call',
  params: {
    name: 'place_option_order',
    arguments: { account_number: 'RHAGENTIC001', option_id: selectedInstrument.id, symbol: 'AAPL', side: 'buy', type: 'market', quantity: 1 },
  },
});
assert.equal(unsupportedOptionOrderType.status, 400);
assert.match(unsupportedOptionOrderType.payload.error.message, /Unsupported option order type/);

const cancelOptionOrder = await harness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'cancel-option-order',
  method: 'tools/call',
  params: { name: 'cancel_option_order', arguments: { order_id: optionOrder.payload.result.structuredContent.id } },
});
assert.equal(cancelOptionOrder.payload.result.structuredContent.status, 'canceled');

const watchlist = await harness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'watchlist',
  method: 'tools/call',
  params: { name: 'create_watchlist', arguments: { display_name: 'Options Rollout' } },
});
const watchlistData = watchlist.payload.result.structuredContent.data.watchlist;
assert.equal(watchlistData.display_name, 'Options Rollout');

const metadataOnlyWatchlist = await harness.call('POST', '/mcp/trading', {
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
const metadataOnlyWatchlistData = metadataOnlyWatchlist.payload.result.structuredContent.data.watchlist;
assert.equal(metadataOnlyWatchlistData.display_name, 'Anti-Aging Peptides');
assert.equal(metadataOnlyWatchlistData.display_description, '15 companies across the peptide value chain');
assert.equal(metadataOnlyWatchlistData.icon_emoji, '🧬');
assert.deepEqual(metadataOnlyWatchlistData.symbols, []);
assert.deepEqual(metadataOnlyWatchlistData.option_ids, []);

const addMixedWatchlistItems = await harness.call('POST', '/mcp/trading', {
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
assert.deepEqual(addMixedWatchlistItems.payload.result.structuredContent.data.symbols, ['NVO', 'LLY', 'PFE', 'AMGN', 'ABBV']);
assert.equal(addMixedWatchlistItems.payload.result.structuredContent.data.object_type, 'instrument');

const addCryptoWatchlistItems = await harness.call('POST', '/mcp/trading', {
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
assert.deepEqual(addCryptoWatchlistItems.payload.result.structuredContent.data.currency_pair_ids, ['currency-pair-btc-usd']);
assert.equal(addCryptoWatchlistItems.payload.result.structuredContent.data.object_type, 'currency_pair');

const addIndexWatchlistItems = await harness.call('POST', '/mcp/trading', {
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
assert.deepEqual(addIndexWatchlistItems.payload.result.structuredContent.data.index_ids, ['index-spx']);
assert.equal(addIndexWatchlistItems.payload.result.structuredContent.data.object_type, 'index');

const mixedWatchlistItems = await harness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'mixed-watchlist-items',
  method: 'tools/call',
  params: { name: 'get_watchlist_items', arguments: { list_id: metadataOnlyWatchlistData.id } },
});
assert.ok(mixedWatchlistItems.payload.result.structuredContent.data.items.some((item) => item.symbol === 'NVO' && item.object_type === 'instrument'));
assert.ok(mixedWatchlistItems.payload.result.structuredContent.data.items.some((item) => item.object_id === 'currency-pair-btc-usd' && item.object_type === 'currency_pair'));
assert.ok(mixedWatchlistItems.payload.result.structuredContent.data.items.some((item) => item.object_id === 'index-spx' && item.object_type === 'index'));

const addedOption = await harness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'add-option-watchlist',
  method: 'tools/call',
  params: {
    name: 'add_option_to_watchlist',
    arguments: { option_ids: [selectedInstrument.id] },
  },
});
assert.ok(addedOption.payload.result.structuredContent.data.option_ids.includes(selectedInstrument.id));

const watchlistItems = await harness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'watchlist-items',
  method: 'tools/call',
  params: { name: 'get_option_watchlist', arguments: {} },
});
assert.ok(watchlistItems.payload.result.structuredContent.options.some((item) => item.instrument_id === selectedInstrument.id));

const followedList = await harness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'follow-list',
  method: 'tools/call',
  params: { name: 'follow_watchlist', arguments: { list_id: watchlistData.id } },
});
assert.equal(followedList.payload.result.structuredContent.data.action, 'followed');

const unfollowedList = await harness.call('POST', '/mcp/trading', {
  jsonrpc: '2.0',
  id: 'unfollow-list',
  method: 'tools/call',
  params: { name: 'unfollow_watchlist', arguments: { list_id: watchlistData.id } },
});
assert.equal(unfollowedList.payload.result.structuredContent.data.action, 'unfollowed');

console.log('robinhood-trading smoke ok');
