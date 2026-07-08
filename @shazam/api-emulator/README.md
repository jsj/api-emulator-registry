# @api-emulator/shazam

Shazam provides recognition, song metadata, chart, search, and Apple Music link workflows.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/shazam
```

## Run

```bash
npx -p api-emulator api --plugin ./@shazam/api-emulator.mjs --service shazam
```

## Fidelity

- Tier: `smoke-only`
- Evidence: direct smoke test exists; no conformance manifest yet

## Endpoints

- `GET /v1/search`
- `GET /v1/charts/:storefront`
- `GET /v1/catalog/:storefront/songs/:id`
- `GET /v1/catalog/:storefront/songs/:id/shazam`
- `POST /v1/matches`
- `GET /v1/matches/:id`
- `GET /inspect/state`

## Auth

No production credentials are required. Use fake local credentials in client tests.

## Seed Configuration

```yaml
shazam:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.apple.com/shazamkit/)
- [api-emulator](https://github.com/jsj/api-emulator)
