# @api-emulator/linq

Linq provides APIs for iMessage, RCS, and SMS chats, messages, phone numbers, and webhook subscriptions.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/linq
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@linq/api-emulator.mjs --service linq
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET ${prefix}/phone_numbers`
- `GET ${prefix}/phonenumbers`
- `GET ${prefix}/chats`
- `POST ${prefix}/chats`
- `GET ${prefix}/chats/:chatId`
- `PUT ${prefix}/chats/:chatId`
- `GET ${prefix}/chats/:chatId/messages`
- `POST ${prefix}/chats/:chatId/messages`
- `GET ${prefix}/messages/:messageId`
- `PATCH ${prefix}/messages/:messageId`
- `DELETE ${prefix}/messages/:messageId`
- `GET ${prefix}/webhook_subscriptions`
- `POST ${prefix}/webhook_subscriptions`
- `GET ${prefix}/webhook_subscriptions/:subscriptionId`
- `DELETE ${prefix}/webhook_subscriptions/:subscriptionId`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
linq:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.linqapp.com/api/)
- [api-emulator](https://github.com/jsj/api-emulator)
