import { spawnSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PROVIDER_DIR = dirname(dirname(fileURLToPath(import.meta.url)));
const REGISTRY_DIR = dirname(PROVIDER_DIR);
const RAW_ROOT = join(REGISTRY_DIR, '.emu', 'robinhood-trading', 'raw');
const RAW_DIR = join(RAW_ROOT, new Date().toISOString().replace(/[:.]/g, '-'));
const LATEST_DIR = join(RAW_ROOT, 'latest');
const MCP_URL = process.env.ROBINHOOD_MCP_TRADING_URL ?? 'https://agent.robinhood.com/mcp/trading';
const SYMBOLS = (process.env.ROBINHOOD_MCP_FIXTURE_SYMBOLS ?? 'AAPL').split(',').map((symbol) => symbol.trim()).filter(Boolean);
const HISTORICAL_START_TIME = process.env.ROBINHOOD_MCP_HISTORICAL_START_TIME ?? '2026-06-15T00:00:00Z';
const HISTORICAL_END_TIME = process.env.ROBINHOOD_MCP_HISTORICAL_END_TIME ?? '2026-06-22T00:00:00Z';
const HISTORICAL_INTERVAL = process.env.ROBINHOOD_MCP_HISTORICAL_INTERVAL ?? 'day';

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: REGISTRY_DIR,
    env: { ...process.env, MCPORTER_OAUTH_TIMEOUT_MS: process.env.MCPORTER_OAUTH_TIMEOUT_MS ?? '300000' },
    encoding: 'utf8',
    stdio: ['inherit', 'pipe', 'inherit'],
  });
  if (result.status !== 0) throw new Error(`${command} ${args.join(' ')} failed with ${result.status}`);
  return result.stdout;
}

function callTool(tool, args = []) {
  const selector = `${MCP_URL}.${tool}`;
  return run('npx', ['-y', 'mcporter', 'call', selector, ...args, '--raw-strings', '--output', 'text']);
}

function readPayload(stdout) {
  const parsed = JSON.parse(stdout);
  return parsed.data ?? parsed;
}

function chooseAccount(accountsPayload) {
  const accounts = accountsPayload.accounts ?? [];
  const requested = process.env.ROBINHOOD_MCP_ACCOUNT_NUMBER;
  if (requested) {
    const account = accounts.find((row) => String(row.account_number) === requested);
    if (!account) throw new Error(`ROBINHOOD_MCP_ACCOUNT_NUMBER ${requested} was not returned by get_accounts`);
    return account;
  }
  return accounts.find((row) => row.agentic_allowed) ?? accounts.find((row) => row.is_default) ?? accounts[0];
}

function firstArray(payload, keys) {
  if (Array.isArray(payload)) return payload;
  for (const key of keys) {
    if (Array.isArray(payload?.[key])) return payload[key];
  }
  return [];
}

function writeCapture(name, stdout) {
  writeFileSync(join(RAW_DIR, `${name}.json`), stdout);
  writeFileSync(join(LATEST_DIR, `${name}.json`), stdout);
}

mkdirSync(RAW_DIR, { recursive: true });
rmSync(LATEST_DIR, { recursive: true, force: true });
mkdirSync(LATEST_DIR, { recursive: true });

console.log('Opening Robinhood OAuth in your browser if needed.');
console.log('Do not share credentials here. Raw captures stay under .emu/ and are gitignored.');

console.log('capturing get_accounts');
const accountsStdout = callTool('get_accounts');
writeCapture('get_accounts', accountsStdout);

const account = chooseAccount(readPayload(accountsStdout));
if (!account?.account_number) throw new Error('get_accounts did not return a usable account_number');
console.log(`using ${account.agentic_allowed ? 'agentic' : 'read-only'} account ending ${String(account.account_number).slice(-4)}`);

const accountArg = `account_number=${account.account_number}`;
const calls = [
  { tool: 'get_portfolio', args: [accountArg] },
  { tool: 'get_equity_positions', args: [accountArg] },
  { tool: 'get_equity_quotes', args: [`symbols=${JSON.stringify(SYMBOLS)}`] },
  {
    tool: 'get_equity_historicals',
    args: [
      `symbols=${JSON.stringify([...new Set([...SYMBOLS, 'SPY'])])}`,
      `start_time=${HISTORICAL_START_TIME}`,
      `end_time=${HISTORICAL_END_TIME}`,
      `interval=${HISTORICAL_INTERVAL}`,
    ],
  },
  { tool: 'get_equity_orders', args: [accountArg] },
  { tool: 'get_equity_tradability', args: [accountArg, `symbols=${JSON.stringify([SYMBOLS[0] ?? 'AAPL'])}`] },
  { tool: 'search', args: ['query=Apple'] },
];

if (account.agentic_allowed) {
  calls.push({
    tool: 'review_equity_order',
    args: [accountArg, `symbol=${SYMBOLS[0] ?? 'AAPL'}`, 'side=buy', 'quantity=1', 'type=market', 'market_hours=regular_hours', 'time_in_force=gfd'],
  });
}

for (const call of calls) {
  console.log(`capturing ${call.tool}`);
  writeCapture(call.tool, callTool(call.tool, call.args));
}

const optionSymbol = SYMBOLS[0] ?? 'AAPL';
console.log('capturing get_option_chains');
const optionChainsStdout = callTool('get_option_chains', [`underlying_symbol=${optionSymbol}`]);
writeCapture('get_option_chains', optionChainsStdout);

const optionChain = firstArray(readPayload(optionChainsStdout), ['chains', 'results'])[0];
const expirationDate = optionChain?.expiration_dates?.[0];
if (optionChain?.id && expirationDate) {
  console.log('capturing get_option_instruments');
  const optionInstrumentsStdout = callTool('get_option_instruments', [
    `chain_id=${optionChain.id}`,
    `expiration_dates=${expirationDate}`,
    'type=call',
    'state=active',
  ]);
  writeCapture('get_option_instruments', optionInstrumentsStdout);

  const optionInstrument = firstArray(readPayload(optionInstrumentsStdout), ['instruments', 'results'])[0];
  if (optionInstrument?.id) {
    console.log('capturing get_option_quotes');
    writeCapture('get_option_quotes', callTool('get_option_quotes', [`instrument_ids=${JSON.stringify([optionInstrument.id])}`]));
  }
}

console.log('capturing get_watchlists');
writeCapture('get_watchlists', callTool('get_watchlists'));

console.log('capturing get_option_watchlist');
writeCapture('get_option_watchlist', callTool('get_option_watchlist'));

run('node', [join(PROVIDER_DIR, 'scripts', 'sanitize-fixtures.mjs'), LATEST_DIR, join(PROVIDER_DIR, 'fixtures', 'sanitized.json')]);
console.log(`raw capture: ${RAW_DIR}`);
console.log('sanitized fixture updated. Review @robinhood-trading/fixtures/sanitized.json before committing.');
