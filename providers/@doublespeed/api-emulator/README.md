# @api-emulator/doublespeed

DoubleSpeed provides social posting, comments, templates, clone jobs, webhooks, accounts, and Comment Monitor workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/doublespeed
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@doublespeed/api-emulator.mjs --service doublespeed
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /api/v1/accounts`
- `GET /api/v1/accounts/{accountId}`
- `PATCH /api/v1/accounts/{accountId}`
- `GET /api/v1/posts`
- `DELETE /api/v1/posts/{postId}`
- `POST /api/v1/posts/{postId}/deletion-request`
- `PATCH /api/v1/posts/{postId}/status`
- `POST /api/posts/create`
- `POST /api/posts/create-from-urls`
- `GET /api/v1/templates`
- `POST /api/v1/clone`
- `GET /api/v1/clone/{jobId}`
- `GET /api/v1/webhooks`
- `POST /api/v1/webhooks`
- `PATCH /api/v1/webhooks/{webhookId}`
- `DELETE /api/v1/webhooks/{webhookId}`
- `GET /api/v1/webhooks/{webhookId}/deliveries`
- `POST /api/v1/webhooks/{webhookId}/test`
- `POST /api/v1/webhooks/{webhookId}/deliveries/{deliveryId}/resend`
- `POST /api/v1/comments`
- `GET /api/v1/comments/status`
- `GET /api/v1/comments/webhook`
- `PUT /api/v1/comments/webhook`
- `DELETE /api/v1/comments/webhook`
- `POST /api/v1/comments/webhook/test`
- `GET /api/v1/monitors`
- `GET /api/v1/monitors/{monitorId}/accounts`
- `POST /api/v1/monitors/{monitorId}/accounts`
- `DELETE /api/v1/monitors/{monitorId}/accounts`
- `GET /api/v1/accounts/:accountId`
- `PATCH /api/v1/accounts/:accountId`
- `DELETE /api/v1/posts/:postId`
- `POST /api/v1/posts/:postId/deletion-request`
- `PATCH /api/v1/posts/:postId/status`
- `GET /api/v1/clone/:jobId`
- `PATCH /api/v1/webhooks/:webhookId`
- `DELETE /api/v1/webhooks/:webhookId`
- `GET /api/v1/webhooks/:webhookId/deliveries`
- `POST /api/v1/webhooks/:webhookId/test`
- `POST /api/v1/webhooks/:webhookId/deliveries/:deliveryId/resend`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
doublespeed:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://doublespeed.ai/docs/api-reference)
- [api-emulator](https://github.com/jsj/api-emulator)
