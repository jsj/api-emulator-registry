# @api-emulator/congress

Congress.gov API v3 provides bill listing and bill detail APIs for legislative research workflows.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/congress
```

## Run

```bash
npx -p api-emulator api --plugin ./@congress/api-emulator.mjs --service congress
```

## Endpoints

- `GET /inspect/contract`
- `GET /v3/bill`
- `GET /v3/bill/:congress/:billType`
- `GET /v3/bill/:congress/:billType/:billNumber`

## Auth

Uses fake local credentials only; provide any deterministic bearer token or API key expected by the client under test.

## Seed Configuration

```yaml
congress:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://api.congress.gov/)
- [api-emulator](https://github.com/jsj/api-emulator)
