# @api-emulator/twilio

Twilio provides communications APIs for messaging, phone numbers, verification, voice, and customer engagement.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/twilio
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@twilio/api-emulator/src/index.ts --service twilio
```

## Fidelity

- Tier: `stub`
- Evidence: starter surface without smoke coverage

## Endpoints

The emulator source lists the supported local API endpoints.

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
twilio:
  # Add provider-specific seed state here.
```

## Links

- [api-emulator](https://github.com/jsj/api-emulator)
