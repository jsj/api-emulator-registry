# @api-emulator/leaseweb

Leaseweb provides public cloud, dedicated server, network, load balancer, and CDN APIs.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/leaseweb
```

## Run

```bash
npx -p api-emulator api --plugin ./@leaseweb/api-emulator.mjs --service leaseweb
```

## Endpoints

- See the emulator source for the supported local API surface.

## Auth

No production credentials are required. Use fake local credentials in client tests.

## Seed Configuration

```yaml
leaseweb:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.leaseweb.com/)
- [api-emulator](https://github.com/jsj/api-emulator)
