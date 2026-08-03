# @api-emulator/reddit

Reddit provides OAuth, identity, subreddit, listing, post submission, and comment APIs.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/reddit
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@reddit/api-emulator.mjs --service reddit
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `POST /api/v1/access_token`
- `GET /api/v1/me`
- `GET /r/:subreddit/about`
- `GET /r/:subreddit/hot`
- `GET /r/:subreddit/new`
- `POST /api/submit`
- `GET /reddit/inspect/state`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
reddit:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.reddit.com/dev/api/)
- [api-emulator](https://github.com/jsj/api-emulator)
