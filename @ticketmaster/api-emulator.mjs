import { getState, setState } from '../scripts/provider-plugin-kit.mjs';

const STATE_KEY = 'ticketmaster:state';
const BASE_URL = 'https://app.ticketmaster.com/discovery/v2';

function image(id, width = 1136, height = 639) {
  return {
    ratio: '16_9',
    url: `http://s1.ticketm.net/dam/a/${id}/${id}_RETINA_LANDSCAPE_16_9.jpg`,
    width,
    height,
    fallback: false,
  };
}

function classification(segmentName = 'Music', genreName = 'Rock', subGenreName = 'Pop') {
  return {
    primary: true,
    segment: { id: segmentName === 'Sports' ? 'KZFzniwnSyZfZ7v7nE' : 'KZFzniwnSyZfZ7v7nJ', name: segmentName },
    genre: { id: genreName === 'Golf' ? 'KnvZfZ7vAdt' : 'KnvZfZ7vAeA', name: genreName },
    subGenre: { id: subGenreName === 'PGA Tour' ? 'KZazBEonSMnZfZ7vFI7' : 'KZazBEonSMnZfZ7v6F1', name: subGenreName },
  };
}

function venue(id, name, city, stateCode, countryCode = 'US') {
  return {
    name,
    type: 'venue',
    id,
    test: false,
    locale: 'en-us',
    postalCode: stateCode === 'CA' ? '90015' : '33178',
    timezone: stateCode === 'CA' ? 'America/Los_Angeles' : 'America/New_York',
    city: { name: city },
    state: { name: stateCode === 'CA' ? 'California' : 'Florida', stateCode },
    country: { name: countryCode === 'US' ? 'United States Of America' : 'Canada', countryCode },
    address: { line1: stateCode === 'CA' ? '1111 S Figueroa St' : '4400 NW 87th Avenue' },
    location: { longitude: stateCode === 'CA' ? '-118.26725410' : '-80.33854298', latitude: stateCode === 'CA' ? '34.04301750' : '25.81260379' },
    markets: [{ id: stateCode === 'CA' ? '27' : '15' }],
    _links: { self: { href: `/discovery/v2/venues/${id}?locale=en-us` } },
  };
}

function attraction(id, name, kind = 'Music') {
  return {
    name,
    type: 'attraction',
    id,
    test: false,
    locale: 'en-us',
    images: [image(id, 640, 360)],
    classifications: [kind === 'Sports' ? classification('Sports', 'Golf', 'PGA Tour') : classification()],
    _links: { self: { href: `/discovery/v2/attractions/${id}?locale=en-us` } },
  };
}

function event({ id, name, attractionData, venueData, segment = 'Music', genre = 'Rock', subGenre = 'Pop', localDate = '2026-07-18' }) {
  return {
    name,
    type: 'event',
    id,
    test: false,
    url: `http://ticketmaster.com/event/${id}`,
    locale: 'en-us',
    images: [image(id), image(id, 305, 203)],
    sales: {
      public: { startDateTime: '2026-01-10T17:00:00Z', startTBD: false, endDateTime: `${localDate}T23:00:00Z` },
    },
    dates: {
      start: { localDate, localTime: '20:00:00', dateTBD: false, dateTBA: false, timeTBA: false, noSpecificTime: false },
      timezone: venueData.timezone,
      status: { code: 'onsale' },
    },
    classifications: [classification(segment, genre, subGenre)],
    promoter: { id: '682', name: 'Ticketmaster Emulator' },
    priceRanges: [{ type: 'standard', currency: 'USD', min: 49.5, max: 149.5 }],
    _links: {
      self: { href: `/discovery/v2/events/${id}?locale=en-us` },
      attractions: [{ href: `/discovery/v2/attractions/${attractionData.id}?locale=en-us` }],
      venues: [{ href: `/discovery/v2/venues/${venueData.id}?locale=en-us` }],
    },
    _embedded: { venues: [venueData], attractions: [attractionData] },
  };
}

function defaultState(baseUrl = BASE_URL) {
  const venues = {
    KovZpZAJ6nlA: venue('KovZpZAJ6nlA', 'Crypto.com Arena', 'Los Angeles', 'CA'),
    KovZpZAaEldA: venue('KovZpZAaEldA', 'Trump National Doral', 'Miami', 'FL'),
  };
  const attractions = {
    K8vZ917Gku7: attraction('K8vZ917Gku7', 'Adele'),
    K8vZ917uc57: attraction('K8vZ917uc57', 'Cadillac Championship', 'Sports'),
  };
  const events = {
    G5diZfkn0B_bh: event({ id: 'G5diZfkn0B_bh', name: 'Adele Live', attractionData: attractions.K8vZ917Gku7, venueData: venues.KovZpZAJ6nlA }),
    vvG1VZKS5pr1qy: event({
      id: 'vvG1VZKS5pr1qy',
      name: 'WGC Cadillac Championship - Sunday Ticket',
      attractionData: attractions.K8vZ917uc57,
      venueData: venues.KovZpZAaEldA,
      segment: 'Sports',
      genre: 'Golf',
      subGenre: 'PGA Tour',
      localDate: '2026-03-08',
    }),
  };
  return {
    baseUrl,
    acceptedApiKeys: ['ticketmaster-emulator-key', 'test-key', 'demo-key'],
    requests: [],
    events,
    attractions,
    venues,
  };
}

const state = (store) => getState(store, STATE_KEY, () => defaultState());
const save = (store, next) => setState(store, STATE_KEY, next);

export function seedFromConfig(store, baseUrl = BASE_URL, config = {}) {
  const seeded = defaultState(baseUrl);
  return save(store, {
    ...seeded,
    ...config,
    events: { ...seeded.events, ...(config.events ?? {}) },
    attractions: { ...seeded.attractions, ...(config.attractions ?? {}) },
    venues: { ...seeded.venues, ...(config.venues ?? {}) },
    acceptedApiKeys: config.acceptedApiKeys ?? seeded.acceptedApiKeys,
  });
}

function query(c, name, fallback = '') {
  return c.req.query?.(name) ?? fallback;
}

function cleanId(value = '') {
  return String(value).replace(/\.json$/, '');
}

function record(current, endpoint, params = {}) {
  current.requests.push({ endpoint, params, requestedAt: new Date().toISOString() });
}

function fault(c, faultstring = 'Invalid ApiKey', status = 401, errorcode = 'oauth.v2.InvalidApiKey') {
  return c.json({ fault: { faultstring, detail: { errorcode } } }, status);
}

function requireApiKey(c, current) {
  const apikey = query(c, 'apikey') || query(c, 'api_key');
  if (current.acceptedApiKeys.includes(apikey)) return null;
  return fault(c);
}

function includes(value, needle) {
  if (!needle) return true;
  return String(value).toLowerCase().includes(String(needle).toLowerCase());
}

function matchesEvent(eventData, c) {
  const keyword = query(c, 'keyword');
  const countryCode = query(c, 'countryCode');
  const classificationName = query(c, 'classificationName');
  const attractionId = query(c, 'attractionId');
  const venueId = query(c, 'venueId');
  const haystack = [
    eventData.name,
    eventData.classifications?.[0]?.segment?.name,
    eventData.classifications?.[0]?.genre?.name,
    eventData.classifications?.[0]?.subGenre?.name,
    eventData._embedded?.attractions?.[0]?.name,
    eventData._embedded?.venues?.[0]?.name,
  ].join(' ');
  return (
    includes(haystack, keyword) &&
    (!countryCode || eventData._embedded?.venues?.some((item) => item.country?.countryCode === countryCode)) &&
    (!classificationName || includes(haystack, classificationName)) &&
    (!attractionId || eventData._embedded?.attractions?.some((item) => item.id === attractionId)) &&
    (!venueId || eventData._embedded?.venues?.some((item) => item.id === venueId))
  );
}

function pageParams(c) {
  const size = Math.max(1, Math.min(Number(query(c, 'size', '20')) || 20, 200));
  const page = Math.max(0, Number(query(c, 'page', '0')) || 0);
  return { size, page };
}

function collectionResponse(type, items, c, path) {
  const { size, page } = pageParams(c);
  if (size * page >= 1000) return { error: true, body: { fault: { faultstring: 'Deep paging is not supported', detail: { errorcode: 'discovery.v2.DeepPaging' } } } };
  const start = page * size;
  const pageItems = items.slice(start, start + size);
  const totalPages = Math.max(1, Math.ceil(items.length / size));
  const links = { self: { href: `/discovery/v2/${path}.json?size=${size}{&page,sort}`, templated: true } };
  if (page + 1 < totalPages) links.next = { href: `/discovery/v2/${path}.json?page=${page + 1}&size=${size}{&sort}`, templated: true };
  return {
    _links: links,
    _embedded: { [type]: pageItems },
    page: { size, totalElements: items.length, totalPages, number: page },
  };
}

function searchEvents(c, store) {
  const current = state(store);
  const auth = requireApiKey(c, current);
  if (auth) return auth;
  const events = Object.values(current.events).filter((item) => matchesEvent(item, c));
  record(current, '/discovery/v2/events', { keyword: query(c, 'keyword'), size: query(c, 'size') });
  save(store, current);
  const response = collectionResponse('events', events, c, 'events');
  if (response.error) return c.json(response.body, 400);
  return c.json(response);
}

function detail(collection, endpoint) {
  return (c, store) => {
    const current = state(store);
    const auth = requireApiKey(c, current);
    if (auth) return auth;
    const id = cleanId(c.req.param('id'));
    const item = current[collection][id] ?? Object.values(current[collection]).find((entry) => entry.id === id);
    if (!item) return fault(c, 'Resource not found', 404, 'discovery.v2.NotFound');
    record(current, endpoint, { id });
    save(store, current);
    return c.json(item);
  };
}

function images(c, store) {
  const current = state(store);
  const auth = requireApiKey(c, current);
  if (auth) return auth;
  const id = cleanId(c.req.param('id'));
  const eventData = current.events[id];
  if (!eventData) return fault(c, 'Resource not found', 404, 'discovery.v2.NotFound');
  record(current, '/discovery/v2/events/:id/images', { id });
  save(store, current);
  return c.json({ type: 'event', id, images: eventData.images, _links: { self: { href: `/discovery/v2/events/${id}/images?locale=en-us` } } });
}

function searchCollection(collection, type, path, matcher = () => true) {
  return (c, store) => {
    const current = state(store);
    const auth = requireApiKey(c, current);
    if (auth) return auth;
    const keyword = query(c, 'keyword') || query(c, 'name');
    const items = Object.values(current[collection]).filter((item) => includes(item.name, keyword) && matcher(item, c));
    record(current, `/discovery/v2/${path}`, { keyword, size: query(c, 'size') });
    save(store, current);
    const response = collectionResponse(type, items, c, path);
    if (response.error) return c.json(response.body, 400);
    return c.json(response);
  };
}

function classifications(c, store) {
  const current = state(store);
  const auth = requireApiKey(c, current);
  if (auth) return auth;
  record(current, '/discovery/v2/classifications', {});
  save(store, current);
  const items = [
    {
      _links: { self: { href: '/discovery/v2/classifications/KZFzniwnSyZfZ7v7nJ?locale=en-us' } },
      segment: {
        id: 'KZFzniwnSyZfZ7v7nJ',
        name: 'Music',
        _embedded: { genres: [{ id: 'KnvZfZ7vAeA', name: 'Rock', _embedded: { subgenres: [{ id: 'KZazBEonSMnZfZ7v6F1', name: 'Pop' }] } }] },
      },
    },
    {
      _links: { self: { href: '/discovery/v2/classifications/KZFzniwnSyZfZ7v7nE?locale=en-us' } },
      segment: {
        id: 'KZFzniwnSyZfZ7v7nE',
        name: 'Sports',
        _embedded: { genres: [{ id: 'KnvZfZ7vAdt', name: 'Golf', _embedded: { subgenres: [{ id: 'KZazBEonSMnZfZ7vFI7', name: 'PGA Tour' }] } }] },
      },
    },
  ];
  return c.json(collectionResponse('classifications', items, c, 'classifications'));
}

function suggest(c, store) {
  const current = state(store);
  const auth = requireApiKey(c, current);
  if (auth) return auth;
  const keyword = query(c, 'keyword');
  record(current, '/discovery/v2/suggest', { keyword });
  save(store, current);
  return c.json({
    _links: { self: { href: '/discovery/v2/suggest.json' } },
    _embedded: {
      events: Object.values(current.events).filter((item) => includes(item.name, keyword)).slice(0, 5),
      attractions: Object.values(current.attractions).filter((item) => includes(item.name, keyword)).slice(0, 5),
      venues: Object.values(current.venues).filter((item) => includes(item.name, keyword)).slice(0, 5),
    },
  });
}

function registerTicketmasterRoutes(app, store) {
  for (const suffix of ['', '.json']) {
    app.get(`/discovery/v2/events${suffix}`, (c) => searchEvents(c, store));
    app.get(`/discovery/v2/venues${suffix}`, (c) => searchCollection('venues', 'venues', 'venues', (item, c2) => !query(c2, 'countryCode') || item.country?.countryCode === query(c2, 'countryCode'))(c, store));
    app.get(`/discovery/v2/attractions${suffix}`, (c) => searchCollection('attractions', 'attractions', 'attractions')(c, store));
    app.get(`/discovery/v2/classifications${suffix}`, (c) => classifications(c, store));
    app.get(`/discovery/v2/suggest${suffix}`, (c) => suggest(c, store));
    app.get(`/discovery/v2/events/:id/images${suffix}`, (c) => images(c, store));
    app.get(`/discovery/v2/events/:id${suffix}`, (c) => detail('events', '/discovery/v2/events/:id')(c, store));
    app.get(`/discovery/v2/venues/:id${suffix}`, (c) => detail('venues', '/discovery/v2/venues/:id')(c, store));
    app.get(`/discovery/v2/attractions/:id${suffix}`, (c) => detail('attractions', '/discovery/v2/attractions/:id')(c, store));
  }
}

export const contract = {
  provider: 'ticketmaster',
  source: 'Ticketmaster Discovery API v2 documentation',
  docs: 'https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/',
  baseUrl: BASE_URL,
  scope: ['events', 'event-details', 'event-images', 'venues', 'attractions', 'classifications', 'suggest'],
  fidelity: 'deterministic-subset',
};

export const plugin = {
  name: 'ticketmaster',
  register(app, store) {
    registerTicketmasterRoutes(app, store);
    app.get('/inspect/contract', (c) => c.json(contract));
    app.get('/inspect/state', (c) => c.json(state(store)));
  },
};

export const label = 'Ticketmaster Discovery API emulator';
export const endpoints = 'events, event images, attractions, venues, classifications, suggest';
export const initConfig = { ticketmaster: { apiKey: 'ticketmaster-emulator-key' } };
