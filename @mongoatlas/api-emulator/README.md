# @api-emulator/mongoatlas

MongoDB Atlas provides managed database projects, clusters, admin APIs, and data access surfaces.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/mongoatlas
```

## Run

```bash
npx -p api-emulator api --plugin ./@mongoatlas/api-emulator/src/index.ts --service mongoatlas
```

## Fidelity

- Tier: `stub`
- Evidence: starter surface without smoke coverage

## Endpoints

- See the emulator source for the supported local API surface.

## Auth

No production credentials are required. Use fake local credentials in client tests.

## Seed Configuration

```yaml
mongoatlas:
  # Add provider-specific seed state here.
```

## Links

- [api-emulator](https://github.com/jsj/api-emulator)
