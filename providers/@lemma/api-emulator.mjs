import { fixedNow, getState, readBody, setState } from '../../scripts/provider-plugin-kit.mjs';

const STATE_KEY = 'lemma:state';
const BASE_URL = 'https://api.uselemma.ai';
const PROJECT_ID = '00000000-0000-4000-8000-000000000001';

function initialState(config = {}) {
  return {
    apiKey: config.apiKey ?? 'lemma_emulator_key',
    projects: config.projects ?? [PROJECT_ID],
    traces: config.traces ?? [],
    nextTrace: Number(config.nextTrace ?? 1),
    nextSpan: Number(config.nextSpan ?? 1),
  };
}

const state = (store) => getState(store, STATE_KEY, () => initialState());
const save = (store, value) => setState(store, STATE_KEY, value);
const uuid = (n) => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function unauthorized(c) {
  return c.json({ error: 'authentication required' }, 401);
}

function isAuthorized(c, current) {
  return c.req.header('authorization') === `Bearer ${current.apiKey}`;
}

function badRequest(c, message) {
  return c.json({ error: message }, 400);
}

function normalizedSpan(span, current) {
  return {
    ...span,
    id: span.id ?? uuid(10_000 + current.nextSpan++),
    type: ['span', 'generation', 'tool'].includes(span.type) ? span.type : 'span',
  };
}

export function seedFromConfig(store, _baseUrl = BASE_URL, config = {}) {
  return save(store, initialState(config));
}

export const contract = {
  provider: 'lemma',
  source: 'Official uselemma/lemma trace contract and @uselemma/tracing 7.11.0, verified 2026-08-22',
  docs: 'https://docs.uselemma.ai/reference/trace-contract',
  baseUrl: BASE_URL,
  auth: 'Authorization: Bearer <api-key>',
  scope: ['traces.ingest', 'traces.ingest-status'],
  fidelity: 'stateful-rest-subset',
};

export const plugin = {
  name: 'lemma',
  register(app, store) {
    app.post('/traces/ingest', async (c) => {
      const current = state(store);
      if (!isAuthorized(c, current)) return unauthorized(c);
      const body = await readBody(c);
      if (!body || typeof body !== 'object' || Array.isArray(body)) return badRequest(c, 'body must be a JSON object');
      if (!uuidPattern.test(body.project_id ?? '')) return badRequest(c, 'project_id must be a UUID');
      if (!current.projects.includes(body.project_id)) return c.json({ error: 'API key does not own project_id' }, 403);
      if (!body.trace || typeof body.trace !== 'object' || Array.isArray(body.trace)) return badRequest(c, 'trace must be an object');
      if (typeof body.trace.name !== 'string' || !body.trace.name.trim()) return badRequest(c, 'trace.name is required');
      const spans = body.trace.spans ?? [];
      if (!Array.isArray(spans)) return badRequest(c, 'trace.spans must be an array');
      if (spans.some((span) => typeof span?.name !== 'string' || !span.name.trim())) return badRequest(c, 'every span requires a name');
      const suppliedIds = spans.map((span) => span.id).filter(Boolean);
      if (new Set(suppliedIds).size !== suppliedIds.length) return badRequest(c, 'span IDs must be unique within the payload');

      const traceId = body.trace.id ?? uuid(current.nextTrace++);
      const existing = current.traces.find((trace) => trace.id === traceId && trace.project_id === body.project_id);
      const normalized = spans.map((span) => normalizedSpan(span, current));
      if (existing) {
        const existingIds = new Set(existing.spans.map((span) => span.id));
        existing.spans.push(...normalized.filter((span) => !existingIds.has(span.id)));
      } else {
        current.traces.push({
          ...body.trace,
          id: traceId,
          project_id: body.project_id,
          spans: normalized,
          ingested_at: fixedNow,
          status: 'ready',
        });
      }
      save(store, current);
      return c.json({ trace_id: traceId, status: 'enqueued' }, 201);
    });

    app.get('/traces/ingest-status', (c) => {
      const current = state(store);
      if (!isAuthorized(c, current)) return unauthorized(c);
      const projectId = c.req.query('project_id');
      const traceId = c.req.query('otel_trace_id');
      const trace = current.traces.find((item) => item.project_id === projectId && item.id === traceId);
      return c.json({ status: trace?.status ?? 'not_found' });
    });

    app.get('/inspect/state', (c) => {
      const current = state(store);
      return c.json({ projects: current.projects, traces: current.traces });
    });
  },
  seed(store) {
    seedFromConfig(store);
  },
};

export const label = 'Lemma tracing API emulator';
export const endpoints = contract.scope.join(', ');
export const capabilities = contract.scope;
export const initConfig = { lemma: initialState() };
export default plugin;
