# @api-emulator/audible

Audible provides audiobook catalog, library, review, and wishlist API surfaces for local client compatibility tests.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/audible
```

## Run

```bash
npx -p api-emulator api --plugin ./@audible/api-emulator.mjs --service audible
```

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

## Auth

No production credentials are required. The emulator accepts fake bearer tokens such as `audible_emulator_token`; marketplace-specific state defaults to `us`.

## Seed Configuration

```yaml
audible:
  marketplace: us
  products:
    - asin: B0EMU00001
      title: Localhost Listening
      authors:
        - name: API Emulator
  library:
    - asin: B0EMU00001
      percent_complete: 0
      is_finished: false
```

## Links

- [Unofficial Audible API notes](https://audible.readthedocs.io/en/latest/misc/external_api.html)
- [mkb79/audible SDK](https://github.com/mkb79/Audible)
- [api-emulator](https://github.com/jsj/api-emulator)
