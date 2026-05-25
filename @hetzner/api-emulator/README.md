# @api-emulator/hetzner

Hetzner Cloud provides European cloud APIs for locations, datacenters, servers, networks, volumes, and firewalls.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/hetzner
```

## Run

```bash
npx -p api-emulator api --plugin ./@hetzner/api-emulator.mjs --service hetzner
```

## Endpoints

- See the emulator source for the supported local API surface.

## Auth

No production credentials are required. Use fake local credentials in client tests.

## Seed Configuration

```yaml
hetzner:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.hetzner.cloud/)
- [api-emulator](https://github.com/jsj/api-emulator)
