# @api-emulator/arxiv

arXiv provides Atom feed APIs for scholarly paper search, metadata retrieval, and offset pagination workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/arxiv
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@arxiv/api-emulator.mjs --service arxiv
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /api/query`
- `GET /arxiv/inspect/contract`
- `GET /arxiv/inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
arxiv:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://info.arxiv.org/help/api/user-manual.html)
- [api-emulator](https://github.com/jsj/api-emulator)
