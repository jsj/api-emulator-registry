# @api-emulator/databricks

Databricks provides workspace, cluster, job, run, SQL warehouse, and SQL statement APIs for lakehouse automation.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/databricks
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@databricks/api-emulator.mjs --service databricks
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /api/2.0/preview/scim/v2/Me`
- `GET /api/2.0/clusters/list`
- `GET /api/2.0/clusters/get`
- `GET /api/2.1/jobs/list`
- `GET /api/2.0/jobs/list`
- `POST /api/2.1/jobs/create`
- `POST /api/2.1/jobs/run-now`
- `GET /api/2.1/jobs/runs/get`
- `GET /api/2.0/workspace/list`
- `GET /api/2.0/sql/warehouses`
- `POST /api/2.0/sql/statements`
- `GET /api/2.0/sql/statements/:statementId`
- `GET /api/2.1/unity-catalog/tables`
- `GET /inspect/contract`
- `GET /inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
databricks:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.databricks.com/api/workspace/introduction)
- [api-emulator](https://github.com/jsj/api-emulator)
