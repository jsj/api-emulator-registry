# @api-emulator/fastly

Fastly provides edge cloud APIs for services, versions, domains, backends, compute, and purge workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/fastly
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@fastly/api-emulator.mjs --service fastly
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
fastly:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.fastly.com/documentation/reference/api/)
- [api-emulator](https://github.com/jsj/api-emulator)
