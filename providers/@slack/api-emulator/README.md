# @api-emulator/slack

Slack provides workplace messaging APIs for OAuth, users, teams, conversations, messages, and webhooks.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/slack
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@slack/api-emulator/src/index.ts --service slack
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
slack:
  # Add provider-specific seed state here.
```

## Links

- [api-emulator](https://github.com/jsj/api-emulator)
