# @api-emulator/snap

Snap Ads provides Marketing API surfaces for OAuth, organizations, ad accounts, campaigns, ads, and reporting.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/snap
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@snap/api-emulator.mjs --service snap
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `POST /login/oauth2/access_token`
- `GET /v1/me/organizations`
- `GET /v1/organizations/:organizationId/adaccounts`
- `GET /v1/adaccounts/:adAccountId/campaigns`
- `GET /v1/campaigns/:campaignId/stats`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
snap:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://marketingapi.snapchat.com/docs)
- [api-emulator](https://github.com/jsj/api-emulator)
