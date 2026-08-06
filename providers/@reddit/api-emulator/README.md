# @api-emulator/reddit

Reddit provides OAuth, identity, subreddit, listing, post submission, and comment APIs.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/reddit
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@reddit/api-emulator.mjs --service reddit
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `POST /api/v1/access_token`
- `GET /api/v1/me`
- `GET /r/:subreddit/about`
- `GET /r/:subreddit/hot`
- `GET /r/:subreddit/new`
- `POST /api/submit`
- `GET /reddit/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
reddit:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.reddit.com/dev/api/)
- [api-emulator](https://github.com/jsj/api-emulator)
