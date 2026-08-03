# @api-emulator/nytimes

The New York Times APIs provide article search, archive, top stories, books, and public content datasets.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/nytimes
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@nytimes/api-emulator.mjs --service nytimes
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /svc/search/v2/articlesearch.json`
- `GET /svc/archive/v1/:year/:month.json`
- `GET /svc/topstories/v2/:section{.+}`
- `GET /svc/books/v3/lists/overview.json`
- `GET /svc/books/v3/lists/current/:list.json`
- `GET /fixtures/books/:isbn.svg`
- `GET /nytimes/inspect/state`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
nytimes:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.nytimes.com/apis)
- [api-emulator](https://github.com/jsj/api-emulator)
