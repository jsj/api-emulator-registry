const STATE_KEY = 'shortcut:state';
const FIXED_TIME = '2026-09-22T12:00:00.000Z';

const defaultSkills = [
  { id: 'default:spreadsheet', folderName: 'spreadsheet', name: 'Spreadsheet', description: 'Create and edit spreadsheet workbooks.', source: 'default' },
];

function initialState(config = {}) {
  return {
    nextRun: 1,
    nextFile: 1,
    jobs: {},
    files: {},
    skills: structuredClone(config.skills ?? defaultSkills),
    outcomes: structuredClone(config.outcomes ?? {}),
    pollSteps: config.pollSteps ?? 3,
    teamId: config.teamId ?? 'team_emulator',
    ...structuredClone(config.state ?? {}),
  };
}

function state(store) {
  let current = store.getData?.(STATE_KEY);
  if (!current) {
    current = initialState();
    store.setData?.(STATE_KEY, current);
  }
  return current;
}

export function seedFromConfig(store, _baseUrl, config = {}) {
  store.setData?.(STATE_KEY, initialState(config.shortcut ?? config));
}

function apiError(c, status, error, message) {
  return c.json({ success: false, error, message }, status);
}

function authorized(c) {
  return /^Bearer \S+$/i.test(c.req.header('authorization') ?? '');
}

function authError(c) {
  return apiError(c, 401, 'unauthorized', 'A bearer API key is required.');
}

function jobFor(c, store) {
  return state(store).jobs[c.req.param('runId')];
}

function publicJob(c, job) {
  if (job.status === 'completed') {
    const result = { runId: job.runId, status: 'completed', summary: job.summary, artifacts: job.artifacts };
    if (job.artifacts.includes('result.xlsx')) {
      const origin = new URL(c.req.url ?? 'http://localhost').origin;
      result.downloadUrl = `${origin}/api/spreadsheets/${job.runId}/download`;
    }
    return result;
  }
  if (job.status === 'failed' || job.status === 'cancelled') {
    return { runId: job.runId, status: job.status, error: job.error ?? `Job ${job.status}.`, artifacts: job.artifacts };
  }
  return { runId: job.runId, status: job.status, artifacts: job.artifacts };
}

function advance(job, pollSteps) {
  if (!['queued', 'running', 'finalizing'].includes(job.status)) return;
  job.polls += 1;
  if (job.polls === 1) job.status = 'running';
  else if (job.polls < pollSteps) job.status = 'finalizing';
  else {
    job.status = job.outcome;
    job.completedAt = FIXED_TIME;
    if (job.status === 'completed' && job.mode !== 'ask') job.artifacts = ['result.xlsx'];
    if (job.status === 'failed') job.error = 'Emulated spreadsheet job failed.';
  }
}

// Minimal, deterministic ZIP writer; OOXML parts are assembled in memory.
function crc32(bytes) {
  let crc = -1;
  for (const byte of bytes) {
    crc ^= byte;
    for (let i = 0; i < 8; i += 1) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ -1) >>> 0;
}

function workbook() {
  const parts = {
    '[Content_Types].xml': '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>',
    '_rels/.rels': '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>',
    'xl/workbook.xml': '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Monthly Budget" sheetId="1" r:id="rId1"/></sheets></workbook>',
    'xl/_rels/workbook.xml.rels': '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>',
    'xl/worksheets/sheet1.xml': '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData><row r="1"><c r="A1" t="inlineStr"><is><t>Category</t></is></c><c r="B1" t="inlineStr"><is><t>Monthly Amount</t></is></c></row><row r="2"><c r="A2" t="inlineStr"><is><t>Income</t></is></c></row><row r="3"><c r="A3" t="inlineStr"><is><t>Expenses</t></is></c></row></sheetData></worksheet>',
  };
  const local = [];
  const central = [];
  let offset = 0;
  for (const [name, xml] of Object.entries(parts)) {
    const filename = Buffer.from(name);
    const data = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>${xml}`);
    const crc = crc32(data);
    const header = Buffer.alloc(30);
    header.writeUInt32LE(0x04034b50, 0);
    header.writeUInt16LE(20, 4);
    header.writeUInt32LE(crc, 14);
    header.writeUInt32LE(data.length, 18);
    header.writeUInt32LE(data.length, 22);
    header.writeUInt16LE(filename.length, 26);
    local.push(header, filename, data);
    const directory = Buffer.alloc(46);
    directory.writeUInt32LE(0x02014b50, 0);
    directory.writeUInt16LE(20, 4);
    directory.writeUInt16LE(20, 6);
    directory.writeUInt32LE(crc, 16);
    directory.writeUInt32LE(data.length, 20);
    directory.writeUInt32LE(data.length, 24);
    directory.writeUInt16LE(filename.length, 28);
    directory.writeUInt32LE(offset, 42);
    central.push(directory, filename);
    offset += header.length + filename.length + data.length;
  }
  const directorySize = central.reduce((sum, part) => sum + part.length, 0);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(Object.keys(parts).length, 8);
  end.writeUInt16LE(Object.keys(parts).length, 10);
  end.writeUInt32LE(directorySize, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...local, ...central, end]);
}

export const contract = {
  provider: 'shortcut',
  source: 'Shortcut Platform API OpenAPI 1.0.0',
  docs: 'https://api.shortcut.ai/api/openapi.json',
  baseUrls: ['https://api.shortcut.ai'],
  scope: ['spreadsheet-jobs', 'status', 'cancel', 'download', 'artifacts', 'skills', 'uploads', 'team-usage-export'],
  fidelity: 'stateful-rest-emulator',
};

export const plugin = {
  name: 'shortcut',
  register(app, store) {
    app.get('/api/spreadsheets/verify', (c) => authorized(c)
      ? c.json({ success: true, message: 'API key is valid.', webhookSecret: 'shortcut_emulator_webhook_secret' })
      : authError(c));

    app.get('/api/spreadsheets/skills', (c) => authorized(c)
      ? c.json({ skills: state(store).skills }) : authError(c));

    app.post('/api/spreadsheets/upload', async (c) => {
      if (!authorized(c)) return authError(c);
      const s = state(store);
      const fileId = `00000000-0000-4000-8000-${String(s.nextFile++).padStart(12, '0')}`;
      s.files[fileId] = { uploadedAt: FIXED_TIME, body: await c.req.text() };
      return c.json({ success: true, fileId });
    });

    app.post('/api/spreadsheets', async (c) => {
      if (!authorized(c)) return authError(c);
      const body = await c.req.json().catch(() => null);
      if (!body || typeof body.prompt !== 'string' || !body.prompt.trim()) {
        return apiError(c, 400, 'invalid_request', 'prompt is required.');
      }
      if (body.mode && !['action', 'ask'].includes(body.mode)) return apiError(c, 400, 'invalid_request', 'Invalid mode.');
      if (body.skills && (!Array.isArray(body.skills) || body.skills.length > 10 || body.skills.some((id) => !state(store).skills.some((skill) => skill.id === id)))) {
        return apiError(c, 400, 'invalid_request', 'Invalid skill id.');
      }
      const s = state(store);
      const runId = `run_emulator_${s.nextRun++}`;
      s.jobs[runId] = {
        runId, prompt: body.prompt, mode: body.mode ?? 'action', status: 'queued',
        createdAt: FIXED_TIME, completedAt: null, creditsUsed: null,
        summary: 'Created a monthly budget spreadsheet.', artifacts: [], polls: 0,
        outcome: s.outcomes[body.prompt] ?? 'completed',
      };
      return c.json({ runId, status: 'queued' });
    });

    app.get('/api/spreadsheets', (c) => {
      if (!authorized(c)) return authError(c);
      const limit = Number(c.req.query('limit') ?? 50);
      const offset = Number(c.req.query('offset') ?? 0);
      if (!Number.isInteger(limit) || limit < 1 || limit > 100 || !Number.isInteger(offset) || offset < 0) {
        return apiError(c, 400, 'invalid_request', 'Invalid limit or offset.');
      }
      const jobs = Object.values(state(store).jobs).reverse().slice(offset, offset + limit)
        .map(({ runId, status, prompt, createdAt, completedAt, creditsUsed, summary }) =>
          ({ runId, status, prompt, createdAt, completedAt, creditsUsed, summary: status === 'completed' ? summary : null }));
      return c.json({ runs: jobs, limit, offset });
    });

    app.get('/api/spreadsheets/:runId', (c) => {
      if (!authorized(c)) return authError(c);
      const job = jobFor(c, store);
      if (!job) return apiError(c, 404, 'not_found', 'Run not found.');
      advance(job, state(store).pollSteps);
      return c.json(publicJob(c, job));
    });

    app.post('/api/spreadsheets/:runId/cancel', (c) => {
      if (!authorized(c)) return authError(c);
      const job = jobFor(c, store);
      if (!job) return apiError(c, 404, 'not_found', 'Run not found.');
      if (!['queued', 'running', 'finalizing'].includes(job.status)) return apiError(c, 409, 'conflict', 'Run is already terminal.');
      const previousStatus = job.status === 'finalizing' ? 'running' : job.status;
      job.status = 'cancelled';
      job.error = 'Run was cancelled.';
      job.completedAt = FIXED_TIME;
      return c.json({ runId: job.runId, status: 'cancelled', previousStatus, message: 'Run cancelled.' });
    });

    app.get('/api/spreadsheets/:runId/download', (c) => {
      if (!authorized(c)) return authError(c);
      const job = jobFor(c, store);
      if (!job) return apiError(c, 404, 'not_found', 'Run not found.');
      if (!job.artifacts.includes('result.xlsx')) return apiError(c, 409, 'conflict', 'Workbook is not available.');
      return c.body(workbook(), 200, { 'content-type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    });

    app.get('/api/spreadsheets/:runId/artifacts/:filename', (c) => {
      if (!authorized(c)) return authError(c);
      const job = jobFor(c, store);
      if (!job) return apiError(c, 404, 'not_found', 'Run not found.');
      if (c.req.param('filename') !== 'result.xlsx' || !job.artifacts.includes('result.xlsx')) {
        return apiError(c, 404, 'not_found', 'Artifact not found.');
      }
      return c.body(workbook(), 200, { 'content-type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    });

    app.get('/api/v1/team/usage-export', (c) => {
      if (!authorized(c)) return authError(c);
      const s = state(store);
      if (!c.req.query('team_id')) return apiError(c, 400, 'invalid_request', 'team_id is required for API keys.');
      const start = c.req.query('start_date');
      const end = c.req.query('end_date');
      if (Boolean(start) !== Boolean(end)) return apiError(c, 400, 'invalid_request', 'start_date and end_date must be provided together.');
      const runs = Object.values(s.jobs).filter((job) => job.status === 'completed');
      if (c.req.query('format') === 'csv') {
        return c.text(`runId,status,creditsUsed\n${runs.map((job) => `${job.runId},${job.status},${job.creditsUsed ?? 0}`).join('\n')}\n`, 200, { 'content-type': 'text/csv' });
      }
      return c.json({ teamId: c.req.query('team_id'), period: c.req.query('period') ?? 'month', totalRuns: runs.length, creditsUsed: 0 });
    });
  },
};

export default plugin;
