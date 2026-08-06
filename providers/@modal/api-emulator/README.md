# @api-emulator/modal

Modal provides serverless Python compute control-plane APIs for apps, environments, secrets, volumes, workspaces, and tokens.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/modal
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@modal/api-emulator.mjs --service modal
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /modal/inspect/state`
- `POST /modal/inspect/reset`
- `POST /modal/forge/inference`
- `GET /modal/v1/token/info`
- `GET /modal/v1/workspace`
- `GET /modal/v1/environments`
- `POST /modal/v1/environments`
- `GET /modal/v1/apps`
- `POST /modal/v1/apps`
- `GET /modal/v1/apps/:app_id`
- `PATCH /modal/v1/apps/:app_id`
- `DELETE /modal/v1/apps/:app_id`
- `GET /modal/v1/secrets`
- `POST /modal/v1/secrets`
- `GET /modal/v1/volumes`
- `POST /modal/v1/volumes`

## Coverage

- Level: `contract-backed`
- Meaning: Automated tests compare this emulator with a defined API contract.
- Evidence: 65% medium conformance score.
- Smoke: `node providers/@modal/smoke.mjs`

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
modal:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://modal.com/docs/reference)
- [api-emulator](https://github.com/jsj/api-emulator)
