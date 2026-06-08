export const contract = {
  provider: 'eia',
  source: 'U.S. EIA Open Data API v2',
  docs: 'https://www.eia.gov/opendata/documentation.php',
  scope: ['route-data'],
  fidelity: 'deterministic-subset',
};

const energyRows = [
  {
    period: '2026-03',
    stateDescription: 'Texas',
    sectorName: 'residential',
    price: '14.2',
    'price-units': 'cents per kilowatthour',
    value: '421000',
    'value-units': 'thousand barrels',
  },
];

export const plugin = {
  name: 'eia',
  register(app) {
    app.get('/inspect/contract', (c) => c.json(contract));
    app.get('/v2/:route{.+}/data/', (c) => c.json({ response: { data: energyRows, route: c.req.param('route') } }));
  },
};

export const label = 'EIA API emulator';
export const endpoints = 'v2/:route/data';
export const initConfig = { eia: { apiKey: 'eia-emulator-key' } };

export default plugin;
