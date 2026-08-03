# @api-emulator/retool

Retool provides organization APIs for users, groups, folders, apps, resources, source control, and permissions.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/retool
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@retool/api-emulator.mjs --service retool
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
retool:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.retool.com/reference/api/v2)
- [api-emulator](https://github.com/jsj/api-emulator)
