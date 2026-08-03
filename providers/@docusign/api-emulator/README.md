# @api-emulator/docusign

Docusign provides eSignature APIs for OAuth userinfo, users, templates, envelopes, recipients, and Connect webhooks.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/docusign
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@docusign/api-emulator.mjs --service docusign
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /oauth/userinfo`
- `GET /restapi/v2.1/accounts/:accountId/users`
- `GET /restapi/v2.1/accounts/:accountId/templates`
- `GET /restapi/v2.1/accounts/:accountId/envelopes`
- `POST /restapi/v2.1/accounts/:accountId/envelopes`
- `GET /restapi/v2.1/accounts/:accountId/envelopes/:envelopeId`
- `GET /restapi/v2.1/accounts/:accountId/envelopes/:envelopeId/recipients`
- `GET /restapi/v2.1/accounts/:accountId/connect`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
docusign:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developers.docusign.com/docs/esign-rest-api/reference/)
- [api-emulator](https://github.com/jsj/api-emulator)
