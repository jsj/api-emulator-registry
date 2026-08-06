# @api-emulator/unity-ads

Unity Ads provides Advertising Management, Advertising Statistics, and Monetization Stats APIs for apps, campaigns, and ad performance reports.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/unity-ads
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@unity-ads/api-emulator.mjs --service unity-ads
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `POST /auth/v1/token-exchange`
- `GET /advertise/v1/organizations/:organizationId/apps`
- `POST /advertise/v1/organizations/:organizationId/apps`
- `GET /advertise/v1/apps/:appId`
- `GET /advertise/v1/apps/:appId/campaigns`
- `POST /advertise/v1/apps/:appId/campaigns`
- `GET /advertise/v1/campaigns/:campaignId`
- `PATCH /advertise/v1/campaigns/:campaignId`
- `DELETE /advertise/v1/campaigns/:campaignId`
- `GET /stats/v1/operate/organizations/:organizationId`
- `GET /statistics/v2/organizations/:organizationId/reports`
- `GET /unity-ads/inspect/contract`
- `GET /unity-ads/inspect/state`
- `GET /unity-ads/inspect/hits`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
unity-ads:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://services.docs.unity.com/advertise/v1/)
- [api-emulator](https://github.com/jsj/api-emulator)
