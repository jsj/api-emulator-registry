# @api-emulator/lemma

Lemma receives agent traces and exposes ingest-delivery status for observability workflows.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/lemma
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@lemma/api-emulator.mjs --service lemma
```

## Endpoints

- `POST /traces/ingest` — validate and store one complete trace.
- `GET /traces/ingest-status` — return `ready` or `not_found` for a trace.
- `GET /inspect/state` — inspect deterministic emulator state.

## Auth

Use `Authorization: Bearer lemma_emulator_key`. The default project ID is `00000000-0000-4000-8000-000000000001`.

## Seed Configuration

```yaml
lemma:
  apiKey: lemma_emulator_key
  projects:
    - 00000000-0000-4000-8000-000000000001
```

## Links

- [Official trace contract](https://docs.uselemma.ai/reference/trace-contract)
- [Official SDK repository](https://github.com/uselemma/lemma)
- [api-emulator](https://github.com/jsj/api-emulator)
