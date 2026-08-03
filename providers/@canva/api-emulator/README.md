# @api-emulator/canva

Canva Connect APIs provide user, design, asset upload, import, and export workflows for Canva-integrated apps.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/canva
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@canva/api-emulator.mjs --service canva
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
canva:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.canva.dev/docs/connect/)
- [api-emulator](https://github.com/jsj/api-emulator)
