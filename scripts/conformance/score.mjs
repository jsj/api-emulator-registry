const weights = {
  routes: 0.2,
  schemas: 0.18,
  auth: 0.14,
  errors: 0.12,
  pagination: 0.1,
  state: 0.14,
  officialClient: 0.12,
};

export function scoreManifest(manifest) {
  const fidelity = manifest.fidelity ?? {};
  let score = 0;
  let totalWeight = 0;

  for (const [key, weight] of Object.entries(weights)) {
    if (typeof fidelity[key] === 'number') {
      score += fidelity[key] * weight;
      totalWeight += weight;
    }
  }

  return totalWeight === 0 ? 0 : Math.round((score / totalWeight) * 100);
}

export function scoreBand(score) {
  if (score >= 85) return 'high';
  if (score >= 65) return 'medium';
  return 'low';
}
