# @api-emulator/google-forms

Google Forms provides form creation, form retrieval, batch updates, and response read APIs for Workspace survey workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/google-forms
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@google-forms/api-emulator.mjs --service google-forms
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /$discovery/rest`
- `GET /discovery/v1/apis/forms/v1/rest`
- `POST /v1/forms`
- `GET /v1/forms/:formId`
- `POST /v1/forms/:formId:batchUpdate`
- `GET /v1/forms/:formId/responses`
- `GET /v1/forms/:formId/responses/:responseId`
- `GET /google-forms/inspect/contract`
- `GET /google-forms/inspect/state`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
google-forms:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developers.google.com/workspace/forms/api/reference/rest)
- [api-emulator](https://github.com/jsj/api-emulator)
