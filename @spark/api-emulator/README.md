# @api-emulator/spark

Apache Spark provides monitoring and standalone submission REST APIs for applications, jobs, stages, executors, and drivers.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/spark
```

## Run

```bash
npx -p api-emulator api --plugin ./@spark/api-emulator.mjs --service spark
```

## Fidelity

- Tier: `smoke-only`
- Evidence: direct smoke test exists; no conformance manifest yet

## Endpoints

- `GET /api/v1/applications`
- `GET /api/v1/applications/:appId`
- `GET /api/v1/applications/:appId/jobs`
- `GET /api/v1/applications/:appId/jobs/:jobId`
- `GET /api/v1/applications/:appId/stages`
- `GET /api/v1/applications/:appId/executors`
- `GET /api/v1/applications/:appId/environment`
- `GET /api/v1/applications/:appId/sql`
- `POST /api/v1/applications/:appId/sql`
- `POST /v1/submissions/create`
- `GET /v1/submissions/status/:driverId`
- `POST /v1/submissions/kill/:driverId`
- `GET /inspect/contract`
- `GET /inspect/state`

## Auth

No production credentials are required. Use fake local credentials in client tests.

## Seed Configuration

```yaml
spark:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://spark.apache.org/docs/latest/monitoring.html#rest-api)
- [api-emulator](https://github.com/jsj/api-emulator)
