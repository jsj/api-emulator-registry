# @api-emulator/hetzner

Hetzner Cloud provides European cloud APIs for locations, datacenters, servers, networks, volumes, and firewalls.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/hetzner
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@hetzner/api-emulator.mjs --service hetzner
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
hetzner:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.hetzner.cloud/)
- [api-emulator](https://github.com/jsj/api-emulator)
