# @api-emulator/skyscanner

Skyscanner Travel APIs provide flights live search sessions, itinerary pricing, and refresh polling workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/skyscanner
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@skyscanner/api-emulator.mjs --service skyscanner
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `POST /apiservices/v3/flights/live/search/create`
- `POST /apiservices/v3/flights/live/search/poll/:sessionToken`
- `POST /apiservices/v3/flights/live/itineraryrefresh/create/:sessionToken`
- `GET /apiservices/v3/flights/live/itineraryrefresh/poll/:refreshSessionToken`
- `GET /skyscanner/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
skyscanner:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developers.skyscanner.net/api/flights-live-pricing)
- [api-emulator](https://github.com/jsj/api-emulator)
