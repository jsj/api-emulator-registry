# @api-emulator/audible

Audible provides audiobook catalog, library, review, and wishlist API surfaces for local client compatibility tests.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/audible
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@audible/api-emulator.mjs --service audible
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /1.0/catalog/products`
- `GET /1.0/catalog/products/:asin`
- `GET /1.0/catalog/products/:asin/reviews`
- `GET /1.0/library`
- `GET /1.0/library/:asin`
- `GET /1.0/wishlist`
- `POST /1.0/wishlist`
- `DELETE /1.0/wishlist/:asin`
- `GET /audible/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
audible:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://audible.readthedocs.io/en/latest/misc/external_api.html)
- [api-emulator](https://github.com/jsj/api-emulator)
