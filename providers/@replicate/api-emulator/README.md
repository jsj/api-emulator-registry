# @api-emulator/replicate

Replicate provides model metadata and deterministic prediction APIs with local image and video outputs.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/replicate
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@replicate/api-emulator.mjs --service replicate
```

## Fidelity

- Tier: `contract-backed`
- Evidence: 65% medium conformance score
- Smoke: `node @replicate/smoke.mjs`

## Endpoints

The emulator source lists the supported local API endpoints.

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
replicate:
  # Add provider-specific seed state here.
```

## Links

- [api-emulator](https://github.com/jsj/api-emulator)
