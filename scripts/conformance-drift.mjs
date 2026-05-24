import { analyzeConformance } from './conformance/drift.mjs';
import { loadConformance } from './conformance/load.mjs';

const json = process.argv.includes('--json');
const conformance = await loadConformance();
const reports = await analyzeConformance(conformance);
const drift = reports.filter((report) => report.findings.length > 0);

if (json) {
  console.log(JSON.stringify({ drift }, null, 2));
} else if (drift.length === 0) {
  console.log('conformance drift ok');
} else {
  console.log(`conformance drift found (${drift.length} providers)`);
  for (const report of drift) {
    console.log(`\n${report.provider} (${report.score}%, ${report.scoreBand})`);
    for (const finding of report.findings) {
      console.log(`- ${finding.severity}: ${finding.area}: ${finding.message}`);
    }
  }
}

if (drift.some((report) => report.findings.some((finding) => finding.severity === 'error'))) {
  process.exit(1);
}
