# @api-emulator/hostinger

Hostinger provides VPS, DNS, domain, account, and hosting infrastructure APIs.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/hostinger
```

## Run

```bash
npx -p api-emulator api --plugin ./@hostinger/api-emulator.mjs --service hostinger
```

## Endpoints

- See the emulator source for the supported local API surface.

## Auth

No production credentials are required. Use fake local credentials in client tests.

## Seed Configuration

```yaml
hostinger:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developers.hostinger.com/)
- [api-emulator](https://github.com/jsj/api-emulator)
