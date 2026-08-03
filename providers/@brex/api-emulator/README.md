# @api-emulator/brex

Brex provides spend-management APIs for vendors, users, payments, and team workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/brex
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@brex/api-emulator.mjs --service brex
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /v1/vendors`
- `POST /v1/vendors`
- `GET /v1/vendors/:vendorId`
- `PUT /v1/vendors/:vendorId`
- `DELETE /v1/vendors/:vendorId`
- `GET /v2/users/me`
- `GET /v2/users`
- `GET /v2/users/:userId`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
brex:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.brex.com/)
- [api-emulator](https://github.com/jsj/api-emulator)
