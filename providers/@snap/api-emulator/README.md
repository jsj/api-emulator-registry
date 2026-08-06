# @api-emulator/snap

Snap Ads provides Marketing API surfaces for OAuth, organizations, ad accounts, campaigns, ads, and reporting.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/snap
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@snap/api-emulator.mjs --service snap
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `POST /login/oauth2/access_token`
- `GET /v1/me/organizations`
- `GET /v1/organizations/:organizationId/adaccounts`
- `GET /v1/adaccounts/:adAccountId/campaigns`
- `GET /v1/campaigns/:campaignId/stats`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
snap:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://marketingapi.snapchat.com/docs)
- [api-emulator](https://github.com/jsj/api-emulator)
