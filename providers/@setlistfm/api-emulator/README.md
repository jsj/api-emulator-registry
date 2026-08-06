# @api-emulator/setlistfm

setlist.fm provides artist, venue, city, country, user, and setlist lookup and search APIs.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/setlistfm
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@setlistfm/api-emulator.mjs --service setlistfm
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

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

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
setlistfm:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://api.setlist.fm/docs/1.0/index.html)
- [api-emulator](https://github.com/jsj/api-emulator)
