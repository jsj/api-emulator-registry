// Bounded live reads only. The explicit allowlist excludes previews and all mutations.
import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const providerDir = dirname(dirname(fileURLToPath(import.meta.url)));
const contract = JSON.parse(readFileSync(join(providerDir, 'fixtures/tools-contract.sanitized.json'), 'utf8'));
const source = 'https://agent.robinhood.com/mcp/trading';
const capturedAt = new Date().toISOString();
const rawDir = join(providerDir, '../../.emu/robinhood-trading', `read-parity-${capturedAt.replace(/[:.]/g, '-')}`);
const allowed = new Set(['get_alerts', 'get_alert_log', 'get_equity_news', 'get_sec_filing_index', 'get_sec_filing', 'get_sec_filing_facts_catalog', 'get_sec_filing_facts']);
const observations = [];
mkdirSync(rawDir, { recursive: true, mode: 0o700 });

function check(value, schema, path = '$', errors = []) {
  if (!schema) return errors;
  const types = [].concat(schema.type ?? []);
  if (types.length && !types.some(t => t === 'null' ? value === null : t === 'array' ? Array.isArray(value) : t === 'object' ? value !== null && typeof value === 'object' && !Array.isArray(value) : t === 'integer' ? Number.isInteger(value) : typeof value === t)) {
    errors.push(`${path}: type mismatch`);
    return errors;
  }
  if (typeof value === 'number' && ((schema.minimum !== undefined && value < schema.minimum) || (schema.maximum !== undefined && value > schema.maximum))) errors.push(`${path}: out of range`);
  if (Array.isArray(value)) value.forEach((item, i) => check(item, schema.items, `${path}[${i}]`, errors));
  else if (value !== null && typeof value === 'object') {
    for (const key of schema.required ?? []) if (!Object.hasOwn(value, key)) errors.push(`${path}.${key}: missing`);
    for (const [key, item] of Object.entries(value)) {
      if (schema.properties?.[key]) check(item, schema.properties[key], `${path}.${key}`, errors);
      else if (schema.additionalProperties === false) errors.push(`${path}: unexpected property`);
    }
  }
  return errors;
}

function call(name, args = {}) {
  if (!allowed.has(name)) throw new Error('Tool is outside read-only allowlist');
  const tool = contract.tools.find(t => t.name === name);
  if (check(args, tool.inputSchema).length) throw new Error(`Invalid arguments for ${name}`);
  const response = spawnSync('npx', ['-y', 'mcporter', 'call', `${source}.${name}`, '--args', JSON.stringify(args), '--output', 'json'], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024, timeout: 60000 });
  writeFileSync(join(rawDir, `${observations.length}-${name}.json`), response.stdout ?? '', { mode: 0o600 });
  let payload;
  try { payload = JSON.parse(response.stdout); } catch { payload = null; }
  const failed = response.status !== 0 || !payload || payload.isError || payload.error || payload.result?.isError;
  const value = payload?.structuredContent ?? payload?.result?.structuredContent ?? payload;
  const mismatches = failed ? [] : check(value, tool.outputSchema);
  const result = { tool: name, status: failed ? 'upstream_error' : mismatches.length ? 'schema_mismatch' : 'passed', mismatches };
  if (!failed) result.data_fields = Object.keys(value.data ?? {}).filter(key => Object.hasOwn(tool.outputSchema.properties.data.properties, key)).sort();
  observations.push(result);
  console.log(`${name}: ${result.status}${mismatches.length ? ` (${mismatches.join(', ')})` : ''}`);
  return failed ? null : value.data;
}

call('get_alerts');
call('get_alert_log', { limit: 1 });
call('get_equity_news', { symbol: 'AAPL', limit: 1 });
const index = call('get_sec_filing_index', { symbol: 'AAPL', form_type: ['10-K'] });
const filingId = index?.filings?.find(row => row?.filing_id)?.filing_id;
if (filingId) {
  const toc = call('get_sec_filing', { filing_id: filingId });
  const section = toc?.table_of_contents?.sections?.find(row => row?.id)?.id;
  if (section) call('get_sec_filing', { filing_id: filingId, section });
  const catalog = call('get_sec_filing_facts_catalog', { filing_id: filingId, concept_contains: 'Assets' });
  const concept = catalog?.concepts?.find(row => row?.concept && !row.is_text_block)?.concept;
  if (concept) call('get_sec_filing_facts', { filing_ids: [filingId], concepts: [concept] });
}
const untested = [...allowed].filter(name => !observations.some(row => row.tool === name));
writeFileSync(join(providerDir, 'fixtures/read-validation.sanitized.json'), `${JSON.stringify({ captured_at: capturedAt, source, contract_captured_at: contract.captured_at, scope: 'Bounded live read-only schema checks; no previews or mutations; response values remain private.', observations, untested }, null, 2)}\n`);
if (untested.length || observations.some(row => row.status !== 'passed')) process.exitCode = 1;
