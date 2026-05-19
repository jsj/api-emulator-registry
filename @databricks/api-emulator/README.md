# @api-emulator/databricks

Databricks emulator for workspace identity, cluster, job, workspace, and SQL statement REST APIs.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/databricks
```

## Run

```bash
npx -p api-emulator api --plugin ./@databricks/api-emulator.mjs --service databricks
```

## Endpoints

- `GET /api/2.0/preview/scim/v2/Me` — returns the current fake workspace user
- `GET /api/2.0/clusters/list` — lists seeded clusters
- `GET /api/2.1/jobs/list` — lists jobs
- `POST /api/2.1/jobs/create` — creates a job
- `POST /api/2.1/jobs/run-now` — creates a completed run
- `GET /api/2.1/jobs/runs/get` — fetches a run
- `GET /api/2.0/workspace/list` — lists workspace objects
- `GET /api/2.0/sql/warehouses` — lists SQL warehouses
- `POST /api/2.0/sql/statements` — executes a deterministic SQL statement

## Auth

Use any fake bearer token, for example `Authorization: Bearer dapi-emulator`. CLI and SDK smoke tests should point `DATABRICKS_HOST` at the emulator and use `DATABRICKS_TOKEN=dapi-emulator`.

## Seed Configuration

```yaml
databricks:
  currentUser:
    userName: emulator_user
  clusters:
    - cluster_id: dbc-cluster-0001
      state: RUNNING
```

## Links

- [Databricks REST API reference](https://docs.databricks.com/api/workspace/introduction)
- [Databricks CLI](https://docs.databricks.com/aws/en/dev-tools/cli/)
- [api-emulator](https://github.com/jsj/api-emulator)
