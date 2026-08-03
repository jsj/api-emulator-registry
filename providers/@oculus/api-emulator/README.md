# @api-emulator/oculus

Oculus and Meta Horizon provide Graph API surfaces for app builds, release channels, redists, and platform utility workflows.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/oculus
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@oculus/api-emulator.mjs --service oculus
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

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

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
oculus:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.oculus.com/)
- [api-emulator](https://github.com/jsj/api-emulator)
