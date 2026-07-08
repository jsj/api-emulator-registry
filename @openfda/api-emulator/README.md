# @api-emulator/openfda

openFDA provides drug event, enforcement, label, Drugs@FDA, and shortage APIs for healthcare and regulatory workflows.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/openfda
```

## Run

```bash
npx -p api-emulator api --plugin ./@openfda/api-emulator.mjs --service openfda
```

## Fidelity

- Tier: `smoke-only`
- Evidence: direct smoke test exists; no conformance manifest yet

## Endpoints

- `GET /inspect/contract`
- `GET /drug/event.json`
- `GET /drug/enforcement.json`
- `GET /drug/label.json`
- `GET /drug/drugsfda.json`
- `GET /drug/shortages.json`

## Auth

Uses fake local credentials only; provide any deterministic bearer token or API key expected by the client under test.

## Seed Configuration

```yaml
openfda:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://open.fda.gov/apis/)
- [api-emulator](https://github.com/jsj/api-emulator)
