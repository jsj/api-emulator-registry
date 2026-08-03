# @api-emulator/apple-media

Apple Media provides iTunes Search, App Store storefront metadata, Apple Books audiobook charts, RSS feeds, and deterministic artwork fixtures.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/apple-media
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@apple-media/api-emulator.mjs --service apple-media
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /search`
- `GET /api/v2/us/audio-books/top/:limit/audio-books.json`
- `GET /fixtures/audiobook-covers/:id/:size`
- `GET /lookup`
- `GET /v1/app-store/search`
- `GET /v1/app-store/lookup`
- `GET /v1/app-store/storefront`
- `GET /:store/app/id:appId`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
apple-media:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://performance-partners.apple.com/search-api)
- [api-emulator](https://github.com/jsj/api-emulator)
