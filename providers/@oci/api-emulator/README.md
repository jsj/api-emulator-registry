# @api-emulator/oci

Oracle Cloud Infrastructure provides cloud APIs for identity, regions, availability domains, compute instances, and networking.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/oci
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@oci/api-emulator.mjs --service oci
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /20160918/regions`
- `GET /20160918/availabilityDomains`
- `GET /20160918/instances`
- `GET /20160918/instances/:instanceId`
- `POST /20160918/instances/:instanceId`
- `GET /oci/inspect/state`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
oci:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.oracle.com/iaas/api/)
- [api-emulator](https://github.com/jsj/api-emulator)
