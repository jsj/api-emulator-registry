# @api-emulator/patreon

Patreon API v2 provides JSON:API resources for OAuth, identity, campaigns, members, posts, and webhooks.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/patreon
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@patreon/api-emulator.mjs --service patreon
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `POST /api/oauth2/token`
- `GET /api/oauth2/v2/identity`
- `GET /api/oauth2/v2/campaigns`
- `GET /api/oauth2/v2/campaigns/:id`
- `GET /api/oauth2/v2/campaigns/:id/members`
- `GET /api/oauth2/v2/campaigns/:id/tiers`
- `GET /api/oauth2/v2/members/:id`
- `GET /api/oauth2/v2/campaigns/:id/posts`
- `GET /api/oauth2/v2/posts/:id`
- `GET /api/oauth2/v2/webhooks`
- `POST /api/oauth2/v2/webhooks`
- `PATCH /api/oauth2/v2/webhooks/:id`
- `DELETE /api/oauth2/v2/webhooks/:id`
- `POST /api/oauth2/v2/lives`
- `GET /api/oauth2/v2/lives/:id`
- `PATCH /api/oauth2/v2/lives/:id`
- `GET /patreon/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
patreon:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.patreon.com/)
- [api-emulator](https://github.com/jsj/api-emulator)
