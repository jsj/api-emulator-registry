# @api-emulator/lucent

Lucent provides session replay SDK APIs for public-key validation, browser replay ingestion, and session capture workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/lucent
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@lucent/api-emulator.mjs --service lucent
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `POST /api/sdk/init`
- `POST /api/sdk/replay`
- `GET /api/sdk/replays`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
lucent:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.lucenthq.com)
- [api-emulator](https://github.com/jsj/api-emulator)
