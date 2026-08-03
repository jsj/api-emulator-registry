# @api-emulator/datadog

Datadog provides observability APIs for metrics, monitors, logs, traces, hosts, dashboards, and events.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/datadog
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@datadog/api-emulator.mjs --service datadog
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /api/v1/validate`
- `GET /api/v1/hosts`
- `GET /api/v1/monitor`
- `GET /api/v1/monitor/:id`
- `POST /api/v1/monitor`
- `GET /api/v2/metrics`
- `POST /api/v1/series`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
datadog:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.datadoghq.com/api/latest/)
- [api-emulator](https://github.com/jsj/api-emulator)
