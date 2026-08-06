# @api-emulator/robinhood-banking

Robinhood Banking provides a local API emulator.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/robinhood-banking
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@robinhood-banking/api-emulator.mjs --service robinhood-banking
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /oauth/authorize`
- `POST /oauth/token`
- `POST /mcp/banking`
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
robinhood-banking:
  # Add provider-specific seed state here.
```

## Links

- [api-emulator](https://github.com/jsj/api-emulator)
