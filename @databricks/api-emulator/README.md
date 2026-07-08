# @api-emulator/databricks

Databricks provides workspace, cluster, job, run, SQL warehouse, and SQL statement APIs for lakehouse automation.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/databricks
```

## Run

```bash
npx -p api-emulator api --plugin ./@databricks/api-emulator.mjs --service databricks
```

## Fidelity

- Tier: `smoke-only`
- Evidence: direct smoke test exists; no conformance manifest yet

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

## Auth

Uses fake local credentials only; provide any deterministic bearer token or API key expected by the client under test.

## Seed Configuration

```yaml
databricks:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.databricks.com/api/workspace/introduction)
- [api-emulator](https://github.com/jsj/api-emulator)
