# @api-emulator/lemonade

Lemonade-style insurance APIs provide customer, renters quote, policy binding, and claim workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/lemonade
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@lemonade/api-emulator.mjs --service lemonade
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /v1/customers`
- `POST /v1/customers`
- `GET /v1/quotes`
- `POST /v1/quotes/renters`
- `POST /v1/policies`
- `GET /v1/policies/:policyId`
- `GET /v1/claims`
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
lemonade:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.lemonade.com/api)
- [api-emulator](https://github.com/jsj/api-emulator)
