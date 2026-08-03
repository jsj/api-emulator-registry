# @api-emulator/spotify

Spotify provides Web API surfaces for catalog search, tracks, albums, artists, playlists, saved library, player controls, and queue workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/spotify
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@spotify/api-emulator.mjs --service spotify
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /v1/me`
- `GET /api/token`
- `GET /v1/search`
- `GET /v1/tracks/:id`
- `GET /v1/albums/:id`
- `GET /v1/artists/:id`
- `GET /v1/shows/:id`
- `GET /v1/episodes/:id`
- `GET /v1/artists/:id/top-tracks`
- `GET /v1/me/playlists`
- `POST /v1/users/:userId/playlists`
- `GET /v1/playlists/:id`
- `GET /v1/playlists/:id/tracks`
- `POST /v1/playlists/:id/tracks`
- `DELETE /v1/playlists/:id/tracks`
- `GET /v1/me/tracks`
- `PUT /v1/me/tracks`
- `DELETE /v1/me/tracks`
- `GET /v1/me/albums`
- `PUT /v1/me/albums`
- `DELETE /v1/me/albums`
- `GET /v1/me/following`
- `PUT /v1/me/following`
- `DELETE /v1/me/following`
- `GET /v1/me/player`
- `GET /v1/me/player/devices`
- `PUT /v1/me/player`
- `PUT /v1/me/player/play`
- `PUT /v1/me/player/pause`
- `POST /v1/me/player/next`
- `POST /v1/me/player/previous`
- `PUT /v1/me/player/volume`
- `PUT /v1/me/player/seek`
- `PUT /v1/me/player/shuffle`
- `PUT /v1/me/player/repeat`
- `POST /v1/me/player/queue`
- `GET /v1/me/player/queue`
- `GET /inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
spotify:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.spotify.com/documentation/web-api)
- [api-emulator](https://github.com/jsj/api-emulator)
