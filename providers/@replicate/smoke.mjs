import assert from 'node:assert/strict';
import { createApp, Store, withServer } from '../../scripts/cli-smoke-runtime.mjs';
import { plugin } from './api-emulator.mjs';

const app = createApp();
const store = new Store();
plugin.register(app, store);

await withServer(app, async (baseUrl) => {
  const modelResponse = await fetch(`${baseUrl}/v1/models/replicate/hello-world`);
  assert.equal(modelResponse.status, 200);
  const model = await modelResponse.json();
  assert.equal(model.owner, 'replicate');
  assert.equal(model.name, 'hello-world');
  assert.equal(model.latest_version.id, 'emu_replicate_version_123');

  const versionResponse = await fetch(`${baseUrl}/v1/models/replicate/hello-world/versions/version-test`);
  assert.equal((await versionResponse.json()).id, 'version-test');

  const predictionResponse = await fetch(`${baseUrl}/v1/models/replicate/hello-world/predictions`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ input: { prompt: 'a local test image' } }),
  });
  assert.equal(predictionResponse.status, 201);
  const prediction = await predictionResponse.json();
  assert.equal(prediction.status, 'succeeded');
  assert.equal(prediction.input.prompt, 'a local test image');
  assert.match(prediction.output, /\/assets\/image\.png$/);

  const fetched = await fetch(`${baseUrl}/v1/predictions/${prediction.id}`);
  assert.equal((await fetched.json()).id, prediction.id);

  const versionPrediction = await fetch(`${baseUrl}/v1/predictions`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ version: 'video-version', input: { prompt: 'test' } }),
  });
  assert.equal(versionPrediction.status, 201);
  assert.equal((await versionPrediction.json()).version, 'video-version');

  const inspection = await fetch(`${baseUrl}/inspect/last-prediction`);
  assert.equal((await inspection.json()).body.version, 'video-version');

  const image = await fetch(`${baseUrl}/assets/image.png`);
  assert.equal(image.headers.get('content-type'), 'image/png');
  assert.ok((await image.arrayBuffer()).byteLength > 0);

  const video = await fetch(`${baseUrl}/assets/video.mp4`);
  assert.equal(video.headers.get('content-type'), 'video/mp4');
  assert.ok((await video.arrayBuffer()).byteLength > 0);
});

console.log('replicate smoke ok');
