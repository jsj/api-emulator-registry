# @api-emulator/crusoe

Crusoe Cloud provides cloud infrastructure APIs for projects, GPU instance types, virtual machines, SSH keys, and operations.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/crusoe
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@crusoe/api-emulator.mjs --service crusoe
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /v1alpha5/featureflags`
- `GET /v1alpha5/projects`
- `GET /v1alpha5/organizations/projects`
- `GET /v1alpha5/projects/:project_id`
- `GET /v1alpha5/locations`
- `GET /v1alpha5/instance-types`
- `GET /v1alpha5/projects/:project_id/instances`
- `GET /v1alpha5/projects/:project_id/compute/vms`
- `GET /v1alpha5/compute/vms`
- `POST /v1alpha5/projects/:project_id/instances`
- `GET /v1alpha5/projects/:project_id/instances/:instance_id`
- `PATCH /v1alpha5/projects/:project_id/instances/:instance_id`
- `DELETE /v1alpha5/projects/:project_id/instances/:instance_id`
- `GET /v1alpha5/projects/:project_id/ssh-keys`
- `POST /v1alpha5/projects/:project_id/ssh-keys`
- `GET /v1alpha5/operations/:operation_id`
- `GET /crusoe/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
crusoe:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.crusoecloud.com/api/)
- [api-emulator](https://github.com/jsj/api-emulator)
