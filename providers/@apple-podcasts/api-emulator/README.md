# @api-emulator/apple-podcasts

Apple Podcasts provides iTunes Search-compatible podcast search, lookup, episode, catalog, and library subscription workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/apple-podcasts
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@apple-podcasts/api-emulator.mjs --service apple-podcasts
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /search`
- `GET /lookup`
- `GET /v1/me`
- `GET /v1/catalog/:storefront/podcasts`
- `GET /v1/catalog/:storefront/podcasts/:id`
- `GET /v1/catalog/:storefront/podcasts/:id/episodes`
- `GET /v1/me/library/podcasts`
- `PUT /v1/me/library/podcasts/:id`
- `DELETE /v1/me/library/podcasts/:id`
- `GET /inspect/state`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
apple-podcasts:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://performance-partners.apple.com/search-api)
- [api-emulator](https://github.com/jsj/api-emulator)
