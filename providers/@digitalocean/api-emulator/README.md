# @api-emulator/digitalocean

DigitalOcean provides cloud infrastructure APIs for accounts, projects, droplets, networking, and managed resources.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/digitalocean
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@digitalocean/api-emulator.mjs --service digitalocean
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /v2/account`
- `GET /v2/projects`
- `POST /v2/projects`
- `GET /v2/projects/:projectId`
- `GET /v2/droplets`
- `GET /v2/droplets/:dropletId`
- `GET /digitalocean/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
digitalocean:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.digitalocean.com/reference/api/)
- [api-emulator](https://github.com/jsj/api-emulator)
