# @api-emulator/tiktok

TikTok Ads provides Business API surfaces for advertisers, campaigns, ad groups, ads, creatives, audiences, pixels, and reports.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/tiktok
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@tiktok/api-emulator.mjs --service tiktok
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
tiktok:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://business-api.tiktok.com/portal/docs)
- [api-emulator](https://github.com/jsj/api-emulator)
