# @api-emulator/silurian

Silurian Earth APIs provide weather forecasts, portfolio GeoJSON features, and cyclone forecast surfaces.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/silurian
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@silurian/api-emulator.mjs --service silurian
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

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

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
silurian:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://github.com/silurian-ai/silurian-ts/blob/HEAD/reference.md)
- [api-emulator](https://github.com/jsj/api-emulator)
