# @api-emulator/upcloud

UpCloud provides European cloud APIs for zones, servers, networks, storage, and account workflows.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/upcloud
```

## Run

```bash
npx -p api-emulator api --plugin ./@upcloud/api-emulator.mjs --service upcloud
```

## Endpoints

- See the emulator source for the supported local API surface.

## Auth

Uses fake local credentials only; provide any deterministic bearer token or API key expected by the client under test.

## Seed Configuration

```yaml
upcloud:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developers.upcloud.com/1.3/)
- [api-emulator](https://github.com/jsj/api-emulator)
