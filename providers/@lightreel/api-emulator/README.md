# @api-emulator/lightreel

Lightreel provides chat APIs for social media research questions, structured agent answers, and API chat transcripts.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/lightreel
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@lightreel/api-emulator.mjs --service lightreel
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `POST /v1/chat`
- `GET /v1/chat/:id`
- `GET /v1/chats`
- `GET /lightreel/inspect/contract`
- `GET /lightreel/inspect/state`
- `GET /lightreel/fixtures/todo-app`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
lightreel:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://api.lightreel.ai)
- [api-emulator](https://github.com/jsj/api-emulator)
