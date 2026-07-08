# @api-emulator/scaleway

Scaleway provides European cloud APIs for regions, zones, instances, private networks, volumes, and edge services.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/scaleway
```

## Run

```bash
npx -p api-emulator api --plugin ./@scaleway/api-emulator.mjs --service scaleway
```

## Fidelity

- Tier: `stub`
- Evidence: starter surface with smoke coverage

## Endpoints

- See the emulator source for the supported local API surface.

## Auth

No production credentials are required. Use fake local credentials in client tests.

## Seed Configuration

```yaml
scaleway:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.scaleway.com/en/developers/api/)
- [api-emulator](https://github.com/jsj/api-emulator)
