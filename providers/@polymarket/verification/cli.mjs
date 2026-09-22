import assert from 'node:assert/strict';
import { createApp, Store, withServer, run } from '../../../scripts/cli-smoke-runtime.mjs';
import { plugin } from '../api-emulator.mjs';

const binary = process.env.POLYMARKET_CLI_BIN;
assert.ok(binary, 'Set POLYMARKET_CLI_BIN to the pinned jsj/polymarket-cli build documented in the provider README');
const app = createApp();
plugin.register(app, new Store());
let localRequests = 0;
for (const route of app.routes) {
  const handler = route.handler;
  route.handler = c => { localRequests++; return handler(c); };
}
await withServer(app, async baseUrl => {
  const env = { ...process.env, POLYMARKET_GAMMA_HOST: `${baseUrl}/gamma`, POLYMARKET_DATA_HOST: `${baseUrl}/data`, POLYMARKET_CLOB_HOST: `${baseUrl}/clob`, POLYMARKET_RPC_URL: `${baseUrl}/unsupported-rpc` };
  const command = async args => {
    const before = localRequests;
    const result = await run(binary, ['-o', 'json', ...args], { env });
    assert.ok(localRequests > before, 'CLI ignored a local host; build the pinned fork revision');
    return JSON.parse(result.stdout);
  };
  const call = args => command(['clob', ...args]);
  const markets = await command(['markets', 'list', '--limit', '1']);
  assert.equal(markets.length, 1);
  assert.equal(markets[0].id, 'polymarket-weather-2026');
  const search = await command(['markets', 'search', 'temperature']);
  assert.equal(search.length, 1);
  const wallet = '0x1111111111111111111111111111111111111111';
  const positions = await command(['data', 'positions', wallet]);
  assert.equal(Number(positions[0].size), 10);
  const value = await command(['data', 'value', wallet]);
  assert.equal(Number(value[0].value), 5.8);
  const book = await call(['book', '1001']);
  assert.equal(BigInt(book.asset_id), 1001n);
  assert.equal(book.bids[0].price, '0.57');
  assert.equal((await call(['midpoint', '1001'])).midpoint, '0.58');
  assert.equal((await call(['spread', '1001'])).spread, '0.02');
  assert.equal((await call(['price', '1001', '--side', 'buy'])).price, '0.57');
  assert.equal((await call(['books', '1001,1002'])).length, 2);
  assert.equal((await call(['last-trade', '1001'])).price, '0.58');
});
console.log('polymarket fork CLI Gamma, Data and CLOB smoke ok');
