# @api-emulator/deel

Deel provides workforce APIs for people, legal entities, contracts, invoices, roles, and organization structures.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/deel
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@deel/api-emulator.mjs --service deel
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `POST /rest/v2/contracts`
- `GET /rest/v2/invoices/:id/download`
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
deel:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.deel.com/api/introduction)
- [api-emulator](https://github.com/jsj/api-emulator)
