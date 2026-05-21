import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const catalog = JSON.parse(await readFile(join(root, 'api-emulator.catalog.json'), 'utf8')).plugins ?? {};

function arg(name) {
  const prefix = `--${name}=`;
  const found = process.argv.find((item) => item.startsWith(prefix));
  return found ? found.slice(prefix.length) : undefined;
}

function listArg(name, fallback = '') {
  return (arg(name) ?? process.env[name.toUpperCase()] ?? fallback)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function numberArg(name, fallback) {
  const value = Number(arg(name) ?? process.env[name.toUpperCase()] ?? fallback);
  if (!Number.isInteger(value) || value < 1) throw new Error(`${name} must be a positive integer`);
  return value;
}

function allPackageProviders() {
  return Object.entries(catalog)
    .filter(([, entry]) => entry.kind === 'package')
    .map(([slug]) => slug)
    .sort((a, b) => a.localeCompare(b));
}

function run(command, args, options = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, { stdio: options.capture ? ['ignore', 'pipe', 'pipe'] : 'inherit', cwd: root, ...options });
    let stdout = '';
    let stderr = '';
    child.stdout?.on('data', (chunk) => stdout += chunk);
    child.stderr?.on('data', (chunk) => stderr += chunk);
    child.on('exit', (code) => {
      if (code === 0) resolvePromise(stdout.trim());
      else reject(new Error(`${command} ${args.join(' ')} failed with exit code ${code}\n${stderr}`));
    });
    child.on('error', reject);
  });
}

async function registryVersion(name) {
  try {
    return await run('npm', ['view', name, 'version'], { capture: true });
  } catch {
    return '0.0.0';
  }
}

function providerPackageJson(slug, entry, version) {
  return {
    name: entry.packageName ?? `@api-emulator/${slug}`,
    version,
    license: 'MIT',
    type: 'module',
    main: './api-emulator.mjs',
    exports: { '.': './api-emulator.mjs' },
    files: ['api-emulator.mjs', 'README.md'],
    homepage: 'https://api-emulator.jsj.sh',
    repository: {
      type: 'git',
      url: 'https://github.com/jsj/api-emulator-registry.git',
      directory: `@${slug}`,
    },
    bugs: { url: 'https://github.com/jsj/api-emulator/issues' },
    peerDependencies: { 'api-emulator': '>=0.6.0' },
    publishConfig: { access: 'public' },
  };
}

async function prepareProvider(slug, entry, version, outRoot) {
  const specifier = entry.specifier ?? `./@${slug}/api-emulator.mjs`;
  const entryPath = resolve(root, specifier);
  if (!existsSync(entryPath)) throw new Error(`missing provider entry for ${slug}: ${specifier}`);

  const packageDir = join(outRoot, slug);
  await run('bun', ['build', entryPath, '--packages', 'external', '--format', 'esm', '--target', 'node', '--outfile', join(packageDir, 'api-emulator.mjs')]);

  const readmePath = join(root, `@${slug}`, 'api-emulator', 'README.md');
  if (existsSync(readmePath)) await writeFile(join(packageDir, 'README.md'), await readFile(readmePath, 'utf8'));
  await writeFile(join(packageDir, 'package.json'), `${JSON.stringify(providerPackageJson(slug, entry, version), null, 2)}\n`);
  return packageDir;
}

const dryRun = process.argv.includes('--dry-run') || process.env.DRY_RUN === 'true';
const force = process.argv.includes('--force') || process.env.FORCE === 'true';
const version = arg('version') ?? process.env.PROVIDER_VERSION;
const requestedProviders = listArg('providers', process.env.PROVIDERS ?? '');
const providers = requestedProviders.length > 0 ? requestedProviders : allPackageProviders();
const publishConcurrency = Math.min(numberArg('publish-concurrency', process.env.PUBLISH_CONCURRENCY ?? '4'), providers.length);

if (!version) throw new Error('Missing provider package version. Pass --version=<semver> or PROVIDER_VERSION.');
if (providers.length === 0) throw new Error('No catalog package providers found.');

console.log(`Preparing ${providers.length} provider package${providers.length === 1 ? '' : 's'}: ${providers.join(', ')}`);
console.log(`Publishing with concurrency ${publishConcurrency}`);

const outRoot = await mkdtemp(join(tmpdir(), 'api-emulator-provider-packages-'));
const failures = [];

async function publishProvider(slug) {
  const entry = catalog[slug];
  if (!entry) throw new Error(`unknown provider in catalog: ${slug}`);
  if (entry.kind !== 'package') throw new Error(`provider ${slug} is not catalog kind=package`);
  const name = entry.packageName ?? `@api-emulator/${slug}`;
  const published = await registryVersion(name);
  if (!force && !dryRun && published === version) {
    console.log(`${name}@${version} already published, skipping`);
    return;
  }

  const packageDir = await prepareProvider(slug, entry, version, outRoot);
  const packJson = await run('npm', ['pack', '--json', '--pack-destination', outRoot], { cwd: packageDir, capture: true });
  const tarball = join(outRoot, JSON.parse(packJson)[0].filename);
  const publishArgs = dryRun ? ['publish', tarball, '--dry-run', '--access', 'public'] : ['publish', tarball, '--provenance', '--access', 'public'];
  try {
    await run('npm', publishArgs);
  } catch (error) {
    failures.push(name);
    console.error(error.message);
  }
}

async function runPool(items, limit, worker) {
  let index = 0;
  const workers = Array.from({ length: limit }, async () => {
    while (index < items.length) {
      const item = items[index++];
      await worker(item);
    }
  });
  await Promise.all(workers);
}

try {
  await runPool(providers, publishConcurrency, publishProvider);
} finally {
  await rm(outRoot, { recursive: true, force: true });
}

if (failures.length > 0) {
  throw new Error(`Failed to publish: ${failures.join(', ')}`);
}
