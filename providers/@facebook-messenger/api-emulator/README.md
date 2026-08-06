# @api-emulator/facebook-messenger

Facebook Messenger Platform provides Graph API surfaces for pages, conversations, Send API messages, user profiles, and webhooks.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/facebook-messenger
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@facebook-messenger/api-emulator.mjs --service facebook-messenger
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /webhook`
- `GET /:version/me/accounts`
- `GET /:version/:pageId/conversations`
- `GET /:version/:conversationId/messages`
- `POST /:version/:pageId/messages`
- `POST /:version/me/messages`
- `GET /:version/:profileId`
- `GET /inspect/contract`
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
facebook-messenger:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developers.facebook.com/docs/messenger-platform)
- [api-emulator](https://github.com/jsj/api-emulator)
