# @api-emulator/symbolab

Symbolab public web bridge APIs provide equation solution, steps, answer verification, and graph plotting workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/symbolab
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@symbolab/api-emulator.mjs --service symbolab
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `POST /pub_api/bridge/solution`
- `POST /pub_api/bridge/steps`
- `POST /pub_api/bridge/verify`
- `POST /pub_api/bridge/verifyProblem`
- `POST /pub_api/graph/plottingInfo`
- `GET /symbolab/inspect/contract`
- `GET /symbolab/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
symbolab:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.symbolab.com/solver/step-by-step-calculator)
- [api-emulator](https://github.com/jsj/api-emulator)
