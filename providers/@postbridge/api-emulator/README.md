# @api-emulator/postbridge

Post Bridge provides social media scheduling APIs for connected accounts, draft posts, scheduled posts, and publishing.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/postbridge
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@postbridge/api-emulator.mjs --service postbridge
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /v1/me`
- `GET /v1/accounts`
- `GET /v1/accounts/:id`
- `GET /v1/media`
- `POST /v1/media`
- `GET /v1/posts`
- `GET /v1/posts/:id`
- `POST /v1/posts`
- `PATCH /v1/posts/:id`
- `DELETE /v1/posts/:id`
- `POST /v1/posts/:id/publish`
- `GET /v1/analytics/posts/:id`
- `GET /postbridge/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
postbridge:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://support.post-bridge.com/api)
- [api-emulator](https://github.com/jsj/api-emulator)
