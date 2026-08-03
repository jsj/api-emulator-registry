# @api-emulator/reducto

Reducto provides document parsing, extraction, splitting, upload, pipeline, webhook, and asynchronous job APIs.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/reducto
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@reducto/api-emulator.mjs --service reducto
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /version`
- `POST /upload`
- `POST /parse`
- `POST /parse_async`
- `POST /extract`
- `POST /extract_async`
- `POST /split`
- `POST /split_async`
- `POST /edit`
- `POST /edit_async`
- `POST /classify`
- `POST /pipeline`
- `POST /pipeline_async`
- `GET /job/:job_id`
- `GET /jobs`
- `POST /cancel/:job_id`
- `POST /configure_webhook`
- `GET /inspect/contract`
- `GET /inspect/state`
- `POST /inspect/reset`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
reducto:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.reducto.ai/sdk/python/overview)
- [api-emulator](https://github.com/jsj/api-emulator)
