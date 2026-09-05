import { fixedNow } from '../../scripts/provider-plugin-kit.mjs';

export const CRYPTO_TOOL_NAMES = [
  'cancel_crypto_order', 'get_crypto_account_onboarding_info', 'get_crypto_orders',
  'get_crypto_positions', 'get_crypto_quotes', 'get_currency_pairs', 'place_crypto_order', 'preview_crypto_order',
];
const assetSymbol = (value) => String(value).toUpperCase().replace(/-?USD$/, '');
const positive = (value) => typeof value === 'string' && /^(?:\d+)(?:\.\d+)?$/.test(value) && Number(value) > 0 && Number.isFinite(Number(value));

export function cryptoDefaults() {
  const currencyPairs = [['BTC', 'Bitcoin', '80000.00'], ['ETH', 'Ethereum', '2500.00']].map(([symbol, name]) => ({
    id: `currency-pair-${symbol.toLowerCase()}-usd`, symbol: `${symbol}-USD`, display_symbol: `${symbol}-USD`, name: `${name} to US Dollar`,
    asset_currency: { id: `currency-${symbol.toLowerCase()}`, code: symbol, name, type: 'cryptocurrency' },
    quote_currency: { id: 'currency-usd', code: 'USD', name: 'US Dollar', type: 'fiat' },
    tradability: 'tradable', display_only: false, min_order_size: '0.00000001', max_order_size: '1000',
    min_order_quantity_increment: '0.00000001', min_order_price_increment: '0.01', min_order_quote_amount: '1.00',
    market_orders_only: false, halted: false,
  }));
  return {
    currencyPairs,
    cryptoQuotes: currencyPairs.map((pair, index) => ({
      symbol: pair.symbol.replace('-', ''), id: pair.id,
      bid_price: index ? '2499.00' : '79999.00', ask_price: index ? '2501.00' : '80001.00',
      mark_price: index ? '2500.00' : '80000.00', open_price: index ? '2450.00' : '79000.00',
      routing: 'Market Maker Routing', updated_at: fixedNow,
    })),
    cryptoAccounts: [{ rhs_account_number: '900000006', account_id: 'crypto-account-6', crypto_account_number: 'RHCEMULATOR006', buying_power: '10000.00', fee_rate: '0' }],
    cryptoPositions: [], cryptoOrders: [],
  };
}

function timestamp(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?)?$/.test(value)) throw new Error('Invalid timestamp filter');
  const parsed = Date.parse(value.includes('T') && !/(Z|[+-]\d{2}:\d{2})$/.test(value) ? `${value}Z` : value);
  if (!Number.isFinite(parsed)) throw new Error('Invalid timestamp filter');
  return parsed;
}

function page(rows, args, limit = 25) {
  const start = args.cursor ? Number(args.cursor) : 0;
  if (!Number.isSafeInteger(start) || start < 0) throw new Error('Invalid pagination cursor');
  const end = start + limit;
  return { results: rows.slice(start, end), ...(end < rows.length ? { next: `https://agent.robinhood.com/mcp/trading?cursor=${end}` } : {}) };
}

function validateInput(tool, args, tools) {
  const schema = tools.find((row) => row.name === tool).inputSchema;
  if (!args || typeof args !== 'object' || Array.isArray(args)) throw new Error('arguments must be an object');
  for (const key of schema.required ?? []) if (args[key] === undefined || args[key] === null || args[key] === '') throw new Error(`${key} is required`);
  for (const [key, value] of Object.entries(args)) {
    const property = schema.properties?.[key];
    if (!property) throw new Error(`Unknown argument: ${key}`);
    const types = [property.type].flat();
    if (!(value === null && types.includes('null')) && !types.some((type) => type === 'array' ? Array.isArray(value) && value.every((item) => typeof item === 'string') : type === 'integer' ? Number.isInteger(value) : typeof value === type)) throw new Error(`Invalid ${key}`);
  }
}

function resolveAccount(args, s, write = false) {
  const brokerage = s.accounts.find((row) => row.rhs_account_number === args.rhs_account_number);
  const crypto = s.cryptoAccounts.find((row) => row.rhs_account_number === args.rhs_account_number);
  if (!brokerage || !crypto) throw new Error('Linked crypto account not found for rhs_account_number');
  if (write && (!brokerage.agentic_allowed || brokerage.deactivated || brokerage.permanently_deactivated || (brokerage.state && brokerage.state !== 'active'))) throw new Error('Account is not accessible for agentic crypto trading');
  return crypto;
}

function orderPreview(args, s, account) {
  if (!['buy', 'sell'].includes(args.side)) throw new Error('side must be buy or sell');
  if (!['market', 'limit', 'stop_loss', 'stop_limit'].includes(args.type)) throw new Error('Unsupported crypto order type');
  if ((args.quantity !== undefined) === (args.dollar_amount !== undefined)) throw new Error('Provide exactly one of quantity or dollar_amount');
  for (const key of ['quantity', 'dollar_amount', 'limit_price', 'stop_price']) if (args[key] !== undefined && !positive(args[key])) throw new Error(`${key} must be a positive decimal string`);
  const hasLimit = ['limit', 'stop_limit'].includes(args.type);
  const hasStop = ['stop_loss', 'stop_limit'].includes(args.type);
  if (hasLimit !== (args.limit_price !== undefined)) throw new Error(hasLimit ? 'limit_price is required' : 'limit_price is not supported for this order type');
  if (hasStop !== (args.stop_price !== undefined)) throw new Error(hasStop ? 'stop_price is required' : 'stop_price is not supported for this order type');
  const timeInForce = args.time_in_force ?? (hasStop ? 'gfd' : 'gtc');
  if (!(hasStop ? ['gtc', 'gfd', 'gfw', 'gfm'] : ['gtc']).includes(timeInForce)) throw new Error('Unsupported crypto time_in_force');
  const pair = s.currencyPairs.find((row) => row.asset_currency.code === assetSymbol(args.symbol));
  if (!pair) throw new Error('Unknown crypto symbol');
  if (pair.halted || pair.display_only || pair.tradability !== 'tradable' || (pair.market_orders_only && args.type !== 'market')) throw new Error('Currency pair is not tradable for this order');
  const quote = s.cryptoQuotes.find((row) => row.id === pair.id);
  const price = Number(hasLimit ? args.limit_price : hasStop ? args.stop_price : quote?.[args.side === 'buy' ? 'ask_price' : 'bid_price']);
  if (!(price > 0)) throw new Error('Crypto quote unavailable');
  const rate = Number(account.fee_rate ?? '0');
  const increment = Number(pair.min_order_quantity_increment);
  const rawQuantity = args.quantity ? Number(args.quantity) : Number(args.dollar_amount) / price / (args.side === 'buy' ? 1 + rate : 1);
  const quantityDecimals = (pair.min_order_quantity_increment.split('.')[1] ?? '').length;
  const quantity = args.quantity ? rawQuantity : Math.floor((rawQuantity + Number.EPSILON) / increment) * increment;
  if (quantity < Number(pair.min_order_size) || quantity > Number(pair.max_order_size)) throw new Error('Quantity is outside currency pair order limits');
  const onIncrement = (value, step) => Math.abs(value / step - Math.round(value / step)) < 0.000001;
  if (!onIncrement(quantity, increment)) throw new Error('Quantity does not match currency pair increment');
  for (const key of ['limit_price', 'stop_price']) if (args[key] && !onIncrement(Number(args[key]), Number(pair.min_order_price_increment))) throw new Error(`${key} does not match currency pair increment`);
  const notional = quantity * price;
  if (notional < Number(pair.min_order_quote_amount ?? 0)) throw new Error('Order is below minimum quote amount');
  const fee = Number((notional * rate).toFixed(2));
  const total = notional + (args.side === 'buy' ? fee : -fee);
  const openOrders = s.cryptoOrders.filter((row) => row.account_id === account.account_id && row.state_group === 'open');
  const reserved = openOrders.filter((row) => row.side === 'buy').reduce((sum, row) => sum + Number(row.net_rounded_estimated_notional), 0);
  if (args.side === 'buy' && total > Number(account.buying_power) - reserved) throw new Error("You don't have enough crypto buying power in this account to place the order");
  if (args.side === 'sell') {
    const position = s.cryptoPositions.find((row) => row.account_id === account.account_id && row.currency_pair_id === pair.id);
    const held = openOrders.filter((row) => row.side === 'sell' && row.currency_pair_id === pair.id).reduce((sum, row) => sum + Number(row.quantity) - Number(row.cumulative_quantity), 0);
    if (quantity > Number(position?.quantity ?? 0) - Number(position?.quantity_held_for_sell ?? 0) - held) throw new Error('Insufficient crypto quantity available to sell');
  }
  return {
    order: {
      id: '', account_id: account.account_id, currency_pair_id: pair.id, currency_code: pair.asset_currency.code,
      side: args.side, type: args.type, state: 'unconfirmed', state_group: 'open', time_in_force: timeInForce,
      quantity: args.quantity ?? (quantityDecimals ? quantity.toFixed(quantityDecimals).replace(/\.?0+$/, '') : String(quantity)), cumulative_quantity: '0', price: String(price),
      limit_price: args.limit_price ?? null, stop_price: args.stop_price ?? null, average_price: null,
      speculative: true, executions: [], canceled_at: null, created_at: fixedNow, updated_at: fixedNow,
      net_rounded_estimated_notional: total.toFixed(2), net_rounded_executed_notional: null,
      routing: quote?.routing ?? 'Market Maker Routing',
    },
    estimated_fee: fee.toFixed(2), ...(rate ? { fee_rate: `${Number((rate * 100).toFixed(8))}%` } : {}), crypto_account_number: account.crypto_account_number,
  };
}

export function handleCryptoTool(tool, args, s, tools) {
  if (!CRYPTO_TOOL_NAMES.includes(tool)) return null;
  try {
    validateInput(tool, args, tools);
    switch (tool) {
      case 'get_currency_pairs': return { data: page(s.currencyPairs, args, Math.min(700, Math.max(1, args.limit ?? 25))) };
      case 'get_crypto_account_onboarding_info': return { data: s.cryptoAccounts.length ? { already_onboarded: true } : { already_onboarded: false, onboarding_url: 'https://robinhood.com/crypto' } };
      case 'get_crypto_quotes': {
        if (args.timezone) new Intl.DateTimeFormat('en-US', { timeZone: args.timezone });
        const symbols = new Set(args.symbols.map(assetSymbol));
        return { data: { results: s.cryptoQuotes.filter((row) => symbols.has(assetSymbol(row.symbol))) }, guide: 'Synthetic seeded crypto quotes; timestamps and previous close are fixed fixture values.' };
      }
      case 'get_crypto_positions': {
        const account = resolveAccount(args, s);
        const positions = s.cryptoPositions.filter((row) => row.account_id === account.account_id).map((row) => {
          const held = s.cryptoOrders.filter((order) => order.account_id === account.account_id && order.currency_pair_id === row.currency_pair_id && order.side === 'sell' && order.state_group === 'open').reduce((sum, order) => sum + Number(order.quantity) - Number(order.cumulative_quantity), 0);
          return { ...row, quantity_held_for_sell: String(Number(row.quantity_held_for_sell) + held), quantity_transferable: String(Math.max(0, Number(row.quantity_transferable) - held)) };
        });
        return { data: page(positions, args) };
      }
      case 'get_crypto_orders': {
        if (args.state && args.state_group) throw new Error('state and state_group are mutually exclusive');
        const createdAfter = args.created_at_gte ? timestamp(args.created_at_gte) : -Infinity;
        const updatedAfter = args.updated_at_gte ? timestamp(args.updated_at_gte) : -Infinity;
        const account = resolveAccount(args, s);
        const orders = s.cryptoOrders.filter((row) => row.account_id === account.account_id &&
          (!args.order_id || row.id === args.order_id) && (!args.symbol || row.currency_code === assetSymbol(args.symbol)) &&
          ['state', 'state_group', 'side'].every((key) => !args[key] || row[key] === args[key]) &&
          timestamp(row.created_at) >= createdAfter && timestamp(row.updated_at) >= updatedAfter);
        return { data: { rhs_account_number: args.rhs_account_number, crypto_account_number: account.crypto_account_number, ...page(orders, args) } };
      }
      case 'preview_crypto_order': return { data: orderPreview(args, s, resolveAccount(args, s, true)), guide: 'Synthetic preview only; no order was created.' };
      case 'place_crypto_order': {
        const account = resolveAccount(args, s, true);
        if (args.ref_id && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(args.ref_id)) throw new Error('ref_id must be a UUID');
        const prior = args.ref_id && s.cryptoOrders.find((row) => row.account_id === account.account_id && row.ref_id === args.ref_id);
        if (prior) return { data: { order: prior, crypto_account_number: account.crypto_account_number } };
        const result = orderPreview(args, s, account);
        const order = { ...result.order, id: `00000000-0000-4000-8000-${String(s.nextId++).padStart(12, '0')}`, state: 'queued', speculative: false, initiator_type: 'agentic_trading', ...(args.ref_id ? { ref_id: args.ref_id } : {}) };
        s.cryptoOrders.unshift(order);
        return { data: { ...result, order }, guide: 'Order queued in the local emulator. Automatic market fills are not simulated.' };
      }
      case 'cancel_crypto_order': {
        const account = resolveAccount(args, s, true);
        const order = s.cryptoOrders.find((row) => row.account_id === account.account_id && row.id === args.order_id);
        if (!order) throw new Error('Crypto order not found for this account');
        if (order.state_group !== 'open') throw new Error('Crypto order is not eligible for cancellation');
        const canceledAt = new Date(Math.max(Date.parse(fixedNow), Date.parse(order.updated_at) + 1)).toISOString();
        order.state = 'canceled'; order.state_group = 'closed'; order.canceled_at = canceledAt; order.updated_at = canceledAt;
        order.canceled_quantity = String(Number(order.quantity) - Number(order.cumulative_quantity));
        return { data: { accepted: true }, guide: 'Local cancellation completed synchronously; inspect get_crypto_orders for the final state.' };
      }
    }
  } catch (error) { return { error: error.message, status: 400 }; }
}
