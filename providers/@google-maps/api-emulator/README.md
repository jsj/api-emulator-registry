# @api-emulator/google-maps

Google Maps Places APIs provide text search, nearby search, autocomplete, details, and field-mask workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/google-maps
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@google-maps/api-emulator.mjs --service google-maps
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `POST /v1/places:searchText`
- `POST /v1/places:searchNearby`
- `POST /v1/places:autocomplete`
- `GET /v1/places/:placeId/photos/:photoId/media`
- `GET /v1/places/:placeId`
- `GET /google-maps/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
google-maps:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developers.google.com/maps/documentation/places/web-service/reference/rest)
- [api-emulator](https://github.com/jsj/api-emulator)
