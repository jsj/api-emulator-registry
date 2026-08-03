# @api-emulator/linkedin

LinkedIn provides profile, organization, posting, advertising, analytics, and OAuth APIs for professional network workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/linkedin
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@linkedin/api-emulator.mjs --service linkedin
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `POST /oauth/v2/accessToken`
- `GET /v2/me`
- `POST /v2/ugcPosts`
- `GET /v2/ugcPosts`
- `GET /v2/organizations`
- `GET /v2/adAccountsV2`
- `GET /v2/adCampaignsV2`
- `GET /rest/adAccounts`
- `GET /rest/adCampaigns`
- `GET /linkedin/inspect/contract`
- `GET /linkedin/inspect/state`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
linkedin:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://learn.microsoft.com/linkedin/)
- [api-emulator](https://github.com/jsj/api-emulator)
