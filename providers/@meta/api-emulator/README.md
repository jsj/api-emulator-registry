# @api-emulator/meta

Meta provides a local API emulator.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/meta
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@meta/api-emulator.mjs --service meta
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `POST /horizon/access_token`
- `GET /horizon/apps/:appId/release_channels`
- `GET /horizon/apps/:appId/release-channel-data`
- `GET /horizon/apps/:appId/release_channels/:channelName`
- `POST /horizon/apps/:appId/release_channels/:channelName/build`
- `GET /horizon/apps/:appId/builds`
- `POST /horizon/apps/:appId/builds`
- `GET /horizon/builds/:buildId`

## Coverage

- Level: `generated fallback`
- Meaning: This emulator has a generated API without direct coverage tests.
- Evidence: a local generated API exists, but smoke and conformance evidence does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
meta:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developers.facebook.com/docs/marketing-apis)
- [api-emulator](https://github.com/jsj/api-emulator)
