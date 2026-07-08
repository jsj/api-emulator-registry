# @api-emulator/rackspace

Rackspace provides cloud identity, servers, networks, object storage, and CDN/OpenStack-compatible APIs.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/rackspace
```

## Run

```bash
npx -p api-emulator api --plugin ./@rackspace/api-emulator.mjs --service rackspace
```

## Fidelity

- Tier: `stub`
- Evidence: starter surface with smoke coverage

## Endpoints

- See the emulator source for the supported local API surface.

## Auth

Uses fake local credentials only; provide any deterministic bearer token or API key expected by the client under test.

## Seed Configuration

```yaml
rackspace:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.rackspace.com/docs/cloud-servers/v2)
- [api-emulator](https://github.com/jsj/api-emulator)
