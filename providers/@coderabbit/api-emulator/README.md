# @api-emulator/coderabbit

CodeRabbit provides code-review automation APIs for users, seats, roles, review metrics, and audit logs.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/coderabbit
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@coderabbit/api-emulator.mjs --service coderabbit
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /v1/users`
- `POST /v1/users/seats`
- `POST /v1/users/roles`
- `GET /v1/metrics/reviews`
- `GET /v1/audit-logs`
- `GET /coderabbit/inspect/state`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
coderabbit:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.coderabbit.ai/api-reference)
- [api-emulator](https://github.com/jsj/api-emulator)
