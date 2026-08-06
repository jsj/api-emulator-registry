# @api-emulator/ethos

Ethos-style life insurance APIs provide partner lead intake, term-life quotes, application decisions, and policy workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/ethos
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@ethos/api-emulator.mjs --service ethos
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /v1/leads`
- `POST /v1/leads`
- `POST /v1/quotes/term-life`
- `GET /v1/quotes/:quoteId`
- `POST /v1/applications`
- `GET /v1/applications/:applicationId`
- `GET /v1/policies`
- `GET /inspect/contract`
- `GET /inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
ethos:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.ethos.com/api/)
- [api-emulator](https://github.com/jsj/api-emulator)
