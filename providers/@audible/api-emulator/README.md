# @api-emulator/audible

Audible provides audiobook catalog, library, review, and wishlist API surfaces for local client compatibility tests.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/audible
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@audible/api-emulator.mjs --service audible
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /1.0/catalog/products`
- `GET /1.0/catalog/products/:asin`
- `GET /1.0/catalog/products/:asin/reviews`
- `GET /1.0/library`
- `GET /1.0/library/:asin`
- `GET /1.0/wishlist`
- `POST /1.0/wishlist`
- `DELETE /1.0/wishlist/:asin`
- `GET /audible/inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
audible:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://audible.readthedocs.io/en/latest/misc/external_api.html)
- [api-emulator](https://github.com/jsj/api-emulator)
