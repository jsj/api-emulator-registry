import assert from 'node:assert/strict';
import { createHarness } from '../scripts/provider-smoke-harness.mjs';
import { contract, initConfig, plugin } from './api-emulator.mjs';

const harness = createHarness(plugin);
const headers = { 'x-api-key': initConfig.setlistfm.apiKey, Accept: 'application/json' };

assert.equal(contract.provider, 'setlistfm');

const artists = await harness.call('GET', '/1.0/search/artists?artistName=Radiohead', undefined, headers);
assert.equal(artists.status, 200);
assert.equal(artists.payload.type, 'artist');
assert.equal(artists.payload.artist[0].mbid, 'a74b1b7f-71a5-4011-9441-d0b5e4122711');

const artist = await harness.call('GET', `/1.0/artist/${artists.payload.artist[0].mbid}`, undefined, headers);
assert.equal(artist.payload.name, 'Radiohead');

const artistSetlists = await harness.call('GET', `/1.0/artist/${artist.payload.mbid}/setlists`, undefined, headers);
assert.equal(artistSetlists.payload.setlist[0].sets.set[0].song[0].name, 'Everything in Its Right Place');

const setlist = await harness.call('GET', `/1.0/setlist/${artistSetlists.payload.setlist[0].id}`, undefined, headers);
assert.equal(setlist.payload.versionId, '33dfd8b9');
assert.equal(setlist.payload.venue.city.country.code, 'US');

const version = await harness.call('GET', '/1.0/setlist/version/33dfd8b9', undefined, headers);
assert.equal(version.payload.id, setlist.payload.id);

const venues = await harness.call('GET', '/1.0/search/venues?name=Fillmore&cityName=San%20Francisco', undefined, headers);
assert.equal(venues.payload.venue[0].id, '6bd6ca6e');

const venueSetlists = await harness.call('GET', '/1.0/venue/6bd6ca6e/setlists', undefined, headers);
assert.equal(venueSetlists.payload.total, 1);

const cities = await harness.call('GET', '/1.0/search/cities?name=San&country=US', undefined, headers);
assert.equal(cities.payload.city[0].id, '5391959');

const countries = await harness.call('GET', '/1.0/search/countries', undefined, headers);
assert.equal(countries.payload.country.some((country) => country.code === 'US'), true);

const user = await harness.call('GET', '/1.0/user/emulator/edited', undefined, headers);
assert.equal(user.payload.setlist.length, 2);

const invalidKey = await harness.call('GET', '/1.0/search/setlists?artistName=Radiohead', undefined, { 'x-api-key': 'bad-key' });
assert.equal(invalidKey.status, 401);

const missing = await harness.call('GET', '/1.0/setlist/missing', undefined, headers);
assert.equal(missing.status, 404);

const state = await harness.call('GET', '/inspect/state');
assert.equal(state.payload.requests.length, 11);

console.log('setlistfm smoke ok');
