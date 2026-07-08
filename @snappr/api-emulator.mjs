const STATE_KEY = 'snappr:state';
const NOW = '2018-09-01T09:12:00Z';
const CREATOR = {
  creator_name: 'Hollie B.',
  creator_id: '69a66cb2-dcb2-4803-9d23-f7894e443e68',
  creator_profile_image_url: 'https://snappr.imgix.net/d7f5be08-e189-4c9b-bdb5-172111560d9d?auto=format&w=300&h=300&fit=facearea&facepad=2&s=3dd41a8404ba86d78d54adad40fd9108',
};

function initialState(config = {}) {
  return {
    bookings: [
      {
        uid: '0ccefa53-b346-4d3e-8dcb-79a914289928',
        title: 'Emerald Theatre Shoot',
        status: 'paid',
        credits: 249,
        latitude: 34.0522,
        longitude: -118.2437,
        shoottype: 'event',
        start_at: '2018-12-01T07:30:00Z',
        duration: 120,
        location_notes: 'Location is Emerald Theatre - ring buzzer at main entrance on arrival',
        style_notes: 'Shots of as many members of crowd as possible; shallow depth of field where possible',
        customer_firstname: 'Mary',
        customer_surname: 'Smith',
        customer_email: 'test@snappr.com',
        customer_mobilephone: '+14153339966',
        customer_company: 'Snappr Inc.',
        internal_id: '123-ABC',
        ...CREATOR,
        created_at: NOW,
        updated_at: NOW,
        tags: ['tag1', 'tag2', 'tag3'],
      },
    ],
    editingJobs: [
      {
        uid: '48b095fd-7fc0-41dc-b632-9b032e0a65e6',
        title: 'Restaurant gallery',
        status: 'completed',
        credits: 9,
        type: 'food',
        preset_id: '1ea37f86-c82d-4267-8773-9a13fd4f1337',
        uploader_firstname: 'Mary',
        uploader_surname: 'Smith',
        uploader_email: 'test@snappr.com',
        uploader_mobilephone: '+14153339966',
        uploader_company: 'Snappr Inc.',
        internal_id: '123-ABC',
        created_at: NOW,
        updated_at: NOW,
      },
    ],
    imagesByBooking: {
      '0ccefa53-b346-4d3e-8dcb-79a914289928': [
        mediaImage('ed10cf86-97f9-4ce6-af6f-a01dfe891114', 'ZD 001.JPG'),
        mediaImage('ee9be5f8-84a8-4592-88a0-1781d0c39d0a', 'ZD 002.JPG'),
        mediaImage('6b6eae3e-ebfb-4776-8a20-2b8087f76418', 'ZD 003.JPG'),
      ],
    },
    imagesByEditingJob: {
      '48b095fd-7fc0-41dc-b632-9b032e0a65e6': [
        editingImage('ed10cf86-97f9-4ce6-af6f-a01dfe891114', 'ZD 001.JPG'),
        editingImage('ee9be5f8-84a8-4592-88a0-1781d0c39d0a', 'ZD 002.JPG'),
        editingImage('6b6eae3e-ebfb-4776-8a20-2b8087f76418', 'ZD 003.JPG'),
      ],
    },
    videosByBooking: {
      '0ccefa53-b346-4d3e-8dcb-79a914289928': [
        video('ed10cf86-97f9-4ce6-af6f-a01dfe891114', 'ZD 001.MP4'),
        video('ee9be5f8-84a8-4592-88a0-1781d0c39d0a', 'ZD 002.MP4'),
      ],
    },
    presets: [
      {
        uid: '1ea37f86-c82d-4267-8773-9a13fd4f1337',
        name: 'Food gallery clean color',
        type: 'food',
        notes: 'Balanced exposure, vertical lines, natural color, and delivery-ready crops.',
      },
    ],
    shootTypes: [
      { name: 'event', display_name: 'Event' },
      { name: 'food', display_name: 'Food' },
      { name: 'real-estate', display_name: 'Real Estate' },
      { name: 'family', display_name: 'Family' },
    ],
    editingJobTypes: [
      { name: 'food', display_name: 'Food' },
      { name: 'real-estate', display_name: 'Real Estate' },
      { name: 'automotive', display_name: 'Automotive' },
    ],
    availableTimes: ['2018-12-01T07:30:00Z', '2018-12-01T09:30:00Z', '2018-12-01T15:00:00Z', '2018-12-01T15:30:00Z'],
    webhooks: [],
    nextBooking: 1,
    nextEditingJob: 1,
    ...config,
  };
}

function mediaImage(uid, fileName) {
  return {
    uid,
    file_name: fileName,
    url_original: `https://prod-us-media-snappr.s3.us-west-1.amazonaws.com/${uid}?AWSAccessKeyId=emulator&Expires=2147483647&Signature=emulator`,
    url_thumb: `https://img.snappr.co/emulator/fit-in/600x0/${uid}`,
  };
}

function editingImage(uid, fileName) {
  const image = mediaImage(uid, fileName);
  return { uid, source: image, final: image };
}

function video(uid, fileName) {
  return {
    uid,
    file_name: fileName,
    url_original: `https://prod-us-media-snappr.s3.us-west-1.amazonaws.com/${uid}?AWSAccessKeyId=emulator&Expires=2147483647&Signature=emulator`,
  };
}

function state(store) {
  const current = store.getData?.(STATE_KEY);
  if (current) return current;
  const next = initialState();
  store.setData?.(STATE_KEY, next);
  return next;
}

function saveState(store, next) {
  store.setData?.(STATE_KEY, next);
}

async function json(c) {
  return c.req.json().catch(() => ({}));
}

async function queryAndBody(c, keys) {
  const body = await json(c);
  const merged = { ...body };
  for (const key of keys) {
    const value = c.req.query(key);
    if (value !== undefined) merged[key] = value;
  }
  return merged;
}

function error(c, name, message, status = 400, problems = undefined) {
  return c.json({ error: { name, message, ...(problems ? { problems } : {}) } }, status);
}

function requireAuth(c) {
  const authorization = c.req.header?.('authorization');
  if (!authorization?.startsWith('Bearer ')) {
    return error(c, 'AuthenticationError', 'Snappr API requests require an Authorization: Bearer api_key header.', 401);
  }
  const version = c.req.header?.('accept-version');
  if (version && version !== '1.0.0') return error(c, 'InvalidAPIVersion', 'Only accept-version 1.0.0 is supported by this emulator.', 400);
  return null;
}

function authed(handler) {
  return async (c) => requireAuth(c) ?? handler(c);
}

function numberOr(value, fallback) {
  if (value === undefined || value === null || value === '') return fallback;
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function limitOffset(c, defaultLimit, maxLimit) {
  const requestedLimit = Math.trunc(numberOr(c.req.query('limit'), defaultLimit));
  const requestedOffset = Math.trunc(numberOr(c.req.query('offset'), 0));
  return {
    limit: Math.max(0, Math.min(maxLimit, requestedLimit)),
    offset: Math.max(0, requestedOffset),
  };
}

function page(c, rows, defaultLimit = 100, maxLimit = 100) {
  const { limit, offset } = limitOffset(c, defaultLimit, maxLimit);
  const results = rows.slice(offset, offset + limit);
  return { results, count: results.length, limit, offset, total: rows.length };
}

function notFound(c, resource) {
  return error(c, 'NotFoundError', `${resource} not found.`, 404);
}

function uid(prefix, next) {
  const suffix = String(next).padStart(12, '0');
  if (prefix === 'booking') return `00000000-0000-4000-8000-${suffix}`;
  return `11111111-0000-4000-8000-${suffix}`;
}

function resolveLocation(input) {
  if (input.latitude !== undefined && input.longitude !== undefined) {
    return { latitude: Number(input.latitude), longitude: Number(input.longitude) };
  }
  if (input.address) return { latitude: 37.8077, longitude: -122.477 };
  return null;
}

function validateLocationAndType(c, input, typeKey = 'shoottype') {
  const location = resolveLocation(input);
  const problems = [];
  if (!location) problems.push({ field: 'location', message: 'Provide address or latitude and longitude.' });
  if (!input[typeKey]) problems.push({ field: typeKey, message: `${typeKey} is required.` });
  if (problems.length > 0) return { response: error(c, 'ValidationError', 'Request validation failed.', 400, problems) };
  return { location };
}

function addWebhook(s, type, resourceKey, resource) {
  s.webhooks.push({ type, [resourceKey]: resource, created_at: new Date().toISOString() });
}

export const contract = {
  provider: 'snappr',
  source: 'Snappr official API documentation',
  docs: 'https://docs.snappr.com/#introduction',
  baseUrl: 'https://api.snappr.com',
  sandboxUrl: 'https://sandbox.snappr.com',
  auth: 'Authorization: Bearer api_key with accept-version: 1.0.0',
  scope: ['coverage', 'availability', 'bookings', 'editing-jobs', 'presets', 'images', 'videos', 'types', 'inspection'],
  fidelity: 'stateful-rest-emulator',
  notes: 'No official OpenAPI spec or public CLI/SDK with safe base URL override was found; route smoke is based on the official Slate docs.',
};

export const plugin = {
  name: 'snappr',
  register(app, store) {
    app.get('/coverage', authed(async (c) => {
      const input = await queryAndBody(c, ['latitude', 'longitude', 'address', 'shoottype', 'creator_id']);
      const { response, location } = validateLocationAndType(c, input);
      if (response) return response;
      const isLaExample = Number(location.latitude).toFixed(4) === '34.0522' && Number(location.longitude).toFixed(4) === '-118.2437';
      return c.json({
        latitude: location.latitude,
        longitude: location.longitude,
        shoottype: input.shoottype,
        coverage: !isLaExample,
      });
    }));

    app.get('/availability', authed(async (c) => {
      const input = await queryAndBody(c, ['latitude', 'longitude', 'address', 'shoottype', 'duration', 'date', 'creator_id']);
      const { response, location } = validateLocationAndType(c, input);
      if (response) return response;
      const problems = [];
      if (!input.duration) problems.push({ field: 'duration', message: 'duration is required.' });
      if (!input.date) problems.push({ field: 'date', message: 'date is required.' });
      if (problems.length > 0) return error(c, 'ValidationError', 'Request validation failed.', 400, problems);
      return c.json({
        latitude: location.latitude,
        longitude: location.longitude,
        shoottype: input.shoottype,
        duration: Number(input.duration),
        date: input.date,
        timezone: 'America/Los_Angeles',
        available_times: state(store).availableTimes,
      });
    }));

    app.post('/bookings', authed(async (c) => {
      const s = state(store);
      const body = await json(c);
      const { response, location } = validateLocationAndType(c, body);
      if (response) return response;
      if (!body.customer_firstname || !body.customer_email || body.start_at === undefined || !body.duration) {
        return error(c, 'ValidationError', 'Request validation failed.', 400);
      }
      const bookingUid = body.uid ?? uid('booking', s.nextBooking++);
      const booking = {
        uid: bookingUid,
        title: body.title ?? 'Snappr Emulator Shoot',
        status: body.start_at === null ? 'paid_pending_schedule' : 'paid',
        credits: body.credits ?? 249,
        latitude: location.latitude,
        longitude: location.longitude,
        shoottype: body.shoottype,
        start_at: body.start_at ?? undefined,
        duration: Number(body.duration),
        location_notes: body.location_notes ?? null,
        style_notes: body.style_notes ?? null,
        customer_firstname: body.customer_firstname,
        customer_surname: body.customer_surname ?? null,
        customer_email: body.customer_email,
        customer_mobilephone: body.customer_mobilephone ?? null,
        customer_company: body.customer_company ?? null,
        internal_id: body.internal_id ?? null,
        ...(body.start_at === null ? { scheduling_url: `https://app.snappr.co/scheduling/${bookingUid}?token=emulator` } : CREATOR),
        created_at: NOW,
        updated_at: NOW,
        tags: body.tags ?? [],
      };
      s.bookings.push(booking);
      s.imagesByBooking[booking.uid] = [];
      s.videosByBooking[booking.uid] = [];
      addWebhook(s, 'create', 'booking', booking);
      saveState(store, s);
      return c.json(booking, 201);
    }));

    app.get('/bookings', authed((c) => c.json(page(c, state(store).bookings, 100, 100))));
    app.get('/bookings/:bookingUid', authed((c) => {
      const booking = state(store).bookings.find((item) => item.uid === c.req.param('bookingUid'));
      return booking ? c.json(booking) : notFound(c, 'Booking');
    }));
    app.get('/bookings/:bookingUid/images', authed((c) => {
      const rows = state(store).imagesByBooking[c.req.param('bookingUid')];
      return rows ? c.json(page(c, rows, 1000, 10000)) : notFound(c, 'Booking');
    }));
    app.get('/bookings/:bookingUid/videos', authed((c) => {
      const rows = state(store).videosByBooking[c.req.param('bookingUid')];
      return rows ? c.json(page(c, rows, 1000, 10000)) : notFound(c, 'Booking');
    }));

    app.post('/editing-jobs', authed(async (c) => {
      const s = state(store);
      const body = await json(c);
      if (!body.type || body.images === undefined || !body.preset_id) return error(c, 'ValidationError', 'Request validation failed.', 400);
      const editingJobUid = body.uid ?? uid('editing-job', s.nextEditingJob++);
      const editingJob = {
        uid: editingJobUid,
        title: body.title ?? 'Snappr Emulator Editing Job',
        status: body.images === null ? 'pending_upload' : 'creating',
        credits: body.images === null ? undefined : Math.max(1, body.images.length * 3),
        type: body.type,
        preset_id: body.preset_id,
        uploader_firstname: body.uploader_firstname ?? undefined,
        uploader_surname: body.uploader_surname ?? undefined,
        uploader_email: body.uploader_email ?? undefined,
        uploader_mobilephone: body.uploader_mobilephone ?? undefined,
        uploader_company: body.uploader_company ?? undefined,
        internal_id: body.internal_id ?? undefined,
        upload_url: body.images === null ? `https://app.snappr.co/editing-jobs/${editingJobUid}/upload?token=emulator` : undefined,
        created_at: NOW,
        updated_at: NOW,
      };
      s.editingJobs.push(editingJob);
      s.imagesByEditingJob[editingJob.uid] = Array.isArray(body.images)
        ? body.images.map((image, index) => editingImage(image.uid ?? uid('editing-job', index + 1), image.file_name ?? `image-${index + 1}.jpg`))
        : [];
      addWebhook(s, 'create', 'editing_job', editingJob);
      saveState(store, s);
      return c.json(editingJob, 201);
    }));

    app.get('/editing-jobs', authed((c) => c.json(page(c, state(store).editingJobs, 100, 100))));
    app.get('/editing-jobs/:editingJobUid', authed((c) => {
      const editingJob = state(store).editingJobs.find((item) => item.uid === c.req.param('editingJobUid'));
      return editingJob ? c.json(editingJob) : notFound(c, 'Editing job');
    }));
    app.get('/editing-jobs/:editingJobUid/images', authed((c) => {
      const rows = state(store).imagesByEditingJob[c.req.param('editingJobUid')];
      return rows ? c.json(page(c, rows, 1000, 10000)) : notFound(c, 'Editing job');
    }));

    app.get('/presets', authed((c) => c.json(page(c, state(store).presets, 100, 1000))));
    app.get('/shoottypes', authed((c) => c.json(page(c, state(store).shootTypes, 100, 1000))));
    app.get('/editing-job-types', authed((c) => c.json(page(c, state(store).editingJobTypes, 100, 1000))));

    app.get('/inspect/contract', (c) => c.json(contract));
    app.get('/inspect/state', (c) => c.json(state(store)));
  },
};

export function seedFromConfig(store, _baseUrl, config = {}) {
  saveState(store, initialState(config));
}

export const label = 'Snappr API emulator';
export const endpoints = 'coverage, availability, bookings, editing jobs, presets, images, videos, and type lists';
export const capabilities = contract.scope;
export const initConfig = { snappr: initialState() };
export default plugin;
