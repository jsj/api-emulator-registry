# @api-emulator/rackspace

Rackspace provides cloud identity, servers, networks, object storage, and CDN/OpenStack-compatible APIs.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/rackspace
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@rackspace/api-emulator.mjs --service rackspace
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
rackspace:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.rackspace.com/docs/cloud-servers/v2)
- [api-emulator](https://github.com/jsj/api-emulator)
