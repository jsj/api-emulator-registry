# @api-emulator/whatsapp

WhatsApp Cloud API provides Graph API surfaces for business phone numbers, messages, media, templates, and webhooks.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/whatsapp
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@whatsapp/api-emulator.mjs --service whatsapp
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

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

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
whatsapp:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [api-emulator](https://github.com/jsj/api-emulator)
