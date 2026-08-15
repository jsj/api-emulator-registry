# @api-emulator/sendblue

Sendblue provides APIs for iMessage, RCS, SMS, contacts, phone lines, and webhooks.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/sendblue
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@sendblue/api-emulator.mjs --service sendblue
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `POST /api/send-message`
- `GET /api/v2/messages`
- `GET /api/v2/messages/:messageId`
- `GET /api/status`
- `GET /api/evaluate-service`
- `GET /api/v2/contacts/count`
- `GET /api/v2/contacts`
- `POST /api/v2/contacts`
- `GET /api/v2/contacts/:phone`
- `PUT /api/v2/contacts/:phone`
- `DELETE /api/v2/contacts/:phone`
- `POST /api/v2/contacts/opt-out`
- `GET /api/lines`
- `GET /api/account/webhooks`
- `POST /api/account/webhooks`
- `PUT /api/account/webhooks`
- `DELETE /api/account/webhooks`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
sendblue:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.sendblue.com/api/)
- [api-emulator](https://github.com/jsj/api-emulator)
