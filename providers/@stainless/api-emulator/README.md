# @api-emulator/stainless

Stainless provides SDK generation APIs for projects, branches, configs, builds, diagnostics, and generated target outputs.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/stainless
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@stainless/api-emulator.mjs --service stainless
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /health`
- `POST /api/oauth/device`
- `POST /v0/oauth/token`
- `GET /v0/user`
- `GET /v0/orgs`
- `GET /v0/projects`
- `POST /v0/projects`
- `GET /v0/projects/:project`
- `PATCH /v0/projects/:project`
- `POST /v0/projects/:project/generate_commit_message`
- `GET /v0/projects/:project/configs`
- `POST /v0/projects/:project/configs/guess`
- `POST /v0/projects/:project/branches`
- `GET /v0/projects/:project/branches`
- `GET /v0/projects/:project/branches/:branch`
- `DELETE /v0/projects/:project/branches/:branch`
- `PUT /v0/projects/:project/branches/:branch/rebase`
- `PUT /v0/projects/:project/branches/:branch/reset`
- `GET /v0/builds`
- `POST /v0/builds`
- `GET /v0/builds/:id`
- `GET /v0/builds/:id/diagnostics`
- `POST /v0/builds/compare`
- `GET /v0/build_target_outputs`
- `POST /api/generate/spec`
- `GET /stainless/inspect/contract`
- `GET /stainless/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
stainless:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.stainless.com/docs/getting-started/quickstart-cli)
- [api-emulator](https://github.com/jsj/api-emulator)
