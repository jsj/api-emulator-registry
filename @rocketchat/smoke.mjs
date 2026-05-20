import assert from 'node:assert/strict';
import { createApp, Store, withServer } from '../scripts/cli-smoke-runtime.mjs';
import { contract, defaultSeed, plugin } from './api-emulator/src/index.js';

const app = createApp();
const store = new Store();
plugin.seed(store);
plugin.register(app, store);

assert.equal(contract.service, 'rocketchat');

const headers = {
  'X-User-Id': defaultSeed.userId,
  'X-Auth-Token': defaultSeed.authToken,
};

await withServer(app, async (baseUrl) => {
  const rooms = await fetch(`${baseUrl}/api/v1/rooms.get`, { headers });
  assert.equal((await rooms.json()).update.length, 3);

  const history = await fetch(`${baseUrl}/api/v1/groups.history?roomName=project-dev&count=2`, { headers });
  assert.equal((await history.json()).messages.length, 2);

  const sent = await fetch(`${baseUrl}/api/v1/chat.postMessage`, {
    method: 'POST',
    headers: {
      ...headers,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ channel: '#project-dev', text: 'hello emulator' }),
  });
  const posted = await sent.json();
  assert.equal(posted.success, true);
  assert.equal(posted.message.msg, 'hello emulator');

  const directMessages = await fetch(`${baseUrl}/api/v1/im.list`, { headers });
  assert.equal((await directMessages.json()).ims[0].name, 'sample-user');
});

console.log('rocketchat smoke ok');
