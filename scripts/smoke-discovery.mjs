import { readdir, readFile, access } from 'node:fs/promises';
import { join } from 'node:path';

export async function listSmokeFiles(root) {
  const entries = await readdir(join(root, 'providers'), { withFileTypes: true });
  const smokeFiles = [];
  for (const entry of entries.filter((entry) => entry.isDirectory() && entry.name.startsWith('@'))) {
    const directory = `providers/${entry.name}`;
    if ((await readdir(join(root, directory))).includes('smoke.mjs')) smokeFiles.push(`${directory}/smoke.mjs`);
  }
  if (smokeFiles.length === 0) throw new Error('No provider smoke tests found under providers/');

  // A removed test must not silently remove the coverage promised by a manifest.
  const manifestDir = join(root, 'conformance/providers');
  for (const file of await readdir(manifestDir)) {
    if (!file.endsWith('.json')) continue;
    const manifest = JSON.parse(await readFile(join(manifestDir, file), 'utf8'));
    const command = manifest.validation?.directSmoke;
    if (!command) continue;
    const path = command.match(/(?:^|\s)(providers\/\S+smoke\.mjs)(?:\s|$)/)?.[1];
    if (path) await access(join(root, path)).catch(() => { throw new Error(`${file} expects missing smoke test ${path}`); });
  }
  return smokeFiles.sort((a, b) => a.localeCompare(b));
}
