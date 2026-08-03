# @api-emulator/concur

SAP Concur provides travel and expense APIs for users, expense reports, entries, receipts, and travel requests.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/concur
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@concur/api-emulator.mjs --service concur
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /oauth2/v0/userinfo`
- `POST /api/v3.0/expense/reports`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
concur:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.concur.com/api-reference/)
- [api-emulator](https://github.com/jsj/api-emulator)
