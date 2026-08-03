# @api-emulator/databricks

Databricks provides workspace, cluster, job, run, SQL warehouse, and SQL statement APIs for lakehouse automation.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/databricks
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@databricks/api-emulator.mjs --service databricks
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

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

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
databricks:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.databricks.com/api/workspace/introduction)
- [api-emulator](https://github.com/jsj/api-emulator)
