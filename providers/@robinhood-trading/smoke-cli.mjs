import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createHarness } from '../../scripts/provider-smoke-harness.mjs';
import { withServer } from '../../scripts/cli-smoke-runtime.mjs';
const { contract, plugin } = await import(process.env.ROBINHOOD_TEST_PLUGIN ?? './api-emulator.mjs');

function mcporter(args) {
  return new Promise((resolve, reject) => {
    const child = spawn('npx', ['-y', 'mcporter', ...args, '--allow-http'], { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '', stderr = '';
    child.stdout.on('data', chunk => { stdout += chunk; });
    child.stderr.on('data', chunk => { stderr += chunk; });
    const timeout = setTimeout(() => { child.kill(); reject(new Error('mcporter timed out')); }, 60000);
    child.on('error', error => { clearTimeout(timeout); reject(error); });
    child.on('close', code => {
      clearTimeout(timeout);
      if (code) return reject(new Error(`mcporter exited ${code}: ${stderr} ${stdout}`));
      try { resolve(JSON.parse(stdout)); } catch { reject(new Error(`Invalid mcporter JSON: ${stdout}`)); }
    });
  });
}

await withServer(createHarness(plugin).app, async (baseUrl) => {
  const url = `${baseUrl}/mcp/trading`;
  const listed = await mcporter(['list', '--http-url', url, '--schema', '--json', '--no-oauth']);
  assert.equal(listed.status, 'ok');
  assert.deepEqual(listed.tools.map(tool => tool.name).sort(), [...contract.scope].sort());
  async function call(name, args = {}) {
    const response = await mcporter(['call', `${url}.${name}`, '--args', JSON.stringify(args), '--output', 'json']);
    assert.ok(!response.isError, JSON.stringify(response));
    return response.data;
  }
  const { accounts } = await call('get_accounts');
  const account = { rhs_account_number: accounts.find(row => row.agentic_allowed).rhs_account_number };
  const orderArgs = { ...account, symbol: 'BTC', side: 'buy', type: 'limit', dollar_amount: '10', limit_price: '10000' };
  assert.equal((await call('preview_crypto_order', orderArgs)).order.speculative, true);
  assert.equal((await call('get_crypto_orders', account)).results.length, 0);
  const { order } = await call('place_crypto_order', orderArgs);
  assert.equal(order.state, 'queued');
  assert.equal((await call('cancel_crypto_order', { ...account, order_id: order.id })).accepted, true);
  assert.equal((await call('get_crypto_orders', account)).results[0].state, 'canceled');
  console.log('robinhood-trading mcporter HTTP smoke ok: 73 tools and crypto lifecycle');
});
