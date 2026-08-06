# @api-emulator/lucent

Lucent provides session replay SDK APIs for public-key validation, browser replay ingestion, and session capture workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/lucent
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@lucent/api-emulator.mjs --service lucent
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `POST /api/sdk/init`
- `POST /api/sdk/replay`
- `GET /api/sdk/replays`
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
lucent:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.lucenthq.com)
- [api-emulator](https://github.com/jsj/api-emulator)
