# @api-emulator/nextdoor

Nextdoor provides neighborhood social APIs for member profiles, publishing posts, and local search workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/nextdoor
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@nextdoor/api-emulator.mjs --service nextdoor
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /me`
- `GET /me/profiles`
- `GET /posts`
- `POST /posts`
- `GET /posts/:id`
- `GET /search-posts`
- `GET /search/posts`
- `GET /search-businesses`
- `GET /search/businesses`
- `GET /nextdoor/inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
nextdoor:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.nextdoor.com/reference/me-1)
- [api-emulator](https://github.com/jsj/api-emulator)
