# @api-emulator/harvey

Harvey provides legal AI APIs for vault projects, documents, search, and legal-grade completions.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/harvey
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@harvey/api-emulator.mjs --service harvey
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /api/v1/vault/workspace/projects`
- `GET /api/v1/vault/projects/:projectId/documents`
- `GET /api/v1/vault/documents/:documentId`
- `POST /api/v1/vault/search`
- `POST /api/v1/completion`
- `POST /v2/completion`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
harvey:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developers.harvey.ai/guides/introduction)
- [api-emulator](https://github.com/jsj/api-emulator)
