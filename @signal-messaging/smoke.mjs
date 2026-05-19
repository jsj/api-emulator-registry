import assert from 'node:assert/strict';
import { createApp, Store, withServer } from '../scripts/cli-smoke-runtime.mjs';
import { contract, plugin } from './api-emulator.mjs';

const app = createApp();
const store = new Store();
plugin.register(app, store);

assert.equal(contract.provider, 'signal-messaging');

await withServer(app, async (baseUrl) => {
  const about = await fetch(`${baseUrl}/v1/about`);
  assert.equal((await about.json()).mode, 'json-rpc');

  const register = await fetch(`${baseUrl}/v1/register/signal-account-c`, { method: 'POST' });
  assert.equal((await register.json()).status, 'verification_required');

  const verify = await fetch(`${baseUrl}/v1/register/signal-account-c/verify/123456`, { method: 'POST' });
  assert.equal((await verify.json()).status, 'registered');

  const send = await fetch(`${baseUrl}/v2/send`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ number: 'signal-account-a', recipients: ['signal-account-c'], message: 'hello emulator' }),
  });
  const sent = await send.json();
  assert.equal(sent.results[0].type, 'SUCCESS');

  const receive = await fetch(`${baseUrl}/v1/receive/signal-account-c`);
  const messages = await receive.json();
  assert.equal(messages[0].envelope.dataMessage.message, 'echo: hello emulator');

  const groups = await fetch(`${baseUrl}/v1/groups/signal-account-a`);
  assert.equal((await groups.json())[0].name, 'Emulator Group');
});

console.log('signal-messaging smoke ok');
