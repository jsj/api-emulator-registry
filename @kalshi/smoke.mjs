import assert from 'node:assert/strict';
import { plugin, contract } from './api-emulator/src/index.ts';

function createCollection() {
  let nextId = 1;
  const rows = [];
  return {
    all: () => rows,
    insert(data) {
      const now = new Date().toISOString();
      const row = { id: nextId++, created_at: now, updated_at: now, ...data };
      rows.push(row);
      return row;
    },
    update(id, data) {
      const row = rows.find((item) => item.id === id);
      if (!row) return undefined;
      Object.assign(row, data, { updated_at: new Date().toISOString() });
      return row;
    },
    clear: () => rows.splice(0, rows.length),
    findOneBy: (field, value) => rows.find((item) => item[field] === value),
  };
}

function createHarness() {
  const routes = new Map();
  const middleware = [];
  const collections = new Map();
  const app = {
    use: (path, handler) => middleware.push({ path, handler }),
    get: (path, handler) => routes.set(`GET ${path}`, handler),
    post: (path, handler) => routes.set(`POST ${path}`, handler),
    put: (path, handler) => routes.set(`PUT ${path}`, handler),
    patch: (path, handler) => routes.set(`PATCH ${path}`, handler),
    delete: (path, handler) => routes.set(`DELETE ${path}`, handler),
  };
  const store = {
    collection(name) {
      if (!collections.has(name)) collections.set(name, createCollection());
      return collections.get(name);
    },
  };
  plugin.seed(store);
  plugin.register(app, store);
  return {
    async call(method, path, body = {}, params = {}, query = {}, options = {}) {
      const handler = routes.get(`${method} ${path}`);
      assert.ok(handler, `missing route ${method} ${path}`);
      let status = 200;
      let payload;
      const url = options.url ?? `http://kalshi-emulator.local/trade-api/v2${path}`;
      const headers = options.headers ?? (options.auth === false ? {} : {
        'KALSHI-ACCESS-KEY': 'kalshi-emulator-key',
        'KALSHI-ACCESS-SIGNATURE': 'kalshi-emulator-signature',
        'KALSHI-ACCESS-TIMESTAMP': String(Date.now()),
      });
      const context = {
        req: {
          method,
          url,
          json: async () => body,
          param: (name) => params[name],
          query: (name) => query[name],
          header: (name) => headers[name],
        },
        json: (value, nextStatus = 200) => {
          status = nextStatus;
          payload = value;
          return { status, payload };
        },
        body: (_value, nextStatus = 204) => {
          status = nextStatus;
          payload = null;
          return { status, payload };
        },
      };
      let blocked = false;
      for (const item of middleware) {
        if (item.path === '/trade-api/v2/*' && url.includes('/trade-api/v2/')) {
          let continued = false;
          const result = await item.handler(context, async () => {
            continued = true;
          });
          if (!continued) {
            blocked = true;
            if (result) return { status, payload };
            break;
          }
        }
      }
      if (!blocked) await handler(context);
      return { status, payload };
    },
  };
}

const harness = createHarness();
assert.equal(contract.provider, 'kalshi');

const status = await harness.call('GET', '/exchange/status');
assert.equal(status.payload.trading_active, true);

const markets = await harness.call('GET', '/markets');
assert.equal(markets.payload.markets.length, 1);

const unauthMarkets = await harness.call('GET', '/markets', {}, {}, { series_ticker: 'KXNBA', status: 'open' }, { auth: false });
assert.equal(unauthMarkets.status, 200);
assert.equal(unauthMarkets.payload.markets[0].event_ticker, 'KXNBA-26CHAMPS');
assert.equal(unauthMarkets.payload.markets[0].yes_bid_dollars, '0.3700');

const unauthEvent = await harness.call('GET', '/events/:event_ticker', {}, { event_ticker: unauthMarkets.payload.markets[0].event_ticker }, {}, { auth: false });
assert.equal(unauthEvent.status, 200);
assert.equal(unauthEvent.payload.event.title, '2026 NBA champion');
assert.equal(unauthEvent.payload.event.category, 'Sports');

const order = await harness.call('POST', '/portfolio/orders', { ticker: 'KXNBA-26CHAMPS-LAL', count: 3, yes_price: 40 });
assert.equal(order.status, 201);
assert.equal(order.payload.order.ticker, 'KXNBA-26CHAMPS-LAL');

const unauthOrder = await harness.call('GET', '/portfolio/orders', {}, {}, {}, { auth: false });
assert.equal(unauthOrder.status, 401);
assert.deepEqual(unauthOrder.payload, { error: { code: 'token_authentication_failure', message: 'token authentication failure' } });

const missingSignature = await harness.call('GET', '/portfolio/orders', {}, {}, {}, { headers: { 'KALSHI-ACCESS-KEY': 'kalshi-emulator-key' } });
assert.equal(missingSignature.status, 401);
assert.deepEqual(missingSignature.payload, { error: { code: 'signature_is_missing_from_headers', message: 'signature is missing from headers' } });

const orders = await harness.call('GET', '/portfolio/orders');
assert.equal(orders.payload.orders.length, 1);

const canceled = await harness.call('DELETE', '/portfolio/orders/:order_id', {}, { order_id: order.payload.order.order_id });
assert.equal(canceled.payload.order.status, 'canceled');

console.log('kalshi smoke ok');
