# @api-emulator/shazam

Shazam provides recognition, song metadata, chart, search, and Apple Music link workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/shazam
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@shazam/api-emulator.mjs --service shazam
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /v1/search`
- `GET /v1/charts/:storefront`
- `GET /v1/catalog/:storefront/songs/:id`
- `GET /v1/catalog/:storefront/songs/:id/shazam`
- `POST /v1/matches`
- `GET /v1/matches/:id`
- `GET /inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
shazam:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.apple.com/shazamkit/)
- [api-emulator](https://github.com/jsj/api-emulator)
