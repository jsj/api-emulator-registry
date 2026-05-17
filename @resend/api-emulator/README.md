# @api-emulator/resend

Resend provides developer email APIs for sending messages, domains, contacts, audiences, and broadcasts.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/resend
```

## Run

```bash
npx -p api-emulator api --plugin ./@resend/api-emulator/src/index.ts --service resend
```

## Endpoints

- See the emulator source for the supported local API surface.

## Auth

Uses fake local credentials only; provide any deterministic bearer token or API key expected by the client under test.

## Seed Configuration

```yaml
resend:
  # Add provider-specific seed state here.
```

## Links

- [api-emulator](https://github.com/jsj/api-emulator)
