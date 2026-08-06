# @api-emulator/wolfram

Wolfram APIs provide short answers, full query results, spoken results, and LLM-ready computational answers.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/wolfram
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@wolfram/api-emulator.mjs --service wolfram
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /v1/result`
- `GET /v1/spoken`
- `GET /v1/simple`
- `GET /v2/query`
- `GET /api/v1/llm-api`
- `GET /wolfram/inspect/contract`
- `GET /wolfram/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
wolfram:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://products.wolframalpha.com/api)
- [api-emulator](https://github.com/jsj/api-emulator)
