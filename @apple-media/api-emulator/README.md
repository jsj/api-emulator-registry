# @api-emulator/apple-media

Apple Media provides iTunes Search, App Store storefront metadata, Apple Books audiobook charts, RSS feeds, and deterministic artwork fixtures.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/apple-media
```

## Run

```bash
npx -p api-emulator api --plugin ./@apple-media/api-emulator.mjs --service apple-media
```

## Fidelity

- Tier: `generated fallback`
- Evidence: local generated surface; no smoke or conformance manifest yet

## Endpoints

- `GET /search`
- `GET /api/v2/us/audio-books/top/:limit/audio-books.json`
- `GET /fixtures/audiobook-covers/:id/:size`
- `GET /lookup`
- `GET /v1/app-store/search`
- `GET /v1/app-store/lookup`
- `GET /v1/app-store/storefront`
- `GET /:store/app/id:appId`

## Auth

No production credentials are required. Use fake local credentials in client tests.

## Seed Configuration

```yaml
apple-media:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://performance-partners.apple.com/search-api)
- [api-emulator](https://github.com/jsj/api-emulator)
