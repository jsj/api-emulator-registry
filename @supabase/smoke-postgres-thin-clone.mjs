import { spawn } from 'node:child_process';
import { cloneWorkspace, disposeWorkspace } from './local-postgres/workspace.mjs';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function commandAvailable(command, args = ['--version']) {
  return new Promise((resolve) => {
    const child = spawn(command, args, { stdio: 'ignore' });
    child.on('exit', (code) => resolve(code === 0));
    child.on('error', () => resolve(false));
  });
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: options.capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
      ...options,
    });
    let stdout = '';
    let stderr = '';
    child.stdout?.on('data', (chunk) => stdout += chunk);
    child.stderr?.on('data', (chunk) => stderr += chunk);
    child.on('exit', (code) => {
      if (code === 0) resolve(stdout.trim());
      else reject(new Error(`${command} ${args.join(' ')} failed with exit code ${code}\n${stderr}`));
    });
    child.on('error', reject);
  });
}

if (process.env.RUN_DB_WORKSPACE_TESTS !== '1') {
  console.log('Skipping Postgres thin clone smoke. Set RUN_DB_WORKSPACE_TESTS=1 to run container-backed checks.');
  process.exit(0);
}

const hasDocker = await commandAvailable('docker', ['info']);
const hasContainer = await commandAvailable('container', ['ls', '--all', '--format', 'json']);
if (!hasDocker && !hasContainer) {
  console.log('Skipping Postgres thin clone smoke because neither Docker nor Apple container is available.');
  process.exit(0);
}

const psqlAvailable = await commandAvailable('psql');
if (!psqlAvailable) {
  console.log('Skipping Postgres thin clone smoke because psql is unavailable.');
  process.exit(0);
}

const first = `thin_${Date.now()}_a`;
const second = `thin_${Date.now()}_b`;

try {
  const firstClone = await cloneWorkspace(first);
  const secondClone = await cloneWorkspace(second);
  assert(firstClone.connectionUrl !== secondClone.connectionUrl, 'clones should have distinct connection URLs');
  assert(['apfs-clonefile', 'reflink'].includes(firstClone.cloneMode), `expected copy-on-write clone, got ${firstClone.cloneMode}`);
  assert(['apfs-clonefile', 'reflink'].includes(secondClone.cloneMode), `expected copy-on-write clone, got ${secondClone.cloneMode}`);

  await run('psql', [firstClone.connectionUrl, '-v', 'ON_ERROR_STOP=1', '-c', "create table public.thin_clone_smoke (id int primary key, value text); insert into public.thin_clone_smoke values (1, 'first');"]);
  const firstRows = await run('psql', [firstClone.connectionUrl, '-t', '-A', '-c', 'select count(*) from public.thin_clone_smoke'], { capture: true });
  assert(firstRows === '1', 'first clone should contain its own migration');

  const secondHasTable = await run('psql', [secondClone.connectionUrl, '-t', '-A', '-c', "select to_regclass('public.thin_clone_smoke') is not null"], { capture: true });
  assert(secondHasTable === 'f', 'second clone should not see first clone changes');

  console.log(`Postgres thin clone smoke passed using ${firstClone.runtime}/${firstClone.cloneMode}.`);
} finally {
  await disposeWorkspace(first).catch(() => undefined);
  await disposeWorkspace(second).catch(() => undefined);
}
