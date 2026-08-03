# @api-emulator/capcut

CapCut-style creative APIs manage templates, projects, media inputs, and render task polling for video automation workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/capcut
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@capcut/api-emulator.mjs --service capcut
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
capcut:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://www.capcut.com/)
- [api-emulator](https://github.com/jsj/api-emulator)
