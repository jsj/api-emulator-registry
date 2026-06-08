export const contract = {
  provider: 'courtlistener',
  source: 'CourtListener REST API v4',
  docs: 'https://www.courtlistener.com/help/api/rest/',
  scope: ['search', 'dockets', 'recap-documents'],
  fidelity: 'deterministic-subset',
};

export const plugin = {
  name: 'courtlistener',
  register(app) {
    app.get('/inspect/contract', (c) => c.json(contract));
    app.get('/api/rest/v4/search/', (c) =>
      c.json({
        results: [
          {
            id: 42,
            caseName: 'Example Pharma Securities Litigation',
            court: 'ca2',
            docketNumber: '24-1234',
            dateFiled: '2026-05-01',
            absolute_url: '/opinion/42/example/',
            snippet: 'Alleged failure to disclose regulatory risk.',
          },
        ],
      })
    );
    app.get('/api/rest/v4/dockets/:docketId/', (c) =>
      c.json({
        id: Number(c.req.param('docketId')),
        caseName: 'Example Pharma Securities Litigation',
        docketNumber: '1:26-cv-00001',
        court: 'nysd',
        dateFiled: '2026-05-01',
        absolute_url: `/docket/${c.req.param('docketId')}/example/`,
        nature_of_suit: 'Securities',
      })
    );
    app.get('/api/rest/v4/recap-documents/:recapDocumentId/', (c) =>
      c.json({
        id: Number(c.req.param('recapDocumentId')),
        docket: 777,
        docket_entry: 999,
        document_number: '12',
        attachment_number: '1',
        description: 'Motion to dismiss',
        date_upload: '2026-05-03T12:00:00Z',
        filepath_local: 'https://storage.courtlistener.com/recap/example.pdf',
        is_available: true,
        page_count: 42,
        pacer_doc_id: '123456789',
      })
    );
  },
};

export const label = 'CourtListener API emulator';
export const endpoints = 'api/rest/v4/search, api/rest/v4/dockets/:id, api/rest/v4/recap-documents/:id';
export const initConfig = { courtlistener: { token: 'courtlistener-emulator-token' } };

export default plugin;
