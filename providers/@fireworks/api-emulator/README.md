# @api-emulator/fireworks

Fireworks AI provides OpenAI-compatible inference APIs for model listing, chat completions, completions, and embeddings.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/fireworks
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@fireworks/api-emulator.mjs --service fireworks
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
fireworks:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.fireworks.ai/api-reference/post-chatcompletions)
- [api-emulator](https://github.com/jsj/api-emulator)
