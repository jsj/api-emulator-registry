# @api-emulator/uspto

USPTO provides Open Data Portal patent assignment and TSDR-compatible trademark status APIs.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/uspto
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@uspto/api-emulator.mjs --service uspto
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /inspect/contract`
- `GET /api/v1/patent/applications/:applicationNumber/assignment`
- `GET /ts/cd/casestatus/:serialNumber/info.json`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
uspto:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://data.uspto.gov/apis/getting-started)
- [api-emulator](https://github.com/jsj/api-emulator)
