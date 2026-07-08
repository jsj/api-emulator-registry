# @api-emulator/setlistfm

setlist.fm provides artist, venue, city, country, user, and setlist lookup and search APIs.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/setlistfm
```

## Run

```bash
npx -p api-emulator api --plugin ./@setlistfm/api-emulator.mjs --service setlistfm
```

## Fidelity

- Tier: `smoke-only`
- Evidence: direct smoke test exists; no conformance manifest yet

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

## Auth

Uses fake local credentials only; provide any deterministic bearer token or API key expected by the client under test.

## Seed Configuration

```yaml
setlistfm:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://api.setlist.fm/docs/1.0/index.html)
- [api-emulator](https://github.com/jsj/api-emulator)
