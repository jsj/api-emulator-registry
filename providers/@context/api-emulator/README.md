# @api-emulator/context

Context.dev provides brand intelligence, web scraping, extraction, industry classification, and transaction enrichment APIs.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/context
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@context/api-emulator.mjs --service context
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

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

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
context:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.context.dev)
- [api-emulator](https://github.com/jsj/api-emulator)
