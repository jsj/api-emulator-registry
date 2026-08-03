# @api-emulator/spark

Apache Spark provides monitoring and standalone submission REST APIs for applications, jobs, stages, executors, and drivers.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/spark
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@spark/api-emulator.mjs --service spark
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

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

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
spark:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://spark.apache.org/docs/latest/monitoring.html#rest-api)
- [api-emulator](https://github.com/jsj/api-emulator)
