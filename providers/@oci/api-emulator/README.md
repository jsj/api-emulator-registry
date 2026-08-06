# @api-emulator/oci

Oracle Cloud Infrastructure provides cloud APIs for identity, regions, availability domains, compute instances, and networking.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/oci
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@oci/api-emulator.mjs --service oci
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /20160918/regions`
- `GET /20160918/availabilityDomains`
- `GET /20160918/instances`
- `GET /20160918/instances/:instanceId`
- `POST /20160918/instances/:instanceId`
- `GET /oci/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
oci:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://docs.oracle.com/iaas/api/)
- [api-emulator](https://github.com/jsj/api-emulator)
