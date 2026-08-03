# @api-emulator/flightradar24

Flightradar24 API provides live and historic flight positions, airport and airline lookup, flight summary, and track workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/flightradar24
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@flightradar24/api-emulator.mjs --service flightradar24
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /api/live/flight-positions/count`
- `GET /api/static/airports/:code/light`
- `GET /api/static/airports/:code/full`
- `GET /api/static/airlines/:icao/light`
- `GET /api/flight-tracks`
- `GET /api/flight-summary/light`
- `GET /api/flight-summary/full`
- `GET /api/flight-summary/count`
- `GET /flightradar24/inspect/state`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
flightradar24:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://fr24api.flightradar24.com/docs/endpoints/overview)
- [api-emulator](https://github.com/jsj/api-emulator)
