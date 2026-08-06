# @api-emulator/huggingface

Hugging Face provides Hub APIs for users, models, datasets, Spaces, repository metadata, files, OAuth, and repo creation workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/huggingface
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@huggingface/api-emulator.mjs --service huggingface
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /.well-known/openid-configuration`
- `GET /.well-known/jwks.json`
- `GET /api/whoami-v2`
- `GET /api/users/:user/likes`
- `GET /api/${plural}`
- `GET /api/${plural}/:namespace/:repo`
- `GET /api/${plural}/:repo`
- `GET /api/${plural}/:namespace/:repo/tree/:rev`
- `GET /api/${plural}/:namespace/:repo/tree/:rev/:path{.+}`
- `GET /api/${plural}/:namespace/:repo/likers`
- `POST /api/${plural}/:namespace/:repo/like`
- `GET /api/${plural}/:namespace/:repo/refs`
- `POST /api/repos/create`
- `GET /oauth/authorize`
- `POST /oauth/register`
- `POST /oauth/device`
- `POST /oauth/token`
- `GET /oauth/userinfo`
- `POST /oauth/userinfo`
- `GET /huggingface/inspect/state`
- `POST /huggingface/reset`
- `GET /inspect/contract`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
huggingface:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://huggingface.co/docs/hub/api)
- [api-emulator](https://github.com/jsj/api-emulator)
