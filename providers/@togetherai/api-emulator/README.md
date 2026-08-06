# @api-emulator/togetherai

Together AI provides OpenAI-compatible inference, embedding, model listing, and reranking APIs.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/togetherai
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@togetherai/api-emulator.mjs --service togetherai
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
togetherai:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.together.ai/reference/chat-completions-1)
- [api-emulator](https://github.com/jsj/api-emulator)
