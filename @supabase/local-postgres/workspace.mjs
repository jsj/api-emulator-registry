import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(root, '..', '..');
const seedPath = resolve(root, 'seed.sql');
const workspaceRoot = resolve(process.env.API_EMULATOR_PG_WORKSPACE_ROOT ?? join(repoRoot, '.api-emulator', 'db', 'postgres'));
const baseDir = join(workspaceRoot, 'base');
const clonesDir = join(workspaceRoot, 'clones');
const metadataPath = join(baseDir, '.api-emulator-base.json');
const image = process.env.SUPABASE_PG_IMAGE ?? 'postgres:16-alpine';
const password = process.env.SUPABASE_PG_PASSWORD ?? 'postgres';
const database = process.env.SUPABASE_PG_DATABASE ?? 'postgres';
const user = process.env.SUPABASE_PG_USER ?? 'postgres';
const runtimeEnv = process.env.API_EMULATOR_DB_RUNTIME ?? process.env.SUPABASE_PG_RUNTIME ?? 'auto';
let selectedRuntime;

function run(command, args, options = {}) {
  return new Promise((resolvePromise, reject) => {
    const stdio = options.capture
      ? [options.input ? 'pipe' : 'ignore', 'pipe', 'pipe']
      : [options.input ? 'pipe' : 'inherit', 'inherit', 'inherit'];
    const child = spawn(command, args, { stdio, ...options });
    let stdout = '';
    let stderr = '';
    child.stdout?.on('data', (chunk) => stdout += chunk);
    child.stderr?.on('data', (chunk) => stderr += chunk);
    if (options.input) child.stdin?.end(options.input);
    child.on('exit', (code) => {
      if (code === 0) resolvePromise(stdout.trim());
      else reject(new Error(`${command} ${args.join(' ')} failed with exit code ${code}\n${stderr}`));
    });
    child.on('error', reject);
  });
}

async function commandWorks(command, args) {
  try {
    await run(command, args, { capture: true });
    return true;
  } catch {
    return false;
  }
}

async function resolveRuntime() {
  if (selectedRuntime) return selectedRuntime;
  if (runtimeEnv !== 'auto') {
    selectedRuntime = runtimeEnv === 'apple-containers' ? 'container' : runtimeEnv;
    return selectedRuntime;
  }
  if (await commandWorks('docker', ['info'])) selectedRuntime = 'docker';
  else if (await commandWorks('container', ['ls', '--all', '--format', 'json'])) selectedRuntime = 'container';
  else if (await commandWorks('which', ['container'])) selectedRuntime = 'container';
  else selectedRuntime = 'docker';
  return selectedRuntime;
}

async function runtime(args, options) {
  return run(await resolveRuntime(), args, options);
}

async function ensureRuntimeStarted() {
  if (await resolveRuntime() !== 'container') return;
  if (await commandWorks('container', ['ls', '--all', '--format', 'json'])) return;
  await run('container', ['system', 'start', '--timeout', '60', '--disable-kernel-install']);
}

async function containerExists(name) {
  if (await resolveRuntime() === 'docker') {
    const out = await runtime(['ps', '-a', '--filter', `name=^/${name}$`, '--format', '{{.Names}}'], { capture: true });
    return out.split('\n').includes(name);
  }
  const out = await runtime(['ls', '--all', '--format', 'json'], { capture: true });
  try {
    const containers = JSON.parse(out || '[]');
    return containers.some((container) => [container.id, container.name, container.names, container.configuration?.id].flat().includes(name));
  } catch {
    return out.includes(name);
  }
}

async function removeContainer(name) {
  if (!(await containerExists(name))) return;
  if (await resolveRuntime() === 'docker') await runtime(['rm', '-f', name]);
  else await runtime(['rm', '--force', name]);
}

async function stopContainer(name) {
  if (!(await containerExists(name))) return;
  await runtime(['stop', name]).catch(() => undefined);
}

async function execInContainer(name, args, options = {}) {
  const execArgs = ['exec'];
  const { env = [], ...runOptions } = options;
  if (options.input) execArgs.push('-i');
  for (const value of env) execArgs.push('-e', value);
  execArgs.push(name, ...args);
  return runtime(execArgs, runOptions);
}

async function waitForPostgres(name, db = database) {
  let lastError;
  for (let attempt = 0; attempt < 90; attempt++) {
    try {
      await execInContainer(name, ['pg_isready', '-U', user, '-d', db], { capture: true });
      return;
    } catch (error) {
      lastError = error;
      await new Promise((resolvePromise) => setTimeout(resolvePromise, 500));
    }
  }
  throw lastError ?? new Error(`Postgres container ${name} did not become ready in time.`);
}

async function freePort() {
  return new Promise((resolvePromise, reject) => {
    const server = createServer();
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      server.close(() => resolvePromise(address.port));
    });
    server.on('error', reject);
  });
}

function assertCloneName(value) {
  if (!/^[a-zA-Z][a-zA-Z0-9_-]{0,62}$/.test(value)) {
    throw new Error(`Invalid clone name: ${value}`);
  }
}

function containerName(name) {
  assertCloneName(name);
  return `api-emulator-pg-${name}`;
}

function cloneDir(name) {
  assertCloneName(name);
  return join(clonesDir, name);
}

async function startPostgresContainer(name, dataDir, port) {
  await ensureRuntimeStarted();
  await removeContainer(name);
  await mkdir(dataDir, { recursive: true });
  await runtime([
    'run',
    '-d',
    '--name', name,
    '-p', `127.0.0.1:${port}:5432`,
    '-e', `POSTGRES_PASSWORD=${password}`,
    '-e', `POSTGRES_USER=${user}`,
    '-e', `POSTGRES_DB=${database}`,
    '-v', `${dataDir}:/var/lib/postgresql/data`,
    image,
  ]);
  await waitForPostgres(name);
}

async function prepareBase({ force = false } = {}) {
  await mkdir(workspaceRoot, { recursive: true });
  const expected = { image, user, database, seedPath };
  if (!force) {
    try {
      const existing = JSON.parse(await readFile(metadataPath, 'utf8'));
      if (existing.image === expected.image && existing.user === expected.user && existing.database === expected.database) {
        return { baseDir, reused: true };
      }
    } catch {
      // base is missing or incompatible
    }
  }

  const name = 'api-emulator-pg-base';
  await removeContainer(name);
  await rm(baseDir, { recursive: true, force: true });
  await mkdir(baseDir, { recursive: true });
  await startPostgresContainer(name, baseDir, await freePort());
  const seed = await readFile(seedPath, 'utf8');
  await execInContainer(name, ['psql', '-U', user, '-d', database, '-v', 'ON_ERROR_STOP=1', '-f', '-'], {
    env: [`PGPASSWORD=${password}`],
    input: seed,
  });
  await stopContainer(name);
  await removeContainer(name);
  await writeFile(metadataPath, JSON.stringify({ ...expected, preparedAt: new Date().toISOString() }, null, 2));
  return { baseDir, reused: false };
}

async function copyOnWriteDirectory(source, target) {
  await rm(target, { recursive: true, force: true });
  await mkdir(dirname(target), { recursive: true });
  if (process.platform === 'darwin') {
    await run('cp', ['-cR', `${source}/.`, target], { capture: true });
    return 'apfs-clonefile';
  }
  await run('cp', ['--reflink=always', '-a', source, target], { capture: true });
  return 'reflink';
}

async function copyDirectoryFallback(source, target) {
  await rm(target, { recursive: true, force: true });
  await cp(source, target, { recursive: true, force: true });
  return 'full-copy';
}

async function cloneWorkspace(name, options = {}) {
  assertCloneName(name);
  const startedAt = Date.now();
  await prepareBase({ force: options.forceBase === true });
  const target = cloneDir(name);
  let cloneMode;
  try {
    cloneMode = await copyOnWriteDirectory(baseDir, target);
  } catch (error) {
    if (options.requireCopyOnWrite) throw error;
    cloneMode = await copyDirectoryFallback(baseDir, target);
  }
  const port = options.port ?? await freePort();
  const container = containerName(name);
  await startPostgresContainer(container, target, port);
  const result = {
    name,
    runtime: await resolveRuntime(),
    cloneMode,
    container,
    dataDir: target,
    host: '127.0.0.1',
    port,
    username: user,
    password,
    database,
    connectionUrl: `postgresql://${user}:${password}@127.0.0.1:${port}/${database}`,
    elapsedMs: Date.now() - startedAt,
  };
  await writeFile(join(target, '.api-emulator-clone.json'), JSON.stringify(result, null, 2));
  return result;
}

async function inspectWorkspace(name) {
  const target = cloneDir(name);
  return JSON.parse(await readFile(join(target, '.api-emulator-clone.json'), 'utf8'));
}

async function disposeWorkspace(name) {
  assertCloneName(name);
  await removeContainer(containerName(name));
  await rm(cloneDir(name), { recursive: true, force: true });
}

function printJson(value) {
  console.log(JSON.stringify(value, null, 2));
}

export {
  cloneWorkspace,
  disposeWorkspace,
  inspectWorkspace,
  prepareBase,
  resolveRuntime,
};

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [command, name] = process.argv.slice(2);
  if (command === 'prepare-base') printJson(await prepareBase({ force: process.env.API_EMULATOR_PG_FORCE_BASE === '1' }));
  else if (command === 'clone') printJson(await cloneWorkspace(name ?? `agent_${Date.now()}`, { requireCopyOnWrite: process.env.API_EMULATOR_PG_REQUIRE_COW === '1' }));
  else if (command === 'inspect') printJson(await inspectWorkspace(name));
  else if (command === 'dispose') await disposeWorkspace(name);
  else {
    console.error('Usage: node @supabase/local-postgres/workspace.mjs [prepare-base|clone <name>|inspect <name>|dispose <name>]');
    process.exit(1);
  }
}
