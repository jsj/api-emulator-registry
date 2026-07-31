# @api-emulator/plaid

Plaid provides financial APIs for Link, accounts, balances, identity, transactions, institutions, auth, and transfer workflows.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/plaid
```

## Run

```bash
npx -p api-emulator api --plugin ./@plaid/api-emulator/src/index.ts --service plaid
```

## Fidelity

- Tier: `contract-backed`
- Evidence: 66% medium conformance score
- Smoke: `node @plaid/smoke.mjs`
- Contract checks: `node scripts/check-plaid-openapi-coverage.mjs`

## Endpoints

- See the emulator source for the supported local API surface.

## Auth

No production credentials are required. Use fake local credentials in client tests.

## Seed Configuration

```yaml
plaid:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://plaid.com/docs/api)
- [api-emulator](https://github.com/jsj/api-emulator)
