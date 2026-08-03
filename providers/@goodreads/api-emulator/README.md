# @api-emulator/goodreads

Goodreads provides historical XML APIs for book search, book details, authors, and user review lists.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/goodreads
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@goodreads/api-emulator.mjs --service goodreads
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /search/index.xml`
- `GET /book/show/:id.xml`
- `GET /author/show/:id.xml`
- `GET /review/list/:userId.xml`
- `GET /goodreads/inspect/state`
- `GET /api`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
goodreads:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.goodreads.com/api)
- [api-emulator](https://github.com/jsj/api-emulator)
