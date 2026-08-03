# @api-emulator/sentry

Sentry provides error tracking, projects, issues, events, releases, organizations, and alerting APIs.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/sentry
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@sentry/api-emulator.mjs --service sentry
```

## Fidelity

- Tier: `sdk-ingestion-and-rest-subset`
- Evidence: contract smoke coverage for envelopes, store requests, grouping, releases, webhooks, and rate limits

## Endpoints

- SDK ingestion: `/api/{project_id}/envelope/` and `/api/{project_id}/store/`
- Resources: organizations, projects, releases, and release files
- Webhooks: signed issue webhook delivery
- Inspection and control: `/inspect/*` and `/control/*`

## Authentication

Use `sentry-emulator-key` for project `1` by default. Configure other fake keys through the control API.

## Seed configuration

```yaml
sentry:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.sentry.io/api/)
- [api-emulator](https://github.com/jsj/api-emulator)
