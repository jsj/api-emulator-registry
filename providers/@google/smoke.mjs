import assert from 'node:assert/strict';
import { contract, plugin, seedFromConfig } from './api-emulator.mjs';

function createHarness() {
  const routes = new Map();
  const app = {
    all: (path, handler) => routes.set(`ALL ${path}`, handler),
    get: (path, handler) => routes.set(`GET ${path}`, handler),
    post: (path, handler) => routes.set(`POST ${path}`, handler),
    put: (path, handler) => routes.set(`PUT ${path}`, handler),
    patch: (path, handler) => routes.set(`PATCH ${path}`, handler),
    delete: (path, handler) => routes.set(`DELETE ${path}`, handler),
  };
  const data = new Map();
  const store = {
    getData: (key) => data.get(key),
    setData: (key, value) => data.set(key, value),
  };
  plugin.register(app, store);

  function matchDynamic(method, path) {
    for (const [key, handler] of routes) {
      const [routeMethod, routePath] = key.split(' ');
      if (routeMethod !== method && routeMethod !== 'ALL') continue;
      const routeParts = routePath.split('/').filter(Boolean);
      const pathParts = path.split('/').filter(Boolean);
      if (routeParts.length !== pathParts.length) continue;
      const params = {};
      let matched = true;
      for (let i = 0; i < routeParts.length; i += 1) {
        if (routeParts[i].startsWith(':')) {
          params[routeParts[i].slice(1).split(':')[0]] = pathParts[i];
        } else if (routeParts[i] !== pathParts[i]) {
          matched = false;
          break;
        }
      }
      if (matched) return { handler, params };
    }
    return undefined;
  }

  return {
    seed: (config) => seedFromConfig(store, 'https://google.test', config),
    async call(method, path, body = {}, params = {}, queries = {}) {
      const dynamic = matchDynamic(method, path);
      const handler =
        routes.get(`${method} ${path}`)
        ?? routes.get(`ALL ${path}`)
        ?? dynamic?.handler
        ?? routes.get(`ALL /:service/:version/*`)
        ?? routes.get(`ALL /upload/:service/:version/*`);
      assert.ok(handler, `missing route ${method} ${path}`);
      const mergedParams = { ...dynamic?.params, ...params };
      let status = 200;
      let payload;
      const response = await handler({
        req: {
          method,
          url: `https://google.test${path}`,
          json: async () => body,
          param: (name) => mergedParams[name] ?? (name === '*' ? path.replace(/^\/+/, '') : undefined),
          query: (name) => queries[name],
          header: () => undefined,
        },
        json: (value, nextStatus = 200) => {
          status = nextStatus;
          payload = value;
          return { status, payload };
        },
      });
      if (response instanceof Response) status = response.status;
      return { status, payload };
    },
  };
}

const harness = createHarness();

assert.equal(contract.provider, 'google');
assert.equal(contract.discoveryServiceCount, 24);
assert.ok(contract.scope.includes('drive'));
assert.ok(contract.scope.includes('vault'));
assert.ok(contract.scope.includes('workspaceevents'));

const files = await harness.call('GET', '/drive/v3/files', {}, {}, { pageSize: '1' });
assert.equal(files.status, 200);
assert.equal(files.payload.files.length, 1);

const createdFile = await harness.call('POST', '/drive/v3/files', { name: 'Smoke Doc', mimeType: 'text/plain' });
assert.equal(createdFile.payload.name, 'Smoke Doc');

const message = await harness.call('POST', '/gmail/v1/users/me/messages/send', { raw: 'Zm9v' });
assert.match(message.payload.id, /^msg_/);

const event = await harness.call('POST', '/calendar/v3/calendars/primary/events', { summary: 'Smoke Event' });
assert.equal(event.payload.summary, 'Smoke Event');

const sheet = await harness.call('POST', '/sheets/v4/spreadsheets', { properties: { title: 'Smoke Sheet' } });
assert.match(sheet.payload.spreadsheetId, /^sheet_/);

const spreadsheet = await harness.call('GET', '/v4/spreadsheets/sheet_emulator_seed');
assert.equal(spreadsheet.payload.properties.title, 'Quarterly Plan');
assert.equal(spreadsheet.payload.sheets[0].properties.title, 'Plan');

const formattedValues = await harness.call('GET', '/v4/spreadsheets/sheet_emulator_seed/values/Plan!A1%3AC3');
assert.equal(formattedValues.payload.range, 'Plan!A1:C3');
assert.equal(formattedValues.payload.values[1][1], '$1,200.00');

const formulaValues = await harness.call('GET', '/sheets/v4/spreadsheets/sheet_emulator_seed/values/Plan!A1%3AC3', {}, {}, { valueRenderOption: 'FORMULA' });
assert.equal(formulaValues.payload.values[1][2], '=B2-1150');

const invalidRender = await harness.call('GET', '/v4/spreadsheets/sheet_emulator_seed/values/Plan!A1%3AC3', {}, {}, { valueRenderOption: 'WRITE' });
assert.equal(invalidRender.status, 400);

const fullDocument = await harness.call('GET', '/v1/documents/doc_emulator_seed', {}, {}, { includeTabsContent: 'true' });
assert.equal(fullDocument.payload.title, 'Workspace Plan');
assert.equal(fullDocument.payload.tabs[0].documentTab.body.content[0].paragraph.elements[0].textRun.content, 'Workspace plan\n');

const firstTabDocument = await harness.call('GET', '/docs/v1/documents/doc_emulator_seed');
assert.equal(firstTabDocument.payload.tabs.length, 0);
assert.equal(firstTabDocument.payload.body.content[0].paragraph.elements[0].textRun.content, 'Workspace plan\n');

harness.seed({
  spreadsheets: [{ spreadsheetId: 'sheet_custom', properties: { title: 'Custom' }, sheets: [] }],
  sheetValues: { sheet_custom: { 'Data!A1': { formatted: [['Ready']], unformatted: [['Ready']], formula: [['Ready']] } } },
  docs: [{ documentId: 'doc_custom', title: 'Custom Doc', tabs: [] }],
});
assert.equal((await harness.call('GET', '/v4/spreadsheets/sheet_custom')).payload.properties.title, 'Custom');
assert.equal((await harness.call('GET', '/v4/spreadsheets/sheet_custom/values/Data!A1')).payload.values[0][0], 'Ready');
assert.equal((await harness.call('GET', '/v1/documents/doc_custom')).payload.title, 'Custom Doc');

const generic = await harness.call('GET', '/vault/v1/matters', {}, { service: 'vault', version: 'v1', '*': 'vault/v1/matters' });
assert.equal(generic.payload.kind, 'vault#matters');
assert.equal(generic.payload.items.length, 1);

console.log('google workspace smoke ok');
