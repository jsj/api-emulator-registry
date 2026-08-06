# @api-emulator/upstash

Upstash provides serverless data and messaging APIs for Redis, QStash, Kafka-style streams, and workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/upstash
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@upstash/api-emulator.mjs --service upstash
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

The emulator source lists the supported local API endpoints.

## Coverage

- Level: `stub`
- Meaning: This emulator has a small starter API.
- Evidence: starter surface without smoke coverage.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
upstash:
  # Add provider-specific seed state here.
```

## Links

- [api-emulator](https://github.com/jsj/api-emulator)
