# @api-emulator/fastly

Fastly provides edge cloud APIs for services, versions, domains, backends, compute, and purge workflows.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/fastly
```

## Run

```bash
npx -p api-emulator api --plugin ./@fastly/api-emulator.mjs --service fastly
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
fastly:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.fastly.com/documentation/reference/api/)
- [api-emulator](https://github.com/jsj/api-emulator)
