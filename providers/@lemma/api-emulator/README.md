# @api-emulator/lemma

Lemma provides agent trace ingestion and ingest-status APIs for local observability workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/lemma
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@lemma/api-emulator.mjs --service lemma
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `POST /traces/ingest`
- `GET /traces/ingest-status`
- `GET /inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
lemma:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.uselemma.ai/reference/trace-contract)
- [api-emulator](https://github.com/jsj/api-emulator)
