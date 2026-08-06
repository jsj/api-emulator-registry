# @api-emulator/datadog

Datadog provides observability APIs for metrics, monitors, logs, traces, hosts, dashboards, and events.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/datadog
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@datadog/api-emulator.mjs --service datadog
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /api/v1/validate`
- `GET /api/v1/hosts`
- `GET /api/v1/monitor`
- `GET /api/v1/monitor/:id`
- `POST /api/v1/monitor`
- `GET /api/v2/metrics`
- `POST /api/v1/series`
- `GET /inspect/contract`
- `GET /inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
datadog:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.datadoghq.com/api/latest/)
- [api-emulator](https://github.com/jsj/api-emulator)
