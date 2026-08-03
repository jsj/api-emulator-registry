# @api-emulator/ionos

IONOS Cloud provides European cloud APIs for datacenters, servers, LANs, IP blocks, and edge services.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/ionos
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@ionos/api-emulator.mjs --service ionos
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
ionos:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://api.ionos.com/docs/cloud/v6/)
- [api-emulator](https://github.com/jsj/api-emulator)
