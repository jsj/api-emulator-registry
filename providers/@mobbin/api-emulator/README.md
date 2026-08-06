# @api-emulator/mobbin

Mobbin provides MCP and Screens Search APIs for discovering mobile and web design reference screens.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/mobbin
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@mobbin/api-emulator.mjs --service mobbin
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /.well-known/oauth-protected-resource/mcp`
- `POST /v1/screens/search`
- `POST /mcp`
- `GET /mobbin/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
mobbin:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://api.mobbin.com/mcp)
- [api-emulator](https://github.com/jsj/api-emulator)
