import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';

export const EXTENDED_TOOL_NAMES = ['create_alert', 'delete_alert', 'get_alert_log', 'get_alerts', 'mark_alerts_read', 'update_alert', 'get_equity_news', 'get_sec_filing', 'get_sec_filing_facts', 'get_sec_filing_facts_catalog', 'get_sec_filing_index'];
const inputSchemas = new Map(JSON.parse(readFileSync(new URL('./fixtures/tools-contract.sanitized.json', import.meta.url))).tools.map(t => [t.name, t.inputSchema]));
const guide = 'Local emulator: synthetic research and alert data. Alerts do not monitor markets or send notifications.';
const ok = data => ({ data, guide });
const fail = message => { throw new Error(message); };
const own = (o, k) => Object.hasOwn(o, k);
function validateInput(value, schema, path = 'arguments') {
  const types = [].concat(schema.type ?? []);
  const type = value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;
  if (types.length && !types.includes(type) && !(types.includes('integer') && Number.isInteger(value))) fail(`${path} has invalid type`);
  if (value === null) return;
  if (typeof value === 'number' && (!Number.isFinite(value) || (schema.minimum !== undefined && value < schema.minimum) || (schema.maximum !== undefined && value > schema.maximum))) fail(`${path} is outside allowed range`);
  if (Array.isArray(value)) { value.forEach((item, i) => validateInput(item, schema.items, `${path}[${i}]`)); return; }
  if (typeof value !== 'object') return;
  for (const key of schema.required ?? []) if (!own(value, key)) fail(`${path}.${key} is required`);
  for (const [key, item] of Object.entries(value)) {
    if (schema.properties?.[key]) validateInput(item, schema.properties[key], `${path}.${key}`);
    else if (schema.additionalProperties === false) fail(`Unknown argument: ${path}.${key}`);
  }
}
const timestamp = value => { if (typeof value !== 'string' || !/^\d{4}-\d\d-\d\dT/.test(value) || !Number.isFinite(Date.parse(value))) fail('Expected RFC3339 timestamp'); return Date.parse(value); };
const symbolOf = value => { if (typeof value !== 'string' || !value.trim()) fail('symbol is required'); return value.trim().toUpperCase().replace(/-USD$/, ''); };
function page(rows, args, size, key) {
  const signature = JSON.stringify([key, Object.fromEntries(Object.entries(args).filter(([k]) => k !== 'cursor').sort())]);
  let offset = 0;
  if (args.cursor) {
    let token; try { token = JSON.parse(Buffer.from(args.cursor, 'base64url').toString()); } catch { fail('Invalid cursor'); }
    if (token.signature !== signature || !Number.isInteger(token.offset) || token.offset < 0) fail('Invalid cursor or changed filters');
    offset = token.offset;
  }
  const result = { rows: rows.slice(offset, offset + size) };
  if (offset + size < rows.length) result.next = Buffer.from(JSON.stringify({ signature, offset: offset + size })).toString('base64url');
  return result;
}
export function extendedDefaults() {
  const date = '2026-09-05T12:00:00Z';
  const alerts = [{ alert_id: 'synthetic-alert-aapl', asset_class: 'equity', symbol: 'AAPL', display_name: 'Synthetic AAPL alert', enabled: true, condition_type: 'price_above', condition: { target_price: '200' }, created_at: date, updated_at: date }];
  const alertLog = [{ alert_log_id: 'synthetic-alert-event-aapl', alert_id: alerts[0].alert_id, asset_class: 'equity', symbol: 'AAPL', condition_type: 'price_above', trigger: { target_price: '200', triggered_price: '201' }, triggered_at: date, read: false }];
  const research = {};
  for (const symbol of ['AAPL', 'MSFT', 'NVDA', 'SPY']) {
    const filings = ['2026-08-01', '2026-05-01', '2026-02-01'].map((date_filed, i) => ({ filing_id: `synthetic-${symbol}-${i}`, form_type: i === 2 ? '10-K' : '10-Q', description: 'Synthetic emulator filing', date_filed }));
    research[symbol] = { filings, articles: [0, 1, 2].map(i => ({ id: `synthetic-news-${symbol}-${i}`, title: `Synthetic ${symbol} news example ${i + 1}`, publisher: 'Emulator synthetic publisher', published_at: `2026-09-0${5 - i}T12:00:00Z`, source_type: 'news', preview_text: 'Synthetic fixture; not a real news report.', content: 'Synthetic content for local testing.' })) };
    for (const filing of filings) {
      filing.sections = [{ id: 'business', title: 'Synthetic business overview', level: 1, content: 'Synthetic filing content for emulator testing; not an actual SEC disclosure.' }];
      filing.facts = ['RevenueFromContractWithCustomerExcludingAssessedTax', 'NetIncomeLoss', 'Assets'].map((concept, i) => ({ filing_id: filing.filing_id, concept, entity: `Synthetic ${symbol}`, period: '2026Q2', axises: [], decimals: -6, value: String((3 - i) * 1000000), char_value: String((3 - i) * 1000000), unit: 'USD', start_date: '2026-04-01', end_date: '2026-06-30' }));
    }
  }
  return { alerts, alertLog, research };
}
function family(type) {
  if (/^price_(above|below|crosses)$/.test(type)) return 'price';
  if (/^(sma|ema|vwap|rsi)_(above|below|crosses)$/.test(type)) return type.split('_')[0];
  if (/^price_(above|below|crosses)_(sma|ema|vwap)$/.test(type)) return type.split('_')[2];
  if (['price_above_boll_upper', 'price_below_boll_lower', 'price_crosses_boll_mid'].includes(type)) return 'boll';
  if (/^macd_(above|below|crosses)_signal$/.test(type)) return 'macd';
  fail('Unsupported condition_type');
}
function condition(type, threshold, indicator, asset) {
  const kind = family(type);
  if (asset === 'crypto' && kind !== 'price') fail('Crypto supports price conditions only');
  const numeric = kind === 'price' || /^(sma|ema|vwap|rsi)_(above|below|crosses)$/.test(type);
  if (numeric && (typeof threshold !== 'string' || !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(threshold) || !Number.isFinite(Number(threshold)))) fail('Decimal threshold required');
  if (!numeric && threshold !== undefined) fail('Threshold is not allowed for price versus indicator conditions');
  if (kind === 'price') { if (indicator != null) fail('Price conditions cannot include indicator'); return { target_price: threshold }; }
  if (!indicator || ![300, 600, 3600, 86400, 604800, 2592000].includes(indicator.interval_secs)) fail('Valid indicator interval_secs required');
  if (kind === 'vwap' && indicator.interval_secs !== 300) fail('VWAP requires 300-second bars');
  const fields = kind === 'macd' ? ['fast_period', 'slow_period', 'signal_period'] : kind === 'vwap' ? [] : ['period'];
  for (const field of fields) if (!Number.isInteger(indicator[field]) || indicator[field] <= 0) fail(`Positive ${field} required`);
  if (kind === 'boll' && (!(indicator.std_dev > 0) || !['sma', 'ema'].includes(indicator.ma_type))) fail('Bollinger bands require std_dev and ma_type');
  return { ...(numeric ? { target_value: threshold } : {}), indicator: { ...indicator, kind } };
}
export function handleExtendedTool(tool, args, state) {
  if (!EXTENDED_TOOL_NAMES.includes(tool)) return null;
  try {
    validateInput(args, inputSchemas.get(tool));
    if (['alerts', 'alertLog', 'research'].some(key => state[key] == null)) {
      for (const [key, value] of Object.entries(extendedDefaults())) state[key] ??= value;
    }
    if (args.asset_class && !['equity', 'crypto'].includes(args.asset_class)) fail('asset_class must be equity or crypto');
    if (tool === 'create_alert') {
      const symbol = symbolOf(args.symbol);
      const asset = args.asset_class || (['BTC', 'ETH', 'DOGE', 'SOL'].includes(symbol) ? 'crypto' : 'equity');
      const now = new Date().toISOString();
      const alert = { alert_id: randomUUID(), asset_class: asset, symbol, display_name: `Synthetic ${symbol} alert`, enabled: true, condition_type: args.condition_type, condition: condition(args.condition_type, args.threshold, args.indicator, asset), created_at: now, updated_at: now };
      state.alerts.push(alert); return ok({ alert });
    }
    if (tool === 'update_alert' || tool === 'delete_alert') {
      const alert = state.alerts.find(a => a.alert_id === args.alert_id);
      if (!alert) return { error: 'Alert not found', status: 404 };
      if (tool === 'delete_alert') { if (args.confirm === true) state.alerts = state.alerts.filter(a => a !== alert); return ok({ deleted: args.confirm === true, alert }); }
      if (!['enabled', 'condition_type', 'threshold', 'indicator'].some(k => own(args, k))) fail('At least one update field required');
      const type = args.condition_type ?? alert.condition_type;
      if (family(type) !== family(alert.condition_type)) fail('Cannot change condition family');
      const needsThreshold = family(type) === 'price' || /^(sma|ema|vwap|rsi)_(above|below|crosses)$/.test(type);
      const threshold = own(args, 'threshold') ? args.threshold : needsThreshold ? (alert.condition.target_price ?? alert.condition.target_value) : undefined;
      const next = condition(type, threshold, own(args, 'indicator') ? args.indicator : alert.condition.indicator, alert.asset_class);
      if (own(args, 'enabled') && typeof args.enabled !== 'boolean') fail('enabled must be boolean');
      Object.assign(alert, { condition_type: type, condition: next, updated_at: new Date().toISOString(), ...(own(args, 'enabled') ? { enabled: args.enabled } : {}) }); return ok({ alert });
    }
    if (tool === 'get_alerts') {
      if (args.asset_class && !args.symbol) fail('asset_class requires symbol');
      const rows = state.alerts.filter(a => (!args.symbol || a.symbol === symbolOf(args.symbol)) && (!args.asset_class || a.asset_class === args.asset_class)).sort((a, b) => a.symbol.localeCompare(b.symbol) || b.created_at.localeCompare(a.created_at));
      const p = page(rows, args, 20, tool); return ok({ alerts: p.rows, ...(p.next ? { next_cursor: p.next } : {}), alert_limit_reached: false });
    }
    if (tool === 'get_alert_log') {
      const limit = args.limit ?? 20;
      if (!Number.isInteger(limit) || limit < 1 || limit > 100) fail('limit must be 1-100');
      const since = args.since ? timestamp(args.since) : -Infinity;
      const rows = state.alertLog.filter(a => (!args.asset_class || a.asset_class === args.asset_class) && Date.parse(a.triggered_at) >= since).sort((a, b) => b.triggered_at.localeCompare(a.triggered_at));
      const p = page(rows, args, limit, tool); return ok({ events: p.rows, ...(p.next ? { next_cursor: p.next } : {}), total_unread_count: state.alertLog.filter(a => !a.read).length });
    }
    if (tool === 'mark_alerts_read') {
      const ids = args.alert_log_ids;
      if ((ids != null) === (args.all_through !== undefined)) fail('Provide exactly one of alert_log_ids or all_through');
      if (ids != null && (!Array.isArray(ids) || !ids.length || ids.some(x => typeof x !== 'string'))) fail('Non-empty alert_log_ids required');
      if (ids?.length > 100) fail('alert_log_ids supports at most 100 IDs per call');
      const through = args.all_through !== undefined ? timestamp(args.all_through) : null;
      if (through !== null && through > Date.now()) fail('all_through cannot be a future timestamp');
      for (const event of state.alertLog) if (ids ? ids.includes(event.alert_log_id) : Date.parse(event.triggered_at) <= through) event.read = true;
      return ok({ marked: true, scope: ids ? 'alert_log_ids' : 'all_through', ...(ids ? { alert_log_id_count: ids.length } : {}) });
    }
    if (tool === 'get_equity_news' || tool === 'get_sec_filing_index') {
      const symbol = symbolOf(args.symbol), research = state.research[symbol];
      if (tool === 'get_equity_news') {
        if (args.limit !== undefined && (!Number.isInteger(args.limit) || args.limit < 1)) fail('limit must be positive');
        const p = page(research?.articles ?? [], args, Math.min(args.limit ?? 20, 50), tool); return ok({ symbol, articles: p.rows, ...(p.next ? { next_cursor: p.next } : {}) });
      }
      for (const k of ['since', 'until']) if (args[k] && (!/^\d{4}-\d\d-\d\d$/.test(args[k]) || !Number.isFinite(Date.parse(args[k])))) fail(`${k} must be YYYY-MM-DD`);
      if (args.since && args.until && args.since > args.until) fail('since must precede until');
      const rows = (research?.filings ?? []).filter(f => (!args.form_type?.length || args.form_type.includes(f.form_type)) && (!args.since || f.date_filed >= args.since) && (!args.until || f.date_filed <= args.until)).sort((a, b) => b.date_filed.localeCompare(a.date_filed));
      const p = page(rows, args, 20, tool); return ok({ symbol, filings: p.rows.map(({ sections, facts, ...f }) => f), next: p.next ?? '' });
    }
    const filings = Object.values(state.research).flatMap(r => r.filings);
    if (tool === 'get_sec_filing_facts') {
      if (!Array.isArray(args.filing_ids) || !args.filing_ids.length || !Array.isArray(args.concepts) || !args.concepts.length) fail('filing_ids and concepts must be non-empty arrays');
      if (args.filing_ids.some(id => !filings.some(f => f.filing_id === id))) return { error: 'Filing not found', status: 404 };
      return ok({ facts: filings.filter(f => args.filing_ids.includes(f.filing_id)).flatMap(f => f.facts).filter(f => args.concepts.includes(f.concept)) });
    }
    const filing = filings.find(f => f.filing_id === args.filing_id);
    if (!filing) return { error: 'Filing not found', status: 404 };
    if (tool === 'get_sec_filing') {
      if (!args.section) return ok({ table_of_contents: { filing_id: filing.filing_id, form_type: filing.form_type, sections: filing.sections.map(({ content, ...s }) => s) } });
      const section = filing.sections.find(s => s.id === args.section);
      if (!section) return { error: 'Section not found', status: 404 };
      return ok({ section: { filing_id: filing.filing_id, form_type: filing.form_type, section_id: section.id, section_title: section.title, content: section.content } });
    }
    const offset = args.offset ?? 0;
    if (!Number.isInteger(offset) || offset < 0) fail('offset must be a non-negative integer');
    const concepts = [...new Set(filing.facts.map(f => f.concept))].map(concept => { const facts = filing.facts.filter(f => f.concept === concept);
      const periods = new Map(facts.map(f => {
        const period = { period: f.period, ...(f.start_date !== undefined ? { start_date: f.start_date } : {}), end_date: f.end_date };
        return [JSON.stringify(period), period];
      }));
      return { concept, is_text_block: concept.endsWith('TextBlock'), periods: [...periods.values()], axis_names: [...new Set(facts.flatMap(f => f.axises ?? []).map(axis => axis.split(':')[0].trim()))] }; }).filter(c => (!args.concept_contains || c.concept.toLowerCase().includes(args.concept_contains.toLowerCase())) && (!args.axis_name_in?.length || c.axis_names.some(axis => args.axis_name_in.includes(axis))));
    return ok({ concepts: concepts.slice(offset, offset + 20), count: concepts.length, ...(offset + 20 < concepts.length ? { next_offset: offset + 20 } : {}) });
  } catch (error) { return { error: error.message, status: 400 }; }
}
