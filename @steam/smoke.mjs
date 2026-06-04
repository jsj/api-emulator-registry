import assert from 'node:assert/strict';
import { createHarness } from '../scripts/provider-smoke-harness.mjs';
import { contract, plugin } from './api-emulator.mjs';

const harness = createHarness(plugin);
assert.equal(contract.provider, 'steam');

const players = await harness.call('GET', '/ISteamUser/GetPlayerSummaries/v0002/?key=test&steamids=76561198000000000');
assert.equal(players.payload.response.players[0].personaname, 'Steam Emulator');

const games = await harness.call('GET', '/IPlayerService/GetOwnedGames/v0001/?key=test&steamid=76561198000000000');
assert.equal(games.payload.response.game_count, 2);

const achievements = await harness.call('GET', '/ISteamUserStats/GetPlayerAchievements/v0001/?key=test&steamid=76561198000000000&appid=440');
assert.equal(achievements.payload.playerstats.success, true);

const appInfo = await harness.call('GET', '/v1/info/740?pretty=1');
assert.equal(appInfo.payload.status, 'success');
assert.equal(appInfo.payload.data['740'].common.type, 'Tool');

const missingAppInfo = await harness.call('GET', '/v1/info/1');
assert.equal(missingAppInfo.status, 404);
assert.equal(missingAppInfo.payload.status, 'error');

const version = await harness.call('GET', '/v1/version');
assert.equal(version.payload.data.major, 1);

console.log('steam smoke ok');
