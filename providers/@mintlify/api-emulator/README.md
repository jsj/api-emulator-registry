# @api-emulator/mintlify

Mintlify provides documentation deployment, preview, assistant, search, page content, and analytics APIs.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/mintlify
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@mintlify/api-emulator.mjs --service mintlify
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /v1/agent/:projectId/jobs`
- `POST /v2/agent/:projectId/job/:id/message`
- `GET /v1/analytics/feedback`
- `GET /v1/analytics/feedback-by-page`
- `GET /v1/analytics/assistant-conversations`
- `GET /v1/analytics/assistant-caller-stats`
- `GET /v1/analytics/searches`
- `GET /v1/analytics/views`
- `GET /v1/analytics/visitors`
- `GET /mintlify/inspect/contract`
- `GET /mintlify/inspect/state`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
mintlify:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.mintlify.com/docs/api/introduction)
- [api-emulator](https://github.com/jsj/api-emulator)
