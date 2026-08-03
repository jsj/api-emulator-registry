# @api-emulator/linode

Linode provides cloud APIs for instances, regions, VPCs, images, volumes, and node balancers.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/linode
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@linode/api-emulator.mjs --service linode
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
linode:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://techdocs.akamai.com/linode-api/reference/api)
- [api-emulator](https://github.com/jsj/api-emulator)
