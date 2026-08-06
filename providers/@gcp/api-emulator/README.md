# @api-emulator/gcp

Google Cloud Platform provides cloud resource, compute, service usage, billing, IAM, and gcloud-oriented infrastructure APIs.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/gcp
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@gcp/api-emulator.mjs --service gcp
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /v1/projects`
- `POST /v1/projects`
- `GET /v1/projects/:projectId`
- `DELETE /v1/projects/:projectId`
- `GET /v3/projects`
- `POST /v3/projects`
- `GET /v3/projects/:projectId`
- `DELETE /v3/projects/:projectId`
- `GET /compute/v1/projects/:projectId/zones`
- `GET /compute/v1/projects/:projectId/zones/:zone/instances`
- `POST /compute/v1/projects/:projectId/zones/:zone/instances`
- `GET /compute/v1/projects/:projectId/zones/:zone/instances/:instance`
- `GET /v1/projects/:projectId/services`
- `GET /v1/projects/:projectId/services/:serviceName`
- `GET /gcp/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
gcp:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.cloud.google.com/sdk/docs/install-sdk)
- [api-emulator](https://github.com/jsj/api-emulator)
