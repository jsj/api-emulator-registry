# @api-emulator/togetherai

Together AI provides OpenAI-compatible inference, embedding, model listing, and reranking APIs.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/togetherai
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@togetherai/api-emulator.mjs --service togetherai
```

## Fidelity

- Tier: `stub`
- Evidence: starter surface with smoke coverage

## Endpoints

The emulator source lists the supported local API endpoints.

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
togetherai:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.together.ai/reference/chat-completions-1)
- [api-emulator](https://github.com/jsj/api-emulator)
