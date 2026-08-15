# @api-emulator/apple-ads

This package emulates the Apple Ads Platform API v1 with deterministic state and test credentials.

It is part of [api-emulator](https://github.com/jsj/api-emulator), which provides local API services for tests and offline agents.

## Install

```bash
npm install @api-emulator/apple-ads
```

## Run

Run this command from the registry root:

```bash
npx -p api-emulator api --plugin ./providers/@apple-ads/api-emulator.mjs --service apple-ads
```

Use the local URL that `api-emulator` displays.

## Supported API

The emulator supports these Apple Ads Platform API v1 areas:

- Apps, eligibility records, and app locale details
- Campaigns, ad groups, keywords, negative keywords, and ads
- Creatives, product pages, assets, rejection reasons, and shared budgets
- Business brands, business categories, location groups, and locations
- Bulk keyword operations
- Campaign, ad group, ad, keyword, and search-term reports
- Business-brand campaign, ad group, ad, keyword, and search-term reports
- Impression-share reports and search-term-popularity reports
- Ad accounts, organizations, access lists, and advertiser resources
- Recommendations, suggestions, and change history

## Authentication

Use `POST /auth/local` to get the fixed test token and account identifiers.

Send the token and account identifier with each `/v1` request:

```text
Authorization: Bearer apple-ads-emulator-token
X-AP-Context: adAccountId=123456789
```

## Test data

The emulator uses fixed data for the fictional AwayFinder app and its campaigns.

The test data does not contain production credentials or customer information.

## Coverage

- Level: `full-operation`
- Operations: `104 of 104`
- Contract: `GET /openapi.json`
- Evidence: The coverage check calls every operation in the generated contract.

Run the coverage check from the registry root:

```bash
npm run contract:apple-ads
```

The OpenAPI document uses general request and response schemas.
Apple has not published the complete v1 field schemas.
The July 2026 preview guide lists 78 operations.
Apple Developer documentation supplies 26 additional operations.

## Links

- [Apple Ads Platform API v1 guide](https://ads.apple.com/adsdam/app-store/us/en_us/documents/api-preview-guide.pdf)
- [api-emulator](https://github.com/jsj/api-emulator)
