# @api-emulator/uipath

UiPath Orchestrator APIs provide OData workflows for folders, users, releases, jobs, queues, robots, and assets.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/uipath
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@uipath/api-emulator.mjs --service uipath
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

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

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
uipath:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.uipath.com/orchestrator/automation-cloud/latest/api-guide/introduction)
- [api-emulator](https://github.com/jsj/api-emulator)
