# @api-emulator/ramp

Ramp provides finance APIs for entities, users, corporate cards, transactions, reimbursements, bills, and spend controls.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/ramp
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@ramp/api-emulator.mjs --service ramp
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `POST /developer/v1/reimbursements`
- `POST /developer/v1/agent-tools/get-simplified-user-detail`
- `POST /developer/v1/agent-tools/list-users`
- `POST /developer/v1/agent-tools/get-transactions`
- `POST /developer/v1/agent-tools/get-full-transaction-metadata`
- `POST /developer/v1/agent-tools/get-reimbursements`
- `GET /v1/public/agent-tools/spec/hash`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
ramp:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.ramp.com/developer-api/v1/overview)
- [api-emulator](https://github.com/jsj/api-emulator)
