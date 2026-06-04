# @api-emulator/finnhub

Finnhub emulates deterministic market and company news endpoints for local client and SDK tests.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/finnhub
```

## Run

```bash
npx -p api-emulator api --plugin ./@finnhub/api-emulator.mjs --service finnhub
```

## Endpoints

- `GET /news` — returns latest market news for `general`, `forex`, `crypto`, or `merger`
- `GET /company-news` — returns latest company news for a symbol and date range
- `GET /api/v1/news` — Finnhub base-path alias
- `GET /api/v1/company-news` — Finnhub base-path alias

## Auth

The emulator accepts `token=finnhub-emulator-token`, `token=demo-token`, or matching `X-Finnhub-Token` header values. Missing tokens are allowed for local compatibility; unknown tokens return a Finnhub-shaped authorization error.

## Seed Configuration

```yaml
finnhub:
  acceptedTokens:
    - finnhub-emulator-token
  marketNews:
    general:
      - id: 5085164
        category: technology
        datetime: 1714374000
        headline: Example headline
        image: https://static.finnhub.io/emulator/news/5085164.jpg
        related: ""
        source: Finnhub Emulator
        summary: Example summary
        url: https://example.com/finnhub/news/5085164
  companyNews:
    AAPL:
      - id: 25286
        category: company news
        datetime: 1714374000
        headline: Apple example headline
        image: https://static.finnhub.io/emulator/news/25286.jpg
        related: AAPL
        source: Finnhub Emulator
        summary: Example summary
        url: https://example.com/finnhub/news/25286
```

To refresh the sanitized fixture from Finnhub without storing credentials:

```bash
FINNHUB_API_KEY=... node @finnhub/scripts/capture-real.mjs
```

Raw captures are written under `.emu/` and ignored by git; review `@finnhub/fixtures/sanitized.json` before committing.

## Links

- [Official API docs](https://finnhub.io/docs/api/market-news)
- [Official Swagger schema](https://finnhub.io/static/swagger.json)
- [api-emulator](https://github.com/jsj/api-emulator)
