# @api-emulator/scaleway

Scaleway provides European cloud APIs for regions, zones, instances, private networks, volumes, and edge services.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/scaleway
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@scaleway/api-emulator.mjs --service scaleway
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
scaleway:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.scaleway.com/en/developers/api/)
- [api-emulator](https://github.com/jsj/api-emulator)
