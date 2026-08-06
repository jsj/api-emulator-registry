# @api-emulator/whatsapp

WhatsApp Cloud API provides Graph API surfaces for business phone numbers, messages, media, templates, and webhooks.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/whatsapp
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@whatsapp/api-emulator.mjs --service whatsapp
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /webhook`
- `GET /:version/:businessAccountId/phone_numbers`
- `GET /:version/:businessAccountId/message_templates`
- `POST /:version/:phoneNumberId/messages`
- `GET /:version/:phoneNumberId/messages`
- `POST /:version/:phoneNumberId/media`
- `GET /:version/:mediaId`
- `DELETE /:version/:mediaId`
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
whatsapp:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [api-emulator](https://github.com/jsj/api-emulator)
