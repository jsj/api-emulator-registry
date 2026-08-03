# @api-emulator/congress

Congress.gov API v3 provides bill listing and bill detail APIs for legislative research workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/congress
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@congress/api-emulator.mjs --service congress
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /inspect/contract`
- `GET /v3/bill`
- `GET /v3/bill/:congress/:billType`
- `GET /v3/bill/:congress/:billType/:billNumber`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
congress:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://api.congress.gov/)
- [api-emulator](https://github.com/jsj/api-emulator)
