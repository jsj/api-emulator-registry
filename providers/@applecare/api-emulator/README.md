# @api-emulator/applecare

AppleCare coverage APIs provide organization device inventory, warranty coverage, service eligibility, and repair case workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/applecare
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@applecare/api-emulator.mjs --service applecare
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /v1/orgDevices`
- `GET /v1/orgDevices/:deviceId`
- `GET /v1/orgDevices/:deviceId/appleCareCoverage`
- `GET /v1/coverage/:serialNumber`
- `POST /v1/repairCases`
- `GET /v1/repairCases/:caseId`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
applecare:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://support.apple.com/guide/apple-business-manager/create-an-api-account-axm33189f66a/web)
- [api-emulator](https://github.com/jsj/api-emulator)
