# @api-emulator/vultr

Vultr provides cloud APIs for account, regions, instances, VPCs, images, DNS, and load balancers.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/vultr
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@vultr/api-emulator.mjs --service vultr
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
vultr:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.vultr.com/api/)
- [api-emulator](https://github.com/jsj/api-emulator)
