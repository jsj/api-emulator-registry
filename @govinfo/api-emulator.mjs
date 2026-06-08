export const contract = {
  provider: 'govinfo',
  source: 'GovInfo API',
  docs: 'https://api.govinfo.gov/docs/',
  scope: ['collections', 'package-summary', 'package-content'],
  fidelity: 'deterministic-subset',
};

export const plugin = {
  name: 'govinfo',
  register(app) {
    app.get('/inspect/contract', (c) => c.json(contract));
    app.get('/collections/:collection/:startDate', (c) =>
      c.json({
        packages: [
          {
            packageId: `${c.req.param('collection')}-2026-05-24`,
            title: 'Federal Register Volume 91',
            collectionCode: c.req.param('collection'),
            dateIssued: '2026-05-24',
            packageLink: `https://api.govinfo.gov/packages/${c.req.param('collection')}-2026-05-24/summary`,
          },
        ],
      })
    );
    app.get('/packages/:packageId/summary', (c) =>
      c.json({
        packageId: c.req.param('packageId'),
        title: 'Example Energy Infrastructure Act',
        collectionCode: 'BILLS',
        dateIssued: '2026-05-20',
        packageLink: `https://api.govinfo.gov/packages/${c.req.param('packageId')}/summary`,
      })
    );
    app.get('/packages/:packageId/:format', (c) => {
      const format = c.req.param('format');
      if (format === 'pdf') return c.body('pdf-bytes', 200, { 'Content-Type': 'application/pdf' });
      return c.text(`<${format}>Example GovInfo content for ${c.req.param('packageId')}</${format}>`, 200, {
        'Content-Type': format === 'htm' ? 'text/html' : 'application/xml',
      });
    });
  },
};

export const label = 'GovInfo API emulator';
export const endpoints = 'collections/:collection/:startDate, packages/:packageId/summary, packages/:packageId/:format';
export const initConfig = { govinfo: { apiKey: 'govinfo-emulator-key' } };

export default plugin;
