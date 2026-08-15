import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createApp, run, Store, withServer } from '../../scripts/cli-smoke-runtime.mjs';
import { plugin } from './api-emulator.mjs';

const directory = await mkdtemp(join(tmpdir(), 'api-emulator-sendblue-sdk-'));
try {
  await run('npm', ['install', '--silent', '--no-audit', '--no-fund', '--prefix', directory, 'sendblue@3.10.1'], { timeout: 120_000 });
  const { default: Sendblue } = await import(pathToFileURL(join(directory, 'node_modules/sendblue/index.mjs')).href);
  const app = createApp(); plugin.register(app, new Store());
  await withServer(app, async (baseUrl) => {
    const client = new Sendblue({ baseURL: baseUrl, apiKey: 'local-key', apiSecret: 'local-secret', maxRetries: 0 });
    const sent = await client.messages.send({ number: '+15555550188', from_number: '+15555550100', content: 'Hello from the official SDK.' });
    assert.match(sent.message_handle, /^msg_emulator_/);
    const listed = await client.messages.list({ number: '+15555550188' });
    assert.equal(listed.data[0].content, 'Hello from the official SDK.');
    const status = await client.messages.getStatus({ handle: sent.message_handle });
    assert.equal(status.message_handle, sent.message_handle);
  });
} finally {
  await rm(directory, { recursive: true, force: true });
}
console.log('sendblue official sdk smoke ok');
