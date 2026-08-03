# @api-emulator/weatherkit

Apple WeatherKit REST API provides availability, current weather, forecasts, and weather alerts.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/weatherkit
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@weatherkit/api-emulator.mjs --service weatherkit
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /api/v1/availability/:latitude/:longitude`
- `GET /api/v1/weather/:language/:latitude/:longitude`
- `GET /weatherkit/inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
weatherkit:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.apple.com/documentation/weatherkitrestapi/)
- [api-emulator](https://github.com/jsj/api-emulator)
