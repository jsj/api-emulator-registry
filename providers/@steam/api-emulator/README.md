# @api-emulator/steam

Steam Web API provides player summaries, owned games, achievements, news, and community data.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/steam
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@steam/api-emulator.mjs --service steam
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `GET /ISteamUser/GetPlayerSummaries/v0002/`
- `GET /ISteamUser/GetPlayerSummaries/v2/`
- `GET /IPlayerService/GetOwnedGames/v0001/`
- `GET /IPlayerService/GetOwnedGames/v1/`
- `GET /ISteamUserStats/GetPlayerAchievements/v0001/`
- `GET /ISteamNews/GetNewsForApp/v0002/`
- `GET /v1/info/:id`
- `GET /v1/version`
- `GET /steam/inspect/state`

## Authentication

The emulator accepts fake local credentials. Use a deterministic bearer token or API key in each client test.

## Seed configuration

```yaml
steam:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://steamcommunity.com/dev; https://www.steamcmd.net/)
- [api-emulator](https://github.com/jsj/api-emulator)
