# @api-emulator/bilt

Bilt Rewards-style APIs provide member profiles, rewards accounts, points ledger, and rent payment workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/bilt
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@bilt/api-emulator.mjs --service bilt
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /v1/member`
- `GET /v1/rewards/accounts`
- `GET /v1/rewards/ledger`
- `GET /v1/rent-payments`
- `POST /v1/rent-payments`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
bilt:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.bilt.com/rewards)
- [api-emulator](https://github.com/jsj/api-emulator)
