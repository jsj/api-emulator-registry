# @api-emulator/youtube-music

YouTube Music provides InnerTube-style APIs for search, browse, playback metadata, queues, playlists, likes, and subscriptions.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/youtube-music
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@youtube-music/api-emulator.mjs --service youtube-music
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /`
- `POST /youtubei/v1/search`
- `POST /youtubei/v1/browse`
- `POST /youtubei/v1/player`
- `POST /youtubei/v1/next`
- `POST /youtubei/v1/playlist/create`
- `POST /youtubei/v1/browse/edit_playlist`
- `POST /youtubei/v1/like/like`
- `POST /youtubei/v1/subscription/subscribe`
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
youtube-music:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://github.com/sigma67/ytmusicapi)
- [api-emulator](https://github.com/jsj/api-emulator)
