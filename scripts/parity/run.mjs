import { compareJson, compareToolContracts } from './compare.mjs';

// An advertised operation is not evidence that its behavior is implemented.
export async function evaluateParity({ expectedTools, actualTools, cases, runScenario, knownGaps = [] }) {
  const names = new Set(expectedTools.map(tool => tool.name));
  const ids = new Set();
  const gapIds = new Set();
  for (const gap of knownGaps) {
    if (!gap.reason || !gap.differences?.length || gapIds.has(gap.id) || !cases.some(scenario => scenario.id === gap.id)) throw new Error(`Invalid known gap: ${gap.id}`);
    gapIds.add(gap.id);
  }
  const scenarios = [];
  for (const scenario of cases) {
    if (!scenario.id || ids.has(scenario.id) || !names.has(scenario.tool)) throw new Error(`Invalid parity scenario: ${scenario.id}`);
    if ((scenario.ignorePaths ?? []).some(path => !scenario.ignoreReasons?.[path])) throw new Error(`Ignore reason required: ${scenario.id}`);
    ids.add(scenario.id);
    const actual = await runScenario(scenario);
    const differences = compareJson(scenario.expected, actual, { ignorePaths: scenario.ignorePaths ?? [] });
    const gap = knownGaps.find(gap => gap.id === scenario.id);
    const known = gap && compareJson(gap.differences, differences).length === 0;
    scenarios.push({ id: scenario.id, tool: scenario.tool, status: known ? 'known_gap' : differences.length ? 'mismatch' : 'passed', differences, ...(gap ? { gapReason: gap.reason, gapChanged: !known } : {}), ignorePaths: scenario.ignorePaths ?? [], ignoreReasons: scenario.ignoreReasons });
  }
  const contract = compareToolContracts(expectedTools, actualTools);
  const operations = expectedTools.map(({ name }) => {
    const evidence = scenarios.filter(scenario => scenario.tool === name);
    const status = !actualTools.some(tool => tool.name === name) ? 'missing'
      : !evidence.length ? 'unverified'
      : evidence.some(scenario => scenario.status !== 'passed') ? 'partial' : 'verified_in_bounded_scenarios';
    return { name, status, scenarios: evidence.map(scenario => scenario.id) };
  });
  const counts = Object.fromEntries(['missing', 'unverified', 'partial', 'verified_in_bounded_scenarios'].map(status => [status, operations.filter(operation => operation.status === status).length]));
  const contractMatches = !contract.added.length && !contract.removed.length && !contract.changed.length;
  return { passed: contractMatches && scenarios.every(scenario => scenario.status !== 'mismatch' && !scenario.gapChanged), boundedParity: contractMatches && scenarios.every(scenario => scenario.status === 'passed'), contract, counts, operations, scenarios };
}
