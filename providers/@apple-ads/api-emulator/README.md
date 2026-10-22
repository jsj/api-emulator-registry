# @api-emulator/apple-ads

Apple Ads Platform API v1 provides campaign management, reporting, recommendations, search popularity, account management, and change history.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/apple-ads
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@apple-ads/api-emulator.mjs --service apple-ads
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `POST /v1/${path}/query`
- `GET /v1/${path}/:id`
- `POST /v1/${path}`
- `PUT /v1/${path}/:id`
- `DELETE /v1/${path}/:id`
- `POST /v1/${path}/bulk-${operation}`
- `GET /health`
- `GET /openapi.json`
- `POST /auth/local`
- `GET /v1/search/apps`
- `POST /v1/eligibilities/apps/query`
- `GET /v1/apps/:id`
- `POST /v1/apps/:id/locale-details/query`
- `POST /v1/metadata/apps/supported-languages/query`
- `GET /v1/campaigns/:id/legacy-app-limited-status-reason-details`
- `POST /v1/product-pages/query`
- `GET /v1/product-pages/:id`
- `POST /v1/product-pages/locale-details/query`
- `POST /v1/assets/upload`
- `GET /v1/assets/:id`
- `DELETE /v1/assets/:id`
- `GET /v1/rejection-reasons/apps/:id`
- `POST /v1/rejection-reasons/business-brands/query`
- `POST /v1/reports/apps/${kind}/query`
- `POST /v1/reports/business-brands/${kind}/query`
- `POST /v1/insights/apps/impression-share/query`
- `POST /v1/insights/apps/search-term-popularity/query`
- `GET /v1/me`
- `GET /v1/acls`
- `GET /v1/orgs/:id`
- `GET /v1/advertiser-resources`
- `GET /v1/search/geo`
- `POST /v1/search/geo`
- `POST /v1/locations/query`
- `GET /v1/locations/:id`
- `POST /v1/ad-accounts`
- `GET /v1/ad-accounts/:id`
- `PUT /v1/ad-accounts/:id`
- `POST /v1/recommendations/${type}/${action}`
- `POST /v1/suggestions/keywords/query`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
apple-ads:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://ads.apple.com/adsdam/app-store/us/en_us/documents/api-preview-guide.pdf)
- [api-emulator](https://github.com/jsj/api-emulator)
