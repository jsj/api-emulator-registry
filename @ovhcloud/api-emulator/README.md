# @api-emulator/ovhcloud

OVHcloud provides European public cloud APIs for projects, regions, instances, networks, and vRack-style resources.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/ovhcloud
```

## Run

```bash
npx -p api-emulator api --plugin ./@ovhcloud/api-emulator.mjs --service ovhcloud
```

## Endpoints

- See the emulator source for the supported local API surface.

## Auth

Uses fake local credentials only; provide any deterministic bearer token or API key expected by the client under test.

## Seed Configuration

```yaml
ovhcloud:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://api.ovh.com/)
- [api-emulator](https://github.com/jsj/api-emulator)
