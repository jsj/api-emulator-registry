import { FIXTURE_TIME, state, saveState } from '../store.mjs';
import { findToken } from './clob.mjs';

export const FIXTURE_API_KEY = '00000000-0000-4000-8000-000000000001';
export const FIXTURE_CREDENTIALS = { apiKey: FIXTURE_API_KEY, secret: 'ZW11bGF0b3Itb25seS1ub3QtYS1yZWFsLXNlY3JldA==', passphrase: 'emulator-only' };

export function registerOrderRoutes(app, store) {
  const register = (method, path, handler, authenticated = true) => {
    const guarded = async c => {
      // Fixture authentication checks headers only; this is not signature verification.
      if (authenticated && (c.req.header('POLY_API_KEY') !== FIXTURE_API_KEY || !c.req.header('POLY_ADDRESS') || !c.req.header('POLY_SIGNATURE') || !c.req.header('POLY_TIMESTAMP') || c.req.header('POLY_PASSPHRASE') !== FIXTURE_CREDENTIALS.passphrase)) return c.json({ error: 'Unauthorized/Invalid api key' }, 401);
      return handler(c);
    };
    app[method](path, guarded); app[method](`/clob${path}`, guarded);
  };
  const credentials = c => {
    if (!c.req.header('POLY_ADDRESS') || !c.req.header('POLY_SIGNATURE')) return c.json({ error: 'Missing fixture L1 headers' }, 401);
    return c.json(FIXTURE_CREDENTIALS);
  };
  register('post', '/auth/api-key', credentials, false);
  register('get', '/auth/derive-api-key', credentials, false);
  register('get', '/auth/api-keys', c => c.json({ apiKeys: [FIXTURE_API_KEY] }));
  const owned = c => Object.values(state(store).orders).filter(o => o.maker_address.toLowerCase() === c.req.header('POLY_ADDRESS').toLowerCase());
  const place = (c, body) => {
    const order = body?.order;
    const token = findToken(store, String(order?.tokenId));
    if (!token || !['BUY', 'SELL', 0, 1].includes(order?.side)) return { error: 'Invalid token or side' };
    if (!token.market.acceptingOrders || token.market.closed) return { error: 'Market is closed' };
    const side = order.side === 'BUY' || order.side === 0 ? 'BUY' : 'SELL';
    const maker = Number(order.makerAmount), taker = Number(order.takerAmount);
    const size = (side === 'BUY' ? taker : maker) / 1e6;
    const price = side === 'BUY' ? maker / taker : taker / maker;
    if (![maker, taker].every(n => Number.isSafeInteger(n) && n > 0) || !Number.isFinite(price) || price <= 0 || price >= 1 || size < token.market.orderMinSize || Math.abs(price / token.market.orderPriceMinTickSize - Math.round(price / token.market.orderPriceMinTickSize)) > 1e-7) return { error: 'Invalid size or price tick' };
    if (!['GTC', 'GTD'].includes(body.orderType ?? 'GTC')) return { error: 'Fixture supports resting GTC/GTD orders only' };
    const expiration = Number(order.expiration ?? 0);
    if (body.orderType === 'GTD' && (!Number.isFinite(expiration) || expiration <= FIXTURE_TIME)) return { error: 'Invalid expiration' };
    const crosses = side === 'BUY' ? price >= token.price + 0.01 : price <= token.price - 0.01;
    if (crosses) return { error: 'Crossing orders and matching are not supported by this fixture' };
    const current = state(store);
    const id = `0x${String(current.nextOrderId++).padStart(64, '0')}`;
    current.orders[id] = {
      id, asset_id: String(order.tokenId), market: token.market.conditionId, side,
      price: price.toFixed(6), original_size: String(size), size_matched: '0',
      status: 'LIVE', owner: FIXTURE_API_KEY, maker_address: c.req.header('POLY_ADDRESS'),
      outcome: JSON.parse(token.market.outcomes)[token.index], order_type: body.orderType ?? 'GTC',
      created_at: FIXTURE_TIME, expiration: String(expiration), associate_trades: [],
    };
    saveState(store, current);
    return { success: true, errorMsg: '', orderID: id, status: 'live', makingAmount: '', takingAmount: '', tradeIDs: [], transactionsHashes: [] };
  };
  register('post', '/order', async c => {
    const result = place(c, await c.req.json().catch(() => null));
    return c.json(result, result.error ? 400 : 200);
  });
  register('get', '/data/orders', c => {
    let orders = owned(c).filter(o => o.status === 'LIVE');
    for (const field of ['market', 'asset_id', 'id']) if (c.req.query(field)) orders = orders.filter(o => o[field] === c.req.query(field));
    return c.json({ data: orders, count: orders.length, limit: 500, next_cursor: 'LTE=' });
  });
  register('get', '/data/order/:id', c => {
    const order = owned(c).find(o => o.id === c.req.param('id'));
    return order ? c.json(order) : c.json({ error: 'Order not found' }, 404);
  });
  const cancel = (c, ids) => {
    const orders = owned(c);
    const result = { canceled: [], not_canceled: {} };
    for (const id of ids) {
      const order = orders.find(o => o.id === id && o.status === 'LIVE');
      if (!order) result.not_canceled[id] = 'Order not found or not live';
      else { order.status = 'CANCELED'; result.canceled.push(id); }
    }
    saveState(store, state(store));
    return c.json(result);
  };
  register('delete', '/order', async c => {
    const body = await c.req.json().catch(() => null);
    return typeof body?.orderID === 'string' ? cancel(c, [body.orderID]) : c.json({ error: 'orderID is required' }, 400);
  });
  register('delete', '/orders', async c => {
    const body = await c.req.json().catch(() => null);
    return Array.isArray(body) && body.every(id => typeof id === 'string') ? cancel(c, body) : c.json({ error: 'Expected order IDs' }, 400);
  });
  register('delete', '/cancel-all', c => cancel(c, owned(c).filter(o => o.status === 'LIVE').map(o => o.id)));
  register('get', '/data/trades', c => c.json({ data: [], count: 0, limit: 500, next_cursor: 'LTE=' }));
}
