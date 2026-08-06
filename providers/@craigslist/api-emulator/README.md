# @api-emulator/craigslist

Craigslist provides Bulkpost OpenAPI surfaces for OAuth, billing, account messages, posting stats, post edits, images, status, RSS feeds, and classifieds search workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/craigslist
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@craigslist/api-emulator.mjs --service craigslist
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `POST /bulkpost/oauth/access-token`
- `GET /bulkpost/v1/account/billing/credit`
- `GET /bulkpost/v1/account/billing/current-pricing/area/:areaAbbr/category/:categoryAbbr`
- `POST /bulkpost/v1/account/billing/make-invoice`
- `GET /bulkpost/v1/account/billing/posting-block-balances`
- `PUT /bulkpost/v1/account/message/:messageId/ack`
- `GET /bulkpost/v1/account/stats/all-postings`
- `GET /bulkpost/v1/account/stats/posting/:postingId`
- `GET /bulkpost/v1/posting/zip/:zip/area`
- `GET /bulkpost/v1/postings/:postingId`
- `PATCH /bulkpost/v1/postings/:postingId`
- `DELETE /bulkpost/v1/postings/:postingId`
- `GET /bulkpost/v1/postings/:postingId/body`
- `PUT /bulkpost/v1/postings/:postingId/body`
- `GET /bulkpost/v1/postings/:postingId/images`
- `POST /bulkpost/v1/postings/:postingId/images`
- `PUT /bulkpost/v1/postings/:postingId/images`
- `GET /bulkpost/v1/postings/:postingId/images/:imageId`
- `DELETE /bulkpost/v1/postings/:postingId/images/:imageId`
- `GET /bulkpost/v1/postings/:postingId/price`
- `PUT /bulkpost/v1/postings/:postingId/price`
- `GET /bulkpost/v1/postings/:postingId/remuneration`
- `PUT /bulkpost/v1/postings/:postingId/remuneration`
- `GET /bulkpost/v1/postings/:postingId/status`
- `PUT /bulkpost/v1/postings/:postingId/status`
- `PUT /bulkpost/v1/postings/:postingId/undelete`
- `GET /search/:area/:category.json`
- `GET /search/:area/:category.rss`
- `GET /:area/search/:category`
- `GET /:area/search/:category/rss`
- `POST /posting/bulk`
- `GET /posts`
- `GET /posts/:postId`
- `DELETE /posts/:postId`
- `GET /inspect/contract`
- `GET /inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
craigslist:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://bapi.craigslist.org/bulkpost-docs/v1/)
- [api-emulator](https://github.com/jsj/api-emulator)
