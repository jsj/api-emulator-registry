import assert from 'node:assert/strict';
import { contract, plugin } from './api-emulator.mjs';

function createHarness() {
  const routes = new Map();
  const app = {
    get: (path, handler) => routes.set(`GET ${path}`, handler),
    post: (path, handler) => routes.set(`POST ${path}`, handler),
    delete: (path, handler) => routes.set(`DELETE ${path}`, handler),
  };
  const data = new Map();
  const store = {
    getData: (key) => data.get(key),
    setData: (key, value) => data.set(key, value),
  };
  plugin.register(app, store);

  function match(method, path) {
    for (const [key, handler] of routes) {
      const [routeMethod, routePath] = key.split(' ');
      if (routeMethod !== method) continue;
      const routeParts = routePath.split('/').filter(Boolean);
      const pathParts = path.split('/').filter(Boolean);
      if (routeParts.length !== pathParts.length) continue;
      const params = {};
      let matched = true;
      for (let i = 0; i < routeParts.length; i += 1) {
        if (routeParts[i].startsWith(':')) params[routeParts[i].slice(1)] = pathParts[i];
        else if (routeParts[i] !== pathParts[i]) matched = false;
      }
      if (matched) return { handler, params };
    }
    return undefined;
  }

  return {
    async call(method, path, body = {}) {
      const route = match(method, path);
      assert.ok(route, `missing route ${method} ${path}`);
      let status = 200;
      let payload;
      await route.handler({
        req: {
          json: async () => body,
          param: (name) => route.params[name],
          query: () => undefined,
          header: () => undefined,
        },
        json: (value, nextStatus = 200) => {
          status = nextStatus;
          payload = value;
          return { status, payload };
        },
        body: (_value, nextStatus = 204) => {
          status = nextStatus;
          return { status };
        },
      });
      return { status, payload };
    },
  };
}

const harness = createHarness();

assert.equal(contract.provider, 'gcp');
assert.ok(contract.scope.includes('cloudresourcemanager.projects'));
assert.ok(contract.scope.includes('compute.instances'));

const projects = await harness.call('GET', '/v1/projects');
assert.equal(projects.status, 200);
assert.equal(projects.payload.projects[0].projectId, 'emulator-project');

const projectV3 = await harness.call('GET', '/v3/projects/emulator-project');
assert.equal(projectV3.payload.name, 'projects/emulator-project');
assert.equal(projectV3.payload.displayName, 'Emulator Project');

const createdProject = await harness.call('POST', '/v1/projects', { projectId: 'smoke-project', name: 'Smoke Project' });
assert.equal(createdProject.payload.projectId, 'smoke-project');

const zones = await harness.call('GET', '/compute/v1/projects/emulator-project/zones');
assert.equal(zones.payload.items[0].name, 'us-central1-a');

const instances = await harness.call('GET', '/compute/v1/projects/emulator-project/zones/us-central1-a/instances');
assert.equal(instances.payload.items[0].name, 'emulator-vm');

const createInstance = await harness.call('POST', '/compute/v1/projects/emulator-project/zones/us-central1-a/instances', { name: 'smoke-vm', machineType: 'zones/us-central1-a/machineTypes/e2-small' });
assert.equal(createInstance.payload.status, 'DONE');

const instance = await harness.call('GET', '/compute/v1/projects/emulator-project/zones/us-central1-a/instances/smoke-vm');
assert.equal(instance.payload.machineType.endsWith('/e2-small'), true);

const services = await harness.call('GET', '/v1/projects/emulator-project/services');
assert.equal(services.payload.services[0].state, 'ENABLED');

console.log('gcp smoke ok');
