# @api-emulator/gong

Gong provides conversation intelligence APIs for users, recorded calls, transcripts, and CRM activity exports.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/gong
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@gong/api-emulator.mjs --service gong
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
gong:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://help.gong.io/docs/what-the-gong-api-provides)
- [api-emulator](https://github.com/jsj/api-emulator)
