# @api-emulator/akamai

Akamai provides edge delivery, security, DNS, and Akamai Cloud Manager infrastructure APIs.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/akamai
```

## Run

```bash
npx -p api-emulator api --plugin ./@akamai/api-emulator.mjs --service akamai
```

## Endpoints

- See the emulator source for the supported local API surface.

## Auth

Uses fake local credentials only; provide any deterministic bearer token or API key expected by the client under test.

## Seed Configuration

```yaml
akamai:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://techdocs.akamai.com/developer/docs/apis)
- [api-emulator](https://github.com/jsj/api-emulator)
