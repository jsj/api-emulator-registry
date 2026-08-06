# @api-emulator/prime-music

Prime Music provides Amazon Music-compatible APIs for catalog search, tracks, albums, playlists, library saves, and playback controls.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/prime-music
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@prime-music/api-emulator.mjs --service prime-music
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /v1/me`
- `GET /v1/search`
- `GET /v1/tracks/:id`
- `GET /v1/albums/:id`
- `GET /v1/playlists/:id`
- `GET /v1/me/library/tracks`
- `PUT /v1/me/library/tracks/:id`
- `DELETE /v1/me/library/tracks/:id`
- `GET /v1/me/player`
- `PUT /v1/me/player/play`
- `PUT /v1/me/player/pause`
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
prime-music:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.amazon.com/docs/music/API_web_overview.html)
- [api-emulator](https://github.com/jsj/api-emulator)
