import { fixedNow, getState, readBody, setState } from '../../scripts/provider-plugin-kit.mjs';

const STATE_KEY = 'xbow:state';
const API_VERSION = '2026-07-01';
const REQUEST_ID = 'req_xbow_emulator_000001';
const ORG_ID = '123e4567-e89b-12d3-a456-426614174001';
const ASSET_ID = '123e4567-e89b-12d3-a456-426614174002';
const ASSESSMENT_ID = '123e4567-e89b-12d3-a456-426614174003';
const FINDING_ID = '123e4567-e89b-12d3-a456-426614174004';
const REPORT_ID = '123e4567-e89b-12d3-a456-426614174005';
const RESOURCE_ID = '123e4567-e89b-12d3-a456-426614174006';
const WEBHOOK_ID = '123e4567-e89b-12d3-a456-426614174007';
const KEY_ID = '123e4567-e89b-12d3-a456-426614174008';

const routeManifest = [
  ['GET', '/api/v1/assessments/{assessmentId}'],
  ['POST', '/api/v1/assessments/{assessmentId}/cancel'],
  ['POST', '/api/v1/assessments/{assessmentId}/pause'],
  ['POST', '/api/v1/assessments/{assessmentId}/resume'],
  ['GET', '/api/v1/assets/{assetId}'],
  ['PUT', '/api/v1/assets/{assetId}'],
  ['GET', '/api/v1/assets/{assetId}/assessments'],
  ['POST', '/api/v1/assets/{assetId}/assessments'],
  ['GET', '/api/v1/assets/{assetId}/findings'],
  ['GET', '/api/v1/assets/{assetId}/reports'],
  ['GET', '/api/v1/findings/{findingId}'],
  ['PATCH', '/api/v1/findings/{findingId}'],
  ['POST', '/api/v1/findings/{findingId}/verify-fix'],
  ['POST', '/api/v1/integrations/{integrationId}/lightspeed'],
  ['GET', '/api/v1/integrations/{integrationId}/organizations'],
  ['POST', '/api/v1/integrations/{integrationId}/organizations'],
  ['DELETE', '/api/v1/keys/{keyId}'],
  ['GET', '/api/v1/meta/addresses'],
  ['GET', '/api/v1/meta/openapi.json'],
  ['GET', '/api/v1/meta/webhooks-signing-keys'],
  ['GET', '/api/v1/organizations/{organizationId}'],
  ['PUT', '/api/v1/organizations/{organizationId}'],
  ['GET', '/api/v1/organizations/{organizationId}/assets'],
  ['POST', '/api/v1/organizations/{organizationId}/assets'],
  ['POST', '/api/v1/organizations/{organizationId}/keys'],
  ['GET', '/api/v1/organizations/{organizationId}/resources'],
  ['POST', '/api/v1/organizations/{organizationId}/resources'],
  ['GET', '/api/v1/organizations/{organizationId}/webhooks'],
  ['POST', '/api/v1/organizations/{organizationId}/webhooks'],
  ['GET', '/api/v1/reports/{reportId}'],
  ['GET', '/api/v1/reports/{reportId}/summary'],
  ['DELETE', '/api/v1/resources/{resourceId}'],
  ['GET', '/api/v1/resources/{resourceId}'],
  ['POST', '/api/v1/resources/{resourceId}/commit'],
  ['POST', '/api/v1/resources/{resourceId}/parts'],
  ['DELETE', '/api/v1/webhooks/{webhookId}'],
  ['GET', '/api/v1/webhooks/{webhookId}'],
  ['PATCH', '/api/v1/webhooks/{webhookId}'],
  ['GET', '/api/v1/webhooks/{webhookId}/deliveries'],
  ['POST', '/api/v1/webhooks/{webhookId}/ping'],
];

const summary = (item, fields) => Object.fromEntries(fields.map((field) => [field, item[field]]));

function organization(id = ORG_ID, input = {}) {
  return { createdAt: fixedNow, externalId: input.externalId ?? 'org-emulator', id, name: input.name ?? 'Emulator Organization', state: 'active', updatedAt: fixedNow };
}

function asset(id = ASSET_ID, organizationId = ORG_ID, input = {}) {
  return {
    approvedTimeWindows: input.approvedTimeWindows ?? null,
    archiveAt: null,
    authorizationHeaderDomains: input.authorizationHeaderDomains ?? 'attackable',
    checks: {
      assetReachable: { error: null, message: input.startUrl ? 'Asset reachable' : 'Waiting for start URL', state: input.startUrl ? 'valid' : 'unchecked' },
      credentials: { error: null, message: input.credentials ? 'Credentials valid' : 'Waiting for credentials', state: input.credentials ? 'valid' : 'unchecked' },
      dnsBoundaryRules: { error: null, message: input.startUrl ? 'Boundary rules valid' : 'Waiting for start URL', state: input.startUrl ? 'valid' : 'unchecked' },
      updatedAt: input.startUrl ? fixedNow : null,
    },
    createdAt: fixedNow,
    credentials: input.credentials ?? null,
    customHeaderDomains: input.customHeaderDomains ?? 'attackable',
    dnsBoundaryRules: input.dnsBoundaryRules ?? null,
    headers: input.headers ?? null,
    httpBoundaryRules: input.httpBoundaryRules ?? null,
    id,
    lifecycle: 'active',
    maxRequestsPerSecond: input.maxRequestsPerSecond ?? null,
    name: input.name ?? 'Emulator Target',
    organizationId,
    sku: input.sku ?? 'standard-sku',
    startUrl: input.startUrl ?? null,
    updatedAt: fixedNow,
  };
}

function assessment(id = ASSESSMENT_ID, assetId = ASSET_ID, organizationId = ORG_ID, input = {}) {
  return { assetId, attackCredits: input.attackCredits ?? 40, createdAt: fixedNow, id, name: input.name ?? 'Emulator Assessment', organizationId, progress: input.progress ?? 0, recentEvents: input.recentEvents ?? [], state: input.state ?? 'waiting-for-capacity', updatedAt: fixedNow };
}

function finding(id = FINDING_ID, assetId = ASSET_ID, organizationId = ORG_ID) {
  return {
    assetId, createdAt: fixedNow,
    cvss: { '3.1': { fields: { A: 'N', AC: 'L', AV: 'N', C: 'L', I: 'L', PR: 'N', S: 'C', UI: 'R' }, score: 6.1, vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N' } },
    cwe: 'CWE-79', evidence: '<script>alert(document.domain)</script>', externalTicketReference: null, externalWorkflowState: null,
    id, impact: 'An attacker can execute script in a victim browser.', mitigations: 'Encode untrusted output and apply a restrictive CSP.', name: 'Stored cross-site scripting', organizationId,
    recipe: '1. Submit the proof payload\n2. Open the affected page\n3. Observe script execution', severity: 'high', state: 'open', summary: 'Untrusted input is rendered without output encoding.', updatedAt: fixedNow,
  };
}

function resource(id = RESOURCE_ID, organizationId = ORG_ID, input = {}) {
  return { createdAt: fixedNow, fileName: input.fileName ?? 'source.tar.gz', id, name: input.name ?? 'Emulator source', organizationId, sha256: input.sha256 ?? null, sizeBytes: input.sizeBytes ?? null, status: input.status ?? 'initiated', statusMessage: input.statusMessage ?? null, type: input.type ?? 'source', updatedAt: fixedNow };
}

function webhook(id = WEBHOOK_ID, organizationId = ORG_ID, input = {}) {
  return { apiVersion: input.apiVersion ?? API_VERSION, createdAt: fixedNow, events: input.events ?? ['asset.changed', 'assessment.changed'], id, organizationId, targetUrl: input.targetUrl ?? 'https://example.test/xbow-webhook', updatedAt: fixedNow };
}

function delivery(payload = { eventId: 'evt_xbow_ping_000001', type: 'ping' }) {
  const body = JSON.stringify(payload);
  return { payload, request: { body, headers: { 'Content-Type': 'application/json', 'X-Signature-Ed25519': 'emulator-signature', 'X-Signature-Timestamp': '1767225600' } }, response: { body: '', headers: { Date: 'Thu, 01 Jan 2026 00:00:00 GMT' }, status: 204 }, sentAt: fixedNow, success: true };
}

function defaultState() {
  return {
    organizations: [organization()], assets: [asset()], assessments: [assessment()], findings: [finding()],
    reports: [{ assessmentId: ASSESSMENT_ID, assetId: ASSET_ID, createdAt: fixedNow, id: REPORT_ID, markdown: '# XBOW assessment\n\nXBOW identified one high-severity finding.', version: 1 }],
    resources: [resource()], webhooks: [webhook()], webhookDeliveries: { [WEBHOOK_ID]: [delivery()] },
    keys: [{ createdAt: fixedNow, expiresAt: '2026-01-01T01:00:00.000Z', id: KEY_ID, key: 'xbt_emulator_000001', name: 'Emulator Key', organizationId: ORG_ID, updatedAt: fixedNow }],
    integrations: {}, counters: { organization: 2, asset: 2, assessment: 2, resource: 2, webhook: 2, key: 2, event: 2 },
  };
}

const state = (store) => getState(store, STATE_KEY, defaultState);
const save = (store, next) => setState(store, STATE_KEY, next);
const nextId = (s, kind) => `00000000-0000-4000-8000-${String(s.counters[kind]++).padStart(12, '0')}`;

function error(c, status, code, errorName, message) {
  return c.json({ code, error: errorName, message, requestId: REQUEST_ID }, status);
}
const badRequest = (c, message) => error(c, 400, 'FST_ERR_VALIDATION', 'Bad Request', message);
const notFound = (c, kind) => error(c, 404, 'ERR_NOT_FOUND', 'Not Found', `${kind} not found`);

function authenticated(handler) {
  return async (c) => {
    const auth = c.req.header('authorization');
    if (!auth?.startsWith('Bearer ')) return error(c, 401, 'ERR_UNAUTHORIZED', 'Unauthorized', 'Missing or invalid bearer token');
    const version = c.req.header('x-xbow-api-version');
    if (version !== API_VERSION) return badRequest(c, `X-XBOW-API-Version must be ${API_VERSION}`);
    return handler(c);
  };
}

function page(items, c) {
  const limit = Math.max(1, Math.min(Number(c.req.query('limit') ?? 20) || 20, 100));
  const after = c.req.query('after');
  let offset = 0;
  if (after) {
    try { offset = Number(Buffer.from(after, 'base64url').toString('utf8')) || 0; } catch { offset = 0; }
  }
  const result = { items: items.slice(offset, offset + limit) };
  if (offset + limit < items.length) result.nextCursor = Buffer.from(String(offset + limit)).toString('base64url');
  return result;
}

function required(c, body, fields) {
  const missing = fields.filter((field) => body[field] === undefined);
  return missing.length ? badRequest(c, `body must have required property '${missing[0]}'`) : null;
}

function addDelivery(s, webhookId, payload) {
  s.webhookDeliveries[webhookId] ??= [];
  s.webhookDeliveries[webhookId].unshift(delivery(payload));
}

function openApiDocument() {
  const paths = {};
  for (const [method, path] of routeManifest) {
    paths[path] ??= {};
    paths[path][method.toLowerCase()] = { responses: { 200: { description: 'Emulated response' } } };
  }
  return { openapi: '3.1.0', info: { title: 'XBOW API', version: API_VERSION }, servers: [{ url: 'https://console.xbow.com' }], paths };
}

export const contract = {
  provider: 'xbow', source: 'XBOW OpenAPI 2026-07-01', sourceUrl: 'https://docs.xbow.com/api/openapi-2026-07-01.json',
  docs: 'https://docs.xbow.com/api/', baseUrl: 'https://console.xbow.com/api/v1/', auth: 'Authorization: Bearer <token>',
  versionHeader: `X-XBOW-API-Version: ${API_VERSION}`, pagination: 'limit/after cursor',
  errorShape: { code: 'string', error: 'string', message: 'string', requestId: 'string' },
  scope: ['assessments', 'assets', 'findings', 'lightspeed', 'meta', 'organizations', 'reports', 'resources', 'webhooks'],
  operations: routeManifest.length, webhooks: ['assessment.changed', 'asset.changed', 'challenge.changed', 'finding.changed', 'ping'], fidelity: 'full-stateful-rest-contract',
};

export const plugin = {
  name: 'xbow',
  register(app, store) {
    const on = (method, path, handler) => app[method](path, authenticated(handler));

    on('get', '/api/v1/assessments/:assessmentId', (c) => {
      const item = state(store).assessments.find((entry) => entry.id === c.req.param('assessmentId'));
      return item ? c.json(item) : notFound(c, 'Assessment');
    });
    for (const [action, nextState] of [['cancel', 'cancelling'], ['pause', 'paused'], ['resume', 'waiting-for-capacity']]) {
      on('post', `/api/v1/assessments/:assessmentId/${action}`, (c) => {
        const s = state(store); const item = s.assessments.find((entry) => entry.id === c.req.param('assessmentId'));
        if (!item) return notFound(c, 'Assessment');
        item.state = nextState; item.updatedAt = fixedNow;
        if (action !== 'cancel') item.recentEvents.push({ name: action === 'pause' ? 'paused' : 'resumed', timestamp: fixedNow });
        save(store, s); return c.json(item);
      });
    }

    on('get', '/api/v1/assets/:assetId', (c) => { const item = state(store).assets.find((entry) => entry.id === c.req.param('assetId')); return item ? c.json(item) : notFound(c, 'Asset'); });
    on('put', '/api/v1/assets/:assetId', async (c) => {
      const s = state(store); const item = s.assets.find((entry) => entry.id === c.req.param('assetId')); if (!item) return notFound(c, 'Asset');
      const body = await readBody(c); const invalid = required(c, body, ['name', 'approvedTimeWindows', 'authorizationHeaderDomains', 'credentials', 'customHeaderDomains', 'dnsBoundaryRules', 'headers', 'httpBoundaryRules', 'maxRequestsPerSecond', 'startUrl']);
      if (invalid) return invalid; Object.assign(item, body, { id: item.id, organizationId: item.organizationId, createdAt: item.createdAt, updatedAt: fixedNow }); save(store, s); return c.json(item);
    });
    on('get', '/api/v1/assets/:assetId/assessments', (c) => {
      const s = state(store); if (!s.assets.some((entry) => entry.id === c.req.param('assetId'))) return notFound(c, 'Asset');
      return c.json(page(s.assessments.filter((entry) => entry.assetId === c.req.param('assetId')).map((entry) => summary(entry, ['createdAt', 'id', 'name', 'progress', 'state', 'updatedAt'])), c));
    });
    on('post', '/api/v1/assets/:assetId/assessments', async (c) => {
      const s = state(store); const target = s.assets.find((entry) => entry.id === c.req.param('assetId')); if (!target) return notFound(c, 'Asset'); const body = await readBody(c); const invalid = required(c, body, ['attackCredits']); if (invalid) return invalid;
      const item = assessment(nextId(s, 'assessment'), target.id, target.organizationId, body); s.assessments.push(item); save(store, s); return c.json(item);
    });
    on('get', '/api/v1/assets/:assetId/findings', (c) => {
      const s = state(store); if (!s.assets.some((entry) => entry.id === c.req.param('assetId'))) return notFound(c, 'Asset');
      const items = s.findings.filter((entry) => entry.assetId === c.req.param('assetId')).map((entry) => summary(entry, ['createdAt', 'externalTicketReference', 'externalWorkflowState', 'id', 'name', 'severity', 'state', 'updatedAt'])); return c.json(page(items, c));
    });
    on('get', '/api/v1/assets/:assetId/reports', (c) => { const s = state(store); if (!s.assets.some((entry) => entry.id === c.req.param('assetId'))) return notFound(c, 'Asset'); return c.json(page(s.reports.filter((entry) => entry.assetId === c.req.param('assetId')).map((entry) => summary(entry, ['createdAt', 'id', 'version'])), c)); });

    on('get', '/api/v1/findings/:findingId', (c) => { const item = state(store).findings.find((entry) => entry.id === c.req.param('findingId')); return item ? c.json(item) : notFound(c, 'Finding'); });
    on('patch', '/api/v1/findings/:findingId', async (c) => { const s = state(store); const item = s.findings.find((entry) => entry.id === c.req.param('findingId')); if (!item) return notFound(c, 'Finding'); const body = await readBody(c); for (const key of ['externalWorkflowState', 'externalTicketReference']) if (key in body) item[key] = body[key]; item.updatedAt = fixedNow; save(store, s); return c.json(item); });
    on('post', '/api/v1/findings/:findingId/verify-fix', (c) => { const s = state(store); const target = s.findings.find((entry) => entry.id === c.req.param('findingId')); if (!target) return notFound(c, 'Finding'); const item = assessment(nextId(s, 'assessment'), target.assetId, target.organizationId, { name: `Fix Verification - ${target.name}` }); s.assessments.push(item); save(store, s); return c.json(item); });

    on('post', '/api/v1/integrations/:integrationId/lightspeed', async (c) => { const body = await readBody(c); if (!body.asset) return badRequest(c, "body must have required property 'asset'"); const s = state(store); s.integrations[c.req.param('integrationId')] = { ...body, submittedAt: fixedNow }; save(store, s); return c.json({ message: 'Lightspeed request submitted successfully' }, 202); });
    on('get', '/api/v1/integrations/:integrationId/organizations', (c) => c.json(page(state(store).organizations, c)));
    on('post', '/api/v1/integrations/:integrationId/organizations', async (c) => { const s = state(store); const body = await readBody(c); const invalid = required(c, body, ['externalId', 'members', 'name']); if (invalid) return invalid; const item = organization(nextId(s, 'organization'), body); item.members = body.members; item.integrationId = c.req.param('integrationId'); s.organizations.push(item); save(store, s); return c.json(item); });

    on('delete', '/api/v1/keys/:keyId', (c) => { const s = state(store); const index = s.keys.findIndex((entry) => entry.id === c.req.param('keyId')); if (index < 0) return notFound(c, 'Key'); s.keys.splice(index, 1); save(store, s); return c.body(null, 204); });
    on('get', '/api/v1/meta/addresses', (c) => c.json({ agents: ['192.0.2.10', '2001:db8::10'] }));
    on('get', '/api/v1/meta/openapi.json', (c) => c.json(openApiDocument()));
    on('get', '/api/v1/meta/webhooks-signing-keys', (c) => c.json([{ publicKey: 'MCowBQYDK2VwAyEAXbowEmulatorPublicKey00000000000=' }]));

    on('get', '/api/v1/organizations/:organizationId', (c) => { const item = state(store).organizations.find((entry) => entry.id === c.req.param('organizationId')); return item ? c.json(item) : notFound(c, 'Organization'); });
    on('put', '/api/v1/organizations/:organizationId', async (c) => { const s = state(store); const item = s.organizations.find((entry) => entry.id === c.req.param('organizationId')); if (!item) return notFound(c, 'Organization'); const body = await readBody(c); const invalid = required(c, body, ['externalId', 'name']); if (invalid) return invalid; Object.assign(item, body, { id: item.id, createdAt: item.createdAt, updatedAt: fixedNow }); save(store, s); return c.json(item); });
    on('get', '/api/v1/organizations/:organizationId/assets', (c) => { const s = state(store); if (!s.organizations.some((entry) => entry.id === c.req.param('organizationId'))) return notFound(c, 'Organization'); const items = s.assets.filter((entry) => entry.organizationId === c.req.param('organizationId')).map((entry) => summary(entry, ['createdAt', 'id', 'lifecycle', 'name', 'updatedAt'])); return c.json(page(items, c)); });
    on('post', '/api/v1/organizations/:organizationId/assets', async (c) => { const s = state(store); const org = s.organizations.find((entry) => entry.id === c.req.param('organizationId')); if (!org) return notFound(c, 'Organization'); const body = await readBody(c); const invalid = required(c, body, ['name', 'sku']); if (invalid) return invalid; const item = asset(nextId(s, 'asset'), org.id, body); s.assets.push(item); save(store, s); return c.json(item, 201); });
    on('post', '/api/v1/organizations/:organizationId/keys', async (c) => { const s = state(store); if (!s.organizations.some((entry) => entry.id === c.req.param('organizationId'))) return notFound(c, 'Organization'); const body = await readBody(c); const invalid = required(c, body, ['name']); if (invalid) return invalid; const id = nextId(s, 'key'); const minutes = body.expiresInMinutes ?? 60; const item = { createdAt: fixedNow, expiresAt: new Date(Date.parse(fixedNow) + minutes * 60_000).toISOString(), id, key: `xbt_emulator_${id}`, name: body.name, organizationId: c.req.param('organizationId'), updatedAt: fixedNow }; s.keys.push(item); save(store, s); return c.json(item); });

    on('get', '/api/v1/organizations/:organizationId/resources', (c) => { const s = state(store); if (!s.organizations.some((entry) => entry.id === c.req.param('organizationId'))) return notFound(c, 'Organization'); const items = s.resources.filter((entry) => entry.organizationId === c.req.param('organizationId')).map(({ organizationId: _organizationId, ...entry }) => entry); return c.json(page(items, c)); });
    on('post', '/api/v1/organizations/:organizationId/resources', async (c) => { const s = state(store); if (!s.organizations.some((entry) => entry.id === c.req.param('organizationId'))) return notFound(c, 'Organization'); const body = await readBody(c); const invalid = required(c, body, ['fileName', 'name', 'type']); if (invalid) return invalid; const item = resource(nextId(s, 'resource'), c.req.param('organizationId'), body); s.resources.push(item); save(store, s); return c.json(summary(item, ['createdAt', 'fileName', 'id', 'name', 'organizationId', 'type', 'updatedAt']), 201); });
    on('get', '/api/v1/organizations/:organizationId/webhooks', (c) => { const s = state(store); if (!s.organizations.some((entry) => entry.id === c.req.param('organizationId'))) return notFound(c, 'Organization'); return c.json(page(s.webhooks.filter((entry) => entry.organizationId === c.req.param('organizationId')).map(({ organizationId: _organizationId, ...entry }) => entry), c)); });
    on('post', '/api/v1/organizations/:organizationId/webhooks', async (c) => { const s = state(store); if (!s.organizations.some((entry) => entry.id === c.req.param('organizationId'))) return notFound(c, 'Organization'); const body = await readBody(c); const invalid = required(c, body, ['apiVersion', 'events', 'targetUrl']); if (invalid) return invalid; const item = webhook(nextId(s, 'webhook'), c.req.param('organizationId'), body); s.webhooks.push(item); s.webhookDeliveries[item.id] = []; save(store, s); const { organizationId: _organizationId, ...response } = item; return c.json(response, 201); });

    on('get', '/api/v1/reports/:reportId', (c) => { const item = state(store).reports.find((entry) => entry.id === c.req.param('reportId')); if (!item) return notFound(c, 'Report'); return c.body(Buffer.from(`%PDF-1.4\n% XBOW emulator report ${item.id}\n%%EOF\n`), 200, { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="xbow-report-${item.id}.pdf"` }); });
    on('get', '/api/v1/reports/:reportId/summary', (c) => { const item = state(store).reports.find((entry) => entry.id === c.req.param('reportId')); return item ? c.json({ markdown: item.markdown }) : notFound(c, 'Report'); });

    on('delete', '/api/v1/resources/:resourceId', (c) => { const s = state(store); const item = s.resources.find((entry) => entry.id === c.req.param('resourceId')); if (!item) return notFound(c, 'Resource'); Object.assign(item, { status: 'deleted', updatedAt: fixedNow }); save(store, s); return c.json(item); });
    on('get', '/api/v1/resources/:resourceId', (c) => { const item = state(store).resources.find((entry) => entry.id === c.req.param('resourceId')); return item ? c.json(item) : notFound(c, 'Resource'); });
    on('post', '/api/v1/resources/:resourceId/parts', async (c) => { const s = state(store); const item = s.resources.find((entry) => entry.id === c.req.param('resourceId')); if (!item) return notFound(c, 'Resource'); if (item.status !== 'initiated') return error(c, 409, 'ERR_CONFLICT', 'Conflict', 'Resource is not accepting parts'); const body = await readBody(c); const invalid = required(c, body, ['parts']); if (invalid) return invalid; return c.json({ parts: body.parts.map((partNumber) => ({ expiresAt: '2026-01-01T01:00:00.000Z', partNumber, url: `https://storage.example.test/${item.id}?partNumber=${partNumber}&uploadId=xbow-emulator` })), storageProtocol: 'S3' }); });
    on('post', '/api/v1/resources/:resourceId/commit', async (c) => { const s = state(store); const item = s.resources.find((entry) => entry.id === c.req.param('resourceId')); if (!item) return notFound(c, 'Resource'); if (item.status !== 'initiated') return error(c, 409, 'ERR_CONFLICT', 'Conflict', 'Resource has already been committed'); const body = await readBody(c); const invalid = required(c, body, ['parts']); if (invalid) return invalid; Object.assign(item, { sha256: body.sha256 ?? null, sizeBytes: body.parts.length * 5_242_880, status: 'processing', updatedAt: fixedNow }); save(store, s); return c.json(item); });

    on('delete', '/api/v1/webhooks/:webhookId', (c) => { const s = state(store); const index = s.webhooks.findIndex((entry) => entry.id === c.req.param('webhookId')); if (index < 0) return notFound(c, 'Webhook'); s.webhooks.splice(index, 1); delete s.webhookDeliveries[c.req.param('webhookId')]; save(store, s); return c.body(null, 204); });
    on('get', '/api/v1/webhooks/:webhookId', (c) => { const item = state(store).webhooks.find((entry) => entry.id === c.req.param('webhookId')); if (!item) return notFound(c, 'Webhook'); const { organizationId: _organizationId, ...response } = item; return c.json(response); });
    on('patch', '/api/v1/webhooks/:webhookId', async (c) => { const s = state(store); const item = s.webhooks.find((entry) => entry.id === c.req.param('webhookId')); if (!item) return notFound(c, 'Webhook'); const body = await readBody(c); for (const key of ['apiVersion', 'events', 'targetUrl']) if (key in body) item[key] = body[key]; item.updatedAt = fixedNow; save(store, s); const { organizationId: _organizationId, ...response } = item; return c.json(response); });
    on('get', '/api/v1/webhooks/:webhookId/deliveries', (c) => { const s = state(store); if (!s.webhooks.some((entry) => entry.id === c.req.param('webhookId'))) return notFound(c, 'Webhook'); return c.json(page(s.webhookDeliveries[c.req.param('webhookId')] ?? [], c)); });
    on('post', '/api/v1/webhooks/:webhookId/ping', (c) => { const s = state(store); if (!s.webhooks.some((entry) => entry.id === c.req.param('webhookId'))) return notFound(c, 'Webhook'); const eventId = `evt_xbow_ping_${String(s.counters.event++).padStart(6, '0')}`; addDelivery(s, c.req.param('webhookId'), { eventId, type: 'ping' }); save(store, s); return c.body(null, 204); });

    app.get('/xbow/inspect/state', (c) => c.json(state(store)));
  },
};

export function seedFromConfig(store, _baseUrl, config = {}) { return save(store, { ...defaultState(), ...config }); }
export const label = 'XBOW API emulator';
export const endpoints = 'full XBOW 2026-07-01 REST contract';
export const capabilities = contract.scope;
export const initConfig = { xbow: defaultState() };
export { routeManifest };
export default plugin;
