import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setImmediate } from 'node:timers/promises';
import { runPool } from './publish-worker-pool.mjs';

test('provider build failure drains active and queued work before shared workspace cleanup', async () => {
  const workspace = await mkdtemp(join(tmpdir(), 'provider-pool-'));
  const artifact = join(workspace, 'package.mjs');
  const activeStarted = Promise.withResolvers();
  const releaseBuild = Promise.withResolvers();
  const buildFailure = new Error('provider build failed');
  const events = [];
  let settled = false;
  const publishing = (async () => {
    try {
      await runPool(['broken', 'active', 'queued'], 2, async (provider) => {
        if (provider === 'broken') {
          await activeStarted.promise;
          throw buildFailure;
        }
        if (provider === 'active') {
          activeStarted.resolve();
          await releaseBuild.promise;
        }
        await writeFile(artifact, provider);
        assert.equal(await readFile(artifact, 'utf8'), provider);
        events.push(provider);
      });
    } finally {
      events.push('cleanup');
      await rm(workspace, { recursive: true, force: true });
    }
  })();
  // Attach rejection handling immediately, including when testing the old pool.
  const outcome = publishing.then(
    () => { settled = true; return null; },
    (error) => { settled = true; return error; },
  );
  try {
    await activeStarted.promise;
    // Flush rejection microtasks while the other build is held at an explicit gate.
    await setImmediate();
    assert.equal(settled, false, 'publisher must not reject and clean up while a build is active');
    assert.deepEqual(events, []);
    releaseBuild.resolve();
    const error = await outcome;
    assert.ok(error instanceof AggregateError);
    assert.deepEqual(error.errors, [buildFailure]);
    assert.deepEqual(events, ['active', 'queued', 'cleanup']);
    await assert.rejects(readFile(artifact), { code: 'ENOENT' });
  } finally {
    releaseBuild.resolve();
    await outcome;
    await rm(workspace, { recursive: true, force: true });
  }
});

test('successful workers remain concurrent, bounded, and process every provider once', async () => {
  let active = 0;
  let peak = 0;
  const published = [];
  await runPool(['one', 'two', 'three', 'four'], 2, async (provider) => {
    active++;
    peak = Math.max(peak, active);
    await setImmediate();
    published.push(provider);
    active--;
  });
  assert.equal(peak, 2);
  assert.equal(active, 0);
  assert.deepEqual(published.sort(), ['four', 'one', 'three', 'two']);
});

test('multiple worker failures are reported only after both workers finish', async () => {
  const failures = [new Error('first build failed'), new Error('second build failed')];
  const finished = [];
  await assert.rejects(runPool(failures, 2, async (error) => {
    await setImmediate();
    finished.push(error);
    throw error;
  }), (error) => {
    assert.ok(error instanceof AggregateError);
    assert.deepEqual(error.errors, failures);
    assert.deepEqual(finished, failures);
    return true;
  });
});
