// Public catalog reads only. This script cannot select accounts, previews, or mutations.
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, writeFile, rename } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const run = promisify(execFile);
const providerDir = dirname(dirname(fileURLToPath(import.meta.url)));
const source = 'https://agent.robinhood.com/mcp/trading';
const capturedAt = new Date().toISOString();
const rawDir = join(providerDir, '../../.emu/robinhood-trading', `parity-${capturedAt.replace(/[:.]/g, '-')}`);
const allowed = new Set(['get_currency_pairs', 'get_indexes']);
await mkdir(rawDir, { recursive: true, mode: 0o700 });

async function call(id, tool, args) {
  if (!allowed.has(tool)) throw new Error(`Tool outside public read-only allowlist: ${tool}`);
  let response;
  try {
    response = await run('npx', ['-y', 'mcporter', 'call', `${source}.${tool}`, '--args', JSON.stringify(args), '--output', 'json'], {
      encoding: 'utf8', maxBuffer: 16 * 1024 * 1024, timeout: 60000,
    });
  } catch (error) {
    await writeFile(join(rawDir, `${id}.json`), JSON.stringify({ stdout: error.stdout, stderr: error.stderr, code: error.code }), { mode: 0o600 });
    throw new Error(`${id}: live call failed; inspect private raw capture`, { cause: new Error(String(error.code)) });
  }
  await writeFile(join(rawDir, `${id}.json`), response.stdout, { mode: 0o600 });
  let payload;
  try { payload = JSON.parse(response.stdout); } catch { throw new Error(`${id}: invalid JSON; inspect private raw capture`); }
  const envelope = payload.structuredContent ?? payload.result?.structuredContent ?? payload;
  if (payload.error || payload.isError || payload.result?.isError || envelope.error || envelope.isError || !envelope.data || typeof envelope.data !== 'object') {
    throw new Error(`${id}: upstream error or missing data; inspect private raw capture`);
  }
  console.log(`${id}: captured (${Object.keys(envelope.data).sort().join(', ')})`);
  return envelope.data;
}

const pairs = await call('seed-currency-pairs', 'get_currency_pairs', { limit: 700 });
const indexes = await call('seed-indexes', 'get_indexes', {});
if (!Array.isArray(pairs.results) || !pairs.results.length || !Array.isArray(indexes.indexes) || indexes.indexes.length < 2) {
  throw new Error('Baseline catalogs are empty or have unexpected shapes; fixture unchanged');
}
if (pairs.next) throw new Error('Currency pair baseline is paginated; refusing an incomplete seed');
const symbols = indexes.indexes.slice(0, 2).map((row) => row.symbol);
if (symbols.some((symbol) => typeof symbol !== 'string' || !symbol)) throw new Error('Missing index symbols');
const scenarios = [
  { id: 'currency-pairs-limit-2', tool: 'get_currency_pairs', args: { limit: 2 } },
  { id: 'currency-pairs-limit-0', tool: 'get_currency_pairs', args: { limit: 0 } },
  { id: 'indexes-one-symbol', tool: 'get_indexes', args: { symbols: symbols[0] } },
  { id: 'indexes-two-symbols', tool: 'get_indexes', args: { symbols: symbols.join(',') } },
  { id: 'indexes-unknown-symbol', tool: 'get_indexes', args: { symbols: 'PARITY_NONEXISTENT_INDEX' } },
];
const cases = [];
for (const scenario of scenarios) {
  const expected = await call(scenario.id, scenario.tool, scenario.args);
  // Cursor URLs reveal upstream infrastructure and are not portable replay values.
  if (scenario.tool === 'get_currency_pairs' && typeof expected.next === 'string' && expected.next) {
    expected.next = 'https://example.invalid/currency_pairs?cursor=redacted';
  }
  cases.push({ ...scenario, expected, ignorePaths: scenario.tool === 'get_currency_pairs' ? ['/next'] : [],
    ...(scenario.tool === 'get_currency_pairs' ? { ignoreReasons: { '/next': 'Upstream cursor URL is opaque and deployment-specific; presence and type remain compared.' } } : {}),
  });
}
const fixture = {
  captured_at: capturedAt, source,
  seed: { currencyPairs: pairs.results, indexes: indexes.indexes }, cases,
  scope: 'Public catalog response replay for two tools and five independently captured argument scenarios. Baseline catalogs seed local state; scenarios are separate upstream calls. No accounts, previews, orders, or other mutations. Does not establish complete provider parity.',
};
const destination = join(providerDir, 'fixtures/parity.sanitized.json');
const temporary = `${destination}.${process.pid}.tmp`;
await writeFile(temporary, `${JSON.stringify(fixture, null, 2)}\n`, { flag: 'wx', mode: 0o600 });
await rename(temporary, destination);
console.log(`Saved ${cases.length} cases; baseline: ${pairs.results.length} currency pairs, ${indexes.indexes.length} indexes.`);
