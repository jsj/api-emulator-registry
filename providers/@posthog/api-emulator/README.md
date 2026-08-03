# @api-emulator/posthog

PostHog provides product analytics, event capture, feature flags, persons, and project APIs.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/posthog
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@posthog/api-emulator.mjs --service posthog
```

## Fidelity

- Tier: `sdk-ingestion-and-resource-subset`
- Evidence: contract smoke coverage for authentication, duplicate events, batches, flags, and rate limits

## Endpoints

- Capture: `/capture`, `/batch`, `/e`, and `/track`
- Identity: `/identify`, `/alias`, and `/groupidentify`
- Flags: `/decide` and `/flags`
- Resources: persons, groups, feature flags, experiments, cohorts, and queries
- Inspection and control: `/inspect/*` and `/control/*`

## Authentication

Use `posthog-emulator-key` by default. Configure other fake keys through the control API.

## Seed configuration

```yaml
posthog:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://posthog.com/docs/api)
- [api-emulator](https://github.com/jsj/api-emulator)
