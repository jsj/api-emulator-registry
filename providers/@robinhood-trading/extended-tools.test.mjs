import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { EXTENDED_TOOL_NAMES, extendedDefaults, handleExtendedTool } from './extended-tools.mjs';
const contract = JSON.parse(readFileSync(new URL('./fixtures/tools-contract.sanitized.json', import.meta.url)));
function schema(value, s) {
  const type = value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;
  const types = [].concat(s.type ?? []);
  assert.ok(!types.length || types.includes(type) || (types.includes('integer') && Number.isInteger(value)), `Unexpected ${type}`);
  if (value === null) return;
  if (Array.isArray(value)) return value.forEach(v => schema(v, s.items));
  if (typeof value !== 'object') return;
  for (const k of s.required ?? []) assert.ok(Object.hasOwn(value, k), `Missing ${k}`);
  for (const [k, v] of Object.entries(value)) { assert.ok(s.properties?.[k] || s.additionalProperties !== false, `Unexpected ${k}`); if (s.properties?.[k]) schema(v, s.properties[k]); }
}
function call(state, name, args = {}) {
  const result = handleExtendedTool(name, args, state);
  assert.equal(result.error, undefined, result.error);
  schema(result, contract.tools.find(t => t.name === name).outputSchema);
  return result.data;
}
test('all eleven captured tool output schemas and alert lifecycle', () => {
  const s = extendedDefaults(), tested = new Set();
  const run = (name, args) => { tested.add(name); return call(s, name, args); };
  const alert = run('create_alert', { symbol: 'btc-usd', condition_type: 'price_above', threshold: '80000' }).alert;
  assert.equal(alert.asset_class, 'crypto'); assert.equal(alert.symbol, 'BTC');
  assert.equal(run('update_alert', { alert_id: alert.alert_id, enabled: false, threshold: '90000' }).alert.enabled, false);
  assert.equal(run('get_alerts', { symbol: 'BTC' }).alerts[0].condition.target_price, '90000');
  assert.equal(run('delete_alert', { alert_id: alert.alert_id }).deleted, false);
  assert.equal(s.alerts.length, 2);
  assert.equal(run('delete_alert', { alert_id: alert.alert_id, confirm: true }).deleted, true);
  const event = run('get_alert_log').events[0];
  run('mark_alerts_read', { alert_log_ids: [event.alert_log_id] });
  assert.equal(run('get_alert_log').total_unread_count, 0);
  assert.equal(run('get_equity_news', { symbol: 'aapl' }).articles.length, 3);
  const filing = run('get_sec_filing_index', { symbol: 'aapl', form_type: ['10-Q'] }).filings[0];
  const section = run('get_sec_filing', { filing_id: filing.filing_id }).table_of_contents.sections[0];
  assert.match(run('get_sec_filing', { filing_id: filing.filing_id, section: section.id }).section.content, /Synthetic/);
  const catalog = run('get_sec_filing_facts_catalog', { filing_id: filing.filing_id, concept_contains: 'assets' });
  assert.equal(catalog.count, 1);
  assert.equal(run('get_sec_filing_facts', { filing_ids: [filing.filing_id], concepts: [catalog.concepts[0].concept] }).facts.length, 1);
  assert.deepEqual([...tested].sort(), [...EXTENDED_TOOL_NAMES].sort());
});
test('pagination is filtered, ordered, and rejects changed log filters', () => {
  const s = extendedDefaults();
  s.alertLog.push({ ...s.alertLog[0], alert_log_id: 'older', triggered_at: '2026-09-04T12:00:00Z' });
  const p = call(s, 'get_alert_log', { limit: 1 });
  assert.equal(p.events[0].alert_log_id, 'synthetic-alert-event-aapl');
  assert.equal(call(s, 'get_alert_log', { limit: 1, cursor: p.next_cursor }).events[0].alert_log_id, 'older');
  assert.equal(handleExtendedTool('get_alert_log', { limit: 2, cursor: p.next_cursor }, s).status, 400);
  const news = call(s, 'get_equity_news', { symbol: 'AAPL', limit: 1 });
  assert.notEqual(call(s, 'get_equity_news', { symbol: 'AAPL', limit: 1, cursor: news.next_cursor }).articles[0].id, news.articles[0].id);
  call(s, 'mark_alerts_read', { all_through: '2026-09-04T12:00:00Z' });
  assert.equal(s.alertLog[0].read, false); assert.equal(s.alertLog[1].read, true);
  assert.equal(call(s, 'get_sec_filing_index', { symbol: 'AAPL', since: '2026-07-01' }).filings.length, 1);
});
test('alert family validation and failed updates preserve state', () => {
  const s = extendedDefaults();
  const a = call(s, 'create_alert', { symbol: 'AAPL', condition_type: 'sma_above', threshold: '150', indicator: { period: 50, interval_secs: 86400 } }).alert;
  call(s, 'update_alert', { alert_id: a.alert_id, condition_type: 'price_crosses_sma' });
  assert.equal(a.condition.target_value, undefined);
  const before = JSON.stringify(s.alerts);
  for (const args of [{ condition_type: 'ema_above', threshold: '2' }, { threshold: '3' }, { enabled: null }]) assert.equal(handleExtendedTool('update_alert', { alert_id: a.alert_id, ...args }, s).status, 400);
  assert.equal(JSON.stringify(s.alerts), before);
  for (const args of [
    { symbol: 'BTC', condition_type: 'sma_above', threshold: '5', indicator: { period: 5, interval_secs: 300 } },
    { symbol: 'AAPL', condition_type: 'price_above' },
    { symbol: 'AAPL', condition_type: 'price_crosses_sma', threshold: '2', indicator: { period: 5, interval_secs: 300 } },
    { symbol: 'AAPL', condition_type: 'vwap_above', threshold: '2', indicator: { interval_secs: 86400 } },
  ]) assert.equal(handleExtendedTool('create_alert', args, s).status, 400);
  assert.equal(handleExtendedTool('mark_alerts_read', {}, s).status, 400);
  assert.equal(handleExtendedTool('mark_alerts_read', { alert_log_ids: ['x'], all_through: '2026-09-05T00:00:00Z' }, s).status, 400);
  assert.equal(handleExtendedTool('get_alerts', { asset_class: 'crypto' }, s).status, 400);
  assert.equal(handleExtendedTool('get_alert_log', { limit: 101 }, s).status, 400);
  assert.equal(handleExtendedTool('get_sec_filing', { filing_id: 'missing' }, s).status, 404);
  assert.equal(call(s, 'get_equity_news', { symbol: 'UNKNOWN' }).articles.length, 0);
});
test('all extended tools route through the MCP harness with persisted alert changes', async () => {
  const { createHarness } = await import('../../scripts/provider-smoke-harness.mjs');
  const { plugin } = await import('./api-emulator.mjs');
  const harness = createHarness(plugin);
  const seen = new Set();
  async function run(name, args = {}) {
    seen.add(name);
    const response = await harness.call('POST', '/mcp/trading', { jsonrpc: '2.0', id: name, method: 'tools/call', params: { name, arguments: args } });
    assert.equal(response.status, 200, JSON.stringify(response.payload));
    assert.ok(!response.payload.result.isError, JSON.stringify(response.payload));
    const output = response.payload.result.structuredContent;
    schema(output, contract.tools.find(t => t.name === name).outputSchema);
    return output.data;
  }
  const { alert } = await run('create_alert', { symbol: 'BTC', condition_type: 'price_above', threshold: '80000' });
  await run('update_alert', { alert_id: alert.alert_id, enabled: false });
  assert.equal((await run('get_alerts', { symbol: 'BTC' })).alerts.find(a => a.alert_id === alert.alert_id).enabled, false);
  await run('delete_alert', { alert_id: alert.alert_id, confirm: true });
  assert.ok(!(await run('get_alerts', { symbol: 'BTC' })).alerts.some(a => a.alert_id === alert.alert_id));
  const { events } = await run('get_alert_log');
  await run('mark_alerts_read', { alert_log_ids: [events[0].alert_log_id] });
  assert.equal((await run('get_alert_log')).total_unread_count, 0);
  await run('get_equity_news', { symbol: 'AAPL' });
  const { filings } = await run('get_sec_filing_index', { symbol: 'AAPL' });
  await run('get_sec_filing', { filing_id: filings[0].filing_id });
  const { concepts } = await run('get_sec_filing_facts_catalog', { filing_id: filings[0].filing_id });
  await run('get_sec_filing_facts', { filing_ids: [filings[0].filing_id], concepts: [concepts[0].concept] });
  assert.deepEqual([...seen].sort(), [...EXTENDED_TOOL_NAMES].sort());
});
test('mark-read rejects oversized batches and future watermarks without mutations', () => {
  const s = extendedDefaults(), before = structuredClone(s);
  const oversized = handleExtendedTool('mark_alerts_read', { alert_log_ids: Array.from({ length: 101 }, (_, i) => `event-${i}`) }, s);
  assert.equal(oversized.status, 400); assert.match(oversized.error, /100/);
  assert.equal(handleExtendedTool('mark_alerts_read', { all_through: new Date(Date.now() + 60000).toISOString() }, s).status, 400);
  assert.deepEqual(s, before);
  assert.equal(call(s, 'mark_alerts_read', { alert_log_ids: Array.from({ length: 100 }, (_, i) => `event-${i}`) }).alert_log_id_count, 100);
});
test('extended inputs enforce captured required fields, types, and unknown fields recursively', () => {
  const s = extendedDefaults(), before = structuredClone(s);
  for (const [name, args] of [
    ['get_alerts', { unknown: true }],
    ['get_alerts', []],
    ['get_alerts', null],
    ['get_equity_news', {}],
    ['get_equity_news', { symbol: 12 }],
    ['delete_alert', { alert_id: 'synthetic-alert-aapl', confirm: 'true' }],
    ['get_sec_filing_facts', { filing_ids: [12], concepts: ['Assets'] }],
    ['create_alert', { symbol: 'AAPL', condition_type: 'sma_above', threshold: '200', indicator: { period: 10 } }],
    ['create_alert', { symbol: 'AAPL', condition_type: 'sma_above', threshold: '200', indicator: { period: 10, interval_secs: 300, unknown: true } }],
  ]) assert.equal(handleExtendedTool(name, args, s).status, 400, JSON.stringify([name, args]));
  assert.deepEqual(s, before);
});
test('SEC catalog groups dimension members by axis and deduplicates reporting periods', () => {
  const s = extendedDefaults();
  const filing = s.research.AAPL.filings[0];
  const base = filing.facts.find(f => f.concept === 'Assets');
  filing.facts = [
    { ...base, axises: null },
    { ...base, axises: ['ProductOrServiceAxis: HardwareMember'] },
    { ...base, axises: ['ProductOrServiceAxis: SoftwareMember', 'GeographicalAxis: USMember'] },
    { ...base, period: '2026-06-30', start_date: undefined, axises: ['GeographicalAxis: EuropeMember'] },
    { ...base, period: '2026-06-30', start_date: undefined, axises: [] },
  ];
  const before = structuredClone(filing.facts);
  const result = call(s, 'get_sec_filing_facts_catalog', { filing_id: filing.filing_id, axis_name_in: ['ProductOrServiceAxis'] });
  assert.equal(result.count, 1);
  assert.deepEqual(result.concepts[0].axis_names, ['ProductOrServiceAxis', 'GeographicalAxis']);
  assert.deepEqual(result.concepts[0].periods, [
    { period: '2026Q2', start_date: '2026-04-01', end_date: '2026-06-30' },
    { period: '2026-06-30', end_date: '2026-06-30' },
  ]);
  assert.equal(call(s, 'get_sec_filing_facts_catalog', { filing_id: filing.filing_id, axis_name_in: ['ProductOrServiceAxis: HardwareMember'] }).count, 0);
  assert.deepEqual(filing.facts, before);
});
