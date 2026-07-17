import assert from 'node:assert/strict';
import { plugin } from './api-emulator.mjs';

const routes = [];
const data = new Map();
const app = {
  get: (path, handler) => routes.push({ method: 'GET', path, handler }),
  post: (path, handler) => routes.push({ method: 'POST', path, handler }),
  patch: (path, handler) => routes.push({ method: 'PATCH', path, handler }),
  delete: (path, handler) => routes.push({ method: 'DELETE', path, handler }),
};
const store = {
  getData: (key) => data.get(key),
  setData: (key, value) => data.set(key, value),
};

plugin.register(app, store);

function match(routePath, requestPath) {
  const routeParts = routePath.split('/').filter(Boolean);
  const requestParts = requestPath.split('/').filter(Boolean);
  if (routeParts.length !== requestParts.length) return null;
  const params = {};
  for (let i = 0; i < routeParts.length; i += 1) {
    if (routeParts[i].startsWith(':')) params[routeParts[i].slice(1)] = decodeURIComponent(requestParts[i]);
    else if (routeParts[i] !== requestParts[i]) return null;
  }
  return params;
}

async function request(method, path, body) {
  const route = routes.find((item) => item.method === method && match(item.path, path));
  assert.ok(route, `${method} ${path} route should exist`);
  const params = match(route.path, path);
  let status = 200;
  let payload;
  await route.handler({
    req: { param: (name) => params[name], json: async () => body ?? {} },
    json: (value, nextStatus = 200) => {
      status = nextStatus;
      payload = value;
      return { status, payload };
    },
  });
  return { status, payload };
}

const quote = await request('POST', '/drive/v2/quotes', {
  external_delivery_id: 'dd_smoke',
  pickup_address: '1 Market St, San Francisco, CA',
  dropoff_address: '500 Howard St, San Francisco, CA',
});
assert.equal(quote.payload.fee, 799);

const accepted = await request('POST', '/drive/v2/quotes/dd_smoke/accept');
assert.equal(accepted.payload.delivery_status, 'accepted');

const fetched = await request('GET', '/drive/v2/deliveries/dd_smoke');
assert.equal(fetched.payload.tracking_url, 'https://track.doordash.com/dd_smoke');

const cancelled = await request('DELETE', '/drive/v2/deliveries/dd_smoke');
assert.equal(cancelled.payload.delivery_status, 'cancelled');

const serviceability = await request('POST', '/drive/v2/serviceability', { pickup_address: '1 Market St', dropoff_address: '500 Howard St' });
assert.equal(serviceability.payload.is_serviceable, true);

const business = await request('POST', '/developer/v1/businesses', { external_business_id: 'biz_smoke', name: 'Smoke Business' });
assert.equal(business.status, 201);

const createdStore = await request('POST', '/developer/v1/businesses/biz_smoke/stores', { external_store_id: 'store_smoke', name: 'Smoke Store' });
assert.equal(createdStore.payload.business_id, 'biz_smoke');

const menu = await request('POST', '/api/v1/menus', { merchant_supplied_id: 'store_smoke', items: [{ id: 'item_smoke', name: 'Smoke Item' }] });
assert.match(menu.payload.id, /^menu_/);

const promotions = await request('POST', '/api/v2/promotions/stores/store_smoke', { name: 'Smoke promo' });
assert.equal(promotions.payload.store_id, 'store_smoke');

const stores = await request('GET', '/consumer/v1/stores/search');
assert.equal(stores.payload.stores[0].id, 'consumer_store_emulator');

const cart = await request('POST', '/consumer/v1/carts', { store_id: 'consumer_store_emulator' });
assert.equal(cart.status, 201);

const cartWithItem = await request('POST', `/consumer/v1/carts/${cart.payload.id}/items`, { item_id: 'consumer_item_ramen', quantity: 2 });
assert.equal(cartWithItem.payload.items[0].quantity, 2);
assert.equal(cartWithItem.payload.subtotal, 3198);

const preview = await request('POST', `/consumer/v1/carts/${cart.payload.id}/preview`);
assert.equal(preview.payload.checkout_ready, true);

const consumerOrder = await request('POST', `/consumer/v1/carts/${cart.payload.id}/checkout`);
assert.equal(consumerOrder.status, 201);
assert.equal(consumerOrder.payload.status, 'confirmed');

const orderHistory = await request('GET', '/consumer/v1/orders');
assert.equal(orderHistory.payload.orders[0].id, consumerOrder.payload.id);

const mcpSearch = await request('POST', '/mcp/consumer', {
  jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'doordash_find_restaurants', arguments: { query: 'ramen', max_stores: 5 } },
});
assert.equal(mcpSearch.payload.result.structuredContent.stores[0].store_name, 'Emulator Ramen House');

const mcpCart = await request('POST', '/mcp/consumer', {
  jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'doordash_add_to_cart', arguments: { store_id: 'consumer_store_emulator', menu_id: 'menu_consumer_store_emulator', items: [{ item_id: 'consumer_item_ramen', item_name: 'Tonkotsu Ramen', quantity: 1 }] } },
});
assert.equal(mcpCart.payload.result.structuredContent.items[0].name, 'Tonkotsu Ramen');

const mcpPreview = await request('POST', '/mcp/consumer', {
  jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'internal_preview_order', arguments: { cart_uuid: mcpCart.payload.result.structuredContent.id } },
});
assert.equal(mcpPreview.payload.result.structuredContent.delivery_availability.is_available, true);

const mcpAddresses = await request('POST', '/mcp/consumer', {
  jsonrpc: '2.0', id: 4, method: 'tools/call', params: { name: 'doordash_list_delivery_addresses', arguments: {} },
});
assert.equal(mcpAddresses.payload.result.structuredContent.addresses[0].label, 'Home');

const mcpGroceries = await request('POST', '/mcp/consumer', {
  jsonrpc: '2.0', id: 5, method: 'tools/call', params: { name: 'doordash_create_product_list', arguments: { items: [{ name: 'ramen', quantity: 1 }] } },
});
assert.equal(mcpGroceries.payload.result.structuredContent.items[0].name, 'Tonkotsu Ramen');

const mcpOrder = await request('POST', '/mcp/consumer', {
  jsonrpc: '2.0', id: 6, method: 'tools/call', params: { name: 'internal_submit_order', arguments: { cart_uuid: mcpCart.payload.result.structuredContent.id, tip_amount_cents: 200 } },
});
assert.equal(mcpOrder.payload.result.structuredContent.id, mcpOrder.payload.result.structuredContent.order_uuid);

const mcpReorder = await request('POST', '/mcp/consumer', {
  jsonrpc: '2.0', id: 7, method: 'tools/call', params: { name: 'internal_reorder', arguments: { order_uuid: mcpOrder.payload.result.structuredContent.order_uuid } },
});
assert.equal(mcpReorder.payload.result.structuredContent.status, 'open');

console.log('doordash smoke ok');
