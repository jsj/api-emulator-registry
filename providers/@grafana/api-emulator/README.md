# @api-emulator/grafana

Grafana provides observability dashboard APIs for organizations, datasources, folders, dashboard search, and dashboard management.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/grafana
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@grafana/api-emulator.mjs --service grafana
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /api/health`
- `GET /api/org`
- `GET /api/datasources`
- `GET /api/search`
- `GET /api/dashboards/uid/:uid`
- `POST /api/dashboards/db`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
grafana:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://grafana.com/docs/grafana/latest/developers/http_api/)
- [api-emulator](https://github.com/jsj/api-emulator)
