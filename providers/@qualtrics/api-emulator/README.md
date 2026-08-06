# @api-emulator/qualtrics

Qualtrics XM provides survey, survey definition, response, and response export APIs for experience management workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/qualtrics
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@qualtrics/api-emulator.mjs --service qualtrics
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /API/v3/whoami`
- `GET /API/v3/surveys`
- `POST /API/v3/surveys`
- `GET /API/v3/surveys/:surveyId`
- `GET /API/v3/survey-definitions/:surveyId`
- `GET /API/v3/surveys/:surveyId/responses`
- `POST /API/v3/surveys/:surveyId/responses`
- `POST /API/v3/surveys/:surveyId/export-responses`
- `GET /API/v3/surveys/:surveyId/export-responses/:progressId`
- `GET /API/v3/surveys/:surveyId/export-responses/:fileId/file`
- `GET /qualtrics/inspect/contract`
- `GET /qualtrics/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
qualtrics:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://api.qualtrics.com/)
- [api-emulator](https://github.com/jsj/api-emulator)
