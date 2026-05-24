import { access, readdir, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const manifestDir = resolve(repoRoot, 'conformance/providers');

export function rootPath(...parts) {
  return resolve(repoRoot, ...parts);
}

export async function pathExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export async function loadCatalog() {
  const catalogPath = rootPath('api-emulator.catalog.json');
  const catalog = JSON.parse(await readFile(catalogPath, 'utf8'));
  return catalog.plugins ?? {};
}

export async function loadManifests() {
  const files = (await readdir(manifestDir)).filter((file) => file.endsWith('.json')).sort((a, b) => a.localeCompare(b));
  const manifests = [];
  for (const file of files) {
    const path = resolve(manifestDir, file);
    const manifest = JSON.parse(await readFile(path, 'utf8'));
    manifests.push({ file, path, manifest });
  }
  return manifests;
}

function numberBetweenZeroAndOne(value) {
  return typeof value === 'number' && value >= 0 && value <= 1;
}

export function validateManifestShape(manifest) {
  const failures = [];
  if (!manifest || typeof manifest !== 'object') failures.push('manifest must be an object');
  if (typeof manifest.provider !== 'string' || manifest.provider.length === 0) failures.push('provider is required');
  if (manifest.catalog?.slug !== manifest.provider) failures.push('catalog.slug must match provider');
  if (typeof manifest.catalog?.specifier !== 'string') failures.push('catalog.specifier is required');
  if (!Array.isArray(manifest.sources?.docs) || manifest.sources.docs.length === 0) failures.push('sources.docs must contain at least one URL');
  if (typeof manifest.validation?.directSmoke !== 'string') failures.push('validation.directSmoke is required');
  if (!Array.isArray(manifest.validation?.contractChecks)) failures.push('validation.contractChecks must be an array');

  const fidelity = manifest.fidelity ?? {};
  for (const key of ['routes', 'schemas', 'auth', 'errors', 'pagination', 'state', 'officialClient']) {
    if (!numberBetweenZeroAndOne(fidelity[key])) failures.push(`fidelity.${key} must be between 0 and 1`);
  }

  return failures;
}

export async function loadConformance() {
  const [catalog, manifests] = await Promise.all([loadCatalog(), loadManifests()]);
  return { catalog, manifests };
}
