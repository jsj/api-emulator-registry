# @api-emulator/marketo

Adobe Marketo Engage provides REST APIs for OAuth, leads, lead upserts, programs, lists, and marketing assets.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/marketo
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@marketo/api-emulator.mjs --service marketo
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /identity/oauth/token`
- `GET /rest/v1/leads.json`
- `GET /rest/v1/lead/:id.json`
- `DELETE /rest/v1/leads.json`
- `POST /rest/v1/leads.json`
- `GET /rest/v1/leads/describe.json`
- `GET /rest/asset/v1/programs.json`
- `GET /rest/asset/v1/program/:id.json`
- `GET /rest/asset/v1/staticLists.json`
- `GET /rest/asset/v1/staticList/:id.json`
- `GET /rest/v1/list/:id/leads.json`
- `POST /rest/v1/lists/:id/leads.json`
- `GET /rest/v1/activities.json`
- `GET /marketo/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
marketo:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://experienceleague.adobe.com/en/docs/marketo-developer/marketo/rest/rest-api)
- [api-emulator](https://github.com/jsj/api-emulator)
