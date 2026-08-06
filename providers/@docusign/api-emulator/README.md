# @api-emulator/docusign

Docusign provides eSignature APIs for OAuth userinfo, users, templates, envelopes, recipients, and Connect webhooks.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/docusign
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@docusign/api-emulator.mjs --service docusign
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

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

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
docusign:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developers.docusign.com/docs/esign-rest-api/reference/)
- [api-emulator](https://github.com/jsj/api-emulator)
