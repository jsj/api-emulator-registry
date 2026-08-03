# @api-emulator/devin

Devin provides AI engineering agent APIs for sessions, messages, PR reviews, users, and knowledge notes.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/devin
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@devin/api-emulator.mjs --service devin
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /v3/self`
- `GET /v3/enterprise/organizations/:orgId/members/users`
- `GET /v3/organizations/:orgId/sessions`
- `POST /v3/organizations/:orgId/sessions`
- `GET /v3/organizations/:orgId/sessions/:devinId`
- `POST /v3/organizations/:orgId/sessions/:devinId/messages`
- `GET /v3/organizations/:orgId/pr-reviews`
- `POST /v3/organizations/:orgId/pr-reviews`
- `POST /v3/organizations/:orgId/knowledge/notes`
- `GET /devin/inspect/state`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
devin:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.devin.ai/api-reference/overview)
- [api-emulator](https://github.com/jsj/api-emulator)
