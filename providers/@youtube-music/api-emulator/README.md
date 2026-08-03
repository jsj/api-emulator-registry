# @api-emulator/youtube-music

YouTube Music provides InnerTube-style APIs for search, browse, playback metadata, queues, playlists, likes, and subscriptions.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/youtube-music
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@youtube-music/api-emulator.mjs --service youtube-music
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

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

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
youtube-music:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://github.com/sigma67/ytmusicapi)
- [api-emulator](https://github.com/jsj/api-emulator)
