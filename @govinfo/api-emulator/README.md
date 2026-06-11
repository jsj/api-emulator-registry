# @api-emulator/govinfo

GovInfo provides package collection, summary, and content APIs for official U.S. government publications.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/govinfo
```

## Run

```bash
npx -p api-emulator api --plugin ./@govinfo/api-emulator.mjs --service govinfo
```

## Endpoints

- `GET /inspect/contract`
- `GET /collections/:collection/:startDate`
- `GET /packages/:packageId/summary`
- `GET /packages/:packageId/:format`

## Auth

Uses fake local credentials only; provide any deterministic bearer token or API key expected by the client under test.

## Seed Configuration

```yaml
govinfo:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://api.govinfo.gov/docs/)
- [api-emulator](https://github.com/jsj/api-emulator)
