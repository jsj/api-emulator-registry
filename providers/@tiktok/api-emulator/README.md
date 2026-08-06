# @api-emulator/tiktok

TikTok Ads provides Business API surfaces for advertisers, campaigns, ad groups, ads, creatives, audiences, pixels, and reports.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/tiktok
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@tiktok/api-emulator.mjs --service tiktok
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

The emulator source lists the supported local API endpoints.

## Coverage

- Level: `stub`
- Meaning: This emulator has a small starter API.
- Evidence: starter surface with smoke coverage.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
tiktok:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://business-api.tiktok.com/portal/docs)
- [api-emulator](https://github.com/jsj/api-emulator)
