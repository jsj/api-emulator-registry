# @api-emulator/vultr

Vultr provides cloud APIs for account, regions, instances, VPCs, images, DNS, and load balancers.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/vultr
```

## Run

```bash
npx -p api-emulator api --plugin ./@vultr/api-emulator.mjs --service vultr
```

## Endpoints

- See the emulator source for the supported local API surface.

## Auth

No production credentials are required. Use fake local credentials in client tests.

## Seed Configuration

```yaml
vultr:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.vultr.com/api/)
- [api-emulator](https://github.com/jsj/api-emulator)
