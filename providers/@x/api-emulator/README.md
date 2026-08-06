# @api-emulator/x

X API provides OAuth, users, tweets, timelines, and social publishing workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/x
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@x/api-emulator.mjs --service x
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `POST /2/oauth2/token`
- `GET /2/users/me`
- `GET /2/users/:id`
- `GET /2/users/:id/tweets`
- `GET /2/tweets`
- `POST /2/tweets`
- `GET /x/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
x:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.x.com/en/docs/x-api)
- [api-emulator](https://github.com/jsj/api-emulator)
