# @api-emulator/google-analytics

Google Analytics Data API provides GA4 property metadata, report execution, realtime metrics, and audience export workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/google-analytics
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@google-analytics/api-emulator.mjs --service google-analytics
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
google-analytics:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developers.google.com/analytics/devguides/reporting/data/v1/rest)
- [api-emulator](https://github.com/jsj/api-emulator)
