# @api-emulator/plaid

Plaid provides financial APIs for Link, accounts, balances, identity, transactions, institutions, auth, and transfer workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/plaid
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@plaid/api-emulator/src/index.ts --service plaid
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

The emulator source lists the supported local API endpoints.

## Coverage

- Level: `contract-backed`
- Meaning: Automated tests compare this emulator with a defined API contract.
- Evidence: 66% medium conformance score.
- Smoke: `node providers/@plaid/smoke.mjs`
- Contract checks: `node scripts/check-plaid-openapi-coverage.mjs`

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
plaid:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://plaid.com/docs/api)
- [api-emulator](https://github.com/jsj/api-emulator)
