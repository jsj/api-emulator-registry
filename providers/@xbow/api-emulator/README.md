# @api-emulator/xbow

XBOW provides automated penetration-testing APIs for organizations, assets, assessments, findings, reports, resources, and webhooks.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/xbow
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@xbow/api-emulator.mjs --service xbow
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /api/v1/assessments/{assessmentId}`
- `POST /api/v1/assessments/{assessmentId}/cancel`
- `POST /api/v1/assessments/{assessmentId}/pause`
- `POST /api/v1/assessments/{assessmentId}/resume`
- `GET /api/v1/assets/{assetId}`
- `PUT /api/v1/assets/{assetId}`
- `GET /api/v1/assets/{assetId}/assessments`
- `POST /api/v1/assets/{assetId}/assessments`
- `GET /api/v1/assets/{assetId}/findings`
- `GET /api/v1/assets/{assetId}/reports`
- `GET /api/v1/findings/{findingId}`
- `PATCH /api/v1/findings/{findingId}`
- `POST /api/v1/findings/{findingId}/verify-fix`
- `POST /api/v1/integrations/{integrationId}/lightspeed`
- `GET /api/v1/integrations/{integrationId}/organizations`
- `POST /api/v1/integrations/{integrationId}/organizations`
- `DELETE /api/v1/keys/{keyId}`
- `GET /api/v1/meta/addresses`
- `GET /api/v1/meta/openapi.json`
- `GET /api/v1/meta/webhooks-signing-keys`
- `GET /api/v1/organizations/{organizationId}`
- `PUT /api/v1/organizations/{organizationId}`
- `GET /api/v1/organizations/{organizationId}/assets`
- `POST /api/v1/organizations/{organizationId}/assets`
- `POST /api/v1/organizations/{organizationId}/keys`
- `GET /api/v1/organizations/{organizationId}/resources`
- `POST /api/v1/organizations/{organizationId}/resources`
- `GET /api/v1/organizations/{organizationId}/webhooks`
- `POST /api/v1/organizations/{organizationId}/webhooks`
- `GET /api/v1/reports/{reportId}`
- `GET /api/v1/reports/{reportId}/summary`
- `DELETE /api/v1/resources/{resourceId}`
- `GET /api/v1/resources/{resourceId}`
- `POST /api/v1/resources/{resourceId}/commit`
- `POST /api/v1/resources/{resourceId}/parts`
- `DELETE /api/v1/webhooks/{webhookId}`
- `GET /api/v1/webhooks/{webhookId}`
- `PATCH /api/v1/webhooks/{webhookId}`
- `GET /api/v1/webhooks/{webhookId}/deliveries`
- `POST /api/v1/webhooks/{webhookId}/ping`

## Coverage

- Level: `contract-backed`
- Meaning: Automated tests compare this emulator with a defined API contract.
- Evidence: 83% medium conformance score.
- Smoke: `node providers/@xbow/smoke.mjs`
- Contract checks: `node scripts/check-xbow-openapi-coverage.mjs`

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
xbow:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.xbow.com/api/)
- [api-emulator](https://github.com/jsj/api-emulator)
