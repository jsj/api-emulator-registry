export const contract = {
  provider: 'congress',
  source: 'Congress.gov API v3',
  docs: 'https://api.congress.gov/',
  scope: ['bill-list', 'bill-detail'],
  fidelity: 'deterministic-subset',
};

const bill = (congress, type, number) => ({
  congress: Number(congress),
  type: String(type).toUpperCase(),
  number: String(number),
  title: number === '99' ? 'Example Drug Pricing Act' : 'Example Energy Infrastructure Act',
  latestAction: {
    actionDate: number === '99' ? '2026-05-22' : '2026-05-20',
    text: number === '99' ? 'Passed Senate.' : 'Referred to committee.',
  },
  url: `https://api.congress.gov/v3/bill/${congress}/${type}/${number}`,
});

export const plugin = {
  name: 'congress',
  register(app) {
    app.get('/inspect/contract', (c) => c.json(contract));
    app.get('/v3/bill', (c) => c.json({ bills: [bill(119, 'hr', '1234')] }));
    app.get('/v3/bill/:congress/:billType', (c) =>
      c.json({ bills: [bill(c.req.param('congress'), c.req.param('billType'), '1234')] })
    );
    app.get('/v3/bill/:congress/:billType/:billNumber', (c) =>
      c.json({ bill: bill(c.req.param('congress'), c.req.param('billType'), c.req.param('billNumber')) })
    );
  },
};

export const label = 'Congress.gov API emulator';
export const endpoints = 'v3/bill, v3/bill/:congress/:billType, v3/bill/:congress/:billType/:billNumber';
export const initConfig = { congress: { apiKey: 'congress-emulator-key' } };

export default plugin;
