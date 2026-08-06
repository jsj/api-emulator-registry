# @api-emulator/usaa

USAA-style Open Finance APIs provide FDX account, customer, balance, and transaction data workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/usaa
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@usaa/api-emulator.mjs --service usaa
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /fdx/v6/customers/current`
- `GET /fdx/v6/accounts`
- `GET /fdx/v6/accounts/:accountId`
- `GET /fdx/v6/accounts/:accountId/transactions`
- `GET /customers/current`
- `GET /accounts`
- `GET /accounts/:accountId`
- `GET /accounts/:accountId/transactions`
- `GET /inspect/contract`
- `GET /inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
usaa:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.akoya.com/reference/fdx-apis)
- [api-emulator](https://github.com/jsj/api-emulator)
