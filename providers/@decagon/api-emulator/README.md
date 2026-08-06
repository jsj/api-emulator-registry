# @api-emulator/decagon

Decagon provides AI customer-support APIs for outbound chat messages and support automation workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/decagon
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@decagon/api-emulator.mjs --service decagon
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `POST /chat/outbound`
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
decagon:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.decagon.ai/api-reference/getting-started)
- [api-emulator](https://github.com/jsj/api-emulator)
