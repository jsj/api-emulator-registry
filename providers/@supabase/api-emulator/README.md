# @api-emulator/supabase

Supabase provides backend APIs for Postgres projects, auth, storage, edge functions, and database workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/supabase
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@supabase/api-emulator.mjs --service supabase
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

The emulator source lists the supported local API endpoints.

## Coverage

- Level: `stub`
- Meaning: This emulator has a small starter API.
- Evidence: standalone management project-list smoke and shared CLI checks.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
supabase:
  # Add provider-specific seed state here.
```

## Links

- [api-emulator](https://github.com/jsj/api-emulator)

## Management project listing

`GET /v1/projects` returns the emulator's synthetic projects and supports the Supabase CLI's `projects list` command. This endpoint is part of the provider itself. It does not create cloud projects or provision a database. The management API is otherwise outside this emulator's scope.

The default project is `project_emulator`. Tests can seed `supabase:state.projects`, including an empty array. Each emulator store keeps its own project list.

```bash
node providers/@supabase/smoke.mjs
bun scripts/cli-verification-smoke.mjs --provider=supabase
```

The CLI check uses a localhost profile and a synthetic token. It uses an installed Supabase CLI or obtains it with `npx` when missing.
