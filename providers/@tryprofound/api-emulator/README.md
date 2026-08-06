# @api-emulator/tryprofound

TryProfound provides AI search analytics APIs for organizations, prompts, reports, agents, knowledge bases, and content optimization.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/tryprofound
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@tryprofound/api-emulator.mjs --service tryprofound
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /v1/org`
- `GET /v1/org/domains`
- `GET /v1/org/personas`
- `GET /v1/org/assets`
- `GET /v1/org/models`
- `GET /v1/org/regions`
- `GET /v1/org/categories`
- `GET /v1/org/categories/:categoryId/assets`
- `GET /v1/org/categories/:categoryId/personas`
- `GET /v1/org/categories/:categoryId/prompts`
- `GET /v1/org/categories/:categoryId/tags`
- `GET /v1/org/categories/:categoryId/topics`
- `POST /v1/org/categories/:categoryId/prompts`
- `PATCH /v1/org/categories/:categoryId/prompts/status`
- `PATCH /v1/org/categories/:categoryId/prompts`
- `POST /v1/prompts/answers`
- `GET /v1/content/:assetId/optimization`
- `GET /v1/content/:assetId/optimization/:contentId`
- `GET /v1/agents`
- `GET /v1/agents/:agentId`
- `POST /v1/agents/:agentId/runs`
- `GET /v1/agents/:agentId/runs/:runId`
- `GET /v1/knowledge-bases`
- `POST /v1/knowledge-bases/:knowledgeBaseId/search`
- `POST /v1/knowledge-bases/:knowledgeBaseId/documents`
- `PUT /v1/knowledge-bases/:knowledgeBaseId/documents`
- `DELETE /v1/knowledge-bases/:knowledgeBaseId/documents`
- `POST /v1/knowledge-bases/:knowledgeBaseId/folders`
- `DELETE /v1/knowledge-bases/:knowledgeBaseId/folders`
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
tryprofound:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.tryprofound.com)
- [api-emulator](https://github.com/jsj/api-emulator)
