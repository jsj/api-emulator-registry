# @api-emulator/turbotax

TurboTax partner tax-import APIs provide OAuth, tax document, and import session workflows for deterministic tax prep testing.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/turbotax
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@turbotax/api-emulator.mjs --service turbotax
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `POST /oauth2/v1/tokens/bearer`
- `GET /v1/tax-documents`
- `POST /v1/tax-documents`
- `GET /v1/tax-documents/:id`
- `POST /v1/import-sessions`
- `GET /v1/import-sessions/:id`
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
turbotax:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.intuit.com/partners/fdp/implementation-support/tax-import/)
- [api-emulator](https://github.com/jsj/api-emulator)
