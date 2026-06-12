import { spawnSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PROVIDER_DIR = dirname(dirname(fileURLToPath(import.meta.url)));
const REGISTRY_DIR = dirname(PROVIDER_DIR);
const RAW_ROOT = join(REGISTRY_DIR, '.emu', 'robinhood-trading', 'options-activity');
const RAW_DIR = join(RAW_ROOT, new Date().toISOString().replace(/[:.]/g, '-'));
const LATEST_DIR = join(RAW_ROOT, 'latest');
const MCP_URL = process.env.ROBINHOOD_MCP_TRADING_URL ?? 'https://agent.robinhood.com/mcp/trading';
const SINCE = process.env.ROBINHOOD_MCP_SINCE ?? '2021-01-01';
const UNTIL = process.env.ROBINHOOD_MCP_UNTIL ?? '2021-12-31';

const READ_ONLY_TOOLS = new Set(['get_accounts', 'get_option_orders', 'get_option_positions']);

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
  if (!READ_ONLY_TOOLS.has(tool)) throw new Error(`Refusing non-read-only Robinhood MCP tool: ${tool}`);
  return run('npx', ['-y', 'mcporter', 'call', `${MCP_URL}.${tool}`, ...args, '--raw-strings', '--output', 'text']);
}

function parseMaybeJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function readPayload(stdout) {
  const parsed = parseMaybeJson(stdout);
  return parsed?.data ?? parsed ?? {};
}

function firstArray(payload, keys) {
  if (Array.isArray(payload)) return payload;
  for (const key of keys) {
    if (Array.isArray(payload?.[key])) return payload[key];
  }
  return [];
}

function chooseAccounts(accountsPayload) {
  const accounts = firstArray(accountsPayload, ['accounts', 'results']);
  const requested = process.env.ROBINHOOD_MCP_ACCOUNT_NUMBER;
  if (requested) {
    const account = accounts.find((row) => String(row.account_number) === requested);
    if (!account) throw new Error(`ROBINHOOD_MCP_ACCOUNT_NUMBER ${requested} was not returned by get_accounts`);
    return [account];
  }
  return accounts.filter((account) => account.account_number);
}

function writeCapture(name, stdout) {
  writeFileSync(join(RAW_DIR, `${name}.json`), stdout);
  writeFileSync(join(LATEST_DIR, `${name}.json`), stdout);
}

function numeric(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'string') return 0;
  const parsed = Number(value.replace(/[$,%\s,]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function orderSymbol(order) {
  return order.symbol ?? order.chain_symbol ?? order.underlying_symbol ?? order.option_symbol ?? 'UNKNOWN';
}

function orderDate(order) {
  return order.created_at ?? order.submitted_at ?? order.updated_at ?? order.processed_at ?? '';
}

function isOrderInWindow(order) {
  const date = orderDate(order);
  if (!date) return true;
  const day = date.slice(0, 10);
  return day >= SINCE && day <= UNTIL;
}

function orderNotional(order) {
  const processedPremium = numeric(order.processed_premium);
  if (processedPremium) return processedPremium;
  const premium = numeric(order.premium);
  if (premium) return premium * numeric(order.quantity ?? order.processed_quantity ?? order.cumulative_quantity);
  const price = numeric(order.price ?? order.average_price);
  const quantity = numeric(order.quantity ?? order.processed_quantity ?? order.cumulative_quantity);
  const multiplier = numeric(order.multiplier ?? order.trade_value_multiplier) || 100;
  return price * quantity * multiplier;
}

function summarizeOptionOrders(captures) {
  const orders = captures.flatMap((capture) => firstArray(readPayload(capture.stdout), ['orders', 'results'])).filter(isOrderInWindow);
  const filled = orders.filter((order) => ['filled', 'executed', 'confirmed'].includes(String(order.state ?? order.status ?? '').toLowerCase()));
  const cancelled = orders.filter((order) => ['cancelled', 'canceled'].includes(String(order.state ?? order.status ?? '').toLowerCase()));
  const bySymbol = new Map();
  for (const order of orders) {
    const symbol = orderSymbol(order);
    const summary = bySymbol.get(symbol) ?? { symbol, orders: 0, filled: 0, grossPremium: 0 };
    summary.orders += 1;
    if (filled.includes(order)) summary.filled += 1;
    summary.grossPremium += orderNotional(order);
    bySymbol.set(symbol, summary);
  }
  return {
    since: SINCE,
    until: UNTIL,
    accountCount: captures.length,
    totalOrders: orders.length,
    filledOrders: filled.length,
    cancelledOrders: cancelled.length,
    dateRange: orders.reduce(
      (range, order) => {
        const date = orderDate(order);
        if (!date) return range;
        return {
          first: !range.first || date < range.first ? date : range.first,
          last: !range.last || date > range.last ? date : range.last,
        };
      },
      { first: '', last: '' },
    ),
    topSymbols: [...bySymbol.values()].sort((left, right) => right.grossPremium - left.grossPremium).slice(0, 20),
  };
}

mkdirSync(RAW_DIR, { recursive: true });
rmSync(LATEST_DIR, { recursive: true, force: true });
mkdirSync(LATEST_DIR, { recursive: true });

console.log('Opening Robinhood OAuth in your browser if needed.');
console.log('Read-only capture: get_accounts, get_option_orders, get_option_positions.');
console.log(`Window: ${SINCE} through ${UNTIL}. Raw captures stay under .emu/ and are gitignored.`);

console.log('capturing get_accounts');
const accountsStdout = callTool('get_accounts');
writeCapture('get_accounts', accountsStdout);

const accounts = chooseAccounts(readPayload(accountsStdout));
if (accounts.length === 0) throw new Error('get_accounts did not return any account_number values');

const orderCaptures = [];
for (const account of accounts) {
  const accountNumber = String(account.account_number);
  const suffix = accountNumber.slice(-4);
  const accountArg = `account_number=${accountNumber}`;
  console.log(`capturing get_option_orders for account ending ${suffix}`);
  const ordersStdout = callTool('get_option_orders', [accountArg, `created_at_gte=${SINCE}`]);
  writeCapture(`get_option_orders_${suffix}`, ordersStdout);
  orderCaptures.push({ accountNumber, stdout: ordersStdout });

  console.log(`capturing get_option_positions for account ending ${suffix}`);
  writeCapture(`get_option_positions_${suffix}`, callTool('get_option_positions', [accountArg]));
}

const summary = summarizeOptionOrders(orderCaptures);
writeFileSync(join(RAW_DIR, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
writeFileSync(join(LATEST_DIR, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);

console.log(`raw capture: ${RAW_DIR}`);
console.log(JSON.stringify(summary, null, 2));
