# @api-emulator/replicate

Replicate provides model metadata and deterministic prediction APIs with local image and video outputs.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/replicate
```

## Run

```bash
npx -p api-emulator api --plugin ./@replicate/api-emulator.mjs --service replicate
```

## Fidelity

- Tier: `contract-backed`
- Evidence: 65% medium conformance score
- Smoke: `node @replicate/smoke.mjs`

## Endpoints

- See the emulator source for the supported local API surface.

## Auth

No production credentials are required. Use fake local credentials in client tests.

## Seed Configuration

```yaml
replicate:
  # Add provider-specific seed state here.
```

## Links

- [api-emulator](https://github.com/jsj/api-emulator)
