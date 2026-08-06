# @api-emulator/clay

Clay provides APIs and webhook surfaces for sales intelligence tables, rows, enrichments, and workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/clay
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@clay/api-emulator.mjs --service clay
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

The emulator source lists the supported local API endpoints.

## Coverage

- Level: `stub`
- Meaning: This emulator has a small starter API.
- Evidence: starter surface with smoke coverage.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
clay:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://university.clay.com/docs/http-api-integration-overview)
- [api-emulator](https://github.com/jsj/api-emulator)
