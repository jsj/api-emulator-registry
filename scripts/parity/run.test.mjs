import assert from 'node:assert/strict';
import test from 'node:test';
import { evaluateParity } from './run.mjs';

const tools = [{ name: 'list', inputSchema: { type: 'object' } }, { name: 'create' }];
const scenario = { id: 'list-empty', tool: 'list', expected: { results: [] } };
const options = { expectedTools: tools, actualTools: tools, cases: [scenario], runScenario: async () => ({ results: [] }) };

test('bounded evidence never promotes untested operations', async () => {
  const report = await evaluateParity(options);
  assert.equal(report.passed, true);
  assert.equal(report.counts.verified_in_bounded_scenarios, 1);
  assert.equal(report.counts.unverified, 1);
});
test('contract drift fails even when behavior matches', async () => {
  for (const actualTools of [tools.slice(0, 1), [...tools, { name: 'new' }], [{ ...tools[0], description: 'changed' }, tools[1]]]) {
    assert.equal((await evaluateParity({ ...options, actualTools })).passed, false);
  }
});
test('known gaps remain partial and changed or fixed gaps require review', async () => {
  const mismatch = await evaluateParity({ ...options, runScenario: async () => ({}) });
  const knownGaps = [{ id: scenario.id, reason: 'Upstream field not implemented', differences: mismatch.scenarios[0].differences }];
  const known = await evaluateParity({ ...options, knownGaps, runScenario: async () => ({}) });
  assert.equal(known.passed, true);
  assert.equal(known.boundedParity, false);
  assert.equal(known.counts.partial, 1);
  assert.equal((await evaluateParity({ ...options, knownGaps })).passed, false);
  assert.equal((await evaluateParity({ ...options, knownGaps, runScenario: async () => ({ results: null }) })).passed, false);
});
test('rejects unauditable fixtures', async () => {
  for (const override of [
    { cases: [scenario, scenario] },
    { cases: [{ ...scenario, tool: 'unknown' }] },
    { cases: [{ ...scenario, ignorePaths: ['/results'] }] },
    { knownGaps: [{ id: 'orphan', reason: 'missing case', differences: [{}] }] },
  ]) await assert.rejects(evaluateParity({ ...options, ...override }));
});
