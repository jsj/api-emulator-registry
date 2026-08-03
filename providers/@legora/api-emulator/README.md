# @api-emulator/legora

Legora provides legal workspace APIs for matters, documents, workflows, review tables, and AI completions.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/legora
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@legora/api-emulator.mjs --service legora
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /v1/workspace`
- `GET /v1/matters`
- `POST /v1/matters`
- `GET /v1/matters/:matterId/documents`
- `POST /v1/matters/:matterId/documents`
- `GET /v1/workflows`
- `POST /v1/workflows/:workflowId/runs`
- `GET /v1/review-tables/:tableId`
- `POST /v1/chat/completions`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
legora:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://legora.com/product)
- [api-emulator](https://github.com/jsj/api-emulator)
