import { FIXTURE_ADDRESS, state } from '../store.mjs';

// Portfolio fixtures are independent of resting orders: matching/settlement are unsupported.
function positions(store, user) {
  if (user.toLowerCase() !== FIXTURE_ADDRESS) return [];
  const market = Object.values(state(store).markets)[0];
  const price = Number(JSON.parse(market.outcomePrices)[0]);
  const tokens = JSON.parse(market.clobTokenIds);
  return [{ proxy_wallet: user, token_id: tokens[0], condition_id: market.conditionId,
    current_size: '10', avg_price: '0.50', entry_cost_usdc: '5', entry_fees_usdc: '0', total_cost_usdc: '5',
    current_price: String(price), current_value: (10 * price).toFixed(2), total_size: '10',
    realized_pnl: '0', unrealized_pnl: (10 * price - 5).toFixed(2), total_pnl: (10 * price - 5).toFixed(2),
    percent_pnl: ((10 * price - 5) / 5 * 100).toFixed(2), percent_realized_pnl: '0',
    status: 'OPEN', redeemable: false, mergeable: false, negative_risk: false, archived: false, verified: false,
    title: market.question, slug: market.slug, event_id: `event-${market.id}`, event_slug: market.slug,
    outcome: 'Yes', outcome_index: 0, opposite_outcome: 'No', opposite_token_id: tokens[1] }];
}

export function registerDataRoutes(app, store) {
  const get = (path, handler) => {
    const guarded = c => {
      const user = c.req.query('user');
      if (!/^0x[0-9a-f]{40}$/i.test(user ?? '')) return c.json({ error: 'Valid user address is required' }, 400);
      let rows = positions(store, user);
      const condition = c.req.query('condition') ?? c.req.query('market');
      if (condition) rows = rows.filter(p => condition.split(',').includes(p.condition_id));
      return handler(c, rows, user);
    };
    app.get(`/data${path}`, guarded); app.get(path, guarded);
  };
  get('/v2/positions', (c, rows) => {
    const status = c.req.query('status');
    if (status) rows = rows.filter(p => p.status === status);
    const limit = Number(c.req.query('limit') ?? 100), offset = Number(c.req.query('cursor') ?? 0);
    if (!Number.isInteger(limit) || limit < 1 || limit > 500 || !Number.isInteger(offset) || offset < 0) return c.json({ error: 'Invalid pagination' }, 400);
    const hasMore = offset + limit < rows.length;
    return c.json({ data: rows.slice(offset, offset + limit), pagination: { limit, offset, has_more: hasMore, next_cursor: hasMore ? String(offset + limit) : null } });
  });
  get('/v2/value', (c, rows, user) => c.json({ data: { proxy_wallet: user, value: rows.reduce((total, p) => total + Number(p.current_value), 0).toFixed(4) } }));
  get('/positions', (c, rows) => c.json(rows.map(p => ({ proxyWallet: p.proxy_wallet, asset: p.token_id, conditionId: p.condition_id,
    size: Number(p.current_size), avgPrice: Number(p.avg_price), initialValue: Number(p.entry_cost_usdc), currentValue: Number(p.current_value),
    cashPnl: Number(p.unrealized_pnl), percentPnl: Number(p.percent_pnl), totalBought: Number(p.total_size), realizedPnl: 0, percentRealizedPnl: 0,
    curPrice: Number(p.current_price), redeemable: false, mergeable: false, negativeRisk: false, title: p.title, slug: p.slug,
    icon: '', eventId: p.event_id, eventSlug: p.event_slug, outcome: p.outcome, outcomeIndex: 0, oppositeOutcome: 'No', oppositeAsset: p.opposite_token_id, endDate: '' }))));
  get('/value', (c, rows, user) => c.json([{ user, value: rows.reduce((total, p) => total + Number(p.current_value), 0) }]));
}
