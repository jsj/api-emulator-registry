# @api-emulator/shazam

Shazam provides recognition, song metadata, chart, search, and Apple Music link workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/shazam
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@shazam/api-emulator.mjs --service shazam
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /v1/search`
- `GET /v1/charts/:storefront`
- `GET /v1/catalog/:storefront/songs/:id`
- `GET /v1/catalog/:storefront/songs/:id/shazam`
- `POST /v1/matches`
- `GET /v1/matches/:id`
- `GET /inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
shazam:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.apple.com/shazamkit/)
- [api-emulator](https://github.com/jsj/api-emulator)
