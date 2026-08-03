# @api-emulator/qualtrics

Qualtrics XM provides survey, survey definition, response, and response export APIs for experience management workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/qualtrics
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@qualtrics/api-emulator.mjs --service qualtrics
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

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

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
qualtrics:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://api.qualtrics.com/)
- [api-emulator](https://github.com/jsj/api-emulator)
