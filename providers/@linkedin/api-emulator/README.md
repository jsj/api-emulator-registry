# @api-emulator/linkedin

LinkedIn provides profile, organization, posting, advertising, analytics, and OAuth APIs for professional network workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/linkedin
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@linkedin/api-emulator.mjs --service linkedin
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

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

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
linkedin:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://learn.microsoft.com/linkedin/)
- [api-emulator](https://github.com/jsj/api-emulator)
