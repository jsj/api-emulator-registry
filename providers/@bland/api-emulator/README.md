# @api-emulator/bland

Bland provides voice AI APIs for account details, outbound calls, call logs, pathways, and agent tools.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/bland
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@bland/api-emulator.mjs --service bland
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /v1/me`
- `GET /v1/calls`
- `GET /v1/active`
- `POST /v1/calls`
- `GET /v1/calls/:id`
- `POST /v1/calls/:id/analyze`
- `GET /v1/calls/:id/recording`
- `POST /v1/calls/:id/stop`
- `GET /v1/all_pathways`
- `POST /v1/pathways`
- `GET /v1/pathway/:id`
- `GET /v2/tools`
- `POST /v2/tools`
- `GET /v2/batches`
- `POST /v2/batches`
- `GET /v2/batches/:id`
- `POST /v2/batches/:id/stop`
- `GET /v1/contacts`
- `POST /v1/contacts/resolve`
- `GET /v1/inbound`
- `GET /v1/inbound/:phoneNumber`
- `GET /bland/inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
bland:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.bland.ai/llms.txt)
- [api-emulator](https://github.com/jsj/api-emulator)
