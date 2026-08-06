# @api-emulator/mercury

Mercury provides banking APIs for accounts, transactions, recipients, and payment approval workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/mercury
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@mercury/api-emulator.mjs --service mercury
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET ${prefix}/accounts`
- `GET ${prefix}/account/:accountId`
- `GET ${prefix}/transactions`
- `GET ${prefix}/transaction/:transactionId`
- `GET ${prefix}/recipients`
- `POST ${prefix}/recipients`
- `GET ${prefix}/recipient/:recipientId`
- `POST ${prefix}/recipient/:recipientId`
- `POST ${prefix}/account/:accountId/request-send-money`
- `POST ${prefix}/account/:accountId/transactions`
- `GET /inspect/contract`
- `GET /inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
mercury:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.mercury.com/docs/welcome)
- [api-emulator](https://github.com/jsj/api-emulator)
