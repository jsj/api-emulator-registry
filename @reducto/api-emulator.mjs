import { createToken, cursorPage, fixedNow, getState, readBody, routeError, setState } from '../scripts/provider-plugin-kit.mjs';

const STATE_KEY = 'reducto:state';
const BASE_URL = 'https://platform.reducto.ai';

function parseResult(jobId, input = 'https://example.com/document.pdf', fixtures = {}) {
  const label = Array.isArray(input) ? input[0] : input;
  const fixture = fixtures[label];
  if (fixture) return { ...structuredClone(fixture), job_id: jobId };
  return {
    duration: 0.42,
    job_id: jobId,
    result: {
      type: 'full',
      chunks: [
        {
          content: `Parsed content from ${label}`,
          embed: `Parsed content from ${label}`,
          blocks: [
            {
              type: 'Title',
              content: 'Emulated Reducto Document',
              bbox: { left: 0.08, top: 0.07, width: 0.84, height: 0.05 },
              confidence: 'high',
            },
            {
              type: 'Text',
              content: 'This deterministic document body is returned by the Reducto emulator.',
              bbox: { left: 0.08, top: 0.15, width: 0.84, height: 0.12 },
              confidence: 'high',
            },
          ],
        },
      ],
    },
    usage: { num_pages: 1, credits: 1 },
    pdf_url: 'https://emulator.reducto.local/files/document.pdf',
    studio_link: 'https://studio.reducto.ai/pipeline/emulator',
  };
}

function splitResult() {
  return {
    result: {
      splits: [
        { name: 'Cover', pages: [1], conf: 'high' },
        { name: 'Body', pages: [2], conf: 'high' },
      ],
      section_mapping: { Cover: [1], Body: [2] },
    },
    usage: { num_pages: 2, credits: 1 },
  };
}

function extractResult(jobId, input = 'https://example.com/document.pdf', schema = {}, fixtures = {}) {
  const label = Array.isArray(input) ? input[0] : input;
  const fixture = fixtures[label];
  if (fixture) return { ...structuredClone(fixture), job_id: jobId };
  const schemaKeys = Object.keys(schema?.properties ?? schema ?? {});
  if (schemaKeys.includes('filings')) {
    return {
      job_id: jobId,
      result: {
        expectedFilingCount: 1,
        expectedTransactionCount: 1,
        filings: [
          {
            source: 'house',
            filerName: 'Nancy Pelosi',
            filingDate: '2026-01-16',
            reportType: 'PTR',
            documentUrl: 'https://disclosures-clerk.house.gov/public_disc/ptr-pdfs/2026/20033725.pdf',
            expectedTransactionCount: 1,
          },
        ],
      },
      usage: { num_pages: 1, credits: 1, num_fields: 6 },
      studio_link: 'https://studio.reducto.ai/pipeline/emulator',
    };
  }
  return {
    job_id: jobId,
    result: [
      {
        title: 'Emulated Reducto Document',
        vendor: 'Reducto Emulator',
        total: 123.45,
        schema_keys: schemaKeys,
      },
    ],
    citations: [{ page: 1, text: 'Emulated Reducto Document' }],
    usage: { num_pages: 1, credits: 1 },
    studio_link: 'https://studio.reducto.ai/pipeline/emulator',
  };
}

function editResult() {
  return {
    document_url: 'https://emulator.reducto.local/files/edited-document.pdf',
    form_schema: [],
    usage: { num_pages: 1, credits: 1 },
  };
}

function classifyResult(jobId) {
  return {
    job_id: jobId,
    result: { label: 'invoice', confidence: 0.98 },
    usage: { num_pages: 1, credits: 1 },
  };
}

function defaultState(baseUrl = BASE_URL) {
  return {
    baseUrl,
    parseFixtures: {},
    extractFixtures: {},
    uploads: [],
    jobs: [],
    webhook: null,
    nextUpload: 1,
    nextJob: 1,
  };
}

const state = (store) => getState(store, STATE_KEY, () => defaultState());
const save = (store, next) => setState(store, STATE_KEY, next);

export function seedFromConfig(store, baseUrl = BASE_URL, config = {}) {
  return save(store, {
    ...defaultState(baseUrl),
    ...config,
    parseFixtures: config.parseFixtures ?? {},
    extractFixtures: config.extractFixtures ?? {},
    uploads: config.uploads ?? [],
    jobs: config.jobs ?? [],
  });
}

function requireAuth(c) {
  const auth = c.req.header?.('authorization') ?? c.req.header?.('Authorization') ?? '';
  if (!auth.startsWith('Bearer ')) return routeError(c, 'Missing bearer token', 401, 'unauthorized');
  return null;
}

function jobRecord(current, type, body, result, status = 'Completed') {
  const jobId = createToken('job', current.nextJob);
  current.nextJob += 1;
  const record = {
    job_id: jobId,
    type,
    status,
    progress: status === 'Completed' ? 1 : 0,
    raw_config: JSON.stringify(body ?? {}),
    created_at: fixedNow,
    duration: status === 'Completed' ? 0.42 : null,
    num_pages: 1,
    total_pages: 1,
    result,
  };
  current.jobs.unshift(record);
  return record;
}

function responseFor(current, type, jobId, body = {}) {
  const input = body.input ?? body.document_url ?? body.documentUrl;
  if (type === 'Parse') return parseResult(jobId, input, current.parseFixtures);
  if (type === 'Extract') return extractResult(jobId, input, body.instructions?.schema ?? body.schema ?? body.extract ?? {}, current.extractFixtures);
  if (type === 'Split') return splitResult();
  if (type === 'Edit') return editResult();
  if (type === 'Classify') return classifyResult(jobId);
  return {
    job_id: jobId,
    result: {
      parse: parseResult(jobId, body.input),
      split: splitResult(),
      extract: extractResult(jobId, body.schema ?? {}),
      edit: null,
    },
    usage: { num_pages: 1, credits: 3 },
  };
}

function isAsyncRequest(body) {
  return Boolean(body?.async ?? body?.async_ ?? body?.webhook);
}

async function runOperation(c, store, type, forceAsync = false) {
  const authError = requireAuth(c);
  if (authError) return authError;
  const body = await readBody(c).catch(() => ({}));
  if (!body.input && !body.document_url && !body.documentUrl && !['Edit'].includes(type)) return routeError(c, 'input is required');
  const current = state(store);
  const placeholderId = createToken('job', current.nextJob);
  const result = responseFor(current, type, placeholderId, body);
  const record = jobRecord(current, type, body, result);
  if (result.job_id) result.job_id = record.job_id;
  if (result.result?.parse?.job_id) result.result.parse.job_id = record.job_id;
  record.result = result;
  save(store, current);
  if (forceAsync || isAsyncRequest(body)) return c.json({ job_id: record.job_id });
  return c.json(result);
}

export const contract = {
  provider: 'reducto',
  source: 'Reducto Stainless Python SDK and public API reference',
  docs: 'https://docs.reducto.ai/sdk/python/overview',
  baseUrls: [BASE_URL, 'https://eu.platform.reducto.ai', 'https://au.platform.reducto.ai'],
  scope: ['version', 'upload', 'parse', 'extract', 'split', 'edit', 'pipeline', 'classify', 'jobs', 'webhook'],
  fidelity: 'deterministic-subset',
};

export const plugin = {
  name: 'reducto',
  register(app, store) {
    app.get('/version', (c) => c.text('2026.05-emulator'));

    app.post('/upload', async (c) => {
      const authError = requireAuth(c);
      if (authError) return authError;
      const current = state(store);
      const extension = c.req.query?.('extension') ?? 'pdf';
      const fileId = `reducto://${createToken('file', current.nextUpload)}.${extension}`;
      current.nextUpload += 1;
      current.uploads.unshift({ file_id: fileId, extension, created_at: fixedNow });
      save(store, current);
      return c.json({ file_id: fileId, presigned_url: null });
    });

    app.post('/parse', (c) => runOperation(c, store, 'Parse'));
    app.post('/parse_async', (c) => runOperation(c, store, 'Parse', true));
    app.post('/extract', (c) => runOperation(c, store, 'Extract'));
    app.post('/extract_async', (c) => runOperation(c, store, 'Extract', true));
    app.post('/split', (c) => runOperation(c, store, 'Split'));
    app.post('/split_async', (c) => runOperation(c, store, 'Split', true));
    app.post('/edit', (c) => runOperation(c, store, 'Edit'));
    app.post('/edit_async', (c) => runOperation(c, store, 'Edit', true));
    app.post('/classify', (c) => runOperation(c, store, 'Classify'));
    app.post('/pipeline', (c) => runOperation(c, store, 'Pipeline'));
    app.post('/pipeline_async', (c) => runOperation(c, store, 'Pipeline', true));

    app.get('/job/:job_id', (c) => {
      const authError = requireAuth(c);
      if (authError) return authError;
      const job = state(store).jobs.find((item) => item.job_id === c.req.param('job_id'));
      if (!job) return routeError(c, 'Job not found', 404, 'not_found');
      return c.json({
        status: job.status,
        progress: job.progress,
        result: job.result,
        created_at: job.created_at,
        duration: job.duration,
        num_pages: job.num_pages,
        total_pages: job.total_pages,
        raw_config: job.raw_config,
        type: job.type,
      });
    });

    app.get('/jobs', (c) => {
      const authError = requireAuth(c);
      if (authError) return authError;
      const { page, nextCursor } = cursorPage(state(store).jobs, c, 100);
      return c.json({
        jobs: page.map(({ result, progress, ...job }) => job),
        next_cursor: nextCursor ?? null,
      });
    });

    app.post('/cancel/:job_id', (c) => {
      const authError = requireAuth(c);
      if (authError) return authError;
      const current = state(store);
      const job = current.jobs.find((item) => item.job_id === c.req.param('job_id'));
      if (!job) return routeError(c, 'Job not found', 404, 'not_found');
      job.status = 'Cancelled';
      job.progress = 0;
      save(store, current);
      return c.json({ ok: true });
    });

    app.post('/configure_webhook', async (c) => {
      const authError = requireAuth(c);
      if (authError) return authError;
      const current = state(store);
      current.webhook = await readBody(c).catch(() => ({}));
      save(store, current);
      return c.json({ ok: true, webhook: current.webhook });
    });

    app.get('/inspect/contract', (c) => c.json(contract));
    app.get('/inspect/state', (c) => c.json(state(store)));
    app.post('/inspect/reset', (c) => {
      store.setData?.(STATE_KEY, null);
      return c.json({ ok: true, state: state(store) });
    });
  },
};

export const label = 'Reducto API emulator';
export const endpoints = 'version, upload, parse, extract, split, edit, pipeline, classify, jobs, webhook';
export const initConfig = {
  reducto: {
    apiKey: 'reducto-emulator-key',
    parseFixtures: {},
    extractFixtures: {},
  },
};

export default plugin;
