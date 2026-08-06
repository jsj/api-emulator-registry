# @api-emulator/mintlify

Mintlify provides documentation deployment, preview, assistant, search, page content, and analytics APIs.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/mintlify
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@mintlify/api-emulator.mjs --service mintlify
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /v1/agent/:projectId/jobs`
- `POST /v2/agent/:projectId/job/:id/message`
- `GET /v1/analytics/feedback`
- `GET /v1/analytics/feedback-by-page`
- `GET /v1/analytics/assistant-conversations`
- `GET /v1/analytics/assistant-caller-stats`
- `GET /v1/analytics/searches`
- `GET /v1/analytics/views`
- `GET /v1/analytics/visitors`
- `GET /mintlify/inspect/contract`
- `GET /mintlify/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
mintlify:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.mintlify.com/docs/api/introduction)
- [api-emulator](https://github.com/jsj/api-emulator)
