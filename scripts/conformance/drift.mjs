import { rootPath, pathExists, validateManifestShape } from './load.mjs';
import { scoreBand, scoreManifest } from './score.mjs';

function commandTarget(command) {
  const parts = command.split(/\s+/).filter(Boolean);
  if (['node', 'bun'].includes(parts[0])) return parts[1];
  return parts[0];
}

export async function analyzeManifest({ catalog, file, manifest }) {
  const findings = [];
  const shapeFailures = validateManifestShape(manifest);
  for (const failure of shapeFailures) {
    findings.push({ severity: 'error', area: 'manifest', message: failure });
  }

  const catalogEntry = catalog[manifest.provider];
  if (!catalogEntry) {
    findings.push({ severity: 'warning', area: 'catalog', message: 'provider is missing from api-emulator.catalog.json' });
  } else if (catalogEntry.specifier !== manifest.catalog?.specifier) {
    findings.push({
      severity: 'warning',
      area: 'catalog',
      message: `catalog specifier drift: manifest has ${manifest.catalog?.specifier}, catalog has ${catalogEntry.specifier}`,
    });
  }

  const specifier = manifest.catalog?.specifier;
  if (specifier && !(await pathExists(rootPath(specifier)))) {
    findings.push({ severity: 'error', area: 'plugin', message: `plugin specifier does not exist: ${specifier}` });
  }

  const directSmoke = manifest.validation?.directSmoke;
  if (directSmoke && !(await pathExists(rootPath(commandTarget(directSmoke))))) {
    findings.push({ severity: 'warning', area: 'smoke', message: `direct smoke target does not exist: ${directSmoke}` });
  }

  for (const check of manifest.validation?.contractChecks ?? []) {
    if (!(await pathExists(rootPath(commandTarget(check))))) {
      findings.push({ severity: 'warning', area: 'contract', message: `contract check target does not exist: ${check}` });
    }
  }

  if (manifest.sources?.cli && !manifest.validation?.cliSmoke && !manifest.validation?.skipReason) {
    findings.push({ severity: 'warning', area: 'official-client', message: `official CLI ${manifest.sources.cli} is declared without cliSmoke or skipReason` });
  }

  if (manifest.sources?.sdk && !manifest.validation?.cliSmoke && !manifest.validation?.contractChecks?.length && !manifest.validation?.skipReason) {
    findings.push({ severity: 'warning', area: 'official-client', message: `official SDK ${manifest.sources.sdk} is declared without conformance coverage or skipReason` });
  }

  if (!manifest.sources?.openapi && !manifest.sources?.sdk && !manifest.sources?.cli && !manifest.sources?.internal) {
    findings.push({ severity: 'warning', area: 'sources', message: 'manifest has docs but no machine-checkable source' });
  }

  const score = scoreManifest(manifest);
  return {
    file,
    provider: manifest.provider,
    score,
    scoreBand: scoreBand(score),
    findings,
  };
}

export async function analyzeConformance({ catalog, manifests }) {
  const reports = [];
  for (const item of manifests) {
    reports.push(await analyzeManifest({ catalog, ...item }));
  }
  return reports;
}
