import assert from 'node:assert/strict';
import { createHarness } from '../scripts/provider-smoke-harness.mjs';
import { contract, plugin } from './api-emulator.mjs';

const harness = createHarness(plugin);
assert.equal(contract.provider, 'doppler');

const projects = await harness.call('GET', '/v3/projects?page=1&per_page=20', undefined, { authorization: 'Bearer dp.st.emulator' });
assert.equal(projects.payload.success, true);
assert.equal(projects.payload.projects[0].slug, 'demo');

const configs = await harness.call('GET', '/v3/configs?project=demo', undefined, { authorization: 'Bearer dp.st.emulator' });
assert.equal(configs.payload.configs[0].name, 'dev');

const secrets = await harness.call('GET', '/v3/configs/config/secrets?project=demo&config=dev');
assert.equal(secrets.payload.secrets.API_KEY.computed, 'doppler-emulator-key');
assert.equal(secrets.payload.secrets.CLI_SMOKE_COMMAND_TIMEOUT_MS.computed, '120000');
assert.equal(secrets.payload.secrets.MCPORTER_OAUTH_TIMEOUT_MS.computed, '300000');
assert.equal(secrets.payload.secrets.ROBINHOOD_MCP_TRADING_URL.computed, 'https://agent.robinhood.com/mcp/trading');

const secret = await harness.call('GET', '/v3/configs/config/secret?project=demo&config=dev&name=API_KEY');
assert.equal(secret.payload.secret.value.raw, 'doppler-emulator-key');

const download = await harness.call('GET', '/v3/configs/config/secrets/download?project=demo&config=dev&format=json');
assert.equal(download.payload.API_KEY, 'doppler-emulator-key');
assert.equal(download.payload.CLI_SMOKE_COMMAND_TIMEOUT_MS, '120000');
assert.equal(download.payload.MCPORTER_OAUTH_TIMEOUT_MS, '300000');
assert.equal(download.payload.ROBINHOOD_MCP_FIXTURE_SYMBOLS, 'AAPL');
assert.equal(download.payload.ROBINHOOD_MCP_HISTORICAL_START_TIME, '2026-06-15T00:00:00Z');
assert.equal(download.payload.ROBINHOOD_MCP_HISTORICAL_END_TIME, '2026-06-22T00:00:00Z');
assert.equal(download.payload.ROBINHOOD_MCP_HISTORICAL_INTERVAL, 'day');
assert.equal(download.payload.ROBINHOOD_MCP_SINCE, '2021-01-01');
assert.equal(download.payload.ROBINHOOD_MCP_UNTIL, '2021-12-31');

console.log('doppler smoke ok');
