# @api-emulator/lexis

Lexis provides legal research APIs for sources, search, documents, folders, and Web Services API-compatible aliases.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/lexis
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@lexis/api-emulator.mjs --service lexis
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /v1/me`
- `GET /v1/sources`
- `POST /v1/search`
- `GET /v1/documents/:documentId`
- `GET /v1/folders`
- `POST /v1/folders`
- `GET /wsapi/rest/sources`
- `POST /wsapi/rest/search`
- `GET /wsapi/rest/documents/:documentId`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
lexis:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.lexisnexis.com/en-us/products/lexis-api.page)
- [api-emulator](https://github.com/jsj/api-emulator)
