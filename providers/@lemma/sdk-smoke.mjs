import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createApp, run, Store, withServer } from '../../scripts/cli-smoke-runtime.mjs';
import { plugin } from './api-emulator.mjs';

const directory = await mkdtemp(join(tmpdir(), 'api-emulator-lemma-sdk-'));

try {
  await run('npm', ['install', '--silent', '--no-audit', '--no-fund', '--prefix', directory, '@uselemma/tracing@7.11.0'], { timeout: 120_000 });
  const { Lemma } = await import(pathToFileURL(join(directory, 'node_modules/@uselemma/tracing/dist/index.js')).href);
  const app = createApp();
  plugin.register(app, new Store());

  await withServer(app, async (baseUrl) => {
    const client = new Lemma({
      apiKey: 'lemma_emulator_key',
      projectId: '00000000-0000-4000-8000-000000000001',
      baseUrl,
    });
    const result = await client.trace({ name: 'official-sdk-smoke', input: 'hello' }, async (trace) => {
      trace.recordTool({ name: 'lookup', input: { id: 1 }, output: { found: true } });
      return 'done';
    });
    assert.equal(result, 'done');
  });
} finally {
  await rm(directory, { recursive: true, force: true });
}

console.log('lemma official sdk smoke ok');
