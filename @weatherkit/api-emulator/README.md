# @api-emulator/weatherkit

Apple WeatherKit REST API provides availability, current weather, forecasts, and weather alerts.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/weatherkit
```

## Run

```bash
npx -p api-emulator api --plugin ./@weatherkit/api-emulator.mjs --service weatherkit
```

## Fidelity

- Tier: `smoke-only`
- Evidence: direct smoke test exists; no conformance manifest yet

## Endpoints

- `GET /api/v1/availability/:latitude/:longitude`
- `GET /api/v1/weather/:language/:latitude/:longitude`
- `GET /weatherkit/inspect/state`

## Auth

No production credentials are required. Use fake local credentials in client tests.

## Seed Configuration

```yaml
weatherkit:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.apple.com/documentation/weatherkitrestapi/)
- [api-emulator](https://github.com/jsj/api-emulator)
