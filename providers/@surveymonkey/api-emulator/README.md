# @api-emulator/surveymonkey

SurveyMonkey provides API v3 surfaces for users, surveys, collectors, and bulk survey response workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/surveymonkey
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@surveymonkey/api-emulator.mjs --service surveymonkey
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /v3/users/me`
- `GET /v3/surveys`
- `POST /v3/surveys`
- `GET /v3/surveys/:surveyId`
- `GET /v3/surveys/:surveyId/details`
- `GET /v3/surveys/:surveyId/collectors`
- `GET /v3/surveys/:surveyId/responses/bulk`
- `GET /v3/surveys/:surveyId/responses/:responseId/details`
- `POST /v3/surveys/:surveyId/responses/bulk`
- `GET /surveymonkey/inspect/contract`
- `GET /surveymonkey/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
surveymonkey:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://api.surveymonkey.com/v3/docs)
- [api-emulator](https://github.com/jsj/api-emulator)
