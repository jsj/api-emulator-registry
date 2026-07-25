import assert from 'node:assert/strict';
import { plugin, contract, grpc } from './api-emulator.mjs';

function createHarness() {
  const routes = new Map();
  const data = new Map();
  const app = {
    get: (path, handler) => routes.set(`GET ${path}`, handler),
    post: (path, handler) => routes.set(`POST ${path}`, handler),
    patch: (path, handler) => routes.set(`PATCH ${path}`, handler),
    delete: (path, handler) => routes.set(`DELETE ${path}`, handler),
  };
  plugin.register(app, {
    getData: (key) => data.get(key),
    setData: (key, value) => data.set(key, value),
  });
  return {
    async call(method, path, body = {}, params = {}, query = {}) {
      const handler = routes.get(`${method} ${path}`);
      assert.ok(handler, `missing route ${method} ${path}`);
      let status = 200;
      let payload;
      await handler({
        req: {
          json: async () => body,
          param: (name) => params[name],
          query: (name) => query[name],
        },
        json: (value, nextStatus = 200) => {
          status = nextStatus;
          payload = value;
          return { status, payload };
        },
      });
      return { status, payload };
    },
  };
}

const harness = createHarness();
assert.equal(contract.provider, 'modal');
assert.match(contract.protobuf, /modal_proto\/api\.proto$/);
const grpcData = new Map();
const grpcRegistration = grpc({ store: { getData: (key) => grpcData.get(key), setData: (key, value) => grpcData.set(key, value) } });
assert.equal(grpcRegistration.packageName, 'modal.client');
assert.ok(grpcRegistration.implementation.TokenInfoGet);

function grpcCall(method, request = {}) {
  return new Promise((resolve, reject) => grpcRegistration.implementation[method]({ request }, (error, response) => (
    error ? reject(error) : resolve(response)
  )));
}

await grpcCall('EnvironmentCreate', { name: 'grpc-test' });
const grpcEnvironments = await grpcCall('EnvironmentList');
assert.ok(grpcEnvironments.items.some((environment) => environment.name === 'grpc-test'));
const grpcSecret = await grpcCall('SecretGetOrCreate', { deployment_name: 'grpc-secret', environment_name: 'main', env_dict: { API_KEY: 'dummy' } });
assert.match(grpcSecret.secret_id, /^st-/);
const grpcVolume = await grpcCall('VolumeGetOrCreate', { deployment_name: 'grpc-cache', environment_name: 'main' });
await grpcCall('VolumeRename', { volume_id: grpcVolume.volume_id, name: 'renamed-cache' });
const grpcVolumes = await grpcCall('VolumeList', { environment_name: 'main' });
assert.ok(grpcVolumes.items.some((volume) => volume.metadata.name === 'renamed-cache'));

const token = await harness.call('GET', '/modal/v1/token/info');
assert.equal(token.payload.workspace_name, 'emulator');
assert.equal(token.payload.token_id, 'ak-emulator');

const apps = await harness.call('GET', '/modal/v1/apps');
assert.equal(apps.payload.apps[0].app_id, 'ap-aaaaaaaaaaaaaaaaaaaaaa');

const environments = await harness.call('GET', '/modal/v1/environments');
assert.equal(environments.payload.items[0].spend_limit_reached, false);
assert.equal(environments.payload.items[0].environment_type, 0);

const created = await harness.call('POST', '/modal/v1/apps', { name: 'cli-smoke', state: 'deployed', n_running_tasks: 2 });
assert.equal(created.status, 201);
assert.equal(created.payload.name, 'cli-smoke');

const stopped = await harness.call('DELETE', '/modal/v1/apps/:app_id', {}, { app_id: created.payload.app_id });
assert.equal(stopped.payload.state, 'stopped');
assert.equal(stopped.payload.n_running_tasks, 0);

const secret = await harness.call('POST', '/modal/v1/secrets', { name: 'cli-secret', values: { API_KEY: 'dummy' } });
assert.equal(secret.status, 201);
assert.deepEqual(secret.payload.metadata.keys, ['API_KEY']);
assert.equal(secret.payload.metadata.name, 'cli-secret');
assert.equal(secret.payload.metadata.creation_info.created_by, 'api-emulator');

const volume = await harness.call('POST', '/modal/v1/volumes', { name: 'cache-two' });
assert.equal(volume.payload.label, 'cache-two');
assert.equal(volume.payload.metadata.name, 'cache-two');
assert.equal(volume.payload.metadata.version, 2);

const state = await harness.call('GET', '/modal/inspect/state');
assert.ok(state.payload.apps.some((item) => item.name === 'cli-smoke'));

const video = await harness.call('POST', '/modal/forge/inference', {
  script: 'ltx23_video.py', args: { prompt: 'smoke', duration: 6, seed: 7 },
});
assert.equal(Buffer.from(video.payload.video_base64, 'base64').toString(), 'modal-emulator-video');
assert.equal(video.payload.duration_seconds, 6);

const inferenceState = await harness.call('GET', '/modal/inspect/state');
assert.equal(inferenceState.payload.lastInference.args.prompt, 'smoke');

console.log('modal smoke ok');
