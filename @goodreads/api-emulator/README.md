# @api-emulator/goodreads

Goodreads provides historical XML APIs for book search, book details, authors, and user review lists.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/goodreads
```

## Run

```bash
npx -p api-emulator api --plugin ./@goodreads/api-emulator.mjs --service goodreads
```

## Fidelity

- Tier: `smoke-only`
- Evidence: direct smoke test exists; no conformance manifest yet

## Endpoints

- `GET /search/index.xml`
- `GET /book/show/:id.xml`
- `GET /author/show/:id.xml`
- `GET /review/list/:userId.xml`
- `GET /goodreads/inspect/state`
- `GET /api`

## Auth

Uses fake local credentials only; provide any deterministic bearer token or API key expected by the client under test.

## Seed Configuration

```yaml
goodreads:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.goodreads.com/api)
- [api-emulator](https://github.com/jsj/api-emulator)
