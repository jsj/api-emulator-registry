# @api-emulator/google-maps

Google Maps Places APIs provide text search, nearby search, autocomplete, details, and field-mask workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/google-maps
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@google-maps/api-emulator.mjs --service google-maps
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `POST /v1/places:searchText`
- `POST /v1/places:searchNearby`
- `POST /v1/places:autocomplete`
- `GET /v1/places/:placeId/photos/:photoId/media`
- `GET /v1/places/:placeId`
- `GET /google-maps/inspect/state`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
google-maps:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developers.google.com/maps/documentation/places/web-service/reference/rest)
- [api-emulator](https://github.com/jsj/api-emulator)
