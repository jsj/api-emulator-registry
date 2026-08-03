# @api-emulator/sierra

Sierra provides AI customer-service agent SDK surfaces for mobile chat embeds, voice SVP transport probes, and conversation fixtures.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/sierra
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@sierra/api-emulator.mjs --service sierra
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /agent/:token/mobile`
- `GET /chat/voice/svp/:token`
- `GET /inspect/contract`
- `GET /inspect/state`
- `GET /sierra/inspect/contract`
- `GET /sierra/inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
sierra:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://github.com/sierra-inc/sierra-react-native-sdk)
- [api-emulator](https://github.com/jsj/api-emulator)
