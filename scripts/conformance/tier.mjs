import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { scoreBand, scoreManifest } from './score.mjs';

export const fidelityTiers = {
  contractBacked: 'contract-backed',
  smokeOnly: 'smoke-only',
  stub: 'stub',
  generatedFallback: 'generated fallback',
};

function routeCount(source) {
  return [...source.matchAll(/app\.(get|post|put|patch|delete)\(\s*['"`]([^'"`]+)['"`]/g)].length;
}

function providerSource(root, slug, specifier) {
  const candidates = [
    join(root, `@${slug}/api-emulator.mjs`),
    specifier ? join(root, specifier) : null,
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (existsSync(candidate)) return readFileSync(candidate, 'utf8');
  }
  return '';
}

export function loadConformanceManifest(root, slug) {
  const path = join(root, 'conformance/providers', `${slug}.json`);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf8'));
}

export function classifyProviderFidelity(root, slug, entry = {}) {
  const conformance = loadConformanceManifest(root, slug);
  if (conformance) {
    const score = scoreManifest(conformance);
    return {
      tier: fidelityTiers.contractBacked,
      detail: `${score}% ${scoreBand(score)} conformance score`,
      conformance,
      score,
      scoreBand: scoreBand(score),
    };
  }

  const source = providerSource(root, slug, entry.specifier);
  const smokePath = join(root, `@${slug}/smoke.mjs`);
  const hasSmoke = existsSync(smokePath);
  const routes = routeCount(source);

  if (/fidelity:\s*['"`]stub['"`]/i.test(source) || routes <= 1) {
    return {
      tier: fidelityTiers.stub,
      detail: hasSmoke ? 'starter surface with smoke coverage' : 'starter surface without smoke coverage',
    };
  }

  if (hasSmoke) {
    return {
      tier: fidelityTiers.smokeOnly,
      detail: 'direct smoke test exists; no conformance manifest yet',
    };
  }

  return {
    tier: fidelityTiers.generatedFallback,
    detail: 'local generated surface; no smoke or conformance manifest yet',
  };
}

