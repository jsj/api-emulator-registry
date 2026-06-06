import { createToken, getState, readBody, setState } from '../scripts/provider-plugin-kit.mjs';

const STATE_KEY = 'opentable:state';
const BASE_URL = 'https://platform.otqa.com';
const OAUTH_URL = 'https://oauth-pp.opentable.com';
const POLICY_MESSAGE =
  'We have a 5 minute grace period. Please call us if you are running later than 5 minutes after your reservation time.<br /><br />We may contact you about this reservation, so please ensure your email and phone number are up to date.<br /><br />Your table will be reserved for 1 hour 30 minutes for parties of up to 2; 2 hours for parties of up to 4; 2 hours 30 minutes for parties of up to 6; and 3 hours for parties of 7+.';

function defaultState(baseUrl = BASE_URL) {
  return {
    baseUrl,
    oauthUrl: OAUTH_URL,
    acceptedTokens: ['opentable_emulator_token', 'v2-opentable-emulator-token'],
    tokenCount: 0,
    slotLockCount: 0,
    nextConfirmationNumber: 1751,
    requests: [],
    restaurants: {
      1038007: restaurant(1038007, 'Emulator Bistro'),
      1074796: restaurant(1074796, 'Sandbox Trattoria'),
    },
    slotLocks: {},
    reservations: {},
  };
}

function restaurant(rid, name) {
  return {
    rid: Number(rid),
    name,
    environments: ['Outdoor', 'Indoor'],
    attributes: ['bar', 'counter', 'highTop', 'default'],
    dining_areas: [
      { id: 1, name: 'Other', description: 'Other', environment: 'Indoor' },
      { id: 2439, name: 'Garden', description: 'Garden', environment: 'Outdoor' },
      { id: 2632, name: 'VIP Lounge', description: 'Ultra VIP lounge', environment: 'Indoor' },
    ],
  };
}

const state = (store) => getState(store, STATE_KEY, () => defaultState());
const save = (store, next) => setState(store, STATE_KEY, next);

export function seedFromConfig(store, baseUrl = BASE_URL, config = {}) {
  const seeded = defaultState(baseUrl);
  return save(store, {
    ...seeded,
    ...config,
    restaurants: { ...seeded.restaurants, ...(config.restaurants ?? {}) },
    acceptedTokens: config.acceptedTokens ?? seeded.acceptedTokens,
  });
}

function query(c, name, fallback = '') {
  return c.req.query?.(name) ?? fallback;
}

function param(c, name) {
  return c.req.param?.(name);
}

function record(current, endpoint, params = {}) {
  current.requests.push({ endpoint, params, requestedAt: new Date().toISOString() });
}

function requestId() {
  return 'ot_request_000001';
}

function otError(c, message, status = 400, details = undefined) {
  const error = details ? { message, details } : { message };
  return c.json({ errors: [error], requestid: requestId() }, status);
}

function bearer(c) {
  return (c.req.header?.('authorization') ?? '').match(/^Bearer\s+(.+)$/i)?.[1] ?? '';
}

function requireAuth(c, current) {
  const token = bearer(c);
  if (!token || current.acceptedTokens.includes(token)) return null;
  return otError(c, 'invalid_token', 401);
}

function getRestaurant(current, rid) {
  return current.restaurants[Number(rid)] ?? restaurant(Number(rid), `Restaurant ${rid}`);
}

function dateTimeParts(input = '2025-03-05T19:00') {
  const [date = '2025-03-05', time = '19:00'] = String(input).split('T');
  const [hour = '19', minute = '00'] = time.split(':');
  return { date, hour: Number(hour) || 19, minute: Number(minute) || 0 };
}

function addMinutes(input, minutes) {
  const { date, hour, minute } = dateTimeParts(input);
  const total = hour * 60 + minute + minutes;
  const nextHour = Math.floor(total / 60);
  const nextMinute = total % 60;
  return `${date}T${String(nextHour).padStart(2, '0')}:${String(nextMinute).padStart(2, '0')}`;
}

function availabilityFor(current, rid, c) {
  const start = query(c, 'start_date_time', '2025-03-05T19:00');
  const partySize = Number(query(c, 'party_size', '2')) || 2;
  const restaurantData = getRestaurant(current, rid);
  const times = [0, 15, 30, 45, 60].map((minutes) => addMinutes(start, minutes));
  return {
    rid: Number(rid),
    party_size: partySize,
    times,
    times_available: times.map((time) => ({
      time,
      availability_types: [
        {
          type: 'Standard',
          cancellationPolicy: {},
          diningArea: restaurantData.dining_areas.map((area) => ({
            id: area.id,
            attributes: [area.id === 2439 ? 'outdoor' : 'default'],
            environment: area.environment,
            booking_url: `https://www.opentable.com/book/validate?rid=${rid}&d=${encodeURIComponent(time)}&sd=${encodeURIComponent(time)}&p=${partySize}&pt=100&hash=${rid}${area.id}&ref=&tc=default&diningAreaId=${area.id}`,
            booking_restref_url: `https://www.opentable.com/restref/client?rid=${rid}&dateTime=${encodeURIComponent(time)}&partySize=${partySize}&restref=${rid}`,
          })),
        },
      ],
    })),
    no_availability_reasons: [],
    href: `${current.baseUrl}/sync/listings/${rid}`,
  };
}

function reservationResponse(current, reservation) {
  return {
    message: POLICY_MESSAGE,
    confirmation_number: reservation.confirmation_number,
    offer_confirmation_number: 0,
    date_time: reservation.date_time,
    party_size: reservation.party_size,
    notes: reservation.notes,
    manage_reservation_url: `https://www.opentable.com/book/view?rid=${reservation.restaurant_id}&confnumber=${reservation.confirmation_number}&token=${reservation.reservation_token}`,
  };
}

function reservationDetail(current, reservation) {
  return {
    ...reservationResponse(current, reservation),
    restaurant_id: reservation.restaurant_id,
    reservation_attribute: reservation.reservation_attribute,
    status: reservation.status,
    dining_area_id: reservation.dining_area_id,
    environment: reservation.environment,
    credit_card_last_four: reservation.credit_card_last_four,
    cancel_cutoff_date_utc: reservation.cancel_cutoff_date_utc,
    language: reservation.language,
    experience: reservation.experience,
  };
}

function tokenEndpoint(c, store) {
  const current = state(store);
  const grantType = query(c, 'grant_type', 'client_credentials');
  if (grantType !== 'client_credentials') return otError(c, 'unsupported_grant_type', 400);
  current.tokenCount += 1;
  const accessToken = current.tokenCount === 1 ? 'v2-opentable-emulator-token' : createToken('v2-opentable', current.tokenCount);
  if (!current.acceptedTokens.includes(accessToken)) current.acceptedTokens.push(accessToken);
  record(current, '/api/v2/oauth/token', { grant_type: grantType });
  save(store, current);
  return c.json({ access_token: accessToken, scope: 'DEFAULT', token_type: 'Bearer', expires_in: 1989434 });
}

function availability(c, store) {
  const current = state(store);
  const auth = requireAuth(c, current);
  if (auth) return auth;
  const rid = param(c, 'rid');
  const partySize = Number(query(c, 'party_size'));
  if (query(c, 'party_size') && (!Number.isInteger(partySize) || partySize < 1 || partySize > 20)) {
    return otError(c, 'Party size must be from 1 to 20', 400);
  }
  record(current, '/v2/availability/:rid', { rid, party_size: query(c, 'party_size') });
  save(store, current);
  return c.json(availabilityFor(current, rid, c));
}

function availabilityMetadata(c, store) {
  const current = state(store);
  const auth = requireAuth(c, current);
  if (auth) return auth;
  const rid = param(c, 'rid');
  const restaurantData = getRestaurant(current, rid);
  record(current, '/v2/availability-metadata/:rid', { rid });
  save(store, current);
  return c.json({ data: { enviroments: restaurantData.environments, attributes: restaurantData.attributes, dining_areas: restaurantData.dining_areas } });
}

async function slotLock(c, store) {
  const current = state(store);
  const auth = requireAuth(c, current);
  if (auth) return auth;
  const rid = param(c, 'rid') ?? '';
  const body = await readBody(c);
  if (!body.party_size) return otError(c, 'party_size should not be null', 400);
  if (!body.date_time) return otError(c, 'date_time should not be null', 400);
  current.slotLockCount += 1;
  const reservationToken = createToken(`ot_slot_${rid}`, current.slotLockCount);
  current.slotLocks[reservationToken] = {
    rid: Number(rid),
    party_size: Number(body.party_size),
    date_time: body.date_time,
    reservation_attribute: body.reservation_attribute ?? 'default',
    dining_area_id: Number(body.dining_area_id ?? 1),
    environment: body.environment ?? 'Indoor',
    experience: body.experience ?? null,
    expires_at: addMinutes(body.date_time, 5),
  };
  record(current, '/v2/booking/:rid/slot_locks', { rid, reservation_token: reservationToken });
  save(store, current);
  return c.json({ expires_at: current.slotLocks[reservationToken].expires_at, reservation_token: reservationToken });
}

function deleteSlotLock(c, store) {
  const current = state(store);
  const auth = requireAuth(c, current);
  if (auth) return auth;
  const token = param(c, 'reservationToken');
  if (!current.slotLocks[token]) return otError(c, 'reservation_token or restaurant id is invalid', 400);
  delete current.slotLocks[token];
  record(current, '/v2/booking/:rid/slot_locks/:reservationToken', { reservation_token: token });
  save(store, current);
  return c.json({ status: 'Success' });
}

async function makeReservation(c, store) {
  const current = state(store);
  const auth = requireAuth(c, current);
  if (auth) return auth;
  const rid = Number(param(c, 'rid'));
  const body = await readBody(c);
  if (!body.reservation_token && (!body.date_time || !body.party_size)) {
    return otError(c, 'reservation_token is required if slotlock flow is used. date_time and party_size is required if slotlock flow is not used.', 400);
  }
  for (const [field, message] of [
    ['first_name', 'first_name should not be empty'],
    ['last_name', 'last_name should not be empty'],
    ['email_address', 'email_address should not be empty'],
  ]) {
    if (!body[field]) return otError(c, message, 400);
  }
  if (!body.phone?.number) return otError(c, 'ValidationError - PhoneRequired: phone Not Provided, country US, type Mobile', 400);
  const lock = body.reservation_token ? current.slotLocks[body.reservation_token] : null;
  if (body.reservation_token && (!lock || lock.rid !== rid)) return otError(c, 'reservation_token is invalid', 400);
  const confirmationNumber = current.nextConfirmationNumber++;
  const reservation = {
    confirmation_number: confirmationNumber,
    restaurant_id: rid,
    date_time: lock?.date_time ?? body.date_time,
    party_size: Number(lock?.party_size ?? body.party_size),
    notes: body.special_request ?? '',
    reservation_token: body.reservation_token ?? createToken(`ot_direct_${rid}`, confirmationNumber),
    reservation_attribute: body.reservation_attribute ?? lock?.reservation_attribute ?? 'default',
    status: 'Pending',
    dining_area_id: Number(body.dining_area_id ?? lock?.dining_area_id ?? 1),
    environment: body.environment ?? lock?.environment ?? 'Indoor',
    credit_card_last_four: body.credit_card?.last4,
    cancel_cutoff_date_utc: `${String(lock?.date_time ?? body.date_time).split('T')[0]}T23:59:00Z`,
    language: c.req.header?.('accept-language') ?? 'en-US',
    experience: body.experience ?? lock?.experience ?? null,
  };
  current.reservations[`${rid}-${confirmationNumber}`] = reservation;
  if (body.reservation_token) delete current.slotLocks[body.reservation_token];
  record(current, '/v2/booking/:rid/reservations', { rid, confirmation_number: confirmationNumber });
  save(store, current);
  return c.json(reservationResponse(current, reservation), 201);
}

function getReservation(c, store) {
  const current = state(store);
  const auth = requireAuth(c, current);
  if (auth) return auth;
  const id = param(c, 'id');
  const reservation = current.reservations[id];
  if (!reservation) return otError(c, `MissingResource - Reservation details [RID = ${param(c, 'rid')}, CONF_NUM = ${id?.split('-')[1] ?? ''}]`, 404);
  record(current, '/v2/booking/:rid/reservations/:id', { id });
  save(store, current);
  return c.json(reservationDetail(current, reservation));
}

async function updateReservation(c, store) {
  const current = state(store);
  const auth = requireAuth(c, current);
  if (auth) return auth;
  const id = param(c, 'id');
  const reservation = current.reservations[id];
  if (!reservation) return otError(c, `MissingResource - Reservation details [RID = ${param(c, 'rid')}, CONF_NUM = ${id?.split('-')[1] ?? ''}]`, 404);
  const body = await readBody(c);
  if (body.status === 'CancelledWeb') {
    reservation.status = 'CancelledWeb';
    record(current, '/v2/booking/:rid/reservations/:id:cancel', { id });
    save(store, current);
    return c.body(null, 200);
  }
  if (body.reservation_token && !current.slotLocks[body.reservation_token]) return otError(c, 'reservation_token is invalid', 400);
  reservation.date_time = body.date_time ?? reservation.date_time;
  reservation.party_size = Number(body.party_size ?? reservation.party_size);
  reservation.notes = body.special_request ?? reservation.notes;
  reservation.reservation_attribute = body.reservation_attribute ?? reservation.reservation_attribute;
  reservation.status = 'Pending';
  if (body.reservation_token) delete current.slotLocks[body.reservation_token];
  record(current, '/v2/booking/:rid/reservations/:id:update', { id });
  save(store, current);
  return c.json(reservationResponse(current, reservation));
}

function registerOpenTableRoutes(app, store, prefix = '') {
  app.get(`${prefix}/v2/availability/:rid`, (c) => availability(c, store));
  app.get(`${prefix}/v2/availability-metadata/:rid`, (c) => availabilityMetadata(c, store));
  app.post(`${prefix}/v2/booking/:rid/slot_locks`, (c) => slotLock(c, store));
  app.delete(`${prefix}/v2/booking/:rid/slot_locks/:reservationToken`, (c) => deleteSlotLock(c, store));
  app.post(`${prefix}/v2/booking/:rid/reservations`, (c) => makeReservation(c, store));
  app.get(`${prefix}/v2/booking/:rid/reservations/:id`, (c) => getReservation(c, store));
  app.put(`${prefix}/v2/booking/:rid/reservations/:id`, (c) => updateReservation(c, store));
}

export const contract = {
  provider: 'opentable',
  source: 'OpenTable API Documentation, Consumer API v2 booking and OAuth sections',
  docs: 'https://docs.opentable.com',
  baseUrl: BASE_URL,
  oauthUrl: OAUTH_URL,
  scope: ['oauth-token', 'availability', 'availability-metadata', 'slot-locks', 'reservations'],
  fidelity: 'deterministic-stateful-subset',
};

export const plugin = {
  name: 'opentable',
  register(app, store) {
    app.get('/api/v2/oauth/token', (c) => tokenEndpoint(c, store));
    registerOpenTableRoutes(app, store);
    app.get('/inspect/contract', (c) => c.json(contract));
    app.get('/inspect/state', (c) => c.json(state(store)));
  },
};

export const label = 'OpenTable API emulator';
export const endpoints = 'oauth token, availability, slot locks, reservations';
export const initConfig = { opentable: { token: 'opentable_emulator_token' } };
