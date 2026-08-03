# @api-emulator/clay

Clay provides APIs and webhook surfaces for sales intelligence tables, rows, enrichments, and workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/clay
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@clay/api-emulator.mjs --service clay
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
clay:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://university.clay.com/docs/http-api-integration-overview)
- [api-emulator](https://github.com/jsj/api-emulator)
