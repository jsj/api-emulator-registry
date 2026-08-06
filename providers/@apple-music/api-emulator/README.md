# @api-emulator/apple-music

Apple Music provides MusicKit and iTunes Search APIs for catalog search, songs, albums, artists, library playlists, and playlist tracks.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/apple-music
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@apple-music/api-emulator.mjs --service apple-music
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /search`
- `GET /v1/catalog/:storefront/search`
- `GET /v1/catalog/:storefront/songs/:id`
- `GET /v1/catalog/:storefront/albums/:id`
- `GET /v1/catalog/:storefront/artists/:id`
- `GET /v1/me/library/playlists`
- `POST /v1/me/library/playlists`
- `GET /v1/me/library/playlists/:id`
- `PUT /v1/me/library/playlists/:id`
- `DELETE /v1/me/library/playlists/:id`
- `GET /v1/me/library/playlists/:id/tracks`
- `POST /v1/me/library/playlists/:id/tracks`
- `DELETE /v1/me/library/playlists/:id/tracks`
- `GET /inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
apple-music:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.apple.com/documentation/applemusicapi)
- [api-emulator](https://github.com/jsj/api-emulator)
