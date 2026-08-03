# @api-emulator/elevenlabs

ElevenLabs provides voice AI APIs for text-to-speech, voices, models, generated audio history, and user subscription metadata.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/elevenlabs
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@elevenlabs/api-emulator.mjs --service elevenlabs
```

## Fidelity

- Tier: `stub`
- Evidence: starter surface with smoke coverage

## Endpoints

The emulator source lists the supported local API endpoints.

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
elevenlabs:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://elevenlabs.io/docs/api-reference/introduction)
- [api-emulator](https://github.com/jsj/api-emulator)
