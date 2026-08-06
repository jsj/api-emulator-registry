# @api-emulator/oculus

Oculus and Meta Horizon provide Graph API surfaces for app builds, release channels, redists, and platform utility workflows.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/oculus
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@oculus/api-emulator.mjs --service oculus
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `POST /graphql`
- `GET /:appId/release_channels`
- `GET /:appId/release_channel_data`
- `GET /:appId/release-channel-data`
- `GET /:appId/builds`
- `POST /:appId/builds`
- `GET /builds/:buildId`
- `POST /:appId/release_channels/:channelName/build`
- `POST /access_token`
- `POST /oauth/access_token`
- `GET /redists`
- `GET /horizon/apps/:appId/release-channel-data`
- `GET /horizon/apps/:appId/release_channels`
- `POST /horizon/apps/:appId/builds`
- `GET /inspect/contract`
- `GET /inspect/state`
- `POST /inspect/reset`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
oculus:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.oculus.com/)
- [api-emulator](https://github.com/jsj/api-emulator)
