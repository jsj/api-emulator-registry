# @api-emulator/spark

Apache Spark emulator for Spark UI monitoring APIs and the standalone REST submission API.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/spark
```

## Run

```bash
npx -p api-emulator api --plugin ./@spark/api-emulator.mjs --service spark
```

## Endpoints

- `GET /api/v1/applications` — lists Spark applications
- `GET /api/v1/applications/:appId/jobs` — lists jobs for an application
- `GET /api/v1/applications/:appId/stages` — lists stages for an application
- `GET /api/v1/applications/:appId/executors` — returns driver executor metadata
- `GET /api/v1/applications/:appId/environment` — returns Spark environment properties
- `POST /v1/submissions/create` — creates a deterministic standalone driver submission
- `GET /v1/submissions/status/:driverId` — returns driver state
- `POST /v1/submissions/kill/:driverId` — marks a driver as killed

## Auth

The implemented Spark endpoints are unauthenticated, matching the default local Spark UI and standalone submission APIs. Use localhost-only bindings in tests.

## Seed Configuration

```yaml
spark:
  applications:
    - id: app-202605190001
      name: api-emulator-spark
```

## Links

- [Apache Spark monitoring REST API](https://spark.apache.org/docs/latest/monitoring.html#rest-api)
- [api-emulator](https://github.com/jsj/api-emulator)
