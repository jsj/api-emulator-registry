# @api-emulator/apple-maps

Apple Maps Server API provides map tokens, search, geocoding, and reverse geocoding for location-aware apps.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/apple-maps
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@apple-maps/api-emulator.mjs --service apple-maps
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /v1/token`
- `GET /v1/search`
- `GET /v1/geocode`
- `GET /v1/reverseGeocode`
- `GET /apple-maps/inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
apple-maps:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.apple.com/documentation/applemapsserverapi/)
- [api-emulator](https://github.com/jsj/api-emulator)
