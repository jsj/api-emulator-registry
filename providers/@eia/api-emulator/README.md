# @api-emulator/eia

EIA Open Data API v2 provides energy fundamentals data routes for oil, gas, power, and inventory-sensitive workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/eia
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@eia/api-emulator.mjs --service eia
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /inspect/contract`
- `GET /v2/:route{.+}/data/`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
eia:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.eia.gov/opendata/documentation.php)
- [api-emulator](https://github.com/jsj/api-emulator)
