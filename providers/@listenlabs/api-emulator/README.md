# @api-emulator/listenlabs

Listen Labs provides AI research APIs for studies, questions, participant responses, transcripts, summaries, and research insights.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/listenlabs
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@listenlabs/api-emulator.mjs --service listenlabs
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /api/public/list_surveys`
- `GET /api/public/list_studies`
- `GET /api/public/responses`
- `POST /api/public/responses`
- `GET /api/public/responses/:responseId`
- `GET /api/public/study_questions`
- `GET /api/public/questions`
- `GET /api/public/insights`
- `GET /listenlabs/inspect/contract`
- `GET /listenlabs/inspect/state`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
listenlabs:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.listenlabs.ai/get-started)
- [api-emulator](https://github.com/jsj/api-emulator)
