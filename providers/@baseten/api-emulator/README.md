# @api-emulator/baseten

Baseten provides model deployment, management, and inference APIs including OpenAI-compatible model endpoints.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/baseten
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@baseten/api-emulator.mjs --service baseten
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
baseten:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.baseten.co/api-reference/overview)
- [api-emulator](https://github.com/jsj/api-emulator)
