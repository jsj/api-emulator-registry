# @api-emulator/setlistfm

Local emulator for the setlist.fm API 1.0 artist, venue, city, country, user, and setlist lookup/search endpoints.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/setlistfm
```

## Run

```bash
npx -p api-emulator api --plugin ./@setlistfm/api-emulator.mjs --service setlistfm
```

## Endpoints

- `GET /1.0/artist/:mbid` — returns an artist by MusicBrainz MBID
- `GET /1.0/artist/:mbid/setlists` — returns paginated setlists for an artist
- `GET /1.0/city/:geoId` — returns a city by GeoNames ID
- `GET /1.0/search/artists` — searches artists by `artistName`
- `GET /1.0/search/cities` — searches cities by `name` and `country`
- `GET /1.0/search/countries` — lists countries
- `GET /1.0/search/setlists` — searches setlists by artist, venue, city, country, year, or tour
- `GET /1.0/search/venues` — searches venues by `name` and `cityName`
- `GET /1.0/setlist/version/:versionId` — returns a setlist version
- `GET /1.0/setlist/:setlistId` — returns a setlist
- `GET /1.0/user/:userId` — returns a user
- `GET /1.0/user/:userId/attended` — returns attended setlists
- `GET /1.0/user/:userId/edited` — returns edited setlists
- `GET /1.0/venue/:venueId` — returns a venue
- `GET /1.0/venue/:venueId/setlists` — returns paginated venue setlists
- `GET /inspect/state` — returns emulator state

## Auth

Use the `x-api-key` header with `setlistfm-emulator-key` or `demo-key`. Missing keys are accepted for local compatibility; unknown keys return `401`.

## Seed Configuration

```yaml
setlistfm:
  apiKey: setlistfm-emulator-key
  acceptedApiKeys:
    - setlistfm-emulator-key
```

## Links

- [Official API docs](https://api.setlist.fm/docs/1.0/index.html)
- [api-emulator](https://github.com/jsj/api-emulator)
