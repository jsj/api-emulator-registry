# @api-emulator/uipath

UiPath Orchestrator APIs provide OData workflows for folders, users, releases, jobs, queues, robots, and assets.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/uipath
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@uipath/api-emulator.mjs --service uipath
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET ${prefix}/Folders`
- `GET ${prefix}/Users/UiPath.Server.Configuration.OData.GetCurrentUserExtended`
- `GET ${prefix}/Releases/UiPath.Server.Configuration.OData.ListReleases`
- `GET ${prefix}/Jobs`
- `POST ${prefix}/Jobs/UiPath.Server.Configuration.OData.StartJobs`
- `GET ${prefix}/QueueDefinitions`
- `GET ${prefix}/QueueItems`
- `GET ${prefix}/Robots`
- `GET ${prefix}/Assets`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
uipath:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.uipath.com/orchestrator/automation-cloud/latest/api-guide/introduction)
- [api-emulator](https://github.com/jsj/api-emulator)
