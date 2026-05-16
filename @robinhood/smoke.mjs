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

const config = await harness.call('GET', '/api/mobile/config/');
assert.equal(config.payload.force_upgrade, false);

const marketHours = await harness.call('GET', '/markets/XNYS/hours/2026-05-16/');
assert.equal(marketHours.payload.market, 'XNYS');

const experiments = await harness.call('GET', '/kaizen/experiments/device?names=account-security-recaptcha-kill-switch-robinhood-ios&entityType=Device%20Id');
assert.equal(experiments.payload.results[0].variant, 'control');

const region = await harness.call('GET', '/region/');
assert.equal(region.payload.country_code, 'US');

const userDefaults = await harness.call('GET', '/accounts/v2/user_defaults?deviceId=device');
assert.deepEqual(userDefaults.payload.defaults, {});

const vitals = await harness.call('GET', '/vitals/fetch?platform=PLATFORM_IOS&app=APP_ROBINHOOD_TRADER');
assert.equal(vitals.payload.force_upgrade, false);

const crumbs = await harness.call('POST', '/trackv2', {});
assert.equal(crumbs.payload.status, 'ok');

const bootstrap = await harness.call('GET', '/api/mobile/bootstrap/');
assert.equal(bootstrap.payload.home.user.id, 'user_emulator');

const notifications = await harness.call('GET', '/notifications/');
assert.deepEqual(notifications.payload.results, []);

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
