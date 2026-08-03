export const contract = {
  provider: 'openfda',
  source: 'openFDA drug APIs',
  docs: 'https://open.fda.gov/apis/',
  scope: ['drug-event', 'drug-enforcement', 'drug-label', 'drugsfda', 'drug-shortages'],
  fidelity: 'deterministic-subset',
};

const applicationDocument = {
  application_docs_title: 'Approval Letter',
  application_docs_type: 'Letter',
  application_docs_date: '2026-05-21',
  application_docs_url: 'https://www.accessdata.fda.gov/drugsatfda_docs/appletter/2026/123456Orig1s000ltr.pdf',
};

export const plugin = {
  name: 'openfda',
  register(app) {
    app.get('/inspect/contract', (c) => c.json(contract));
    app.get('/drug/event.json', (c) =>
      c.json({
        results: [
          {
            safetyreportid: 'govreg-event-1',
            receivedate: '20260501',
            patient: {
              drug: [{ medicinalproduct: 'Mounjaro' }],
              reaction: [{ reactionmeddrapt: 'Nausea' }],
            },
            openfda: {
              brand_name: ['MOUNJARO'],
              generic_name: ['TIRZEPATIDE'],
              manufacturer_name: ['Eli Lilly and Company'],
            },
          },
        ],
      })
    );
    app.get('/drug/enforcement.json', (c) =>
      c.json({
        results: [
          {
            recall_number: 'D-1234-2026',
            report_date: '20260515',
            recall_initiation_date: '20260501',
            status: 'Ongoing',
            classification: 'Class II',
            recalling_firm: 'Example Pharma Inc.',
            product_description: 'Example drug tablets',
            reason_for_recall: 'Labeling mix-up',
            openfda: { brand_name: ['EXAMPLEDRUG'], generic_name: ['EXAMPLEDIUM'] },
          },
        ],
      })
    );
    app.get('/drug/label.json', (c) =>
      c.json({
        results: [
          {
            package_ndc: '0000-0000',
            indications_and_usage: ['Indicated for emulator coverage.'],
            openfda: {
              brand_name: ['EXAMPLEDRUG'],
              generic_name: ['EXAMPLEDIUM'],
              manufacturer_name: ['Example Pharma Inc.'],
            },
          },
        ],
      })
    );
    app.get('/drug/drugsfda.json', (c) =>
      c.json({
        results: [
          {
            application_number: 'NDA123456',
            sponsor_name: 'Example Pharma Inc.',
            products: 'ExampleDrug tablet',
            openfda: {
              brand_name: ['EXAMPLEDRUG'],
              generic_name: ['EXAMPLEDIUM'],
              manufacturer_name: ['Example Pharma Inc.'],
            },
            submissions: [
              {
                submission_number: '001',
                submission_type: 'ORIG',
                submission_status: 'AP',
                submission_status_date: '2026-05-21',
                submission_class_code: 'TYPE 1',
                submission_class_code_description: 'New Molecular Entity',
                application_docs: [applicationDocument],
              },
            ],
          },
        ],
      })
    );
    app.get('/drug/shortages.json', (c) =>
      c.json({
        results: [
          {
            shortage_report_id: 'shortage-1',
            company_name: 'Example Pharma Inc.',
            products: 'ExampleDrug injection',
            status: 'Current',
          },
        ],
      })
    );
  },
};

export const label = 'openFDA API emulator';
export const endpoints = 'drug/event.json, drug/enforcement.json, drug/label.json, drug/drugsfda.json, drug/shortages.json';
export const initConfig = { openfda: { apiKey: 'openfda-emulator-key' } };

export default plugin;
