# @api-emulator/grafana

Grafana provides observability dashboard APIs for organizations, datasources, folders, dashboard search, and dashboard management.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/grafana
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@grafana/api-emulator.mjs --service grafana
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /api/health`
- `GET /api/org`
- `GET /api/datasources`
- `GET /api/search`
- `GET /api/dashboards/uid/:uid`
- `POST /api/dashboards/db`
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
grafana:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://grafana.com/docs/grafana/latest/developers/http_api/)
- [api-emulator](https://github.com/jsj/api-emulator)
