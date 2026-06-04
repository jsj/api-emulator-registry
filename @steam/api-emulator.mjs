import { fixedNow, getState, setState } from '../scripts/provider-plugin-kit.mjs';

const STATE_KEY = 'steam:state';

function defaultState() {
  return {
    players: [{ steamid: '76561198000000000', personaname: 'Steam Emulator', profileurl: 'https://steamcommunity.com/id/emulator/', avatar: 'https://avatars.steamstatic.com/emulator.jpg', personastate: 1, timecreated: 1262304000 }],
    games: [{ appid: 440, name: 'Team Fortress 2', playtime_forever: 120, img_icon_url: 'tf2' }, { appid: 570, name: 'Dota 2', playtime_forever: 240, img_icon_url: 'dota2' }],
    achievements: [{ apiname: 'EMULATOR_READY', achieved: 1, unlocktime: 1767225600, name: 'Emulator Ready', description: 'Called the local Steam emulator.' }],
    steamcmdApps: {
      740: {
        common: {
          community_visible_stats: '1',
          gameid: '740',
          name: 'Counter-Strike Global Offensive - Dedicated Server',
          oslist: 'windows,linux',
          type: 'Tool',
        },
        config: {
          contenttype: '3',
          installdir: 'Counter-Strike Global Offensive Beta - Dedicated Server',
          launch: { 0: { executable: 'srcds_run' } },
        },
        depots: {
          740: {
            manifests: { public: '8596693408921672263' },
            maxsize: '1448766796',
            name: 'Counter-Strike Global Offensive Beta - Dedicated Server',
            systemdefined: '1',
          },
          branches: {
            public: { buildid: '3936003', timeupdated: '1560990358' },
          },
        },
        extended: {
          gamedir: 'Counter-Strike Global Offensive Beta Dedicated Server',
          noservers: '0',
          primarycache: '740',
          sourcegame: '1',
          state: 'eStateTool',
        },
      },
    },
    steamcmdVersion: { build: null, major: 1, minor: 0, patch: 0, prerelease: null },
  };
}

const state = (store) => getState(store, STATE_KEY, defaultState);

export function seedFromConfig(store, baseUrl = 'https://api.steampowered.com', config = {}) {
  return setState(store, STATE_KEY, { ...defaultState(), baseUrl, ...config });
}

export const contract = {
  provider: 'steam',
  source: 'Steam Web API and SteamCMD API documented subset',
  docs: 'https://steamcommunity.com/dev; https://www.steamcmd.net/',
  baseUrl: 'https://api.steampowered.com',
  scope: ['player_summaries', 'owned_games', 'player_achievements', 'steamcmd_app_info', 'steamcmd_version'],
  fidelity: 'deterministic-subset',
};

export const plugin = {
  name: 'steam',
  register(app, store) {
    const steamcmdResponse = (c, payload, status = 200) => {
      if (c.req.query('pretty') === '1') {
        return c.json(payload, status, { 'x-api-emulator-pretty': 'true' });
      }
      return c.json(payload, status);
    };

    app.get('/ISteamUser/GetPlayerSummaries/v0002/', (c) => c.json({ response: { players: state(store).players } }));
    app.get('/ISteamUser/GetPlayerSummaries/v2/', (c) => c.json({ response: { players: state(store).players } }));
    app.get('/IPlayerService/GetOwnedGames/v0001/', (c) => c.json({ response: { game_count: state(store).games.length, games: state(store).games } }));
    app.get('/IPlayerService/GetOwnedGames/v1/', (c) => c.json({ response: { game_count: state(store).games.length, games: state(store).games } }));
    app.get('/ISteamUserStats/GetPlayerAchievements/v0001/', (c) => c.json({ playerstats: { steamID: state(store).players[0].steamid, gameName: 'Emulator Game', achievements: state(store).achievements, success: true } }));
    app.get('/ISteamNews/GetNewsForApp/v0002/', (c) => c.json({ appnews: { appid: Number(c.req.query('appid') ?? 440), newsitems: [{ gid: 'emulator-news-1', title: 'Steam Emulator News', url: 'https://store.steampowered.com/news/emulator', is_external_url: true, author: 'emulator', contents: 'Deterministic Steam Web API response.', feedlabel: 'emulator', date: Math.floor(new Date(fixedNow).getTime() / 1000) }], count: 1 } }));
    app.get('/v1/info/:id', (c) => {
      const id = c.req.param('id');
      const appInfo = state(store).steamcmdApps[id];
      if (!appInfo) {
        return steamcmdResponse(c, { data: 'No information for this specific app id could be found on Steam', status: 'error' }, 404);
      }
      return steamcmdResponse(c, { data: { [id]: appInfo }, status: 'success' });
    });
    app.get('/v1/version', (c) => steamcmdResponse(c, { data: state(store).steamcmdVersion, status: 'success' }));
    app.get('/steam/inspect/state', (c) => c.json(state(store)));
  },
};

export const label = 'Steam Web API emulator';
export const endpoints = 'player summaries, owned games, achievements, app news, SteamCMD app info, SteamCMD version';
export const initConfig = { steam: { apiKey: 'steam-emulator-key', steamid: '76561198000000000' } };

export default plugin;
