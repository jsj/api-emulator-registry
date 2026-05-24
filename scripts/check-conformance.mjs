import { analyzeConformance } from './conformance/drift.mjs';
import { loadConformance } from './conformance/load.mjs';

const conformance = await loadConformance();
const reports = await analyzeConformance(conformance);
const errors = reports.flatMap((report) =>
  report.findings
    .filter((finding) => finding.severity === 'error')
    .map((finding) => `${report.provider}: ${finding.area}: ${finding.message}`),
);

if (errors.length > 0) {
  console.error('conformance check failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`conformance manifests ok (${reports.length} providers)`);
