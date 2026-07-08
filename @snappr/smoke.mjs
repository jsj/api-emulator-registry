import assert from 'node:assert/strict';
import { createHarness } from '../scripts/provider-smoke-harness.mjs';
import { contract, plugin } from './api-emulator.mjs';

const harness = createHarness(plugin);
const headers = { authorization: 'Bearer snappr_emulator_key', 'accept-version': '1.0.0' };

assert.equal(contract.provider, 'snappr');

const coverage = await harness.call('GET', '/coverage?address=Golden%20Gate%20Bridge&shoottype=event', undefined, headers);
assert.equal(coverage.payload.latitude, 37.8077);
assert.equal(coverage.payload.coverage, true);

const availability = await harness.call('GET', '/availability?latitude=34.0522&longitude=-118.2437&shoottype=event&duration=120&date=2018-12-01', undefined, headers);
assert.equal(availability.payload.available_times[0], '2018-12-01T07:30:00Z');

const booking = await harness.call('POST', '/bookings', {
  title: 'Smoke Test Shoot',
  address: 'Golden Gate Bridge Welcome Center, Golden Gate Bridge, Coastal Trail, San Francisco, CA, USA',
  shoottype: 'event',
  start_at: '2018-12-01T07:30:00Z',
  duration: 120,
  customer_firstname: 'Mary',
  customer_email: 'test@snappr.com',
  tags: ['smoke'],
}, headers);
assert.equal(booking.status, 201);
assert.equal(booking.payload.status, 'paid');

const bookings = await harness.call('GET', '/bookings?limit=2&offset=0', undefined, headers);
assert.equal(bookings.payload.count, 2);
assert.equal(bookings.payload.total, 2);

const single = await harness.call('GET', `/bookings/${booking.payload.uid}`, undefined, headers);
assert.equal(single.payload.title, 'Smoke Test Shoot');

const images = await harness.call('GET', '/bookings/0ccefa53-b346-4d3e-8dcb-79a914289928/images', undefined, headers);
assert.equal(images.payload.results[0].file_name, 'ZD 001.JPG');

const editingJob = await harness.call('POST', '/editing-jobs', {
  title: 'Smoke Editing Job',
  type: 'food',
  preset_id: '1ea37f86-c82d-4267-8773-9a13fd4f1337',
  images: [{ file_name: 'source.jpg', url_source: 'https://example.com/source.jpg' }],
}, headers);
assert.equal(editingJob.status, 201);
assert.equal(editingJob.payload.status, 'creating');

const editingImages = await harness.call('GET', `/editing-jobs/${editingJob.payload.uid}/images`, undefined, headers);
assert.equal(editingImages.payload.count, 1);

const presets = await harness.call('GET', '/presets', undefined, headers);
assert.equal(presets.payload.results[0].uid, '1ea37f86-c82d-4267-8773-9a13fd4f1337');

const shootTypes = await harness.call('GET', '/shoottypes', undefined, headers);
assert.equal(shootTypes.payload.results[0].name, 'event');

const unauthenticated = await harness.call('GET', '/bookings');
assert.equal(unauthenticated.status, 401);
assert.equal(unauthenticated.payload.error.name, 'AuthenticationError');

console.log('snappr smoke ok');
