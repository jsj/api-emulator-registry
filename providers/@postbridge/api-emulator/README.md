# @api-emulator/postbridge

Post Bridge provides social media scheduling APIs for connected accounts, draft posts, scheduled posts, and publishing.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/postbridge
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@postbridge/api-emulator.mjs --service postbridge
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /v1/me`
- `GET /v1/accounts`
- `GET /v1/accounts/:id`
- `GET /v1/media`
- `POST /v1/media`
- `GET /v1/posts`
- `GET /v1/posts/:id`
- `POST /v1/posts`
- `PATCH /v1/posts/:id`
- `DELETE /v1/posts/:id`
- `POST /v1/posts/:id/publish`
- `GET /v1/analytics/posts/:id`
- `GET /postbridge/inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
postbridge:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://support.post-bridge.com/api)
- [api-emulator](https://github.com/jsj/api-emulator)
