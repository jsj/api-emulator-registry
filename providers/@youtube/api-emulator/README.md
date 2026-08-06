# @api-emulator/youtube

YouTube provides Data API, Upload API, and Analytics API surfaces for creator posting, video management, comments, playlists, reports, and groups.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/youtube
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@youtube/api-emulator.mjs --service youtube
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `POST /token`
- `POST /oauth2/v4/token`
- `GET /youtube/v3/search`
- `GET /youtube/v3/channels`
- `GET /youtube/v3/videos`
- `GET /youtube/v3/playlists`
- `POST /youtube/v3/playlists`
- `PUT /youtube/v3/playlists`
- `DELETE /youtube/v3/playlists`
- `GET /youtube/v3/playlistItems`
- `POST /youtube/v3/playlistItems`
- `PUT /youtube/v3/playlistItems`
- `DELETE /youtube/v3/playlistItems`
- `POST /youtube/v3/videos`
- `PUT /youtube/v3/videos`
- `DELETE /youtube/v3/videos`
- `POST /youtube/v3/videos/rate`
- `GET /youtube/v3/videos/getRating`
- `POST /youtube/v3/videos/reportAbuse`
- `POST /upload/youtube/v3/videos`
- `GET /youtube/v3/commentThreads`
- `POST /youtube/v3/commentThreads`
- `GET /youtube/v3/comments`
- `POST /youtube/v3/comments`
- `PUT /youtube/v3/comments`
- `DELETE /youtube/v3/comments`
- `GET /youtube/v3/i18nLanguages`
- `GET /youtube/v3/i18nRegions`
- `GET /youtube/v3/videoCategories`
- `GET /youtube/v3/videoAbuseReportReasons`
- `GET /v2/reports`
- `GET /v2/groups`
- `GET /v2/groupItems`
- `GET /youtube/inspect/contract`
- `GET /youtube/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
youtube:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developers.google.com/youtube)
- [api-emulator](https://github.com/jsj/api-emulator)
