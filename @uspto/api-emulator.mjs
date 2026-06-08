export const contract = {
  provider: 'uspto',
  source: 'USPTO Open Data Portal and TSDR-compatible APIs',
  docs: 'https://data.uspto.gov/apis/getting-started',
  scope: ['patent-application-assignments', 'trademark-status'],
  fidelity: 'deterministic-subset',
};

export const plugin = {
  name: 'uspto',
  register(app) {
    app.get('/inspect/contract', (c) => c.json(contract));
    app.get('/api/v1/patent/applications/:applicationNumber/assignment', (c) =>
      c.json({
        count: 1,
        patentFileWrapperDataBag: [
          {
            reelNumber: '066070',
            frameNumber: '0442',
            assignmentReceivedDate: '2026-05-01',
            conveyanceText: `Assignment for ${c.req.param('applicationNumber')}`,
            assignorBag: [{ name: 'Inventor One' }],
            assigneeBag: [{ name: 'Example Bio Inc.' }],
            assignmentDocumentLocationURI: 'https://assignmentcenter.uspto.gov/doc.pdf',
          },
        ],
      })
    );
    app.get('/ts/cd/casestatus/:serialNumber/info.json', (c) => {
      const serialNumber = String(c.req.param('serialNumber')).replace(/^sn/i, '');
      return c.json({
        caseFileHeader: {
          serialNumber,
          registrationNumber: '7654321',
          markIdentification: 'EXAMPLEMARK',
          filingDate: '2022-01-05',
          registrationDate: '2023-04-18',
          statusCode: '700',
          statusDescription: 'REGISTERED',
          statusDate: '2023-04-18',
        },
        owners: [{ name: 'Example Bio Inc.' }],
        goodsAndServices: ['Pharmaceutical preparations'],
      });
    });
  },
};

export const label = 'USPTO API emulator';
export const endpoints = 'api/v1/patent/applications/:applicationNumber/assignment, ts/cd/casestatus/:serialNumber/info.json';
export const initConfig = { uspto: { apiKey: 'uspto-emulator-key' } };

export default plugin;
