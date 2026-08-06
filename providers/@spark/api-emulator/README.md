# @api-emulator/spark

Apache Spark provides monitoring and standalone submission REST APIs for applications, jobs, stages, executors, and drivers.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/spark
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@spark/api-emulator.mjs --service spark
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

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

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
spark:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://spark.apache.org/docs/latest/monitoring.html#rest-api)
- [api-emulator](https://github.com/jsj/api-emulator)
