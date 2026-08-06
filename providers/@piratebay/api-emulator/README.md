# @api-emulator/piratebay

Pirate Bay provides generic media index fixtures for search, item metadata, playback, and library-style workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/piratebay
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@piratebay/api-emulator.mjs --service piratebay
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /System/Info/Public`
- `POST /Users/AuthenticateByName`
- `GET /Users/Public`
- `GET /Users/:userId/Views`
- `GET /Users/:userId/Items`
- `GET /Users/:userId/Items/Latest`
- `GET /Users/:userId/Items/Resume`
- `POST /Users/:userId/FavoriteItems/:itemId`
- `DELETE /Users/:userId/FavoriteItems/:itemId`
- `GET /Users/:userId/Items/:itemId`
- `GET /Search/Hints`
- `POST /Items/:itemId/PlaybackInfo`
- `GET /Videos/:itemId/stream`
- `POST /Sessions/Playing`
- `POST /Sessions/Playing/Progress`
- `POST /Sessions/Playing/Stopped`
- `GET /Items/:itemId/Images/:imageType`
- `GET /inspect/last-authenticate`
- `GET /inspect/last-playback-info`
- `GET /inspect/last-playing`
- `GET /inspect/last-progress`
- `GET /inspect/last-stopped`

## Coverage

- Level: `generated fallback`
- Meaning: This emulator has a generated API without direct coverage tests.
- Evidence: a local generated API exists, but smoke and conformance evidence does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
piratebay:
  # Add provider-specific seed state here.
```

## Links

- [api-emulator](https://github.com/jsj/api-emulator)
