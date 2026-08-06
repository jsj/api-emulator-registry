# @api-emulator/gong

Gong provides conversation intelligence APIs for users, recorded calls, transcripts, and CRM activity exports.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/gong
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@gong/api-emulator.mjs --service gong
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
gong:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://help.gong.io/docs/what-the-gong-api-provides)
- [api-emulator](https://github.com/jsj/api-emulator)
