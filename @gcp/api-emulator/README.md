# @api-emulator/gcp

Google Cloud Platform emulator for gcloud-oriented Cloud Resource Manager, Compute Engine, and Service Usage workflows.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/gcp
```

## Run

```bash
npx -p api-emulator api --plugin ./@gcp/api-emulator.mjs --service gcp
```

## Endpoints

- `GET /v1/projects` — list active projects
- `POST /v1/projects` — create a project
- `GET /v1/projects/:projectId` — get a project
- `DELETE /v1/projects/:projectId` — mark a project for deletion
- `GET /v3/projects` — list v3 project resources
- `POST /v3/projects` — create a v3 project operation
- `GET /v3/projects/:projectId` — get a v3 project resource
- `DELETE /v3/projects/:projectId` — delete a v3 project resource
- `GET /compute/v1/projects/:projectId/zones` — list Compute zones
- `GET /compute/v1/projects/:projectId/zones/:zone/instances` — list Compute instances
- `POST /compute/v1/projects/:projectId/zones/:zone/instances` — create a Compute instance operation
- `GET /compute/v1/projects/:projectId/zones/:zone/instances/:instance` — get a Compute instance
- `GET /v1/projects/:projectId/services` — list enabled services
- `GET /v1/projects/:projectId/services/:serviceName` — get a service
- `GET /gcp/inspect/state` — inspect emulator state

## Auth

Uses fake local credentials only; provide any deterministic bearer token or gcloud application-default credential expected by the client under test.

## Seed Configuration

```yaml
gcp:
  projects:
    - projectId: emulator-project
      name: Emulator Project
```

## Links

- [Google Cloud CLI install docs](https://docs.cloud.google.com/sdk/docs/install-sdk)
- [Cloud Resource Manager REST](https://cloud.google.com/resource-manager/reference/rest)
- [Compute Engine REST](https://cloud.google.com/compute/docs/reference/rest/v1)
- [api-emulator](https://github.com/jsj/api-emulator)
