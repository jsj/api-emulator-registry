# @api-emulator/greptile

Greptile provides AI codebase indexing, semantic search, and repository question-answering APIs.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/greptile
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@greptile/api-emulator.mjs --service greptile
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `POST /v2/repositories`
- `GET /v2/repositories/:repositoryId`
- `POST /v2/query`
- `POST /v2/search`
- `GET /greptile/inspect/state`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
greptile:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.greptile.com/docs/api-reference/introduction)
- [api-emulator](https://github.com/jsj/api-emulator)
