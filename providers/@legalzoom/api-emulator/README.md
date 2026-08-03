# @api-emulator/legalzoom

LegalZoom provides legal-services workflows for customers, products, orders, business formations, and generated documents.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/legalzoom
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@legalzoom/api-emulator.mjs --service legalzoom
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /v1/customers`
- `POST /v1/customers`
- `GET /v1/products`
- `GET /v1/orders`
- `POST /v1/orders`
- `GET /v1/orders/:orderId`
- `POST /v1/business-formations`
- `GET /v1/business-formations/:formationId`
- `GET /v1/orders/:orderId/documents`
- `GET /v1/documents/:documentId`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
legalzoom:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.legalzoom.com/)
- [api-emulator](https://github.com/jsj/api-emulator)
