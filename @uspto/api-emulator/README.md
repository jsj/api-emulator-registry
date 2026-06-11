# @api-emulator/uspto

USPTO provides Open Data Portal patent assignment and TSDR-compatible trademark status APIs.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/uspto
```

## Run

```bash
npx -p api-emulator api --plugin ./@uspto/api-emulator.mjs --service uspto
```

## Endpoints

- `GET /inspect/contract`
- `GET /api/v1/patent/applications/:applicationNumber/assignment`
- `GET /ts/cd/casestatus/:serialNumber/info.json`

## Auth

Uses fake local credentials only; provide any deterministic bearer token or API key expected by the client under test.

## Seed Configuration

```yaml
uspto:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://data.uspto.gov/apis/getting-started)
- [api-emulator](https://github.com/jsj/api-emulator)
