# @api-emulator/openfda

openFDA provides drug event, enforcement, label, Drugs@FDA, and shortage APIs for healthcare and regulatory workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/openfda
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@openfda/api-emulator.mjs --service openfda
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /inspect/contract`
- `GET /drug/event.json`
- `GET /drug/enforcement.json`
- `GET /drug/label.json`
- `GET /drug/drugsfda.json`
- `GET /drug/shortages.json`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
openfda:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://open.fda.gov/apis/)
- [api-emulator](https://github.com/jsj/api-emulator)
