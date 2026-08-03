# @api-emulator/facebook-messenger

Facebook Messenger Platform provides Graph API surfaces for pages, conversations, Send API messages, user profiles, and webhooks.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/facebook-messenger
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@facebook-messenger/api-emulator.mjs --service facebook-messenger
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /webhook`
- `GET /:version/me/accounts`
- `GET /:version/:pageId/conversations`
- `GET /:version/:conversationId/messages`
- `POST /:version/:pageId/messages`
- `POST /:version/me/messages`
- `GET /:version/:profileId`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
facebook-messenger:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developers.facebook.com/docs/messenger-platform)
- [api-emulator](https://github.com/jsj/api-emulator)
