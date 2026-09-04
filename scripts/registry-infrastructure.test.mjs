import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { listSmokeFiles } from './smoke-discovery.mjs';
import { selectChangedPackageProviders } from './provider-release-selection.mjs';

test('discovers the real provider directory, and rejects missing declared tests', async () => {
  const root = await mkdtemp(join(tmpdir(), 'registry-smoke-'));
  try {
    await mkdir(join(root, 'providers/@example'), { recursive: true });
    await mkdir(join(root, 'conformance/providers'), { recursive: true });
    await assert.rejects(listSmokeFiles(root), /No provider smoke tests/);
    await writeFile(join(root, 'providers/@example/smoke.mjs'), '');
    assert.deepEqual(await listSmokeFiles(root), ['providers/@example/smoke.mjs']);
    await writeFile(join(root, 'conformance/providers/missing.json'), JSON.stringify({ validation: { directSmoke: 'node providers/@missing/smoke.mjs' } }));
    await assert.rejects(listSmokeFiles(root), /expects missing smoke test/);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test('actual discovery includes known provider tests', async () => {
  const files = await listSmokeFiles(dirname(dirname(fileURLToPath(import.meta.url))));
  assert.ok(files.includes('providers/@posthog/smoke.mjs'));
  assert.ok(files.includes('providers/@github/smoke.mjs'));
});

test('release selection covers shared code and stays scoped for provider edits', () => {
  const catalog = { zebra: { kind: 'package' }, alpha: { kind: 'package', specifier: './custom/alpha.mjs' }, other: { kind: 'module' } };
  for (const file of ['scripts/provider-plugin-kit.mjs', 'scripts/saas-emulator-kit.mjs', 'scripts/new-runtime-helper.mjs', 'api-emulator.catalog.json', 'package.json', 'bun.lock']) {
    assert.deepEqual(selectChangedPackageProviders(catalog, [file]), ['alpha', 'zebra'], file);
  }
  assert.deepEqual(selectChangedPackageProviders(catalog, ['providers/@zebra/api-emulator.mjs']), ['zebra']);
  assert.deepEqual(selectChangedPackageProviders(catalog, ['custom/alpha.mjs']), ['alpha']);
  assert.deepEqual(selectChangedPackageProviders(catalog, ['providers/@zebras/api-emulator.mjs', 'README.md']), []);
});
