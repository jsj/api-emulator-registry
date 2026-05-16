import assert from 'node:assert/strict';
import { createHarness } from '../scripts/provider-smoke-harness.mjs';
import { contract, plugin } from './api-emulator.mjs';

const harness = createHarness(plugin);
assert.equal(contract.provider, 'robinhood');

const login = await harness.call('POST', '/oauth2/token/', { username: 'emulator@example.test', password: 'anything' });
assert.equal(login.payload.access_token, 'robinhood_emulator_access');
assert.equal(login.payload.mfa_required, false);

const refresh = await harness.call('POST', '/oauth2/token/', { grant_type: 'refresh_token', refresh_token: 'robinhood_emulator_refresh' });
assert.equal(refresh.payload.grant_type, 'refresh_token');

const challenge = await harness.call('POST', '/challenge/', {});
assert.equal(challenge.status, 201);
assert.equal(challenge.payload.status, 'validated');

const challengeResponse = await harness.call('POST', '/challenge/challenge_emulator/respond/', { response: '000000' });
assert.equal(challengeResponse.payload.challenge_response_id, 'challenge_response_emulator');

const user = await harness.call('GET', '/user/');
assert.equal(user.payload.id, 'user_emulator');

const basicInfo = await harness.call('GET', '/user/basic_info/');
assert.equal(basicInfo.payload.address.state, 'CA');

const investmentProfile = await harness.call('GET', '/user/investment_profile/');
assert.equal(investmentProfile.payload.investment_objective, 'growth');

const additionalInfo = await harness.call('GET', '/user/additional_info/');
assert.equal(additionalInfo.payload.employment_status, 'employed');

const userId = await harness.call('GET', '/user/id/');
assert.equal(userId.payload.status, 'verified');

const application = await harness.call('GET', '/applications/');
assert.equal(application.payload.results[0].state, 'approved');

const accounts = await harness.call('GET', '/api/v1/crypto/trading/accounts/');
assert.equal(accounts.payload.results[0].status, 'active');

const brokerageAccounts = await harness.call('GET', '/accounts/');
assert.equal(brokerageAccounts.payload.results[0].account_number, 'RH00000001');

const portfolio = await harness.call('GET', '/portfolios/');
assert.equal(portfolio.payload.results[0].market_value, '12631.25');

const positions = await harness.call('GET', '/positions/');
assert.equal(positions.payload.results[0].symbol, 'AAPL');

const stockQuote = await harness.call('GET', '/quotes/?symbols=AAPL,HOOD');
assert.equal(stockQuote.payload.results.length, 2);

const home = await harness.call('GET', '/api/mobile/home/');
assert.equal(home.payload.cards[0].id, 'portfolio');
assert.equal(home.payload.onboarding.state, 'complete');
assert.equal(home.payload.positions[0].quote.symbol, 'AAPL');
assert.equal(home.payload.watchlists[0].quotes.length, 4);

const config = await harness.call('GET', '/api/mobile/config/');
assert.equal(config.payload.force_upgrade, false);
assert.equal(config.payload.features.portfolio, true);

const marketHours = await harness.call('GET', '/markets/XNYS/hours/2026-05-16/');
assert.equal(marketHours.payload.market, 'XNYS');

const experiments = await harness.call('GET', '/kaizen/experiments/device?names=account-security-recaptcha-kill-switch-robinhood-ios&entityType=Device%20Id');
assert.equal(experiments.payload.results[0].variant, 'control');

const region = await harness.call('GET', '/region/');
assert.equal(region.payload.country_code, 'US');

const userDefaults = await harness.call('GET', '/accounts/v2/user_defaults?deviceId=device');
assert.equal(userDefaults.payload.defaults.account_id, 'acct_emulator');
assert.equal(userDefaults.payload.user_defaults.default_watchlist_id, 'watchlist_default');

const vitals = await harness.call('GET', '/vitals/fetch?platform=PLATFORM_IOS&app=APP_ROBINHOOD_TRADER');
assert.equal(vitals.payload.force_upgrade, false);
assert.equal(vitals.payload.vitals.account_state, 'active');

const crumbs = await harness.call('POST', '/trackv2', {});
assert.equal(crumbs.payload.status, 'ok');

const bootstrap = await harness.call('GET', '/api/mobile/bootstrap/');
assert.equal(bootstrap.payload.home.user.id, 'user_emulator');

const notifications = await harness.call('GET', '/notifications/');
assert.equal(notifications.payload.results[0].type, 'portfolio');

const userSettings = await harness.call('GET', '/ceres/v1/user_settings');
assert.equal(userSettings.payload.settings.home.default_tab, 'investing');

const discoveryDefault = await harness.call('GET', '/discovery/lists/default/');
assert.equal(discoveryDefault.payload.quotes[0].symbol, 'AAPL');

const discoveryLists = await harness.call('GET', '/discovery/lists/?owner_type=custom');
assert.equal(discoveryLists.payload.results[0].id, 'watchlist_default');

const accountSwitcher = await harness.call('GET', '/home/account_switcher/v2/');
assert.equal(accountSwitcher.payload.selected_account_id, 'acct_emulator');

const unified = await harness.call('GET', '/phoenix/accounts/unified');
assert.equal(unified.payload.positions[0].quote.symbol, 'AAPL');

const rhyAccounts = await harness.call('GET', '/rhy/accounts/');
assert.equal(rhyAccounts.payload.primary_account_id, 'acct_emulator');

const rhyTabState = await harness.call('GET', '/rhy/tab_state/');
assert.equal(rhyTabState.payload.tabs[0].id, 'investing');

const cryptoHome = await harness.call('GET', '/crypto/home/0/state');
assert.equal(cryptoHome.payload.holdings[0].asset_code, 'BTC');

const inboxBadge = await harness.call('GET', '/inbox/should_badge/');
assert.equal(inboxBadge.payload.unread_count, 1);

const appComms = await harness.call('GET', '/app-comms/surface/bottom-sheet?location=top_level_investing');
assert.equal(appComms.payload.surface, 'bottom-sheet');

const appCommsBatch = await harness.call('GET', '/app-comms/batch/surface/info-banner?locations=info_banner_profile_tab_top_level');
assert.equal(appCommsBatch.payload.locations[0], 'info_banner_profile_tab_top_level');

const optionsAccounts = await harness.call('GET', '/options/accounts/');
assert.equal(optionsAccounts.payload.results[0].state, 'approved');

const profilePage = await harness.call('GET', '/profile/page/');
assert.equal(profilePage.payload.sections[0].id, 'account');

const accountCenter = await harness.call('GET', '/account_center/');
assert.equal(accountCenter.payload.account.id, 'acct_emulator');

const transferAccounts = await harness.call('GET', '/transfer/accounts/');
assert.equal(transferAccounts.payload.ach_relationships[0].verified, true);

const suggestedAmounts = await harness.call('GET', '/transfer/suggested_amounts?guided_transfers_variant=member');
assert.equal(suggestedAmounts.payload.default_amount, '100.00');

const marketdataQuotes = await harness.call('GET', '/marketdata/quotes/?ids=ef29fd22-6e22-44ef-9911-a8f5bd68abd3&include_inactive=true');
assert.equal(marketdataQuotes.payload.results[0].id, 'ef29fd22-6e22-44ef-9911-a8f5bd68abd3');

const spendingEligibility = await harness.call('GET', '/application/spending/eligibility/');
assert.equal(spendingEligibility.payload.eligible, true);

const supportChats = await harness.call('GET', '/pathfinder/support_chats/');
assert.deepEqual(supportChats.payload.results, []);

const ach = await harness.call('GET', '/ach/relationships/');
assert.equal(ach.payload.results[0].verified, true);

const equityOrder = await harness.call('POST', '/orders/', { symbol: 'HOOD', side: 'buy', quantity: '1.00000000' });
assert.equal(equityOrder.status, 201);
assert.equal(equityOrder.payload.state, 'queued');

const holdings = await harness.call('GET', '/api/v1/crypto/trading/holdings/');
assert.equal(holdings.payload.results[0].asset_code, 'BTC');

const quote = await harness.call('GET', '/api/v1/crypto/marketdata/best_bid_ask/?symbol=BTC-USD');
assert.equal(quote.payload.results[0].symbol, 'BTC-USD');

const order = await harness.call('POST', '/api/v1/crypto/trading/orders/', { currency_pair_id: 'BTC-USD', side: 'buy', quantity: '0.00200000' });
assert.equal(order.status, 201);
assert.equal(order.payload.state, 'queued');

const fetched = await harness.call('GET', `/api/v1/crypto/trading/orders/${order.payload.id}/`);
assert.equal(fetched.payload.id, order.payload.id);

const fakeout = await harness.call('GET', '/dns/fakeout-plan');
assert.ok(fakeout.payload.hosts.includes('api.robinhood.com'));

const reset = await harness.call('POST', '/inspect/reset');
assert.equal(reset.payload.orders.length, 0);

console.log('robinhood smoke ok');
