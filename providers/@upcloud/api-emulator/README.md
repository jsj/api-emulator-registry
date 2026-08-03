# @api-emulator/upcloud

UpCloud provides European cloud APIs for zones, servers, networks, storage, and account workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/upcloud
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@upcloud/api-emulator.mjs --service upcloud
```

## Fidelity

- Tier: `stub`
- Evidence: starter surface with smoke coverage

## Endpoints

The emulator source lists the supported local API endpoints.

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
upcloud:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developers.upcloud.com/1.3/)
- [api-emulator](https://github.com/jsj/api-emulator)
