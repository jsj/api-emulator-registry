# @api-emulator/exa

Exa provides neural search, contents, similar-link discovery, and answer APIs for AI agent retrieval workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/exa
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@exa/api-emulator.mjs --service exa
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
exa:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.exa.ai)
- [api-emulator](https://github.com/jsj/api-emulator)
