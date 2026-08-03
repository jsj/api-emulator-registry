# @api-emulator/setlistfm

setlist.fm provides artist, venue, city, country, user, and setlist lookup and search APIs.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/setlistfm
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@setlistfm/api-emulator.mjs --service setlistfm
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /1.0/artist/:mbid`
- `GET /1.0/artist/:mbid/setlists`
- `GET /1.0/city/:geoId`
- `GET /1.0/search/artists`
- `GET /1.0/search/cities`
- `GET /1.0/search/countries`
- `GET /1.0/search/setlists`
- `GET /1.0/search/venues`
- `GET /1.0/setlist/version/:versionId`
- `GET /1.0/setlist/:setlistId`
- `GET /1.0/user/:userId`
- `GET /1.0/user/:userId/attended`
- `GET /1.0/user/:userId/edited`
- `GET /1.0/venue/:venueId`
- `GET /1.0/venue/:venueId/setlists`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
setlistfm:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://api.setlist.fm/docs/1.0/index.html)
- [api-emulator](https://github.com/jsj/api-emulator)
