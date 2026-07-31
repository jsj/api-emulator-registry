# @api-emulator/doordash

DoorDash provides Drive, Drive Classic, Developer, and Marketplace APIs for delivery quotes, serviceability, stores, businesses, menus, orders, item management, promotions, and webhooks.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/doordash
```

## Run

```bash
npx -p api-emulator api --plugin ./@doordash/api-emulator.mjs --service doordash
```

## Fidelity

- Tier: `smoke-only`
- Evidence: direct smoke test exists; no conformance manifest yet

## Endpoints

- `POST /drive/v2/quotes`
- `POST /drive/v2/quotes/:externalDeliveryId/accept`
- `POST /drive/v2/deliveries`
- `GET /drive/v2/deliveries/:externalDeliveryId`
- `PATCH /drive/v2/deliveries/:externalDeliveryId`
- `DELETE /drive/v2/deliveries/:externalDeliveryId`
- `POST /drive/v2/deliveries/:externalDeliveryId/cancel`
- `POST /drive/v2/estimates`
- `POST /drive/v2/serviceability`
- `GET /drive/v2/address/auto_complete`
- `POST /drive/v2/items_substitution_recommendation`
- `POST /drive/v2/checkout_audit_signal`
- `POST /drive/v1/estimates`
- `POST /drive/v1/validations`
- `POST /drive/v1/deliveries`
- `GET /drive/v1/deliveries/:deliveryId`
- `PATCH /drive/v1/deliveries/:deliveryId`
- `POST /drive/v1/deliveries/:deliveryId/cancel`
- `POST /mcp/consumer`
- `GET /consumer/v1/stores/search`
- `GET /consumer/v1/stores/:storeId`
- `GET /consumer/v1/stores/:storeId/menu`
- `POST /consumer/v1/carts`
- `GET /consumer/v1/carts/:cartId`
- `POST /consumer/v1/carts/:cartId/items`
- `DELETE /consumer/v1/carts/:cartId/items/:itemId`
- `POST /consumer/v1/carts/:cartId/preview`
- `POST /consumer/v1/carts/:cartId/checkout`
- `GET /consumer/v1/orders`
- `GET /consumer/v1/orders/:orderId`
- `GET /developer/v1/businesses`
- `POST /developer/v1/businesses`
- `GET /developer/v1/businesses/:businessId`
- `PATCH /developer/v1/businesses/:businessId`
- `GET /developer/v1/businesses/:businessId/stores`
- `POST /developer/v1/businesses/:businessId/stores`
- `GET /developer/v1/businesses/:businessId/stores/:storeId`
- `PATCH /developer/v1/businesses/:businessId/stores/:storeId`
- `POST /api/v1/menus`
- `GET /api/v1/menus/:menuId`

## Auth

No production credentials are required. Use fake local credentials in client tests.

## Seed Configuration

```yaml
doordash:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.doordash.com/en-US/api/drive/)
- [api-emulator](https://github.com/jsj/api-emulator)
