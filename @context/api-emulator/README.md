# @api-emulator/context

Local deterministic emulator for Context.dev brand intelligence, web scraping, and extraction APIs.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/context
```

## Run

```bash
npx -p api-emulator api --plugin ./@context/api-emulator.mjs --service context
```

## Endpoints

- `GET /v1/brand/retrieve` — retrieve brand data by domain.
- `GET /v1/brand/retrieve/simple` — retrieve essential brand data by domain.
- `GET /v1/brand/transaction_identifier` — identify a brand from transaction text.
- `POST /v1/brand/ai/product` — extract a deterministic product from a URL.
- `POST /v1/brand/ai/query` — answer structured data extraction prompts.
- `GET /v1/web/styleguide` — return a deterministic website styleguide.
- `GET /v1/web/fonts` — return deterministic font usage data.
- `GET /v1/web/scrape/markdown` — return deterministic scraped Markdown.
- `GET /v1/web/scrape/html` — return deterministic scraped HTML.
- `GET /v1/web/scrape/images` — return deterministic image assets.
- `GET /v1/web/scrape/sitemap` — return deterministic sitemap URLs.
- `POST /v1/web/crawl` — return deterministic crawl results.
- `GET /v1/web/screenshot` — return a deterministic screenshot URL.
- `GET /v1/web/naics` — return deterministic NAICS classification.
- `GET /v1/web/sic` — return deterministic SIC classification.

## Auth

Send `Authorization: Bearer context_emulator_key`, `ctx_emulator_key`, or `test_api_key`. Missing tokens are accepted for local SDK compatibility; unknown bearer tokens return Context.dev-shaped `UNAUTHORIZED` errors.

## Seed Configuration

```yaml
context:
  apiKey: context_emulator_key
  brands:
    example.com:
      title: Example
```

## Links

- [Official API docs](https://docs.context.dev)
- [Official OpenAPI spec](https://app.stainless.com/api/spec/documented/context.dev/openapi.documented.yml)
- [api-emulator](https://github.com/jsj/api-emulator)
