# @api-emulator/ionos

IONOS Cloud provides European cloud APIs for datacenters, servers, LANs, IP blocks, and edge services.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/ionos
```

## Run

```bash
npx -p api-emulator api --plugin ./@ionos/api-emulator.mjs --service ionos
```

## Endpoints

- See the emulator source for the supported local API surface.

## Auth

No production credentials are required. Use fake local credentials in client tests.

## Seed Configuration

```yaml
ionos:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://api.ionos.com/docs/cloud/v6/)
- [api-emulator](https://github.com/jsj/api-emulator)
