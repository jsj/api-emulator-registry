# Contributing

Contributions are welcome. Use these instructions for provider changes, fixes, and documentation.

## Before you start

1. Search the [open issues](https://github.com/jsj/api-emulator-registry/issues).
2. Use the provider-request template for a new provider or endpoint.
3. Do not add private contracts, credentials, or customer data.

## Change a provider

1. Read the provider README.
2. Change only the files for that provider.
3. Add coverage for each new behavior.
4. Run the provider smoke test.
5. Run the repository checks that apply to your change.

Run all smoke tests:

```bash
bun run smoke
```

The smoke runner discovers `providers/@*/smoke.mjs` and runs the repository checks.
It fails if discovery finds no tests or a conformance manifest names a missing smoke test.
Use `SMOKE_CONCURRENCY=4 bun run smoke` to limit parallel jobs.

For registry discovery and release-selection changes, run `bun run test:infrastructure`.
For Stripe changes, run `bun run test` in `providers/@stripe/api-emulator`.

`publish:providers --changed-only` selects all package providers when shared scripts,
the catalog, package metadata, or lockfiles change. This covers shared code bundled
into providers; the publisher still compares package content before publishing.
Provider-only changes select their corresponding packages.

Make sure that the provider catalog and README files are current:

```bash
bun run check:provider-wall
bun run check:provider-readmes
```

## Add a provider

Use the [provider plugin skill](./.agents/skills/create-api-emulator-plugin/SKILL.md).

Add a description, test data, supported routes, and coverage evidence.

## Send a pull request

Include this information:

- What changed
- Why the change is necessary
- Which commands you ran
- Which behavior remains unsupported

Keep each pull request focused on one provider or one shared behavior.
