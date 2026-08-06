# @api-emulator/xbox

Xbox publishing-style Microsoft Store APIs provide app submissions, flights, package metadata, and publish status workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/xbox
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@xbox/api-emulator.mjs --service xbox
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

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

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
xbox:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://learn.microsoft.com/en-us/windows/uwp/monetize/create-and-manage-submissions-using-windows-store-services)
- [api-emulator](https://github.com/jsj/api-emulator)
