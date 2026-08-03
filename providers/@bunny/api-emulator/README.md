# @api-emulator/bunny

Bunny.net provides CDN, edge storage, pull zone, DNS, and edge delivery APIs.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/bunny
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@bunny/api-emulator.mjs --service bunny
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
bunny:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.bunny.net/reference)
- [api-emulator](https://github.com/jsj/api-emulator)
