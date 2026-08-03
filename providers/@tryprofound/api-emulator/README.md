# @api-emulator/tryprofound

TryProfound provides AI search analytics APIs for organizations, prompts, reports, agents, knowledge bases, and content optimization.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/tryprofound
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@tryprofound/api-emulator.mjs --service tryprofound
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

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

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
tryprofound:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.tryprofound.com)
- [api-emulator](https://github.com/jsj/api-emulator)
