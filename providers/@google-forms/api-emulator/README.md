# @api-emulator/google-forms

Google Forms provides form creation, form retrieval, batch updates, and response read APIs for Workspace survey workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/google-forms
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@google-forms/api-emulator.mjs --service google-forms
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /$discovery/rest`
- `GET /discovery/v1/apis/forms/v1/rest`
- `POST /v1/forms`
- `GET /v1/forms/:formId`
- `POST /v1/forms/:formId:batchUpdate`
- `GET /v1/forms/:formId/responses`
- `GET /v1/forms/:formId/responses/:responseId`
- `GET /google-forms/inspect/contract`
- `GET /google-forms/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
google-forms:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developers.google.com/workspace/forms/api/reference/rest)
- [api-emulator](https://github.com/jsj/api-emulator)
