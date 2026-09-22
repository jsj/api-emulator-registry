# @api-emulator/google

Google provides OAuth and Workspace APIs for Gmail, Drive, Calendar, Docs, Sheets, and admin workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/google
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@google/api-emulator/src/index.ts --service google
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

The emulator source lists the supported local API endpoints.

## Docs and Sheets reads

The emulator supports the read operations that the guarded GWS CLI uses:

- `GET /v1/documents/:documentId`
- `GET /v4/spreadsheets/:spreadsheetId`
- `GET /v4/spreadsheets/:spreadsheetId/values/:range`

The service-prefixed forms under `/docs/v1` and `/sheets/v4` are also available.
Sheets values support formatted values, unformatted values, and formulas.
Docs reads support the `includeTabsContent` option.

Seed data can contain `docs`, `spreadsheets`, and `sheetValues` fields.

## Coverage

- Level: `stateful-core`
- Evidence: The smoke test covers Docs content, Sheets metadata, value ranges, render modes, and custom seed data.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
google:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developers.google.com/workspace)
- [api-emulator](https://github.com/jsj/api-emulator)
