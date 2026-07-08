# @api-emulator/eia

EIA Open Data API v2 provides energy fundamentals data routes for oil, gas, power, and inventory-sensitive workflows.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/eia
```

## Run

```bash
npx -p api-emulator api --plugin ./@eia/api-emulator.mjs --service eia
```

## Fidelity

- Tier: `smoke-only`
- Evidence: direct smoke test exists; no conformance manifest yet

## Endpoints

- `GET /inspect/contract`
- `GET /v2/:route{.+}/data/`

## Auth

Uses fake local credentials only; provide any deterministic bearer token or API key expected by the client under test.

## Seed Configuration

```yaml
eia:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.eia.gov/opendata/documentation.php)
- [api-emulator](https://github.com/jsj/api-emulator)
