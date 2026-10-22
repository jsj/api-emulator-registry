# @api-emulator/shortcut

Shortcut Platform API emulates spreadsheet jobs, skills, uploads, downloads, cancellation, and usage export.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/shortcut
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@shortcut/api-emulator.mjs --service shortcut
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /api/spreadsheets/verify`
- `GET /api/spreadsheets/skills`
- `POST /api/spreadsheets/upload`
- `POST /api/spreadsheets`
- `GET /api/spreadsheets`
- `GET /api/spreadsheets/:runId`
- `POST /api/spreadsheets/:runId/cancel`
- `GET /api/spreadsheets/:runId/download`
- `GET /api/spreadsheets/:runId/artifacts/:filename`
- `GET /api/v1/team/usage-export`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
shortcut:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://api.shortcut.ai/api/openapi.json)
- [api-emulator](https://github.com/jsj/api-emulator)
