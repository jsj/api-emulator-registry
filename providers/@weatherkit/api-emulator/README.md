# @api-emulator/weatherkit

Apple WeatherKit REST API provides availability, current weather, forecasts, and weather alerts.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/weatherkit
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@weatherkit/api-emulator.mjs --service weatherkit
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /api/v1/availability/:latitude/:longitude`
- `GET /api/v1/weather/:language/:latitude/:longitude`
- `GET /weatherkit/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
weatherkit:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.apple.com/documentation/weatherkitrestapi/)
- [api-emulator](https://github.com/jsj/api-emulator)
