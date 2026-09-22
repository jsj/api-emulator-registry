import { marketFromBody } from './concepts/markets.mjs';

export const FIXTURE_TIME = 1780272000;
export const FIXTURE_ADDRESS = '0x1111111111111111111111111111111111111111';

export const DEFAULT_MARKETS = [
  {
    id: 'polymarket-weather-2026',
    question: 'Will global average temperature set a new record in 2026?',
    outcomes: JSON.stringify(['Yes', 'No']),
    outcomePrices: JSON.stringify(['0.58', '0.42']),
    volume: '4200000',
    endDate: '2026-06-30T00:00:00Z',
    description: 'Emulated Polymarket climate and weather market.',
  },
  {
    id: 'polymarket-space-launch-2026',
    question: 'Will there be more than 200 orbital launch attempts in 2026?',
    outcomes: JSON.stringify(['Yes', 'No']),
    outcomePrices: JSON.stringify(['0.47', '0.53']),
    volume: '1900000',
    endDate: '2026-12-31T00:00:00Z',
    description: 'Emulated Polymarket space industry market.',
  },
].map((market, index) => marketFromBody({
  ...market,
  conditionId: `0x${String(index + 1).padStart(64, '0')}`,
  clobTokenIds: JSON.stringify([String(1001 + index * 2), String(1002 + index * 2)]),
  version: 'v1',
  orderPriceMinTickSize: 0.01,
  orderMinSize: 1,
  negRisk: false,
}));

export function state(store) {
  const existing = store.getData?.('polymarket:state');
  if (existing) return existing;
  const initial = {
    markets: Object.fromEntries(structuredClone(DEFAULT_MARKETS).map((market) => [market.id, market])),
    orders: {},
    nextOrderId: 1,
    requests: [],
  };
  store.setData?.('polymarket:state', initial);
  return initial;
}

export function saveState(store, value) {
  store.setData?.('polymarket:state', value);
}
