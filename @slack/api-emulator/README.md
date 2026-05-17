# @api-emulator/slack

Slack provides workplace messaging APIs for OAuth, users, teams, conversations, messages, and webhooks.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/slack
```

## Run

```bash
npx -p api-emulator api --plugin ./@slack/api-emulator/src/index.ts --service slack
```

## Endpoints

- See the emulator source for the supported local API surface.

## Auth

No production credentials are required. Use fake local credentials in client tests.

## Seed Configuration

```yaml
slack:
  # Add provider-specific seed state here.
```

## Links

- [api-emulator](https://github.com/jsj/api-emulator)
