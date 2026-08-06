# @api-emulator/flightradar24

Flightradar24 API provides live and historic flight positions, airport and airline lookup, flight summary, and track workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/flightradar24
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@flightradar24/api-emulator.mjs --service flightradar24
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /api/live/flight-positions/count`
- `GET /api/static/airports/:code/light`
- `GET /api/static/airports/:code/full`
- `GET /api/static/airlines/:icao/light`
- `GET /api/flight-tracks`
- `GET /api/flight-summary/light`
- `GET /api/flight-summary/full`
- `GET /api/flight-summary/count`
- `GET /flightradar24/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
flightradar24:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://fr24api.flightradar24.com/docs/endpoints/overview)
- [api-emulator](https://github.com/jsj/api-emulator)
