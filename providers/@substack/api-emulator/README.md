# @api-emulator/substack

Substack-compatible APIs provide publication metadata, newsletter posts, drafts, and subscribers.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/substack
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@substack/api-emulator.mjs --service substack
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /api/v1/publication`
- `GET /api/v1/posts`
- `GET /api/v1/posts/:id`
- `POST /api/v1/posts`
- `PATCH /api/v1/posts/:id`
- `DELETE /api/v1/posts/:id`
- `GET /api/v1/subscribers`
- `POST /api/v1/subscribers`
- `GET /api/v1/posts/:id/comments`
- `POST /api/v1/posts/:id/comments`
- `GET /api/v1/recommendations`
- `GET /substack/inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
substack:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://substack-api.readthedocs.io/)
- [api-emulator](https://github.com/jsj/api-emulator)
