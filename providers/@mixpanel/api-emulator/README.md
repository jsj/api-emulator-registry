# @api-emulator/mixpanel

Mixpanel provides product analytics APIs for event ingestion, user profiles, exports, and reporting.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/mixpanel
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@mixpanel/api-emulator.mjs --service mixpanel
```

## Fidelity

- Tier: `stub`
- Evidence: starter surface without smoke coverage

## Endpoints

The emulator source lists the supported local API endpoints.

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
mixpanel:
  # Add provider-specific seed state here.
```

## Links

- [api-emulator](https://github.com/jsj/api-emulator)
