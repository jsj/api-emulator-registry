# @api-emulator/leaseweb

Leaseweb provides public cloud, dedicated server, network, load balancer, and CDN APIs.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/leaseweb
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@leaseweb/api-emulator.mjs --service leaseweb
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
leaseweb:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.leaseweb.com/)
- [api-emulator](https://github.com/jsj/api-emulator)
