# @api-emulator/x

X API provides OAuth, users, tweets, timelines, and social publishing workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/x
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@x/api-emulator.mjs --service x
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `POST /2/oauth2/token`
- `GET /2/users/me`
- `GET /2/users/:id`
- `GET /2/users/:id/tweets`
- `GET /2/tweets`
- `POST /2/tweets`
- `GET /x/inspect/state`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
x:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.x.com/en/docs/x-api)
- [api-emulator](https://github.com/jsj/api-emulator)
