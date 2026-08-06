# @api-emulator/sourcegraph

Sourcegraph provides code search, GraphQL, Cody context, and LLM model APIs for developer tooling workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/sourcegraph
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@sourcegraph/api-emulator.mjs --service sourcegraph
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `POST /.api/graphql`
- `GET /.api/search/stream`
- `GET /.api/llm/models`
- `GET /.api/llm/models/:modelId`
- `POST /.api/cody/context`
- `GET /sourcegraph/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
sourcegraph:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://sourcegraph.com/docs/api)
- [api-emulator](https://github.com/jsj/api-emulator)
