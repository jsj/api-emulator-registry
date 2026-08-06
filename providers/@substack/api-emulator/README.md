# @api-emulator/substack

Substack-compatible APIs provide publication metadata, newsletter posts, drafts, and subscribers.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/substack
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@substack/api-emulator.mjs --service substack
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /api/v1/publication`
- `GET /api/v1/posts`
- `GET /api/v1/posts/:id`
- `POST /api/v1/posts`
- `PATCH /api/v1/posts/:id`
- `DELETE /api/v1/posts/:id`
- `GET /api/v1/subscribers`
- `POST /api/v1/subscribers`
- `GET /api/v1/posts/:id/comments`
- `POST /api/v1/posts/:id/comments`
- `GET /api/v1/recommendations`
- `GET /substack/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
substack:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://substack-api.readthedocs.io/)
- [api-emulator](https://github.com/jsj/api-emulator)
