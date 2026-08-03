# @api-emulator/skyscanner

Skyscanner Travel APIs provide flights live search sessions, itinerary pricing, and refresh polling workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/skyscanner
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@skyscanner/api-emulator.mjs --service skyscanner
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `POST /apiservices/v3/flights/live/search/create`
- `POST /apiservices/v3/flights/live/search/poll/:sessionToken`
- `POST /apiservices/v3/flights/live/itineraryrefresh/create/:sessionToken`
- `GET /apiservices/v3/flights/live/itineraryrefresh/poll/:refreshSessionToken`
- `GET /skyscanner/inspect/state`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
skyscanner:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developers.skyscanner.net/api/flights-live-pricing)
- [api-emulator](https://github.com/jsj/api-emulator)
