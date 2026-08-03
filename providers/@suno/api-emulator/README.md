# @api-emulator/suno

SunoAPI-compatible APIs provide credits, asynchronous music generation tasks, record polling, and lyrics generation workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/suno
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@suno/api-emulator.mjs --service suno
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /api/v1/generate/credit`
- `POST /api/v1/generate`
- `GET /api/v1/generate/record-info`
- `POST /api/v1/generate/extend`
- `POST /api/v1/wav/generate`
- `POST /api/v1/mp4/generate`
- `POST /api/v1/lyrics`
- `GET /api/v1/lyrics/record-info`
- `GET /suno/inspect/state`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
suno:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.sunoapi.org/)
- [api-emulator](https://github.com/jsj/api-emulator)
