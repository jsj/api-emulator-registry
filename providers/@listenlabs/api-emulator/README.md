# @api-emulator/listenlabs

Listen Labs provides AI research APIs for studies, questions, participant responses, transcripts, summaries, and research insights.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/listenlabs
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@listenlabs/api-emulator.mjs --service listenlabs
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

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

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
listenlabs:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.listenlabs.ai/get-started)
- [api-emulator](https://github.com/jsj/api-emulator)
