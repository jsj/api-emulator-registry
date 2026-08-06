# @api-emulator/apple-maps

Apple Maps Server API provides map tokens, search, geocoding, and reverse geocoding for location-aware apps.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/apple-maps
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@apple-maps/api-emulator.mjs --service apple-maps
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /v1/token`
- `GET /v1/search`
- `GET /v1/geocode`
- `GET /v1/reverseGeocode`
- `GET /apple-maps/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
apple-maps:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.apple.com/documentation/applemapsserverapi/)
- [api-emulator](https://github.com/jsj/api-emulator)
