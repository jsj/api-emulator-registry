# @api-emulator/xbox

Xbox publishing-style Microsoft Store APIs provide app submissions, flights, package metadata, and publish status workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/xbox
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@xbox/api-emulator.mjs --service xbox
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /v1.0/my/applications`
- `GET /v1.0/my/applications/:applicationId`
- `POST /v1.0/my/applications/:applicationId/submissions`
- `GET /v1.0/my/applications/:applicationId/submissions/:submissionId`
- `PUT /v1.0/my/applications/:applicationId/submissions/:submissionId`
- `POST /v1.0/my/applications/:applicationId/submissions/:submissionId/commit`
- `GET /v1.0/my/applications/:applicationId/submissions/:submissionId/status`
- `GET /v1.0/my/applications/:applicationId/listflights`
- `POST /v1.0/my/applications/:applicationId/flights/:flightId/submissions`
- `GET /v1.0/my/applications/:applicationId/flights/:flightId/submissions/:submissionId`
- `PUT /v1.0/my/applications/:applicationId/flights/:flightId/submissions/:submissionId`
- `POST /v1.0/my/applications/:applicationId/flights/:flightId/submissions/:submissionId/commit`
- `GET /v1.0/my/applications/:applicationId/flights/:flightId/submissions/:submissionId/status`
- `GET /submission/v1/product/:productId/metadata/listings`
- `PUT /submission/v1/product/:productId/metadata/listings`
- `GET /submission/v1/product/:productId/packages`
- `PUT /submission/v1/product/:productId/packages`
- `PATCH /submission/v1/product/:productId/packages/:packageId`
- `POST /submission/v1/product/:productId/submission`
- `GET /submission/v1/product/:productId/submission/:submissionId/status`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
xbox:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://learn.microsoft.com/en-us/windows/uwp/monetize/create-and-manage-submissions-using-windows-store-services)
- [api-emulator](https://github.com/jsj/api-emulator)
