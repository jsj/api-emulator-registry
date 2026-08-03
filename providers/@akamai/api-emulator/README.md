# @api-emulator/akamai

Akamai provides edge delivery, security, DNS, and Akamai Cloud Manager infrastructure APIs.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/akamai
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@akamai/api-emulator.mjs --service akamai
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
akamai:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://techdocs.akamai.com/developer/docs/apis)
- [api-emulator](https://github.com/jsj/api-emulator)
