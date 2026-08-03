# @api-emulator/zapier

Zapier provides automation APIs for apps, Zaps, task history, and webhook trigger workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/zapier
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@zapier/api-emulator.mjs --service zapier
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
zapier:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.zapier.com/platform/home)
- [api-emulator](https://github.com/jsj/api-emulator)
