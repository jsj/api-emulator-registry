# @api-emulator/context

Context.dev provides brand intelligence, web scraping, extraction, industry classification, and transaction enrichment APIs.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/context
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@context/api-emulator.mjs --service context
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET ${prefix}/brand/retrieve`
- `GET ${prefix}/brand/retrieve/simple`
- `GET ${prefix}/brand/transaction_identifier`
- `POST ${prefix}/brand/ai/product`
- `POST ${prefix}/brand/ai/query`
- `GET ${prefix}/web/styleguide`
- `GET ${prefix}/web/fonts`
- `GET ${prefix}/web/scrape/markdown`
- `GET ${prefix}/web/scrape/html`
- `GET ${prefix}/web/scrape/images`
- `GET ${prefix}/web/scrape/sitemap`
- `POST ${prefix}/web/crawl`
- `GET ${prefix}/web/screenshot`
- `GET ${prefix}/web/naics`
- `GET ${prefix}/web/sic`
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
context:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.context.dev)
- [api-emulator](https://github.com/jsj/api-emulator)
