import assert from 'node:assert/strict';
import { createHarness } from '../scripts/provider-smoke-harness.mjs';
import { contract, plugin } from './api-emulator.mjs';

const harness = createHarness(plugin);
const apikey = 'ticketmaster-emulator-key';

assert.equal(contract.provider, 'ticketmaster');

const missingKey = await harness.call('GET', '/discovery/v2/events.json?size=1');
assert.equal(missingKey.status, 401);
assert.equal(missingKey.payload.fault.faultstring, 'Invalid ApiKey');
assert.equal(missingKey.payload.fault.detail.errorcode, 'oauth.v2.InvalidApiKey');

const events = await harness.call('GET', `/discovery/v2/events.json?apikey=${apikey}&size=1&keyword=Adele&countryCode=US`);
assert.equal(events.status, 200);
assert.equal(events.payload._embedded.events.length, 1);
assert.equal(events.payload._embedded.events[0].name, 'Adele Live');
assert.equal(events.payload.page.size, 1);
assert.equal(events.payload._links.self.templated, true);

const event = await harness.call('GET', `/discovery/v2/events/G5diZfkn0B_bh.json?apikey=${apikey}`);
assert.equal(event.status, 200);
assert.equal(event.payload._embedded.venues[0].name, 'Crypto.com Arena');
assert.equal(event.payload._embedded.attractions[0].id, 'K8vZ917Gku7');

const images = await harness.call('GET', `/discovery/v2/events/G5diZfkn0B_bh/images.json?apikey=${apikey}`);
assert.equal(images.status, 200);
assert.equal(images.payload.type, 'event');
assert.equal(images.payload.images[0].ratio, '16_9');

const venues = await harness.call('GET', `/discovery/v2/venues.json?apikey=${apikey}&keyword=Crypto&size=5`);
assert.equal(venues.payload._embedded.venues[0].id, 'KovZpZAJ6nlA');

const venue = await harness.call('GET', `/discovery/v2/venues/KovZpZAJ6nlA.json?apikey=${apikey}`);
assert.equal(venue.payload.city.name, 'Los Angeles');
assert.equal(venue.payload.country.countryCode, 'US');

const attractions = await harness.call('GET', `/discovery/v2/attractions.json?apikey=${apikey}&keyword=Adele`);
assert.equal(attractions.payload._embedded.attractions[0].name, 'Adele');

const attraction = await harness.call('GET', `/discovery/v2/attractions/K8vZ917Gku7.json?apikey=${apikey}`);
assert.equal(attraction.payload.classifications[0].segment.name, 'Music');

const sports = await harness.call('GET', `/discovery/v2/events.json?apikey=${apikey}&classificationName=Golf&attractionId=K8vZ917uc57`);
assert.equal(sports.payload._embedded.events[0].classifications[0].genre.name, 'Golf');

const classifications = await harness.call('GET', `/discovery/v2/classifications.json?apikey=${apikey}&size=1`);
assert.equal(classifications.payload._embedded.classifications[0].segment.name, 'Music');

const suggest = await harness.call('GET', `/discovery/v2/suggest.json?apikey=${apikey}&keyword=Adele`);
assert.equal(suggest.payload._embedded.events[0].name, 'Adele Live');

const notFound = await harness.call('GET', `/discovery/v2/events/nope.json?apikey=${apikey}`);
assert.equal(notFound.status, 404);
assert.equal(notFound.payload.fault.detail.errorcode, 'discovery.v2.NotFound');

const state = await harness.call('GET', '/inspect/state');
assert.ok(state.payload.requests.some((request) => request.endpoint === '/discovery/v2/events'));

console.log('ticketmaster smoke ok');
