# @api-emulator/steam

Steam Web API provides player summaries, owned games, achievements, news, and community data.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/steam
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@steam/api-emulator.mjs --service steam
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

- `GET /ISteamUser/GetPlayerSummaries/v0002/`
- `GET /ISteamUser/GetPlayerSummaries/v2/`
- `GET /IPlayerService/GetOwnedGames/v0001/`
- `GET /IPlayerService/GetOwnedGames/v1/`
- `GET /ISteamUserStats/GetPlayerAchievements/v0001/`
- `GET /ISteamNews/GetNewsForApp/v0002/`
- `GET /v1/info/:id`
- `GET /v1/version`
- `GET /steam/inspect/state`

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

Use a fixed bearer token or API key in each test. The emulator does not send these credentials to the provider.

## Test data

Add repeatable test data to the provider configuration.

```yaml
steam:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs 1](https://steamcommunity.com/dev)
- [Official API docs 2](https://www.steamcmd.net/)
- [api-emulator](https://github.com/jsj/api-emulator)
