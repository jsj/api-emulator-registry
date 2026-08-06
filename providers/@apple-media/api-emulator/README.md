# @api-emulator/apple-media

Apple Media provides iTunes Search, App Store storefront metadata, Apple Books audiobook charts, RSS feeds, and deterministic artwork fixtures.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/apple-media
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@apple-media/api-emulator.mjs --service apple-media
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /search`
- `GET /api/v2/us/audio-books/top/:limit/audio-books.json`
- `GET /fixtures/audiobook-covers/:id/:size`
- `GET /lookup`
- `GET /v1/app-store/search`
- `GET /v1/app-store/lookup`
- `GET /v1/app-store/storefront`
- `GET /:store/app/id:appId`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
apple-media:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://performance-partners.apple.com/search-api)
- [api-emulator](https://github.com/jsj/api-emulator)
