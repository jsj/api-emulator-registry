# @api-emulator/linode

Linode provides cloud APIs for instances, regions, VPCs, images, volumes, and node balancers.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/linode
```

## Run

```bash
npx -p api-emulator api --plugin ./@linode/api-emulator.mjs --service linode
```

## Endpoints

- See the emulator source for the supported local API surface.

## Auth

No production credentials are required. Use fake local credentials in client tests.

## Seed Configuration

```yaml
linode:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://techdocs.akamai.com/linode-api/reference/api)
- [api-emulator](https://github.com/jsj/api-emulator)
