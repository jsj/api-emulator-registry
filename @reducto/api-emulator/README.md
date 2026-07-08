# @api-emulator/reducto

Reducto provides document parsing, extraction, splitting, upload, pipeline, webhook, and asynchronous job APIs.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/reducto
```

## Run

```bash
npx -p api-emulator api --plugin ./@reducto/api-emulator.mjs --service reducto
```

## Fidelity

- Tier: `smoke-only`
- Evidence: direct smoke test exists; no conformance manifest yet

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

## Auth

Uses fake local credentials only; provide any deterministic bearer token or API key expected by the client under test.

## Seed Configuration

```yaml
reducto:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.reducto.ai/sdk/python/overview)
- [api-emulator](https://github.com/jsj/api-emulator)
