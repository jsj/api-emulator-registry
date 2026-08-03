# @api-emulator/telegram

Telegram provides bot APIs for updates, messages, chats, webhooks, and interactive bot workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/telegram
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@telegram/api-emulator/src/index.ts --service telegram
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
telegram:
  # Add provider-specific seed state here.
```

## Links

- [api-emulator](https://github.com/jsj/api-emulator)
