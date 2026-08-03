# @api-emulator/sourcegraph

Sourcegraph provides code search, GraphQL, Cody context, and LLM model APIs for developer tooling workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/sourcegraph
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@sourcegraph/api-emulator.mjs --service sourcegraph
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `POST /.api/graphql`
- `GET /.api/search/stream`
- `GET /.api/llm/models`
- `GET /.api/llm/models/:modelId`
- `POST /.api/cody/context`
- `GET /sourcegraph/inspect/state`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
sourcegraph:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://sourcegraph.com/docs/api)
- [api-emulator](https://github.com/jsj/api-emulator)
