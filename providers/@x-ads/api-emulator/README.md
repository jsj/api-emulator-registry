# @api-emulator/x-ads

X Ads MCP provides account, campaign, line-item, targeting, creative, and analytics tools with paused-by-default writes.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/x-ads
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@x-ads/api-emulator.mjs --service x-ads
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `POST /mcp`
- `GET /inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
x-ads:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.x.com/x-ads-api/mcp)
- [api-emulator](https://github.com/jsj/api-emulator)
