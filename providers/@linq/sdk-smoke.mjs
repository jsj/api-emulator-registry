import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createApp, run, Store, withServer } from '../../scripts/cli-smoke-runtime.mjs';
import { plugin } from './api-emulator.mjs';

const directory = await mkdtemp(join(tmpdir(), 'api-emulator-linq-sdk-'));

try {
  await run('npm', ['install', '--silent', '--no-audit', '--no-fund', '--prefix', directory, '@linqapp/sdk@0.33.1'], { timeout: 120_000 });
  const sdkUrl = pathToFileURL(join(directory, 'node_modules/@linqapp/sdk/index.mjs')).href;
  const { default: Linq } = await import(sdkUrl);
  const app = createApp();
  plugin.register(app, new Store());

  await withServer(app, async (baseUrl) => {
    const client = new Linq({ baseURL: baseUrl, apiKey: 'linq_emulator_token', maxRetries: 0 });
    const numbers = await client.phoneNumbers.list();
    assert.equal(numbers.phone_numbers[0].phone_number, '+12025550100');

    const created = await client.chats.create({
      from: '+12025550100',
      to: ['+12025550188'],
      message: { parts: [{ type: 'text', value: 'Hello from the official SDK.' }] },
    });
    assert.equal(created.chat.handles[1].handle, '+12025550188');

    const sent = await client.chats.messages.send(created.chat.id, { parts: [{ type: 'text', value: 'Second SDK message.' }] });
    assert.equal(sent.message.parts[0].value, 'Second SDK message.');
  });
} finally {
  await rm(directory, { recursive: true, force: true });
}

console.log('linq official sdk smoke ok');
