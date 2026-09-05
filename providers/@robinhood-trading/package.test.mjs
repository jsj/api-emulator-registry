import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cpSync, mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import test from 'node:test';

const provider = dirname(fileURLToPath(import.meta.url));
test('published layout bundles and runs all 73 tools from an extracted npm tarball', { timeout: 120000 }, () => {
  const root = mkdtempSync(join(tmpdir(), 'robinhood-package-test-'));
  try {
    const packageDir = join(root, 'build'); mkdirSync(packageDir);
    execFileSync('bun', ['build', join(provider, 'api-emulator.mjs'), '--packages', 'external', '--format', 'esm', '--target', 'node', '--outfile', join(packageDir, 'api-emulator.mjs')], { stdio: 'pipe' });
    cpSync(join(provider, 'fixtures'), join(packageDir, 'fixtures'), { recursive: true });
    cpSync(join(provider, 'api-emulator/README.md'), join(packageDir, 'README.md'));
    writeFileSync(join(packageDir, 'package.json'), JSON.stringify({ name: '@api-emulator/robinhood-trading', version: '0.0.0-test', type: 'module', main: './api-emulator.mjs', exports: { '.': './api-emulator.mjs' }, files: ['api-emulator.mjs', 'README.md', 'fixtures'] }));
    const packResult = JSON.parse(execFileSync('npm', ['pack', '--ignore-scripts', '--json'], { cwd: packageDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }));
    const packed = Array.isArray(packResult) ? packResult[0] : Object.values(packResult)[0];
    assert.ok(packed.files.some(file => file.path === 'fixtures/tools-contract.sanitized.json'));
    assert.ok(!packed.files.some(file => /(?:\.emu|node_modules|capture-crypto|\.test\.)/.test(file.path)));
    const unpacked = join(root, 'unpacked'); mkdirSync(unpacked);
    execFileSync('tar', ['-xzf', join(packageDir, packed.filename), '-C', unpacked]);
    const entry = pathToFileURL(join(unpacked, 'package/api-emulator.mjs')).href;
    const env = { ...process.env, ROBINHOOD_TEST_PLUGIN: entry };
    const output = execFileSync(process.execPath, [join(provider, 'smoke.mjs')], { env, encoding: 'utf8', timeout: 30000 });
    assert.match(output, /robinhood-trading smoke ok/);
    const cliOutput = execFileSync(process.execPath, [join(provider, 'smoke-cli.mjs')], { env, encoding: 'utf8', timeout: 90000 });
    assert.match(cliOutput, /mcporter HTTP smoke ok/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});
