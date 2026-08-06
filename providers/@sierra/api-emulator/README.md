# @api-emulator/sierra

Sierra provides AI customer-service agent SDK surfaces for mobile chat embeds, voice SVP transport probes, and conversation fixtures.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/sierra
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@sierra/api-emulator.mjs --service sierra
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /agent/:token/mobile`
- `GET /chat/voice/svp/:token`
- `GET /inspect/contract`
- `GET /inspect/state`
- `GET /sierra/inspect/contract`
- `GET /sierra/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
sierra:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://github.com/sierra-inc/sierra-react-native-sdk)
- [api-emulator](https://github.com/jsj/api-emulator)
