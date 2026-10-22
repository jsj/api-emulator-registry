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
    html: (value, nextStatus = 200) => ({ status: nextStatus, payload: value }),
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

// These scenarios moved with the iTunes routes from Apple to Apple Media.
seedFromConfig(store, 'http://apple-media.test', {
  apps: [
    { trackId: 123456789, trackName: 'HN Sample', bundleId: 'com.example.hnsample',
      description: 'A Hacker News reader for iOS', averageUserRating: 4.8,
      screenshotUrls: ['https://example.com/ss1.jpg', 'https://example.com/ss2.jpg'] },
    { trackId: 987654321, trackName: 'Weather Pro', bundleId: 'com.example.weather', description: 'Accurate weather forecasts' },
  ],
});
const rawSearch = await call('/search', {}, { term: 'hacker', limit: '10' });
assert.equal(rawSearch.status, 200);
assert.equal(rawSearch.payload.resultCount, 1);
assert.equal(rawSearch.payload.results[0].trackName, 'HN Sample');
assert.equal(rawSearch.payload.results[0].trackId, 123456789);
const proxiedSearch = await call('/v1/app-store/search', {}, { term: 'weather', store: 'us', limit: '5' });
assert.equal(proxiedSearch.status, 200);
assert.equal(proxiedSearch.payload.resultCount, 1);
assert.equal(proxiedSearch.payload.results[0].trackName, 'Weather Pro');
const noMatch = await call('/search', {}, { term: 'nonexistent', limit: '10' });
assert.equal(noMatch.payload.resultCount, 0);
assert.deepEqual(noMatch.payload.results, []);
assert.equal((await call('/search', {}, { term: 'e', limit: '1' })).payload.resultCount, 1);
const rawLookup = await call('/lookup', {}, { id: '123456789' });
assert.equal(rawLookup.status, 200);
assert.equal(rawLookup.payload.resultCount, 1);
assert.equal(rawLookup.payload.results[0].bundleId, 'com.example.hnsample');
assert.equal(rawLookup.payload.results[0].averageUserRating, 4.8);
const proxiedLookup = await call('/v1/app-store/lookup', {}, { appId: '987654321', store: 'us' });
assert.equal(proxiedLookup.status, 200);
assert.equal(proxiedLookup.payload.resultCount, 1);
assert.equal(proxiedLookup.payload.results[0].trackName, 'Weather Pro');
assert.equal((await call('/lookup', {}, { id: '999' })).payload.resultCount, 0);
const screenshots = await call('/v1/app-store/storefront', {}, { appId: '123456789', store: 'us' });
assert.equal(screenshots.status, 200);
assert.match(screenshots.payload, /product_media_screenshots/);
assert(screenshots.payload.includes('https://example.com/ss1.jpg'));
assert(screenshots.payload.includes('https://example.com/ss2.jpg'));
const withoutScreenshots = await call('/v1/app-store/storefront', {}, { appId: '987654321', store: 'us' });
assert(!withoutScreenshots.payload.includes('product_media_screenshots'));
console.log('apple-media smoke ok (including all nine migrated iTunes scenarios)');
