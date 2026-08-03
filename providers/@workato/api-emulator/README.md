# @api-emulator/workato

Workato provides automation APIs for recipes, connections, folders, jobs, and manifest export workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/workato
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@workato/api-emulator.mjs --service workato
```

## Fidelity

- Tier: `stub`
- Evidence: starter surface with smoke coverage

## Endpoints

The emulator source lists the supported local API endpoints.

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
workato:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.workato.com/workato-api.html)
- [api-emulator](https://github.com/jsj/api-emulator)
