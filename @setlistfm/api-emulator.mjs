import { getState, routeError, setState } from '../scripts/provider-plugin-kit.mjs';

const STATE_KEY = 'setlistfm:state';
const BASE_URL = 'https://api.setlist.fm/rest';

function artist(mbid, name, sortName, disambiguation = '') {
  return {
    mbid,
    name,
    sortName,
    disambiguation,
    url: `https://www.setlist.fm/setlists/${name.toLowerCase().replaceAll(' ', '-')}-${mbid.slice(0, 8)}.html`,
  };
}

function country(code, name) {
  return { code, name };
}

function city(id, name, stateCode, state, countryData, lat, long) {
  return {
    id,
    name,
    stateCode,
    state,
    coords: { lat, long },
    country: countryData,
  };
}

function venue(id, name, cityData) {
  return {
    id,
    name,
    city: cityData,
    url: `https://www.setlist.fm/venue/${name.toLowerCase().replaceAll(' ', '-')}-${id}.html`,
  };
}

function song(name, extra = {}) {
  return { name, ...extra };
}

function defaultState(baseUrl = BASE_URL) {
  const us = country('US', 'United States');
  const gb = country('GB', 'United Kingdom');
  const sanFrancisco = city('5391959', 'San Francisco', 'CA', 'California', us, 37.7749, -122.4194);
  const liverpool = city('2644210', 'Liverpool', 'ENG', 'England', gb, 53.4072, -2.9917);
  const fillmore = venue('6bd6ca6e', 'The Fillmore', sanFrancisco);
  const cavern = venue('3d6b9a5', 'Cavern Club', liverpool);
  const radiohead = artist('a74b1b7f-71a5-4011-9441-d0b5e4122711', 'Radiohead', 'Radiohead');
  const beatles = artist('b10bbbfc-cf9e-42e0-be17-e2c3e1d2600d', 'The Beatles', 'Beatles, The', 'John, Paul, George and Ringo');
  const setlists = [
    {
      id: '63de4613',
      versionId: '33dfd8b9',
      eventDate: '23-04-2025',
      lastUpdated: '2025-04-24T03:17:22.000+0000',
      artist: radiohead,
      venue: fillmore,
      tour: { name: 'Emulator Sessions' },
      sets: {
        set: [
          {
            name: 'Main',
            song: [
              song('Everything in Its Right Place'),
              song('Fake Plastic Trees'),
              song('No Surprises'),
            ],
          },
          { encore: 1, song: [song('Karma Police')] },
        ],
      },
      info: 'Deterministic setlist.fm emulator fixture.',
      url: 'https://www.setlist.fm/setlist/radiohead/2025/the-fillmore-san-francisco-ca-63de4613.html',
    },
    {
      id: '2bd6a842',
      versionId: '7bc70d24',
      eventDate: '09-02-1961',
      lastUpdated: '2025-01-03T19:12:00.000+0000',
      artist: beatles,
      venue: cavern,
      tour: { name: 'Cavern Club Residency' },
      sets: {
        set: [
          {
            name: 'Main',
            song: [
              song('Some Other Guy'),
              song('Please Please Me'),
              song('Love Me Do'),
            ],
          },
        ],
      },
      url: 'https://www.setlist.fm/setlist/the-beatles/1961/cavern-club-liverpool-england-2bd6a842.html',
    },
  ];
  return {
    baseUrl,
    acceptedApiKeys: ['setlistfm-emulator-key', 'demo-key'],
    requests: [],
    users: {
      emulator: { userId: 'emulator', fullname: 'Setlist Emulator', url: 'https://www.setlist.fm/user/emulator' },
    },
    artists: { [radiohead.mbid]: radiohead, [beatles.mbid]: beatles },
    countries: { US: us, GB: gb },
    cities: { [sanFrancisco.id]: sanFrancisco, [liverpool.id]: liverpool },
    venues: { [fillmore.id]: fillmore, [cavern.id]: cavern },
    setlists,
  };
}

const state = (store) => getState(store, STATE_KEY, () => defaultState());
const save = (store, next) => setState(store, STATE_KEY, next);

export function seedFromConfig(store, baseUrl = BASE_URL, config = {}) {
  const seeded = defaultState(baseUrl);
  return save(store, {
    ...seeded,
    ...config,
    acceptedApiKeys: config.acceptedApiKeys ?? seeded.acceptedApiKeys,
    users: { ...seeded.users, ...(config.users ?? {}) },
    artists: { ...seeded.artists, ...(config.artists ?? {}) },
    countries: { ...seeded.countries, ...(config.countries ?? {}) },
    cities: { ...seeded.cities, ...(config.cities ?? {}) },
    venues: { ...seeded.venues, ...(config.venues ?? {}) },
    setlists: config.setlists ?? seeded.setlists,
  });
}

function query(c, name, fallback = '') {
  return c.req.query?.(name) ?? fallback;
}

function param(c, name) {
  return c.req.param?.(name);
}

function header(c, name) {
  return c.req.header?.(name) ?? c.req.header?.(name.toLowerCase()) ?? '';
}

function requireAuth(c, current) {
  const value = header(c, 'x-api-key');
  if (!value || current.acceptedApiKeys.includes(value)) return null;
  return routeError(c, 'Invalid API key.', 401, 'invalid_api_key');
}

function record(current, endpoint, params = {}) {
  current.requests.push({ endpoint, params, requestedAt: new Date().toISOString() });
}

function pageResult(items, c, key) {
  const page = Math.max(1, Number(query(c, 'p', '1')) || 1);
  const itemsPerPage = 20;
  const offset = (page - 1) * itemsPerPage;
  return {
    type: key,
    itemsPerPage,
    page,
    total: items.length,
    [key]: items.slice(offset, offset + itemsPerPage),
  };
}

function textMatch(value, needle) {
  return !needle || String(value ?? '').toLowerCase().includes(String(needle).toLowerCase());
}

function setlistMatch(setlist, c) {
  return (
    textMatch(setlist.artist.name, query(c, 'artistName')) &&
    textMatch(setlist.artist.mbid, query(c, 'artistMbid')) &&
    textMatch(setlist.venue.name, query(c, 'venueName')) &&
    textMatch(setlist.venue.city.name, query(c, 'cityName')) &&
    textMatch(setlist.venue.city.country.code, query(c, 'countryCode')) &&
    textMatch(setlist.eventDate.slice(-4), query(c, 'year')) &&
    textMatch(setlist.tour?.name, query(c, 'tourName'))
  );
}

function withState(handler) {
  return (c, store) => {
    const current = state(store);
    const auth = requireAuth(c, current);
    if (auth) return auth;
    return handler(c, current, store);
  };
}

function notFound(c, resource) {
  return routeError(c, `${resource} not found.`, 404, 'not_found');
}

function registerSetlistfmRoutes(app, store) {
  app.get('/1.0/artist/:mbid', (c) =>
    withState((ctx, current) => {
      const mbid = param(ctx, 'mbid');
      record(current, '/1.0/artist/:mbid', { mbid });
      save(store, current);
      return current.artists[mbid] ? ctx.json(current.artists[mbid]) : notFound(ctx, 'Artist');
    })(c, store),
  );

  app.get('/1.0/artist/:mbid/setlists', (c) =>
    withState((ctx, current) => {
      const mbid = param(ctx, 'mbid');
      const matches = current.setlists.filter((item) => item.artist.mbid === mbid);
      record(current, '/1.0/artist/:mbid/setlists', { mbid, p: query(ctx, 'p', '1') });
      save(store, current);
      return ctx.json(pageResult(matches, ctx, 'setlist'));
    })(c, store),
  );

  app.get('/1.0/city/:geoId', (c) =>
    withState((ctx, current) => {
      const geoId = param(ctx, 'geoId');
      record(current, '/1.0/city/:geoId', { geoId });
      save(store, current);
      return current.cities[geoId] ? ctx.json(current.cities[geoId]) : notFound(ctx, 'City');
    })(c, store),
  );

  app.get('/1.0/search/artists', (c) =>
    withState((ctx, current) => {
      const matches = Object.values(current.artists).filter((item) => textMatch(item.name, query(ctx, 'artistName')) || textMatch(item.sortName, query(ctx, 'artistName')));
      record(current, '/1.0/search/artists', { artistName: query(ctx, 'artistName'), p: query(ctx, 'p', '1') });
      save(store, current);
      return ctx.json(pageResult(matches, ctx, 'artist'));
    })(c, store),
  );

  app.get('/1.0/search/cities', (c) =>
    withState((ctx, current) => {
      const matches = Object.values(current.cities).filter((item) => textMatch(item.name, query(ctx, 'name')) && textMatch(item.country.code, query(ctx, 'country')));
      record(current, '/1.0/search/cities', { name: query(ctx, 'name'), country: query(ctx, 'country') });
      save(store, current);
      return ctx.json(pageResult(matches, ctx, 'city'));
    })(c, store),
  );

  app.get('/1.0/search/countries', (c) =>
    withState((ctx, current) => {
      record(current, '/1.0/search/countries');
      save(store, current);
      return ctx.json(pageResult(Object.values(current.countries), ctx, 'country'));
    })(c, store),
  );

  app.get('/1.0/search/setlists', (c) =>
    withState((ctx, current) => {
      const matches = current.setlists.filter((item) => setlistMatch(item, ctx));
      record(current, '/1.0/search/setlists', { artistName: query(ctx, 'artistName'), venueName: query(ctx, 'venueName'), p: query(ctx, 'p', '1') });
      save(store, current);
      return ctx.json(pageResult(matches, ctx, 'setlist'));
    })(c, store),
  );

  app.get('/1.0/search/venues', (c) =>
    withState((ctx, current) => {
      const matches = Object.values(current.venues).filter((item) => textMatch(item.name, query(ctx, 'name')) && textMatch(item.city.name, query(ctx, 'cityName')));
      record(current, '/1.0/search/venues', { name: query(ctx, 'name'), cityName: query(ctx, 'cityName') });
      save(store, current);
      return ctx.json(pageResult(matches, ctx, 'venue'));
    })(c, store),
  );

  app.get('/1.0/setlist/version/:versionId', (c) =>
    withState((ctx, current) => {
      const versionId = param(ctx, 'versionId');
      record(current, '/1.0/setlist/version/:versionId', { versionId });
      save(store, current);
      const found = current.setlists.find((item) => item.versionId === versionId);
      return found ? ctx.json(found) : notFound(ctx, 'Setlist version');
    })(c, store),
  );

  app.get('/1.0/setlist/:setlistId', (c) =>
    withState((ctx, current) => {
      const setlistId = param(ctx, 'setlistId');
      record(current, '/1.0/setlist/:setlistId', { setlistId });
      save(store, current);
      const found = current.setlists.find((item) => item.id === setlistId);
      return found ? ctx.json(found) : notFound(ctx, 'Setlist');
    })(c, store),
  );

  app.get('/1.0/user/:userId', (c) =>
    withState((ctx, current) => {
      const userId = param(ctx, 'userId');
      record(current, '/1.0/user/:userId', { userId });
      save(store, current);
      return current.users[userId] ? ctx.json(current.users[userId]) : notFound(ctx, 'User');
    })(c, store),
  );

  app.get('/1.0/user/:userId/attended', (c) =>
    withState((ctx, current) => {
      record(current, '/1.0/user/:userId/attended', { userId: param(ctx, 'userId') });
      save(store, current);
      return ctx.json(pageResult(current.setlists.slice(0, 1), ctx, 'setlist'));
    })(c, store),
  );

  app.get('/1.0/user/:userId/edited', (c) =>
    withState((ctx, current) => {
      record(current, '/1.0/user/:userId/edited', { userId: param(ctx, 'userId') });
      save(store, current);
      return ctx.json(pageResult(current.setlists, ctx, 'setlist'));
    })(c, store),
  );

  app.get('/1.0/venue/:venueId', (c) =>
    withState((ctx, current) => {
      const venueId = param(ctx, 'venueId');
      record(current, '/1.0/venue/:venueId', { venueId });
      save(store, current);
      return current.venues[venueId] ? ctx.json(current.venues[venueId]) : notFound(ctx, 'Venue');
    })(c, store),
  );

  app.get('/1.0/venue/:venueId/setlists', (c) =>
    withState((ctx, current) => {
      const venueId = param(ctx, 'venueId');
      const matches = current.setlists.filter((item) => item.venue.id === venueId);
      record(current, '/1.0/venue/:venueId/setlists', { venueId, p: query(ctx, 'p', '1') });
      save(store, current);
      return ctx.json(pageResult(matches, ctx, 'setlist'));
    })(c, store),
  );
}

export const contract = {
  provider: 'setlistfm',
  source: 'setlist.fm API 1.0 documentation and Swagger resource list',
  docs: 'https://api.setlist.fm/docs/1.0/index.html',
  baseUrl: BASE_URL,
  auth: 'x-api-key header',
  scope: ['artists', 'cities', 'countries', 'venues', 'setlists', 'users'],
  fidelity: 'deterministic-json-subset',
};

export const plugin = {
  name: 'setlistfm',
  register(app, store) {
    registerSetlistfmRoutes(app, store);
    app.get('/inspect/contract', (c) => c.json(contract));
    app.get('/inspect/state', (c) => c.json(state(store)));
  },
};

export const label = 'setlist.fm API emulator';
export const endpoints = 'artist lookup, city lookup, venue lookup, setlist lookup, search artists/cities/countries/venues/setlists, user attended/edited setlists';
export const initConfig = { setlistfm: { apiKey: 'setlistfm-emulator-key' } };
export default plugin;
