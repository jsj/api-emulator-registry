# @api-emulator/brave-search

Brave Search provides web, news, and suggestion search APIs for agentic retrieval and SERP-style workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/brave-search
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@brave-search/api-emulator.mjs --service brave-search
```

## Fidelity

- Tier: `stub`
- Evidence: starter surface with smoke coverage

## Endpoints

The emulator source lists the supported local API endpoints.

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
brave-search:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://api.search.brave.com)
- [api-emulator](https://github.com/jsj/api-emulator)
