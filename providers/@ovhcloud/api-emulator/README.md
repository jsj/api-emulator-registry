# @api-emulator/ovhcloud

OVHcloud provides European public cloud APIs for projects, regions, instances, networks, and vRack-style resources.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/ovhcloud
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@ovhcloud/api-emulator.mjs --service ovhcloud
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
ovhcloud:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://api.ovh.com/)
- [api-emulator](https://github.com/jsj/api-emulator)
