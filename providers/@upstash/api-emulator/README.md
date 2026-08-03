# @api-emulator/upstash

Upstash provides serverless data and messaging APIs for Redis, QStash, Kafka-style streams, and workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/upstash
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@upstash/api-emulator.mjs --service upstash
```

## Fidelity

- Tier: `stub`
- Evidence: starter surface without smoke coverage

## Endpoints

The emulator source lists the supported local API endpoints.

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
upstash:
  # Add provider-specific seed state here.
```

## Links

- [api-emulator](https://github.com/jsj/api-emulator)
