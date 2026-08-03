# @api-emulator/silurian

Silurian Earth APIs provide weather forecasts, portfolio GeoJSON features, and cyclone forecast surfaces.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/silurian
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@silurian/api-emulator.mjs --service silurian
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /forecast/daily`
- `GET /forecast/hourly`
- `GET /past/forecast/daily`
- `GET /past/forecast/hourly`
- `GET /experimental/extended`
- `GET /experimental/regional/usa`
- `GET /experimental/past/regional/usa`
- `GET /experimental/personalized/total-energies`
- `GET /portfolios/:portfolioId/features`
- `GET /portfolios/:portfolioId/forecasts`
- `GET /portfolios/:portfolioId/observations`
- `GET /portfolios/:portfolioId/init_time`
- `GET /cyclones/forecasts`
- `GET /cyclones/forecasts/:stormId/track`
- `GET /cyclones/forecasts/:stormId/cone`
- `GET /silurian/inspect/state`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
silurian:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://github.com/silurian-ai/silurian-ts/blob/HEAD/reference.md)
- [api-emulator](https://github.com/jsj/api-emulator)
