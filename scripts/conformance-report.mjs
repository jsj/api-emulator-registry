import { analyzeConformance } from './conformance/drift.mjs';
import { loadConformance } from './conformance/load.mjs';

const json = process.argv.includes('--json');
const conformance = await loadConformance();
const reports = await analyzeConformance(conformance);

if (json) {
  console.log(JSON.stringify({ providers: reports }, null, 2));
} else {
  console.log('provider'.padEnd(16), 'score'.padEnd(8), 'band'.padEnd(8), 'findings');
  for (const report of reports) {
    const findingCount = report.findings.length;
    console.log(report.provider.padEnd(16), `${report.score}%`.padEnd(8), report.scoreBand.padEnd(8), String(findingCount));
  }
}
