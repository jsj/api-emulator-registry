import { fixedNow, getState, readBody, setState } from '../../scripts/provider-plugin-kit.mjs';

const KEY = 'sendblue:state';
const TYPES = ['receive', 'outbound', 'typing_indicator', 'call_log', 'line_blocked', 'line_assigned', 'contact_created'];
const emptyWebhooks = () => Object.fromEntries([...TYPES.map((type) => [type, []]), ['globalSecret', 'whsec_sendblue_emulator']]);

function message(input = {}, index = 1) {
  return { account_email: input.account_email ?? 'emulator@sendblue.test', content: input.content ?? 'Hello from Sendblue.', date_created: input.date_created ?? fixedNow, date_updated: input.date_updated ?? fixedNow, date_sent: input.date_sent ?? fixedNow, error_code: input.error_code ?? 0, error_message: input.error_message ?? null, from_number: input.from_number ?? '+15555550100', is_outbound: input.is_outbound ?? true, media_url: input.media_url ?? null, message_handle: input.message_handle ?? `msg_emulator_${String(index).padStart(6, '0')}`, message_type: input.message_type ?? 'message', number: input.number ?? '+15555550101', reply_to: input.reply_to ?? null, seat_id: input.seat_id ?? null, send_style: input.send_style ?? null, sender_email: input.sender_email ?? null, service: input.service ?? 'iMessage', status: input.status ?? 'QUEUED', to_number: input.to_number ?? input.number ?? '+15555550101', was_downgraded: input.was_downgraded ?? false };
}

function contact(input = {}) {
  return { firstName: input.firstName ?? input.first_name ?? '', lastName: input.lastName ?? input.last_name ?? '', phone: input.phone ?? input.number, companyName: input.companyName ?? input.company_name ?? null, tags: input.tags ?? [], sendblueNumber: input.sendblueNumber ?? input.sendblue_number ?? '+15555550100', created_at: input.created_at ?? fixedNow, assignedToEmail: input.assignedToEmail ?? input.assigned_to_email ?? null, customVariables: input.customVariables ?? input.custom_variables ?? {}, opted_out: input.opted_out ?? false, verified: input.verified ?? true };
}

function initial(config = {}) {
  return { messages: (config.messages ?? [message()]).map(message), contacts: (config.contacts ?? [contact({ number: '+15555550101', first_name: 'Example', last_name: 'Contact' })]).map(contact), lines: config.lines ?? [{ id: 'line_emulator_001', phone_number: '+15555550100', status: 'active', service: 'iMessage' }], webhooks: { ...emptyWebhooks(), ...(config.webhooks ?? {}) }, next_message: (config.messages?.length ?? 1) + 1 };
}

const state = (store) => getState(store, KEY, () => initial());
const save = (store, value) => setState(store, KEY, value);
const ok = (extra = {}) => ({ status: 'OK', ...extra });
const fail = (c, text, status = 400) => c.json({ status: 'ERROR', message: text }, status);
const findContact = (current, phone) => current.contacts.find((item) => item.phone === phone);

export function seedFromConfig(store, _baseUrl, config = {}) { return save(store, initial(config)); }

export const contract = {
  provider: 'sendblue', source: 'Official Sendblue API reference and sendblue TypeScript SDK 3.10.1', docs: 'https://docs.sendblue.com/api/', baseUrl: 'https://api.sendblue.co', auth: ['sb-api-key-id', 'sb-api-secret-key'],
  scope: ['messages.send', 'messages.list', 'messages.get', 'messages.status', 'contacts.create', 'contacts.list', 'contacts.get', 'contacts.update', 'contacts.delete', 'contacts.opt_out', 'lookups.evaluate_service', 'typing.send', 'reactions.send', 'read_receipts.send', 'groups.send', 'carousels.send', 'lines.list', 'webhooks.create', 'webhooks.list', 'webhooks.update', 'webhooks.delete'], fidelity: 'stateful-rest-subset',
};

export const plugin = { name: 'sendblue', register(app, store) {
  app.post('/api/send-message', async (c) => { const current = state(store); const body = await readBody(c); if (!body.number || !body.from_number) return fail(c, 'number and from_number are required'); if (!body.content && !body.media_url && !body.app_card) return fail(c, 'content, media_url, or app_card is required'); const sent = message(body, current.next_message++); current.messages.unshift(sent); save(store, current); return c.json(sent); });
  app.get('/api/v2/messages', (c) => { const current = state(store); const limit = Math.max(1, Math.min(Number(c.req.query('limit') ?? 50), 1000)); const offset = Math.max(0, Number(c.req.query('offset') ?? 0)); let values = current.messages; for (const field of ['from_number', 'to_number', 'status', 'service', 'message_type']) { const value = c.req.query(field); if (value) values = values.filter((item) => String(item[field]) === value); } const number = c.req.query('number'); if (number) values = values.filter((item) => item.number === number || item.from_number === number); const outbound = c.req.query('is_outbound'); if (outbound) values = values.filter((item) => String(item.is_outbound) === outbound); return c.json(ok({ data: values.slice(offset, offset + limit), pagination: { hasMore: offset + limit < values.length, limit, offset, total: values.length } })); });
  app.get('/api/v2/messages/:messageId', (c) => { const item = state(store).messages.find((value) => value.message_handle === c.req.param('messageId')); return item ? c.json(item) : fail(c, 'Message not found', 404); });
  app.get('/api/status', (c) => { const handle = c.req.query('handle') ?? c.req.query('message_handle'); const item = state(store).messages.find((value) => value.message_handle === handle); return item ? c.json({ ...item, message_handle: item.message_handle, status: item.status }) : fail(c, 'Message not found', 404); });
  app.get('/api/evaluate-service', (c) => c.json({ number: c.req.query('number') ?? '', service: 'iMessage' }));
  for (const path of ['/api/send-typing-indicator', '/api/send-reaction', '/api/mark-read']) app.post(path, async (c) => c.json(ok(await readBody(c))));
  for (const path of ['/api/send-group-message', '/api/send-carousel']) app.post(path, async (c) => { const current = state(store); const body = await readBody(c); const sent = message({ ...body, message_type: 'group', number: body.numbers?.[0] ?? body.number }, current.next_message++); current.messages.unshift(sent); save(store, current); return c.json(sent); });
  app.get('/api/v2/contacts/count', (c) => c.json({ count: state(store).contacts.length }));
  app.get('/api/v2/contacts', (c) => { const values = state(store).contacts; const offset = Number(c.req.query('offset') ?? 0); const limit = Number(c.req.query('limit') ?? 100); return c.json(values.slice(offset, offset + limit)); });
  app.post('/api/v2/contacts', async (c) => { const current = state(store); const body = await readBody(c); if (!body.number) return fail(c, 'number is required'); let value = findContact(current, body.number); if (value && !body.update_if_exists) return fail(c, 'Contact already exists', 409); if (value) Object.assign(value, contact({ ...value, ...body })); else { value = contact(body); current.contacts.unshift(value); } save(store, current); return c.json(ok({ contact: value })); });
  app.get('/api/v2/contacts/:phone', (c) => { const value = findContact(state(store), c.req.param('phone')); return value ? c.json(ok({ contact: value })) : fail(c, 'Contact not found', 404); });
  app.put('/api/v2/contacts/:phone', async (c) => { const current = state(store); const value = findContact(current, c.req.param('phone')); if (!value) return fail(c, 'Contact not found', 404); Object.assign(value, contact({ ...value, ...(await readBody(c)) })); save(store, current); return c.json(ok({ contact: value })); });
  app.delete('/api/v2/contacts/:phone', (c) => { const current = state(store); const value = findContact(current, c.req.param('phone')); if (!value) return fail(c, 'Contact not found', 404); current.contacts = current.contacts.filter((item) => item.phone !== value.phone); save(store, current); return c.json(ok({ message: 'Contact deleted' })); });
  app.post('/api/v2/contacts/opt-out', async (c) => { const current = state(store); const body = await readBody(c); const value = findContact(current, body.number ?? body.phone_number); if (!value) return fail(c, 'Contact not found', 404); value.opted_out = body.opt_out ?? body.opted_out ?? true; save(store, current); return c.json(ok({ contact: value })); });
  app.get('/api/lines', (c) => c.json(ok({ lines: state(store).lines })));
  app.get('/api/account/webhooks', (c) => c.json(ok({ webhooks: state(store).webhooks })));
  app.post('/api/account/webhooks', async (c) => { const current = state(store); const body = await readBody(c); const type = body.type ?? 'receive'; current.webhooks[type] = [...(current.webhooks[type] ?? []), ...(body.webhooks ?? [])]; if (body.globalSecret) current.webhooks.globalSecret = body.globalSecret; save(store, current); return c.json(ok({ message: 'Webhooks added successfully', webhooks: current.webhooks })); });
  app.put('/api/account/webhooks', async (c) => { const current = state(store); const body = await readBody(c); current.webhooks = { ...emptyWebhooks(), ...(body.webhooks ?? body) }; save(store, current); return c.json(ok({ message: 'Webhooks replaced successfully', webhooks: current.webhooks })); });
  app.delete('/api/account/webhooks', async (c) => { const current = state(store); const body = await readBody(c); if (body.type) current.webhooks[body.type] = []; else current.webhooks = emptyWebhooks(); save(store, current); return c.json(ok({ message: 'Webhooks deleted successfully', webhooks: current.webhooks })); });
}, seed(store) { seedFromConfig(store); } };

export const label = 'Sendblue API emulator'; export const endpoints = contract.scope.join(', '); export const capabilities = contract.scope; export const initConfig = { sendblue: initial() }; export default plugin;
