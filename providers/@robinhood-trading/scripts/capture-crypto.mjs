// Live reads by default. --include-preview opts into a non-placing order preview; never place/cancel.
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const providerDir = dirname(dirname(fileURLToPath(import.meta.url)));
const capturedAt = new Date().toISOString();
const rawDir = join(providerDir, '..', '..', '.emu', 'robinhood-trading', `crypto-${capturedAt.replace(/[:.]/g, '-')}`);
const source = process.env.ROBINHOOD_MCP_TRADING_URL ?? 'https://agent.robinhood.com/mcp/trading';
mkdirSync(rawDir, { recursive: true, mode: 0o700 });
const observations = {};
function call(name, args = {}) {
  const response = spawnSync('npx', ['-y', 'mcporter', 'call', `${source}.${name}`, '--args', JSON.stringify(args), '--output', 'json'], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024, timeout: 90000 });
  writeFileSync(join(rawDir, `${name}.json`), response.stdout ?? '', { mode: 0o600 });
  let payload;
  try { payload = JSON.parse(response.stdout); } catch { throw new Error(`${name} failed to return JSON; inspect private raw capture`); }
  const data = payload.data ?? payload.structuredContent?.data ?? payload.result?.structuredContent?.data ?? payload;
  const failed = response.status !== 0 || payload.isError || payload.error;
  observations[name] = { success: !failed, ...(failed ? { error_category: payload._meta?.rh_error_category ?? 'unknown' } : { fields: Object.keys(data).sort() }) };
  console.log(`${name}: ${failed ? 'error captured' : 'captured'}`);
  return failed ? null : data;
}
const accounts = call('get_accounts');
if (!accounts?.accounts) throw new Error('Account capture failed');
const pairs = call('get_currency_pairs', { limit: 700 });
const quotes = call('get_crypto_quotes', { symbols: ['BTC-USD', 'ETH-USD'], timezone: 'America/New_York' });
call('get_crypto_account_onboarding_info');
const account = accounts.accounts.find((row) => row.agentic_allowed && row.rhs_account_number);
if (account) {
  const args = { rhs_account_number: account.rhs_account_number };
  call('get_crypto_positions', args);
  call('get_crypto_orders', args);
  if (process.argv.includes('--include-preview')) call('preview_crypto_order', { ...args, symbol: 'BTC', side: 'buy', type: 'limit', dollar_amount: '10.00', limit_price: '10000.00' });
}
// Only public market data and result field names leave the gitignored raw directory.
const sanitized = {
  captured_at: capturedAt, source, observations,
  currency_pairs: (pairs?.results ?? []).filter((row) => ['BTC-USD', 'ETH-USD'].includes(row.symbol)),
  quotes: quotes?.results ?? [],
};
writeFileSync(join(providerDir, 'fixtures', 'crypto-observed.sanitized.json'), `${JSON.stringify(sanitized, null, 2)}\n`);
console.log('Saved public crypto market data and response-shape evidence; private account payloads remain under .emu/.');
if (Object.entries(observations).some(([name, result]) => !result.success && name !== 'preview_crypto_order')) process.exitCode = 1;
