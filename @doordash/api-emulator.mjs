const STATE_KEY = 'doordash:state';

function now() {
  return new Date().toISOString();
}

function initialState(config = {}) {
  return {
    quotes: config.quotes ?? [],
    deliveries: config.deliveries ?? [{
      external_delivery_id: 'dd_delivery_seed',
      delivery_id: 'dd_delivery_seed',
      delivery_status: 'delivered',
      currency: 'USD',
      fee: 799,
      tracking_url: 'https://track.doordash.com/dd_delivery_seed',
      pickup_address: '1 Market St, San Francisco, CA',
      dropoff_address: '500 Howard St, San Francisco, CA',
      created_at: now(),
      updated_at: now(),
    }],
    stores: config.stores ?? [{
      id: 'store_emulator',
      external_store_id: 'store_emulator',
      business_id: 'business_emulator',
      name: 'DoorDash Emulator Store',
      address: '1 Market St, San Francisco, CA',
      is_active: true,
    }],
    businesses: config.businesses ?? [{ id: 'business_emulator', external_business_id: 'business_emulator', name: 'DoorDash Emulator Business' }],
    menus: config.menus ?? [{ id: 'menu_emulator', merchant_supplied_id: 'store_emulator', status: 'active', items: [{ id: 'item_emulator', name: 'API Burger', price: 1299, active: true }] }],
    orders: config.orders ?? [{ id: 'order_emulator', store_id: 'store_emulator', status: 'new', items: [{ id: 'item_emulator', quantity: 1 }] }],
    webhooks: config.webhooks ?? [],
    jobs: config.jobs ?? [{ id: 'job_emulator', status: 'completed', type: 'item_import' }],
    promotions: config.promotions ?? [],
    consumerStores: config.consumerStores ?? [{
      id: 'consumer_store_emulator',
      name: 'Emulator Ramen House',
      address: '1 Market St, San Francisco, CA',
      cuisine: ['Japanese', 'Ramen'],
      delivery_fee: 199,
      estimated_delivery_minutes: 30,
      menu: [
        { id: 'consumer_item_ramen', name: 'Tonkotsu Ramen', description: 'Pork broth, noodles, egg, and scallions.', price: 1599 },
        { id: 'consumer_item_edamame', name: 'Edamame', description: 'Sea salt.', price: 599 },
      ],
    }],
    carts: config.carts ?? [],
    consumerOrders: config.consumerOrders ?? [],
    consumerAddresses: config.consumerAddresses ?? [{ id: 'address_emulator', address_id: 'address_emulator', label: 'Home', printable_address: '1 Market St, San Francisco, CA', is_default: true }],
    paymentMethods: config.paymentMethods ?? [{ payment_method_id: 'payment_emulator', brand: 'Visa', last4: '4242', exp_month: 12, exp_year: 2030 }],
    nextQuote: 1,
    nextDelivery: 1,
    nextBusiness: 1,
    nextStore: 1,
    nextMenu: 1,
    nextOrder: 1,
    nextPromotion: 1,
    nextCart: 1,
    nextConsumerOrder: 1,
  };
}

function state(store) {
  const current = store.getData?.(STATE_KEY);
  if (current) return current;
  const next = initialState();
  store.setData?.(STATE_KEY, next);
  return next;
}

function saveState(store, next) {
  store.setData?.(STATE_KEY, next);
}

async function jsonBody(c) {
  return c.req.json().catch(() => ({}));
}

function quoteFromBody(s, body) {
  const externalId = body.external_delivery_id ?? `dd_quote_${s.nextQuote++}`;
  return {
    external_delivery_id: externalId,
    quote_id: externalId,
    currency: body.currency ?? 'USD',
    fee: body.fee ?? 799,
    tax: body.tax ?? 0,
    estimated_pickup_time: body.pickup_time ?? now(),
    estimated_delivery_time: body.dropoff_time ?? now(),
    expires_at: new Date(Date.now() + 15 * 60_000).toISOString(),
    pickup_address: body.pickup_address,
    dropoff_address: body.dropoff_address,
    status: 'quote',
  };
}

function deliveryFromBody(s, body, patch = {}) {
  const externalId = body.external_delivery_id ?? `dd_delivery_${s.nextDelivery++}`;
  return {
    external_delivery_id: externalId,
    delivery_id: externalId,
    delivery_status: 'created',
    currency: body.currency ?? 'USD',
    fee: body.fee ?? 799,
    tracking_url: `https://track.doordash.com/${externalId}`,
    pickup_address: body.pickup_address,
    pickup_business_name: body.pickup_business_name ?? 'Emulator Merchant',
    pickup_phone_number: body.pickup_phone_number ?? '+14155550100',
    dropoff_address: body.dropoff_address,
    dropoff_contact_given_name: body.dropoff_contact_given_name ?? 'Ada',
    dropoff_contact_family_name: body.dropoff_contact_family_name ?? 'Lovelace',
    dropoff_phone_number: body.dropoff_phone_number ?? '+14155550101',
    order_value: body.order_value ?? 2500,
    created_at: now(),
    updated_at: now(),
    ...patch,
  };
}

function findDelivery(s, id) {
  return s.deliveries.find((item) => item.external_delivery_id === id || item.delivery_id === id);
}

function serviceability(body = {}) {
  return {
    is_serviceable: true,
    currency: body.currency ?? 'USD',
    fee: body.fee ?? 799,
    pickup_address: body.pickup_address,
    dropoff_address: body.dropoff_address,
    estimated_pickup_time: now(),
    estimated_delivery_time: new Date(Date.now() + 35 * 60_000).toISOString(),
  };
}

function findConsumerStore(s, id) {
  return s.consumerStores.find((storeRow) => storeRow.id === id);
}

function cartSummary(s, cart) {
  const storeRow = findConsumerStore(s, cart.store_id);
  const subtotal = cart.items.reduce((total, line) => total + (line.unit_price * line.quantity), 0);
  const deliveryFee = storeRow?.delivery_fee ?? 0;
  return {
    ...cart,
    store: storeRow ? { id: storeRow.id, name: storeRow.name, address: storeRow.address } : undefined,
    subtotal,
    delivery_fee: deliveryFee,
    tax: Math.round(subtotal * 0.0875),
    total: subtotal + deliveryFee + Math.round(subtotal * 0.0875),
    currency: 'USD',
  };
}

function mcpResult(id, payload, isError = false) {
  return {
    jsonrpc: '2.0',
    id,
    result: {
      content: [{ type: 'text', text: JSON.stringify(payload) }],
      structuredContent: payload,
      ...(isError ? { isError: true } : {}),
    },
  };
}

function mcpNotFound(id, message) {
  return mcpResult(id, { message }, true);
}

export const contract = {
  provider: 'doordash',
  source: 'DoorDash Drive, Drive Classic, Developer, Marketplace, and dd-cli-style consumer ordering subset',
  docs: 'https://developer.doordash.com/en-US/api/drive/',
  scope: ['drive-v2', 'drive-classic', 'serviceability', 'address-autocomplete', 'developer-businesses', 'developer-stores', 'marketplace-menus', 'marketplace-orders', 'marketplace-store-status', 'consumer-store-search', 'consumer-carts', 'consumer-checkout', 'consumer-order-history', 'dd-cli-mcp-json-rpc', 'item-management', 'promotions', 'webhooks', 'state-inspection'],
  fidelity: 'stateful-rest-emulator',
};

export const plugin = {
  name: 'doordash',
  register(app, store) {
    app.post('/drive/v2/quotes', async (c) => {
      const s = state(store);
      const quote = quoteFromBody(s, await jsonBody(c));
      s.quotes.push(quote);
      saveState(store, s);
      return c.json(quote, 200);
    });

    app.post('/drive/v2/quotes/:externalDeliveryId/accept', async (c) => {
      const s = state(store);
      const quote = s.quotes.find((item) => item.external_delivery_id === c.req.param('externalDeliveryId'));
      const delivery = deliveryFromBody(s, quote ?? await jsonBody(c), { delivery_status: 'accepted' });
      s.deliveries.push(delivery);
      saveState(store, s);
      return c.json(delivery, 200);
    });

    app.post('/drive/v2/deliveries', async (c) => {
      const s = state(store);
      const delivery = deliveryFromBody(s, await jsonBody(c));
      s.deliveries.push(delivery);
      saveState(store, s);
      return c.json(delivery, 200);
    });

    app.get('/drive/v2/deliveries/:externalDeliveryId', (c) => {
      const delivery = findDelivery(state(store), c.req.param('externalDeliveryId'));
      return delivery ? c.json(delivery) : c.json({ code: 'not_found', message: 'Delivery not found' }, 404);
    });

    app.patch('/drive/v2/deliveries/:externalDeliveryId', async (c) => {
      const s = state(store);
      const delivery = findDelivery(s, c.req.param('externalDeliveryId'));
      if (!delivery) return c.json({ code: 'not_found', message: 'Delivery not found' }, 404);
      Object.assign(delivery, await jsonBody(c), { updated_at: now() });
      saveState(store, s);
      return c.json(delivery);
    });

    app.delete('/drive/v2/deliveries/:externalDeliveryId', (c) => {
      const s = state(store);
      const delivery = findDelivery(s, c.req.param('externalDeliveryId'));
      if (!delivery) return c.json({ code: 'not_found', message: 'Delivery not found' }, 404);
      delivery.delivery_status = 'cancelled';
      delivery.updated_at = now();
      saveState(store, s);
      return c.json(delivery);
    });
    app.post('/drive/v2/deliveries/:externalDeliveryId/cancel', (c) => {
      const s = state(store);
      const delivery = findDelivery(s, c.req.param('externalDeliveryId'));
      if (!delivery) return c.json({ code: 'not_found', message: 'Delivery not found' }, 404);
      delivery.delivery_status = 'cancelled';
      delivery.updated_at = now();
      saveState(store, s);
      return c.json(delivery);
    });

    app.post('/drive/v2/estimates', async (c) => c.json({ ...quoteFromBody(state(store), await jsonBody(c)), status: 'estimate' }));
    app.post('/drive/v2/serviceability', async (c) => c.json(serviceability(await jsonBody(c))));
    app.get('/drive/v2/address/auto_complete', (c) => c.json({ predictions: [{ description: `${c.req.query?.('input') ?? '1 Market St'}, San Francisco, CA`, place_id: 'place_emulator' }] }));
    app.post('/drive/v2/items_substitution_recommendation', async (c) => c.json({ recommendations: [{ item_id: 'item_emulator', substitute_item_id: 'item_substitute', confidence: 0.91 }], request: await jsonBody(c) }));
    app.post('/drive/v2/checkout_audit_signal', async (c) => c.json({ accepted: true, signal_id: `signal_${Date.now()}`, request: await jsonBody(c) }));

    app.post('/drive/v1/estimates', async (c) => c.json({ id: `estimate_${Date.now()}`, ...serviceability(await jsonBody(c)) }));
    app.post('/drive/v1/validations', async (c) => c.json({ valid: true, ...serviceability(await jsonBody(c)) }));
    app.post('/drive/v1/deliveries', async (c) => {
      const s = state(store);
      const delivery = deliveryFromBody(s, await jsonBody(c));
      s.deliveries.push(delivery);
      saveState(store, s);
      return c.json(delivery, 201);
    });
    app.get('/drive/v1/deliveries/:deliveryId', (c) => {
      const delivery = findDelivery(state(store), c.req.param('deliveryId'));
      return delivery ? c.json(delivery) : c.json({ code: 'not_found', message: 'Delivery not found' }, 404);
    });
    app.patch('/drive/v1/deliveries/:deliveryId', async (c) => {
      const s = state(store);
      const delivery = findDelivery(s, c.req.param('deliveryId'));
      if (!delivery) return c.json({ code: 'not_found', message: 'Delivery not found' }, 404);
      Object.assign(delivery, await jsonBody(c), { updated_at: now() });
      saveState(store, s);
      return c.json(delivery);
    });
    app.post('/drive/v1/deliveries/:deliveryId/cancel', (c) => {
      const s = state(store);
      const delivery = findDelivery(s, c.req.param('deliveryId'));
      if (!delivery) return c.json({ code: 'not_found', message: 'Delivery not found' }, 404);
      delivery.delivery_status = 'cancelled';
      saveState(store, s);
      return c.json(delivery);
    });

    // DoorDash CLI v0.2.0 talks to /mcp/consumer with JSON-RPC tools/call.
    // It accepts this plain JSON envelope in addition to the production SSE form.
    app.post('/mcp/consumer', async (c) => {
      const request = await jsonBody(c);
      if (request.method !== 'tools/call') return c.json({ jsonrpc: '2.0', id: request.id ?? null, error: { code: -32601, message: 'Method not found' } }, 400);
      const s = state(store);
      const id = request.id ?? null;
      const { name, arguments: args = {} } = request.params ?? {};
      const storeRow = findConsumerStore(s, args.store_id);
      const cart = s.carts.find((item) => item.id === args.cart_uuid);
      const item = storeRow?.menu.find((menuItem) => menuItem.id === args.item_id);

      if (name === 'doordash_find_restaurants') {
        const query = String(args.query ?? '').toLowerCase();
        const stores = s.consumerStores
          .filter((candidate) => !query || [candidate.name, candidate.address, ...(candidate.cuisine ?? [])].join(' ').toLowerCase().includes(query))
          .slice(0, Number(args.max_stores ?? 20))
          .map((candidate) => ({ store_id: candidate.id, store_name: candidate.name, printable_address: candidate.address, cuisine: candidate.cuisine, delivery_fee: candidate.delivery_fee, estimated_delivery_minutes: candidate.estimated_delivery_minutes }));
        return c.json(mcpResult(id, { stores }));
      }
      if (name === 'doordash_get_restaurant_menu') {
        if (!storeRow) return c.json(mcpNotFound(id, 'Store not found'));
        return c.json(mcpResult(id, { store_id: storeRow.id, menu_id: `menu_${storeRow.id}`, store_name: storeRow.name, items: storeRow.menu.map((menuItem) => ({ ...menuItem, id: `i_${menuItem.id}` })) }));
      }
      if (name === 'doordash_get_food_item' || name === 'internal_get_item_details') {
        if (!item) return c.json(mcpNotFound(id, 'Menu item not found'));
        return c.json(mcpResult(id, { store_id: storeRow.id, menu_id: `menu_${storeRow.id}`, item }));
      }
      if (name === 'internal_get_store_info') {
        if (!storeRow) return c.json(mcpNotFound(id, 'Store not found'));
        return c.json(mcpResult(id, { store: { store_id: storeRow.id, name: storeRow.name, printable_address: storeRow.address, business_vertical_id: 'restaurant' } }));
      }
      if (name === 'internal_find_items_in_store') {
        if (!storeRow) return c.json(mcpNotFound(id, 'Store not found'));
        const names = (args.item_names ?? []).map((value) => String(value).toLowerCase());
        const items = storeRow.menu.filter((candidate) => !names.length || names.some((value) => candidate.name.toLowerCase().includes(value))).map((candidate) => ({ item_id: candidate.id, ...candidate }));
        return c.json(mcpResult(id, { store_id: storeRow.id, items }));
      }
      if (name === 'internal_find_nearby_stores') {
        const stores = s.consumerStores.slice(0, Number(args.max_stores ?? 20)).map((candidate) => ({ store_id: candidate.id, name: candidate.name, printable_address: candidate.address, vertical_scope: args.vertical_scope ?? 'grocery', delivery_time: `${candidate.estimated_delivery_minutes} min` }));
        return c.json(mcpResult(id, { stores }));
      }
      if (name === 'doordash_list_active_carts') {
        const carts = s.carts.filter((candidate) => candidate.status === 'open' && (!args.store_id || candidate.store_id === args.store_id)).map((candidate) => cartSummary(s, candidate));
        return c.json(mcpResult(id, { carts }));
      }
      if (name === 'doordash_add_to_cart') {
        if (!storeRow) return c.json(mcpNotFound(id, 'Store not found'));
        let target = args.cart_uuid ? s.carts.find((candidate) => candidate.id === args.cart_uuid && candidate.status === 'open') : s.carts.find((candidate) => candidate.store_id === storeRow.id && candidate.status === 'open');
        if (!target) {
          target = { id: `cart_${s.nextCart++}`, store_id: storeRow.id, items: [], status: 'open', created_at: now(), updated_at: now(), fulfillment: args.is_pickup ? 'pickup' : 'delivery' };
          s.carts.push(target);
        }
        for (const requested of args.items ?? []) {
          const menuItem = storeRow.menu.find((candidate) => candidate.id === String(requested.item_id).replace(/^i_/, ''));
          if (!menuItem) return c.json(mcpNotFound(id, `Menu item not found: ${requested.item_id}`));
          const line = target.items.find((candidate) => candidate.item_id === menuItem.id);
          if (line) line.quantity += Number(requested.quantity ?? 1);
          else target.items.push({ id: `cart_item_${target.items.length + 1}`, item_id: menuItem.id, name: menuItem.name, unit_price: menuItem.price, quantity: Number(requested.quantity ?? 1) });
        }
        target.updated_at = now();
        saveState(store, s);
        return c.json(mcpResult(id, cartSummary(s, target)));
      }
      if (name === 'doordash_get_cart') return c.json(cart ? mcpResult(id, cartSummary(s, cart)) : mcpNotFound(id, 'Cart not found'));
      if (name === 'doordash_remove_cart_item') {
        if (!cart || cart.status !== 'open') return c.json(mcpNotFound(id, 'Open cart not found'));
        cart.items = cart.items.filter((line) => line.id !== args.cart_item_id && line.item_id !== args.cart_item_id);
        cart.updated_at = now();
        saveState(store, s);
        return c.json(mcpResult(id, cartSummary(s, cart)));
      }
      if (name === 'doordash_clear_cart') {
        if (!cart || cart.status !== 'open') return c.json(mcpNotFound(id, 'Open cart not found'));
        cart.items = [];
        cart.updated_at = now();
        saveState(store, s);
        return c.json(mcpResult(id, cartSummary(s, cart)));
      }
      if (name === 'internal_preview_order') {
        if (!cart) return c.json(mcpNotFound(id, 'Cart not found'));
        return c.json(mcpResult(id, { quote: cartSummary(s, cart), delivery_availability: { is_available: true } }));
      }
      if (name === 'doordash_get_checkout_url') {
        if (!cart) return c.json(mcpNotFound(id, 'Cart not found'));
        return c.json(mcpResult(id, { cart_uuid: cart.id, checkout_url: `http://localhost/checkout/${cart.id}` }));
      }
      if (name === 'internal_list_eligible_cart_promotions') {
        if (!storeRow) return c.json(mcpNotFound(id, 'Store not found'));
        return c.json(mcpResult(id, { store_id: storeRow.id, promotions: s.promotions.filter((promotion) => promotion.store_id === storeRow.id) }));
      }
      if (name === 'internal_apply_cart_promotion' || name === 'internal_remove_cart_promotion') {
        if (!cart) return c.json(mcpNotFound(id, 'Cart not found'));
        cart.promotions ??= [];
        if (name === 'internal_apply_cart_promotion') {
          const promotion = { code: args.promo_code, campaign_id: args.campaign_id, ad_group_id: args.ad_group_id, ad_id: args.ad_id };
          if (!cart.promotions.some((candidate) => candidate.code === promotion.code)) cart.promotions.push(promotion);
        } else cart.promotions = cart.promotions.filter((candidate) => candidate.code !== args.promo_code);
        saveState(store, s);
        return c.json(mcpResult(id, { cart_uuid: cart.id, applied_promotions: cart.promotions }));
      }
      if (name === 'doordash_list_delivery_addresses') return c.json(mcpResult(id, { addresses: s.consumerAddresses }));
      if (name === 'doordash_set_delivery_address') {
        const address = s.consumerAddresses.find((candidate) => candidate.address_id === args.address_id || candidate.id === args.address_id);
        if (!address) return c.json(mcpNotFound(id, 'Address not found'));
        s.consumerAddresses.forEach((candidate) => { candidate.is_default = candidate === address; });
        saveState(store, s);
        return c.json(mcpResult(id, { address_id: address.address_id, is_default: true }));
      }
      if (name === 'doordash_get_payment_info') return c.json(mcpResult(id, { cards: s.paymentMethods, default_payment_method_id: s.paymentMethods[0]?.payment_method_id ?? null }));
      if (name === 'doordash_create_product_list') {
        const selected = args.store_id ? findConsumerStore(s, args.store_id) : s.consumerStores[0];
        if (!selected) return c.json(mcpNotFound(id, 'Store not found'));
        const items = (args.items ?? []).map((requested, index) => {
          const menuItem = selected.menu.find((candidate) => candidate.name.toLowerCase().includes(String(requested.name ?? '').toLowerCase())) ?? selected.menu[index % selected.menu.length];
          return { id: menuItem.id, name: menuItem.name, price: menuItem.price, quantity: Number(requested.quantity ?? 1), store_id: selected.id };
        });
        return c.json(mcpResult(id, { store_name: selected.name, menu_id: `menu_${selected.id}`, items, available_stores: s.consumerStores.map((candidate) => ({ store_id: candidate.id, name: candidate.name })) }));
      }
      if (name === 'internal_get_order_history') return c.json(mcpResult(id, { orders: s.consumerOrders.slice(0, Number(args.max_orders ?? 20)) }));
      if (name === 'internal_get_order_receipt' || name === 'internal_get_order_status') {
        const order = s.consumerOrders.find((candidate) => candidate.order_uuid === args.order_uuid || candidate.id === args.order_uuid);
        return c.json(order ? mcpResult(id, order) : mcpNotFound(id, 'Order not found'));
      }
      if (name === 'internal_reorder') {
        const order = s.consumerOrders.find((candidate) => candidate.order_uuid === args.order_uuid || candidate.id === args.order_uuid);
        if (!order) return c.json(mcpNotFound(id, 'Order not found'));
        const reordered = { id: `cart_${s.nextCart++}`, store_id: order.store_id, items: order.items.map((line) => ({ ...line })), status: 'open', created_at: now(), updated_at: now() };
        s.carts.push(reordered);
        saveState(store, s);
        return c.json(mcpResult(id, cartSummary(s, reordered)));
      }
      if (name === 'internal_submit_order') {
        if (!cart || cart.status !== 'open' || !cart.items.length) return c.json(mcpNotFound(id, 'Open cart with items not found'));
        cart.status = 'checked_out';
        cart.updated_at = now();
        const orderId = `consumer_order_${s.nextConsumerOrder++}`;
        const order = { ...cartSummary(s, cart), id: orderId, order_uuid: orderId, cart_uuid: cart.id, status: 'confirmed', created_at: now() };
        s.consumerOrders.push(order);
        saveState(store, s);
        return c.json(mcpResult(id, order));
      }
      return c.json(mcpResult(id, { message: `Unsupported DoorDash CLI tool: ${name}` }, true));
    });

    // Consumer ordering surface used to model the workflows exposed by dd-cli.
    app.get('/consumer/v1/stores/search', (c) => {
      const query = (c.req.query?.('query') ?? c.req.query?.('q') ?? '').toLowerCase();
      const stores = state(store).consumerStores.filter((storeRow) => !query || [storeRow.name, storeRow.address, ...(storeRow.cuisine ?? [])].join(' ').toLowerCase().includes(query));
      return c.json({ stores });
    });
    app.get('/consumer/v1/stores/:storeId', (c) => {
      const storeRow = findConsumerStore(state(store), c.req.param('storeId'));
      return storeRow ? c.json(storeRow) : c.json({ code: 'not_found', message: 'Store not found' }, 404);
    });
    app.get('/consumer/v1/stores/:storeId/menu', (c) => {
      const storeRow = findConsumerStore(state(store), c.req.param('storeId'));
      return storeRow ? c.json({ store_id: storeRow.id, menu: storeRow.menu }) : c.json({ code: 'not_found', message: 'Store not found' }, 404);
    });
    app.post('/consumer/v1/carts', async (c) => {
      const s = state(store);
      const body = await jsonBody(c);
      const storeRow = findConsumerStore(s, body.store_id);
      if (!storeRow) return c.json({ code: 'not_found', message: 'Store not found' }, 404);
      const cart = { id: `cart_${s.nextCart++}`, store_id: storeRow.id, items: [], status: 'open', created_at: now(), updated_at: now() };
      s.carts.push(cart);
      saveState(store, s);
      return c.json(cartSummary(s, cart), 201);
    });
    app.get('/consumer/v1/carts/:cartId', (c) => {
      const s = state(store);
      const cart = s.carts.find((item) => item.id === c.req.param('cartId'));
      return cart ? c.json(cartSummary(s, cart)) : c.json({ code: 'not_found', message: 'Cart not found' }, 404);
    });
    app.post('/consumer/v1/carts/:cartId/items', async (c) => {
      const s = state(store);
      const cart = s.carts.find((item) => item.id === c.req.param('cartId'));
      if (!cart || cart.status !== 'open') return c.json({ code: 'not_found', message: 'Open cart not found' }, 404);
      const body = await jsonBody(c);
      const item = findConsumerStore(s, cart.store_id)?.menu.find((menuItem) => menuItem.id === body.item_id);
      if (!item) return c.json({ code: 'not_found', message: 'Menu item not found' }, 404);
      const quantity = Math.max(1, Number(body.quantity ?? 1));
      const existing = cart.items.find((line) => line.item_id === item.id);
      if (existing) existing.quantity += quantity;
      else cart.items.push({ item_id: item.id, name: item.name, unit_price: item.price, quantity });
      cart.updated_at = now();
      saveState(store, s);
      return c.json(cartSummary(s, cart));
    });
    app.delete('/consumer/v1/carts/:cartId/items/:itemId', (c) => {
      const s = state(store);
      const cart = s.carts.find((item) => item.id === c.req.param('cartId'));
      if (!cart || cart.status !== 'open') return c.json({ code: 'not_found', message: 'Open cart not found' }, 404);
      cart.items = cart.items.filter((line) => line.item_id !== c.req.param('itemId'));
      cart.updated_at = now();
      saveState(store, s);
      return c.json(cartSummary(s, cart));
    });
    app.post('/consumer/v1/carts/:cartId/preview', (c) => {
      const s = state(store);
      const cart = s.carts.find((item) => item.id === c.req.param('cartId'));
      return cart ? c.json({ ...cartSummary(s, cart), checkout_ready: cart.items.length > 0 }) : c.json({ code: 'not_found', message: 'Cart not found' }, 404);
    });
    app.post('/consumer/v1/carts/:cartId/checkout', (c) => {
      const s = state(store);
      const cart = s.carts.find((item) => item.id === c.req.param('cartId'));
      if (!cart || cart.status !== 'open') return c.json({ code: 'not_found', message: 'Open cart not found' }, 404);
      if (!cart.items.length) return c.json({ code: 'invalid_cart', message: 'Cart must contain at least one item' }, 422);
      cart.status = 'checked_out';
      cart.updated_at = now();
      const order = { ...cartSummary(s, cart), id: `consumer_order_${s.nextConsumerOrder++}`, cart_id: cart.id, status: 'confirmed', created_at: now() };
      s.consumerOrders.push(order);
      saveState(store, s);
      return c.json(order, 201);
    });
    app.get('/consumer/v1/orders', (c) => c.json({ orders: state(store).consumerOrders }));
    app.get('/consumer/v1/orders/:orderId', (c) => {
      const order = state(store).consumerOrders.find((item) => item.id === c.req.param('orderId'));
      return order ? c.json(order) : c.json({ code: 'not_found', message: 'Order not found' }, 404);
    });

    app.get('/developer/v1/businesses', (c) => c.json({ businesses: state(store).businesses }));
    app.post('/developer/v1/businesses', async (c) => {
      const s = state(store);
      const body = await jsonBody(c);
      const business = { id: body.external_business_id ?? `business_${s.nextBusiness++}`, external_business_id: body.external_business_id ?? `business_${s.nextBusiness}`, name: body.name ?? 'Emulator Business', ...body };
      s.businesses.push(business);
      saveState(store, s);
      return c.json(business, 201);
    });
    app.get('/developer/v1/businesses/:businessId', (c) => {
      const business = state(store).businesses.find((item) => item.id === c.req.param('businessId') || item.external_business_id === c.req.param('businessId'));
      return business ? c.json(business) : c.json({ code: 'not_found' }, 404);
    });
    app.patch('/developer/v1/businesses/:businessId', async (c) => {
      const s = state(store);
      const business = s.businesses.find((item) => item.id === c.req.param('businessId') || item.external_business_id === c.req.param('businessId'));
      if (!business) return c.json({ code: 'not_found' }, 404);
      Object.assign(business, await jsonBody(c));
      saveState(store, s);
      return c.json(business);
    });
    app.get('/developer/v1/businesses/:businessId/stores', (c) => c.json({ stores: state(store).stores.filter((storeRow) => storeRow.business_id === c.req.param('businessId')) }));
    app.post('/developer/v1/businesses/:businessId/stores', async (c) => {
      const s = state(store);
      const body = await jsonBody(c);
      const storeRow = { id: body.external_store_id ?? `store_${s.nextStore++}`, external_store_id: body.external_store_id ?? `store_${s.nextStore}`, business_id: c.req.param('businessId'), name: body.name ?? 'Emulator Store', is_active: true, ...body };
      s.stores.push(storeRow);
      saveState(store, s);
      return c.json(storeRow, 201);
    });
    app.get('/developer/v1/businesses/:businessId/stores/:storeId', (c) => {
      const storeRow = state(store).stores.find((item) => item.business_id === c.req.param('businessId') && (item.id === c.req.param('storeId') || item.external_store_id === c.req.param('storeId')));
      return storeRow ? c.json(storeRow) : c.json({ code: 'not_found' }, 404);
    });
    app.patch('/developer/v1/businesses/:businessId/stores/:storeId', async (c) => {
      const s = state(store);
      const storeRow = s.stores.find((item) => item.business_id === c.req.param('businessId') && (item.id === c.req.param('storeId') || item.external_store_id === c.req.param('storeId')));
      if (!storeRow) return c.json({ code: 'not_found' }, 404);
      Object.assign(storeRow, await jsonBody(c));
      saveState(store, s);
      return c.json(storeRow);
    });

    app.post('/api/v1/menus', async (c) => {
      const s = state(store);
      const menu = { id: `menu_${s.nextMenu++}`, status: 'active', ...(await jsonBody(c)) };
      s.menus.push(menu);
      saveState(store, s);
      return c.json(menu, 201);
    });
    app.get('/api/v1/menus/:menuId', (c) => c.json(state(store).menus.find((menu) => menu.id === c.req.param('menuId')) ?? { code: 'not_found' }, state(store).menus.some((menu) => menu.id === c.req.param('menuId')) ? 200 : 404));
    app.patch('/api/v1/menus/:menuId', async (c) => {
      const s = state(store);
      const menu = s.menus.find((item) => item.id === c.req.param('menuId'));
      if (!menu) return c.json({ code: 'not_found' }, 404);
      Object.assign(menu, await jsonBody(c));
      saveState(store, s);
      return c.json(menu);
    });
    app.delete('/api/v1/menus/:menuId', (c) => {
      const s = state(store);
      s.menus = s.menus.filter((menu) => menu.id !== c.req.param('menuId'));
      saveState(store, s);
      return c.json({ deleted: true });
    });
    app.get('/api/v1/orders/:orderId', (c) => c.json(state(store).orders.find((order) => order.id === c.req.param('orderId')) ?? { code: 'not_found' }, state(store).orders.some((order) => order.id === c.req.param('orderId')) ? 200 : 404));
    app.post('/api/v1/orders/:orderId/events/:eventType', (c) => {
      const s = state(store);
      const order = s.orders.find((item) => item.id === c.req.param('orderId'));
      if (!order) return c.json({ code: 'not_found' }, 404);
      order.status = c.req.param('eventType');
      saveState(store, s);
      return c.json(order);
    });
    app.post('/api/v1/orders/:orderId/adjustment', async (c) => c.json({ order_id: c.req.param('orderId'), adjustment_id: `adj_${Date.now()}`, ...(await jsonBody(c)) }));
    app.post('/api/v1/orders/:orderId/cancellation', (c) => c.json({ order_id: c.req.param('orderId'), status: 'cancelled' }));
    app.post('/api/v1/orders/:orderId/return', (c) => c.json({ order_id: c.req.param('orderId'), status: 'return_requested' }));
    app.get('/api/v1/stores/:storeId/status', (c) => c.json({ store_id: c.req.param('storeId'), status: 'active', accepting_orders: true }));
    app.get('/api/v1/stores/:storeId/store_details', (c) => c.json(state(store).stores.find((storeRow) => storeRow.id === c.req.param('storeId') || storeRow.external_store_id === c.req.param('storeId')) ?? { code: 'not_found' }));
    app.get('/api/v1/stores/:storeId/menu_details', (c) => c.json({ menus: state(store).menus.filter((menu) => menu.merchant_supplied_id === c.req.param('storeId')) }));
    app.get('/api/v1/stores/:storeId/store_menu', (c) => c.json({ menus: state(store).menus.filter((menu) => menu.merchant_supplied_id === c.req.param('storeId')) }));
    app.patch('/api/v1/stores/:storeId/items/status', async (c) => c.json({ store_id: c.req.param('storeId'), updated: true, ...(await jsonBody(c)) }));
    app.patch('/api/v1/stores/:storeId/item_options/status', async (c) => c.json({ store_id: c.req.param('storeId'), updated: true, ...(await jsonBody(c)) }));
    app.patch('/api/v1/stores/:storeId/item/availability', async (c) => c.json({ store_id: c.req.param('storeId'), updated: true, ...(await jsonBody(c)) }));
    app.patch('/api/v1/stores/:storeId/item_option/availability', async (c) => c.json({ store_id: c.req.param('storeId'), updated: true, ...(await jsonBody(c)) }));

    app.get('/api/v2/items', (c) => c.json({ items: state(store).menus.flatMap((menu) => menu.items ?? []) }));
    app.post('/api/v2/items', async (c) => c.json({ id: `item_${Date.now()}`, ...(await jsonBody(c)) }, 201));
    app.get('/api/v2/jobs', (c) => c.json({ jobs: state(store).jobs }));
    app.get('/api/v2/managed_merchant_connect_url', (c) => c.json({ url: 'https://merchant.doordash.com/connect/emulator' }));
    app.get('/api/v2/stores/:storeId', (c) => c.json(state(store).stores.find((item) => item.id === c.req.param('storeId')) ?? { code: 'not_found' }));
    app.patch('/api/v2/stores/:storeId', async (c) => c.json({ id: c.req.param('storeId'), ...(await jsonBody(c)) }));
    app.get('/api/v2/stores/:storeId/items', (c) => c.json({ items: state(store).menus.flatMap((menu) => menu.items ?? []) }));
    app.patch('/api/v2/stores/:storeId/items', async (c) => c.json({ store_id: c.req.param('storeId'), updated: true, ...(await jsonBody(c)) }));
    app.get('/api/v2/promotions/stores/:storeId', (c) => c.json({ promotions: state(store).promotions.filter((promotion) => promotion.store_id === c.req.param('storeId')) }));
    app.post('/api/v2/promotions/stores/:storeId', async (c) => {
      const s = state(store);
      const promotion = { id: `promotion_${s.nextPromotion++}`, store_id: c.req.param('storeId'), ...(await jsonBody(c)) };
      s.promotions.push(promotion);
      saveState(store, s);
      return c.json(promotion, 201);
    });
    app.patch('/api/v2/promotions/stores/:storeId', async (c) => c.json({ store_id: c.req.param('storeId'), updated: true, ...(await jsonBody(c)) }));

    app.post('/webhooks/delivery_status', async (c) => {
      const s = state(store);
      const event = { id: `webhook_${Date.now()}`, type: 'delivery_status', payload: await jsonBody(c), received_at: now() };
      s.webhooks.push(event);
      saveState(store, s);
      return c.json({ ok: true });
    });
    app.get('/inspect/contract', (c) => c.json(contract));
    app.get('/inspect/state', (c) => c.json(state(store)));
  },
};

export function seedFromConfig(store, _baseUrl, config = {}) {
  saveState(store, initialState(config));
}

export const label = 'DoorDash Drive API emulator';
export const endpoints = 'Drive quotes, quote acceptance, deliveries, estimates, stores, and state inspection';
export const capabilities = contract.scope;
export const initConfig = { doordash: initialState() };
export default plugin;
