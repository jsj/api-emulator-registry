# @api-emulator/replit

Replit provides extension Data API and GraphQL surfaces for users, Repls, and extension public key workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/replit
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@replit/api-emulator.mjs --service replit
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `POST /graphql`
- `GET /data/extensions/publicKey/:kid`
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
replit:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.replit.com/extensions/api/data)
- [api-emulator](https://github.com/jsj/api-emulator)
