# @api-emulator/deel

Deel provides workforce APIs for people, legal entities, contracts, invoices, roles, and organization structures.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/deel
```

## Run

```bash
npx -p api-emulator api --plugin ./@deel/api-emulator.mjs --service deel
```

## Fidelity

- Tier: `smoke-only`
- Evidence: direct smoke test exists; no conformance manifest yet

## Endpoints

- `POST /rest/v2/contracts`
- `GET /rest/v2/invoices/:id/download`
- `GET /inspect/contract`
- `GET /inspect/state`

## Auth

No production credentials are required. Use fake local credentials in client tests.

## Seed Configuration

```yaml
deel:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.deel.com/api/introduction)
- [api-emulator](https://github.com/jsj/api-emulator)
