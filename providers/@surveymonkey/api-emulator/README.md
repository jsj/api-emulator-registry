# @api-emulator/surveymonkey

SurveyMonkey provides API v3 surfaces for users, surveys, collectors, and bulk survey response workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/surveymonkey
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@surveymonkey/api-emulator.mjs --service surveymonkey
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

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

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
surveymonkey:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://api.surveymonkey.com/v3/docs)
- [api-emulator](https://github.com/jsj/api-emulator)
