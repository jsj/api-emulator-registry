import assert from 'node:assert/strict';
import { createHarness } from '../scripts/provider-smoke-harness.mjs';
import { contract, plugin } from './api-emulator.mjs';

const harness = createHarness(plugin);
const jsonAuth = { authorization: 'Bearer opentable_emulator_token', 'content-type': 'application/json' };

assert.equal(contract.provider, 'opentable');

const token = await harness.call('GET', '/api/v2/oauth/token?grant_type=client_credentials', undefined, { authorization: 'Basic dGVzdDp0ZXN0' });
assert.equal(token.status, 200);
assert.equal(token.payload.token_type, 'Bearer');
assert.equal(token.payload.scope, 'DEFAULT');

const auth = { authorization: `Bearer ${token.payload.access_token}`, 'content-type': 'application/json' };

const availability = await harness.call(
  'GET',
  '/v2/availability/1074796?start_date_time=2025-03-05T19%3A00&forward_minutes=60&backward_minutes=0&party_size=2&require_attributes=default',
  undefined,
  auth,
);
assert.equal(availability.status, 200);
assert.equal(availability.payload.rid, 1074796);
assert.equal(availability.payload.times_available[0].availability_types[0].diningArea[0].environment, 'Indoor');

const metadata = await harness.call('GET', '/v2/availability-metadata/1074796', undefined, auth);
assert.equal(metadata.payload.data.attributes.includes('default'), true);
assert.equal(metadata.payload.data.dining_areas[2].name, 'VIP Lounge');

const lock = await harness.call(
  'POST',
  '/v2/booking/1074796/slot_locks',
  {
    party_size: 2,
    date_time: '2025-10-13T16:00',
    reservation_attribute: 'default',
    dining_area_id: 2632,
    environment: 'Indoor',
  },
  auth,
);
assert.equal(lock.status, 200);
assert.match(lock.payload.reservation_token, /^ot_slot_1074796_/);

const reservation = await harness.call(
  'POST',
  '/v2/booking/1074796/reservations',
  {
    reservation_token: lock.payload.reservation_token,
    first_name: 'Jane',
    last_name: 'Doe',
    email_address: 'jane@example.com',
    phone: { number: '4155555555', country_code: 'US', phone_type: 'mobile' },
    reservation_attribute: 'default',
    special_request: 'Window table',
    dining_area_id: 2632,
    environment: 'Indoor',
  },
  auth,
);
assert.equal(reservation.status, 201);
assert.equal(reservation.payload.confirmation_number, 1751);
assert.equal(reservation.payload.party_size, 2);

const getReservation = await harness.call('GET', '/v2/booking/1074796/reservations/1074796-1751', undefined, auth);
assert.equal(getReservation.status, 200);
assert.equal(getReservation.payload.status, 'Pending');
assert.equal(getReservation.payload.notes, 'Window table');

const updateLock = await harness.call('POST', '/v2/booking/1074796/slot_locks', { party_size: 3, date_time: '2025-10-13T17:00' }, auth);
const updated = await harness.call(
  'PUT',
  '/v2/booking/1074796/reservations/1074796-1751',
  { party_size: 3, date_time: '2025-10-13T17:00', reservation_token: updateLock.payload.reservation_token, special_request: 'Booth' },
  auth,
);
assert.equal(updated.status, 200);
assert.equal(updated.payload.party_size, 3);
assert.equal(updated.payload.notes, 'Booth');

const cancel = await harness.call('PUT', '/v2/booking/1074796/reservations/1074796-1751', { status: 'CancelledWeb' }, auth);
assert.equal(cancel.status, 200);

const cancelled = await harness.call('GET', '/v2/booking/1074796/reservations/1074796-1751', undefined, auth);
assert.equal(cancelled.payload.status, 'CancelledWeb');

const deleteLock = await harness.call('POST', '/v2/booking/1038007/slot_locks', { party_size: 2, date_time: '2025-10-14T18:00' }, jsonAuth);
const deleted = await harness.call('DELETE', `/v2/booking/1038007/slot_locks/${deleteLock.payload.reservation_token}`, undefined, jsonAuth);
assert.equal(deleted.payload.status, 'Success');

const invalidToken = await harness.call('GET', '/v2/availability/1074796?party_size=2', undefined, { authorization: 'Bearer wrong' });
assert.equal(invalidToken.status, 401);
assert.equal(invalidToken.payload.errors[0].message, 'invalid_token');

const state = await harness.call('GET', '/inspect/state');
assert.ok(state.payload.requests.some((request) => request.endpoint === '/v2/booking/:rid/reservations'));

console.log('opentable smoke ok');
