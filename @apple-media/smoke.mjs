import assert from 'node:assert/strict';
import { contract, plugin, seedFromConfig } from './api-emulator.mjs';

const routes = new Map();
const data = new Map();
const app = {
  get: (path, handler) => routes.set(`GET ${path}`, handler),
};
const store = {
  getData: (key) => data.get(key),
  setData: (key, value) => data.set(key, value),
};
seedFromConfig(store, 'http://apple-media.test', {
  apps: [{ trackId: 123, trackName: 'Fixture App', bundleId: 'com.example.fixture' }],
});
plugin.register(app, store, undefined, 'http://apple-media.test');

async function call(path, params = {}, query = {}) {
  const handler = routes.get(`GET ${path}`);
  assert.ok(handler, `missing route GET ${path}`);
  let status = 200;
  let payload;
  const response = await handler({
    req: {
      url: `http://apple-media.test${path}`,
      param: (name) => params[name],
      query: (name) => query[name],
    },
    json: (value, nextStatus = 200) => {
      status = nextStatus;
      payload = value;
      return { status, payload };
    },
    body: (value, nextStatus = 200) => ({ status: nextStatus, payload: value }),
    header: () => {},
    notFound: () => ({ status: 404 }),
  });
  return response?.status ? response : { status, payload };
}

assert.equal(contract.provider, 'apple-media');
assert.equal(routes.has('GET /auth/authorize'), false);
assert.equal(routes.has('GET /v1/apps'), false);

const appSearch = await call('/search', {}, { term: 'fixture' });
assert.equal(appSearch.payload.results[0].bundleId, 'com.example.fixture');
const audiobooks = await call('/search', {}, { media: 'audiobook', term: 'Dungeon Crawler Carl' });
assert.equal(audiobooks.payload.results[0].collectionName, 'Dungeon Crawler Carl');
const chart = await call('/api/v2/us/audio-books/top/:limit/audio-books.json', { limit: '3' });
assert.equal(chart.payload.feed.results.length, 3);
const cover = await call('/fixtures/audiobook-covers/:id/:size', { id: '1808184254', size: '100x100bb.jpg' });
assert.equal(Buffer.isBuffer(cover.payload), true);

console.log('apple-media smoke ok');
