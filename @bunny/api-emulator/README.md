# @api-emulator/bunny

Bunny.net provides CDN, edge storage, pull zone, DNS, and edge delivery APIs.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/bunny
```

## Run

```bash
npx -p api-emulator api --plugin ./@bunny/api-emulator.mjs --service bunny
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
bunny:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.bunny.net/reference)
- [api-emulator](https://github.com/jsj/api-emulator)
