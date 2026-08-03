# @api-emulator/baseten

Baseten provides model deployment, management, and inference APIs including OpenAI-compatible model endpoints.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/baseten
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@baseten/api-emulator.mjs --service baseten
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
baseten:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.baseten.co/api-reference/overview)
- [api-emulator](https://github.com/jsj/api-emulator)
