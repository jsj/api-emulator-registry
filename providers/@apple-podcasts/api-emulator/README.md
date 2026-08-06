# @api-emulator/apple-podcasts

Apple Podcasts provides iTunes Search-compatible podcast search, lookup, episode, catalog, and library subscription workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/apple-podcasts
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@apple-podcasts/api-emulator.mjs --service apple-podcasts
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

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

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
apple-podcasts:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://performance-partners.apple.com/search-api)
- [api-emulator](https://github.com/jsj/api-emulator)
