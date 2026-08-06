# @api-emulator/uber

Uber provides Rides, Direct, and Eats APIs for profiles, products, estimates, ride requests, history, payment methods, places, deliveries, stores, menus, orders, reports, and webhooks.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/uber
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@uber/api-emulator.mjs --service uber
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /v1/me`
- `GET /v1.2/me`
- `PATCH /v1.2/me`
- `GET /v1/products`
- `GET /v1.2/products/:productId`
- `GET /v1/estimates/price`
- `GET /v1/estimates/time`
- `GET /v1.2/history`
- `GET /v1.2/payment-methods`
- `GET /v1.2/payment-methods/:paymentMethodId`
- `PATCH /v1.2/payment-methods/:paymentMethodId`
- `DELETE /v1.2/payment-methods/:paymentMethodId`
- `GET /v1.2/places/:placeId`
- `PUT /v1.2/places/:placeId`
- `GET /v1.2/me/promotions`
- `POST /v1.2/me/vouchers/redeem`
- `POST /v1.2/requests/estimate`
- `POST /v1.2/requests`
- `GET /v1.2/requests/current`
- `PATCH /v1.2/requests/current`
- `DELETE /v1.2/requests/current`
- `GET /v1.2/requests/:requestId`
- `DELETE /v1.2/requests/:requestId`
- `PATCH /v1.2/requests/:requestId`
- `GET /v1.2/requests/:requestId/map`
- `GET /v1.2/requests/:requestId/receipt`
- `PUT /v1.2/sandbox/products/:productId`
- `PUT /v1.2/sandbox/requests/:requestId`
- `GET /v1.2/sandbox/map`
- `POST /v1/customers/:customerId/delivery_quotes`
- `POST /v1/customers/:customerId/deliveries`
- `GET /v1/customers/:customerId/deliveries/:deliveryId`
- `POST /v1/customers/:customerId/deliveries/:deliveryId/cancel`
- `GET /v1/customers/:customerId/deliveries/:deliveryId/proof-of-delivery`
- `POST /event.delivery_status`
- `POST /event.courier_update`
- `GET /eats/stores`
- `GET /eats/stores/:storeId`
- `PATCH /eats/stores/:storeId`
- `GET /eats/stores/:storeId/menu`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
uber:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.uber.com/docs)
- [api-emulator](https://github.com/jsj/api-emulator)
