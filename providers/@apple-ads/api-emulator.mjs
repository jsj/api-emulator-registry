import { readFileSync } from 'node:fs';
import { fixedNow, getState, readBody, setState } from '../../scripts/provider-plugin-kit.mjs';

const openapi = JSON.parse(readFileSync(new URL('./apple-ads-platform-api-v1.openapi.json', import.meta.url), 'utf8'));

const STATE_KEY = 'apple-ads:state';
const TOKEN = 'apple-ads-emulator-token';
const AD_ACCOUNT_ID = 123456789;
const ORG_ID = 987654321;

const clone = (value) => JSON.parse(JSON.stringify(value));
const envelope = (result, pagination = null) => ({ result: clone(result), pagination, error: null });
const page = (result, offset = 0, pageSize = 20) => envelope(result, { offset, pageSize, totalCount: result.length });
const money = (amount = '1.00') => ({ amount: String(amount), currency: 'USD' });

function initialState() {
  return {
    nextId: 900000001,
    orgs: [{ id: ORG_ID, name: 'AwayFinder', currency: 'USD', timezone: 'America/New_York', paymentModel: 'PAYG', systemStatus: 'ACTIVE', systemStatusReasons: [] }],
    adAccounts: [{ id: AD_ACCOUNT_ID, name: 'AwayFinder Ad Account', orgId: ORG_ID, timezone: 'America/New_York', currency: 'USD', paymentModel: 'PAYG', systemStatus: 'ACTIVE', productFeatures: ['APPSTORE_APP_MANUAL'], delegations: [{ resourceId: '12345678', resourceType: 'CONTENT_PROVIDER', resourceName: 'AwayFinder Apps' }], creationTime: fixedNow, modificationTime: fixedNow }],
    apps: [{ id: 999999999, appName: 'AwayFinder', artistName: 'AwayFinder Labs', primaryLanguage: 'en', primaryGenre: 'Productivity', secondaryGenre: 'Travel', deviceClasses: ['IPHONE', 'IPAD'], iconPictureUrl: 'https://example.invalid/awayfinder.png', isPreorder: false, availableStorefronts: ['US', 'GB', 'CA'] }],
    appLocales: [{ adamId: 999999999, language: 'en', languageCode: 'en-US', isPrimaryLocale: true, appName: 'AwayFinder', subTitle: 'Find your next adventure', promotionalText: 'Plan a better trip.', shortDescription: 'A deterministic fixture app.', deviceClasses: ['IPHONE', 'IPAD'], assetsByDevice: { iphone_6_5: { assets: [{ assetId: 'asset-iphone-1' }], appPreviewDeviceFallBackDevices: [] } } }],
    eligibilities: [{ adamId: 999999999, supplyPlacement: 'APPSTORE_SEARCH_RESULTS', supplySource: 'APPSTORE', state: 'ELIGIBLE', countryOrRegion: 'US', deviceClass: 'IPHONE' }],
    campaigns: [{ id: 444555666, name: 'AwayFinder App Campaign', adAccountId: AD_ACCOUNT_ID, promotedObjectType: 'APPSTORE_APP', promotedObjectId: '999999999', status: 'ENABLED', billingEvent: 'TAPS', bidStrategy: { bidStrategyType: 'MANUAL_CPT', bidStrategyGoal: 'TAP' }, dailyBudget: { value: money('300.00') }, targeting: { countryOrRegion: { include: ['US'] }, supplyPlacement: { include: ['APPSTORE_SEARCH_RESULTS'] } }, creationTime: fixedNow, modificationTime: fixedNow, deleted: false, paymentModel: 'PAYG', systemStatus: 'RUNNING', systemStatusReasons: [], systemStatusLimitingReasons: [] }],
    adgroups: [{ id: 555666777, adAccountId: AD_ACCOUNT_ID, campaignId: 444555666, name: 'AwayFinder - Flights', status: 'ENABLED', pricingModel: 'CPT', automatedKeywordsOptIn: false, automatedKeywordsRequired: false, bidStrategy: { bidStrategyType: 'MANUAL_CPT', bidStrategyGoal: 'TAP', bid: money('2.00') }, targeting: {}, displayStatus: 'RUNNING', systemStatus: 'RUNNING', systemStatusReasons: [], creationTime: fixedNow, modificationTime: fixedNow, deleted: false }],
    keywords: [{ id: 888999000, adAccountId: AD_ACCOUNT_ID, campaignId: 444555666, adGroupId: 555666777, text: 'travel planner', status: 'ENABLED', matchType: 'BROAD', bid: money('1.75'), displayStatus: 'RUNNING', creationTime: fixedNow, modificationTime: fixedNow, deleted: false }],
    negativeKeywords: [{ id: 888999100, adAccountId: AD_ACCOUNT_ID, campaignId: 444555666, text: 'free', status: 'ENABLED', matchType: 'BROAD', creationTime: fixedNow, modificationTime: fixedNow, deleted: false }],
    creatives: [{ id: 666777888, adAccountId: AD_ACCOUNT_ID, name: 'Default Product Page', creativeType: 'DEFAULT_PRODUCT_PAGE', destination: { destinationType: 'APP_STORE_PRODUCT_PAGE', parameters: { adamId: '999999999' } }, systemStatus: 'VALID', systemStatusReasons: [], deleted: false, creationTime: fixedNow, modificationTime: fixedNow }],
    businessBrands: [{ id: 'brand-12345678', name: 'AwayFinder', status: 'ACTIVE', categoryId: 'TRAVEL', deleted: false }],
    businessCategories: [{ id: 'TRAVEL', name: 'Travel', parentId: null }],
    brandRejectionReasons: [{ id: 'brand-rejection-1', brandId: 'brand-12345678', reasonCode: 'ASSET_REVIEW_REQUIRED', reasonLevel: 'BUSINESS_BRAND' }],
    locationGroups: [{ id: 333444555, name: 'New York Metro', locations: ['geo-us-nyc'], deleted: false, creationTime: fixedNow, modificationTime: fixedNow }],
    locations: [{ id: 'geo-us-nyc', name: 'New York', entity: 'Locality', countryOrRegion: 'US', adminArea: 'New York' }],
    supportedLanguages: [{ languageCode: 'en-US', language: 'English', storefronts: ['US'] }],
    ads: [{ id: 777888999, adAccountId: AD_ACCOUNT_ID, campaignId: 444555666, adGroupId: 555666777, creativeId: 666777888, name: 'AwayFinder Default Ad', status: 'ENABLED', displayStatus: 'RUNNING', systemStatus: 'RUNNING', systemStatusReasons: [], systemStatusLimitingReasons: [], creationTime: fixedNow, modificationTime: fixedNow, deleted: false }],
    sharedBudgets: [{ id: 777890001, name: 'AwayFinder Q3 Budget', startTime: '2026-07-01T00:00:00.000', endTime: '2026-09-30T23:59:59.000', value: money('20000.00'), adAccountIds: [AD_ACCOUNT_ID], deleted: false }],
    productPages: [{ id: 'product-page-671', adamId: 999999999, name: 'Travel Product Page', state: 'VISIBLE', deepLink: 'awayfinder://travel', creationTime: fixedNow, modificationTime: fixedNow }],
    productPageLocales: [{ productPageId: 'product-page-671', adamId: 999999999, language: 'en', languageCode: 'en-US', appName: 'AwayFinder', subTitle: 'Explore, Plan & Book Travel', deviceClasses: ['IPHONE'], assetsByDevice: { iphone_6_5: { assets: [{ assetId: 'asset-cpp-1' }], appPreviewDeviceFallBackDevices: [] } } }],
    assets: [{ id: 'asset-iphone-1', assetId: 'asset-iphone-1', adamId: 999999999, assetType: 'SCREENSHOT', deviceClass: 'IPHONE', url: 'https://example.invalid/assets/iphone-1.png' }, { id: 'asset-cpp-1', assetId: 'asset-cpp-1', adamId: 999999999, assetType: 'SCREENSHOT', deviceClass: 'IPHONE', url: 'https://example.invalid/assets/cpp-1.png' }],
    rejectionReasons: [{ id: 1111111, adamId: 999999999, supplyPlacement: 'APPSTORE_TODAY_TAB', countryOrRegion: 'US', languageCode: 'en-US', reasonType: 'REJECTION_REASON', reasonCode: 'LANGUAGE_LOCALIZATION_REQUIRED', comment: '', reasonLevel: 'CUSTOM_PRODUCT_PAGE_LOCALE' }],
    recommendations: {
      keywords: [{ id: 'rec-kw-001', recommendationType: 'KEYWORD', promotedObjectId: '999999999', promotedObjectType: 'APPSTORE_APP', campaignId: 444555666, adGroupId: 555666777, keyword: 'task management app', matchType: 'BROAD', state: 'AVAILABLE', status: 'ENABLED', campaignName: 'AwayFinder App Campaign', adGroupName: 'AwayFinder - Flights', storefront: 'US', popularity: 85, expectedInstalls: 300, expectedImpressions: 8000, expectedTaps: 400, expectedSpend: money('480.00'), expectedCpa: money('1.60'), creationTime: fixedNow, modificationTime: fixedNow }],
      targetCpas: [{ id: 'rec-tcpa-001', recommendationType: 'TCPA', promotedObjectId: '999999999', promotedObjectType: 'APPSTORE_APP', campaignId: 444555666, state: 'AVAILABLE', recommendedTargetCPA: money('5.00') }],
      dailyBudgets: [{ id: 'rec-budget-001', recommendationType: 'DAILY_BUDGET', promotedObjectId: '999999999', promotedObjectType: 'APPSTORE_APP', campaignId: 444555666, state: 'AVAILABLE', recommendedDailyBudget: money('450.00') }],
    },
    changeHistory: [{ transactionId: 'txn_abc123def456', detailId: 'Campaign.444555666.txn_abc123def456', eventType: 'UPDATE', eventTime: fixedNow, entityType: 'Campaign', entityId: '444555666', count: 1, metas: { campaignName: 'AwayFinder App Campaign', campaignId: '444555666' }, userType: 'CUSTOMER_API', modifiedBy: '3962840', details: [{ changes: [{ field: 'status', oldValues: ['PAUSED'], newValues: ['ENABLED'] }] }] }],
  };
}

const state = (store) => getState(store, STATE_KEY, initialState);
const save = (store, value) => setState(store, STATE_KEY, value);

function apiError(c, code, message, status = 400, info) {
  return c.json({ result: null, pagination: null, error: { code, message, details: info ? [{ code, message, info }] : [] } }, status);
}

function requireAuth(c) {
  if ((c.req.header?.('authorization') ?? '') !== `Bearer ${TOKEN}`) return apiError(c, 'UNAUTHORIZED', 'Use the Apple Ads emulator bearer token.', 401);
  const context = c.req.header?.('x-ap-context') ?? '';
  if (context !== `adAccountId=${AD_ACCOUNT_ID}`) return apiError(c, 'INVALID_CONTEXT', `Use X-AP-Context: adAccountId=${AD_ACCOUNT_ID}.`, 400, { field: 'X-AP-Context' });
  return null;
}

function valueAt(row, field) {
  return String(field).split('.').reduce((value, key) => value?.[key], row);
}

function matchesFilter(row, filter) {
  const actual = valueAt(row, filter.field);
  const expected = filter.value;
  const values = Array.isArray(expected) ? expected : [expected];
  switch (filter.operator) {
  case 'EQUALS': return values.some((value) => String(actual) === String(value));
  case 'NOT_EQUALS': return values.every((value) => String(actual) !== String(value));
  case 'IN': return values.some((value) => String(actual) === String(value));
  case 'LIKE': return String(actual ?? '').toLowerCase().includes(String(values[0] ?? '').toLowerCase());
  case 'STARTS_WITH': return String(actual ?? '').startsWith(String(values[0] ?? ''));
  case 'ENDS_WITH': return String(actual ?? '').endsWith(String(values[0] ?? ''));
  case 'GREATER_THAN': return Number(actual) > Number(values[0]);
  case 'GREATER_THAN_OR_EQUAL_TO': return Number(actual) >= Number(values[0]);
  case 'LESS_THAN': return Number(actual) < Number(values[0]);
  case 'LESS_THAN_OR_EQUAL_TO': return Number(actual) <= Number(values[0]);
  case 'BETWEEN': return actual >= values[0] && actual <= values[1];
  case 'CONTAINS_ANY': return Array.isArray(actual) && values.some((value) => actual.includes(value));
  case 'CONTAINS_ALL': return Array.isArray(actual) && values.every((value) => actual.includes(value));
  default: return false;
  }
}

function queryRows(rows, body = {}) {
  let result = rows.filter((row) => (body.filters ?? []).every((filter) => matchesFilter(row, filter)));
  if (!(body.filters ?? []).some((filter) => filter.field === 'deleted')) result = result.filter((row) => !row.deleted);
  for (const sort of [...(body.sorting ?? [])].reverse()) {
    result.sort((a, b) => String(valueAt(a, sort.field) ?? '').localeCompare(String(valueAt(b, sort.field) ?? ''), undefined, { numeric: true }) * (sort.order === 'DESC' ? -1 : 1));
  }
  const offset = body.pagination?.offset ?? 0;
  const pageSize = body.pagination?.pageSize ?? 20;
  const selected = result.slice(offset, offset + pageSize).map((row) => body.fields?.length ? Object.fromEntries(body.fields.map((field) => [field, valueAt(row, field)])) : row);
  return { selected, pagination: { offset, pageSize, totalCount: result.length } };
}

function parentFields(kind, body, s) {
  if (kind === 'campaigns') return { adAccountId: AD_ACCOUNT_ID };
  if (kind === 'adgroups') return { adAccountId: AD_ACCOUNT_ID, campaignId: body.campaignId };
  if (kind === 'keywords') {
    const group = s.adgroups.find((row) => row.id === Number(body.adGroupId));
    return { adAccountId: AD_ACCOUNT_ID, campaignId: group?.campaignId, adGroupId: body.adGroupId };
  }
  if (kind === 'negativeKeywords') {
    const group = s.adgroups.find((row) => row.id === Number(body.adGroupId));
    return { adAccountId: AD_ACCOUNT_ID, campaignId: body.campaignId ?? group?.campaignId, ...(body.adGroupId ? { adGroupId: body.adGroupId } : {}) };
  }
  if (kind === 'ads') return { adAccountId: AD_ACCOUNT_ID, campaignId: body.campaignId, adGroupId: body.adGroupId };
  if (kind === 'creatives') return { adAccountId: AD_ACCOUNT_ID };
  return {};
}

function resource(kind, body, s, id = s.nextId++) {
  return { id, ...parentFields(kind, body, s), ...clone(body), creationTime: fixedNow, modificationTime: fixedNow, deleted: false };
}

function registerCrud(app, store, path, kind, { create = true, update = true, remove = true } = {}) {
  app.post(`/v1/${path}/query`, async (c) => {
    const auth = requireAuth(c); if (auth) return auth;
    const { selected, pagination } = queryRows(state(store)[kind], await readBody(c));
    return c.json(envelope(selected, pagination));
  });
  app.get(`/v1/${path}/:id`, (c) => {
    const auth = requireAuth(c); if (auth) return auth;
    const row = state(store)[kind].find((item) => String(item.id) === c.req.param('id'));
    return row ? c.json(envelope(row)) : apiError(c, 'NOT_FOUND', `${path} resource not found.`, 404);
  });
  if (create) app.post(`/v1/${path}`, async (c) => {
    const auth = requireAuth(c); if (auth) return auth;
    const s = state(store); const row = resource(kind, await readBody(c), s); s[kind].push(row); save(store, s);
    return c.json(envelope(row));
  });
  if (update) app.put(`/v1/${path}/:id`, async (c) => {
    const auth = requireAuth(c); if (auth) return auth;
    const s = state(store); const index = s[kind].findIndex((item) => String(item.id) === c.req.param('id'));
    if (index < 0) return apiError(c, 'NOT_FOUND', `${path} resource not found.`, 404);
    s[kind][index] = { ...s[kind][index], ...await readBody(c), modificationTime: fixedNow }; save(store, s);
    return c.json(envelope(s[kind][index]));
  });
  if (remove) app.delete(`/v1/${path}/:id`, (c) => {
    const auth = requireAuth(c); if (auth) return auth;
    const s = state(store); const row = s[kind].find((item) => String(item.id) === c.req.param('id'));
    if (!row) return apiError(c, 'NOT_FOUND', `${path} resource not found.`, 404);
    row.deleted = true; row.modificationTime = fixedNow; save(store, s); return c.json(envelope(row));
  });
}

function registerBulk(app, store, path, kind) {
  for (const operation of ['create', 'update', 'delete']) app.post(`/v1/${path}/bulk-${operation}`, async (c) => {
    const auth = requireAuth(c); if (auth) return auth;
    const s = state(store); const body = await readBody(c); const results = [];
    for (const [index, item] of (body.items ?? []).entries()) {
      const correlationId = item.correlationId ?? index; const data = item.data ?? item;
      if (operation === 'create') { const row = resource(kind, data, s); s[kind].push(row); results.push({ correlationId, operation: 'CREATE', success: true, result: row }); continue; }
      const id = data.id ?? item.id; const row = s[kind].find((candidate) => String(candidate.id) === String(id));
      if (!row) { results.push({ correlationId, operation: operation.toUpperCase(), success: false, error: { code: 'NOT_FOUND', message: `${path} resource not found.` } }); continue; }
      if (operation === 'update') Object.assign(row, data, { modificationTime: fixedNow }); else Object.assign(row, { deleted: true, modificationTime: fixedNow });
      results.push({ correlationId, operation: operation.toUpperCase(), success: true, result: row });
    }
    save(store, s); return c.json(envelope(results));
  });
}

function reportRows(kind, s) {
  const collection = { campaigns: s.campaigns, adgroups: s.adgroups, ads: s.ads, keywords: s.keywords }[kind];
  const metadata = collection?.[0] ?? { searchTermText: 'organize tasks', adAccountId: AD_ACCOUNT_ID, campaignId: 444555666, adGroupId: 555666777 };
  return [{ totalMetrics: { localSpend: money('350.00'), impressions: 7500, taps: 270, ttr: 0.036, tapInstalls: 55, viewInstalls: 8, totalInstalls: 63, totalPreOrdersPlaced: 0 }, granularMetrics: [], metadata }];
}

function recommendationResult(s, type, action, body) {
  const key = type === 'target-cpas' ? 'targetCpas' : type === 'daily-budgets' ? 'dailyBudgets' : 'keywords';
  if (action === 'query') return s.recommendations[key];
  const requested = Array.isArray(body) ? body : body.items ?? [];
  return requested.map((item) => {
    const recommendation = s.recommendations[key].find((row) => row.id === item.id) ?? { id: item.id, recommendationType: key.toUpperCase() };
    recommendation.state = action === 'apply' ? 'APPLIED' : 'DISMISSED'; recommendation.modificationTime = fixedNow;
    return { recommendationId: recommendation.id, recommendationType: recommendation.recommendationType, promotedObjectId: recommendation.promotedObjectId, promotedObjectType: recommendation.promotedObjectType, campaignId: recommendation.campaignId, adGroupId: recommendation.adGroupId, state: recommendation.state, appliedTime: fixedNow };
  });
}

export const contract = {
  provider: 'apple-ads',
  source: 'Apple Ads Platform API preview guide and Apple Developer documentation',
  docs: 'https://ads.apple.com/adsdam/app-store/us/en_us/documents/api-preview-guide.pdf',
  baseUrls: ['https://api.ads.apple.com/v1/'],
  scope: ['oauth_context', 'apps', 'eligibility', 'campaigns', 'adgroups', 'keywords', 'negative_keywords', 'ads', 'shared_budgets', 'creatives', 'product_pages', 'rejection_reasons', 'assets', 'business_brands', 'business_categories', 'location_groups', 'locations', 'reports', 'impression_share', 'account_management', 'bulk_operations', 'recommendations', 'suggestions', 'search_term_popularity', 'change_history'],
  fidelity: 'stateful-platform-api-v1-preview',
  openapi: 'apple-ads-platform-api-v1.openapi.json',
  operationCount: Object.values(openapi.paths).flatMap((path) => Object.keys(path)).length,
};

export const plugin = {
  name: 'apple-ads',
  register(app, store) {
    app.get('/health', (c) => c.json({ ok: true, service: 'apple-ads', apiVersion: 'v1' }));
    app.get('/openapi.json', (c) => c.json(openapi));
    app.post('/auth/local', (c) => c.json({ accessToken: TOKEN, adAccountId: AD_ACCOUNT_ID, orgId: ORG_ID }));

    registerCrud(app, store, 'campaigns', 'campaigns');
    registerCrud(app, store, 'adgroups', 'adgroups');
    registerCrud(app, store, 'keywords', 'keywords');
    registerCrud(app, store, 'negative-keywords', 'negativeKeywords');
    registerCrud(app, store, 'ads', 'ads');
    registerCrud(app, store, 'shared-budgets', 'sharedBudgets');
    registerCrud(app, store, 'creatives', 'creatives');
    registerCrud(app, store, 'location-groups', 'locationGroups');
    registerBulk(app, store, 'keywords', 'keywords');
    registerBulk(app, store, 'negative-keywords', 'negativeKeywords');

    app.get('/v1/search/apps', (c) => { const auth = requireAuth(c); if (auth) return auth; const term = String(c.req.query('query') ?? c.req.query('term') ?? '').toLowerCase(); return c.json(page(state(store).apps.filter((row) => !term || row.appName.toLowerCase().includes(term)))); });
    app.post('/v1/eligibilities/apps/query', async (c) => { const auth = requireAuth(c); if (auth) return auth; const q = queryRows(state(store).eligibilities, await readBody(c)); return c.json(envelope(q.selected, q.pagination)); });
    app.get('/v1/apps/:id', (c) => { const auth = requireAuth(c); if (auth) return auth; const row = state(store).apps.find((item) => String(item.id) === c.req.param('id')); return row ? c.json(envelope(row)) : apiError(c, 'NOT_FOUND', 'App not found.', 404); });
    app.post('/v1/apps/:id/locale-details/query', async (c) => { const auth = requireAuth(c); if (auth) return auth; const q = queryRows(state(store).appLocales.filter((row) => String(row.adamId) === c.req.param('id')), await readBody(c)); return c.json(envelope(q.selected, q.pagination)); });
    app.post('/v1/metadata/apps/supported-languages/query', async (c) => { const auth = requireAuth(c); if (auth) return auth; const q = queryRows(state(store).supportedLanguages, await readBody(c)); return c.json(envelope(q.selected, q.pagination)); });
    app.get('/v1/campaigns/:id/legacy-app-limited-status-reason-details', (c) => { const auth = requireAuth(c); if (auth) return auth; return c.json(envelope({ campaignId: Number(c.req.param('id')), reasons: [] })); });

    app.post('/v1/product-pages/query', async (c) => { const auth = requireAuth(c); if (auth) return auth; const q = queryRows(state(store).productPages, await readBody(c)); return c.json(envelope(q.selected, q.pagination)); });
    app.get('/v1/product-pages/:id', (c) => { const auth = requireAuth(c); if (auth) return auth; const row = state(store).productPages.find((item) => item.id === c.req.param('id')); return row ? c.json(envelope(row)) : apiError(c, 'NOT_FOUND', 'Product page not found.', 404); });
    app.post('/v1/product-pages/locale-details/query', async (c) => { const auth = requireAuth(c); if (auth) return auth; const q = queryRows(state(store).productPageLocales, await readBody(c)); return c.json(envelope(q.selected, q.pagination)); });
    for (const [path, key] of [['assets', 'assets'], ['rejection-reasons/apps', 'rejectionReasons']]) app.post(`/v1/${path}/query`, async (c) => { const auth = requireAuth(c); if (auth) return auth; const q = queryRows(state(store)[key], await readBody(c)); return c.json(envelope(q.selected, q.pagination)); });
    app.post('/v1/assets/upload', async (c) => { const auth = requireAuth(c); if (auth) return auth; const s = state(store); const row = resource('assets', await readBody(c), s, `asset-${s.nextId++}`); s.assets.push(row); save(store, s); return c.json(envelope(row)); });
    app.get('/v1/assets/:id', (c) => { const auth = requireAuth(c); if (auth) return auth; const row = state(store).assets.find((item) => String(item.id) === c.req.param('id')); return row ? c.json(envelope(row)) : apiError(c, 'NOT_FOUND', 'Asset not found.', 404); });
    app.delete('/v1/assets/:id', (c) => { const auth = requireAuth(c); if (auth) return auth; const s = state(store); const row = s.assets.find((item) => String(item.id) === c.req.param('id')); if (!row) return apiError(c, 'NOT_FOUND', 'Asset not found.', 404); row.deleted = true; save(store, s); return c.json(envelope(row)); });
    app.get('/v1/rejection-reasons/apps/:id', (c) => { const auth = requireAuth(c); if (auth) return auth; const row = state(store).rejectionReasons.find((item) => String(item.id) === c.req.param('id')); return row ? c.json(envelope(row)) : apiError(c, 'NOT_FOUND', 'Rejection reason not found.', 404); });

    for (const [path, key] of [['business-brands', 'businessBrands'], ['business-categories', 'businessCategories']]) {
      app.post(`/v1/${path}/query`, async (c) => { const auth = requireAuth(c); if (auth) return auth; const q = queryRows(state(store)[key], await readBody(c)); return c.json(envelope(q.selected, q.pagination)); });
      app.get(`/v1/${path}/:id`, (c) => { const auth = requireAuth(c); if (auth) return auth; const row = state(store)[key].find((item) => String(item.id) === c.req.param('id')); return row ? c.json(envelope(row)) : apiError(c, 'NOT_FOUND', `${path} resource not found.`, 404); });
    }
    app.post('/v1/rejection-reasons/business-brands/query', async (c) => { const auth = requireAuth(c); if (auth) return auth; const q = queryRows(state(store).brandRejectionReasons, await readBody(c)); return c.json(envelope(q.selected, q.pagination)); });

    for (const kind of ['campaigns', 'adgroups', 'ads', 'keywords', 'searchterms']) app.post(`/v1/reports/apps/${kind}/query`, (c) => { const auth = requireAuth(c); if (auth) return auth; return c.json(envelope({ rows: reportRows(kind, state(store)), summary: { grandTotal: reportRows(kind, state(store))[0].totalMetrics } })); });
    for (const kind of ['campaigns', 'adgroups', 'ads', 'keywords', 'searchterms']) app.post(`/v1/reports/business-brands/${kind}/query`, (c) => { const auth = requireAuth(c); if (auth) return auth; return c.json(envelope({ rows: reportRows(kind, state(store)), summary: { grandTotal: reportRows(kind, state(store))[0].totalMetrics } })); });
    app.post('/v1/insights/apps/impression-share/query', (c) => { const auth = requireAuth(c); if (auth) return auth; return c.json(envelope({ rows: [{ adamId: 999999999, countryOrRegion: 'US', searchTerm: 'travel planner', impressionShare: 0.42, impressionShareType: 'ALL_SLOTS' }] }, { offset: 0, pageSize: 20, totalCount: 1 })); });
    app.post('/v1/insights/apps/search-term-popularity/query', (c) => { const auth = requireAuth(c); if (auth) return auth; return c.json(envelope({ rows: [{ week: '2026-08-09', countryOrRegion: 'US', genre: 'PRODUCTIVITY', searchTerm: 'task manager', rankInGenre: 1, searchPopularityInGenre: 95, searchPopularity1to100: 88, searchPopularity1to5: 5 }, { week: '2026-08-09', countryOrRegion: 'US', genre: 'PRODUCTIVITY', searchTerm: 'travel planner', rankInGenre: 2, searchPopularityInGenre: 89, searchPopularity1to100: 84, searchPopularity1to5: 5 }] }, { offset: 0, pageSize: 20, totalCount: 2 })); });

    app.get('/v1/me', (c) => requireAuth(c) ?? c.json(envelope({ userId: 3962840, orgId: ORG_ID })));
    app.get('/v1/acls', (c) => requireAuth(c) ?? c.json(envelope({ acls: [{ adAccount: state(store).adAccounts[0], roles: ['Admin'] }] })));
    app.get('/v1/orgs/:id', (c) => { const auth = requireAuth(c); if (auth) return auth; const row = state(store).orgs.find((item) => String(item.id) === c.req.param('id')); return row ? c.json(envelope(row)) : apiError(c, 'NOT_FOUND', 'Organization not found.', 404); });
    app.get('/v1/advertiser-resources', (c) => requireAuth(c) ?? c.json(envelope([{ resourceId: '12345678', resourceType: c.req.query('resourceType') ?? 'CONTENT_PROVIDER', resourceName: 'AwayFinder Apps' }])));
    app.get('/v1/search/geo', (c) => { const auth = requireAuth(c); if (auth) return auth; const term = String(c.req.query('query') ?? c.req.query('term') ?? '').toLowerCase(); return c.json(page(state(store).locations.filter((row) => !term || row.name.toLowerCase().includes(term)))); });
    app.post('/v1/search/geo', async (c) => { const auth = requireAuth(c); if (auth) return auth; const body = await readBody(c); const ids = body.ids ?? body.locationIds ?? []; const rows = state(store).locations.filter((row) => ids.length === 0 || ids.map(String).includes(String(row.id))); return c.json(page(rows)); });
    app.post('/v1/locations/query', async (c) => { const auth = requireAuth(c); if (auth) return auth; const q = queryRows(state(store).locations, await readBody(c)); return c.json(envelope(q.selected, q.pagination)); });
    app.get('/v1/locations/:id', (c) => { const auth = requireAuth(c); if (auth) return auth; const row = state(store).locations.find((item) => String(item.id) === c.req.param('id')); return row ? c.json(envelope(row)) : apiError(c, 'NOT_FOUND', 'Location not found.', 404); });
    app.post('/v1/ad-accounts', async (c) => {
      const auth = requireAuth(c); if (auth) return auth;
      const s = state(store); const row = resource('adAccounts', await readBody(c), s); s.adAccounts.push(row); save(store, s);
      return c.json(envelope(row));
    });
    app.get('/v1/ad-accounts/:id', (c) => {
      const auth = requireAuth(c); if (auth) return auth;
      const row = state(store).adAccounts.find((item) => String(item.id) === c.req.param('id'));
      return row ? c.json(envelope(row)) : apiError(c, 'NOT_FOUND', 'Ad account not found.', 404);
    });
    app.put('/v1/ad-accounts/:id', async (c) => {
      const auth = requireAuth(c); if (auth) return auth;
      const s = state(store); const index = s.adAccounts.findIndex((item) => String(item.id) === c.req.param('id'));
      if (index < 0) return apiError(c, 'NOT_FOUND', 'Ad account not found.', 404);
      s.adAccounts[index] = { ...s.adAccounts[index], ...await readBody(c), modificationTime: fixedNow }; save(store, s);
      return c.json(envelope(s.adAccounts[index]));
    });

    for (const type of ['keywords', 'target-cpas', 'daily-budgets']) for (const action of ['query', 'apply', 'dismiss']) app.post(`/v1/recommendations/${type}/${action}`, async (c) => { const auth = requireAuth(c); if (auth) return auth; const s = state(store); const result = recommendationResult(s, type, action, await readBody(c)); save(store, s); return c.json(page(result)); });
    app.post('/v1/suggestions/keywords/query', (c) => requireAuth(c) ?? c.json(page([{ text: 'productivity app', popularity: 85 }, { text: 'task manager', popularity: 72 }, { text: 'to do list', popularity: 68 }])));
    app.post('/v1/suggestions/phrases/query', (c) => requireAuth(c) ?? c.json(page([{ text: 'plan your next trip', popularity: 77 }])));
    app.post('/v1/suggestions/categories/query', (c) => requireAuth(c) ?? c.json(page([{ id: 'PRODUCTIVITY', name: 'Productivity' }])));
    app.post('/v1/suggestions/target-cpas/query', (c) => requireAuth(c) ?? c.json(envelope({ promotedObjectId: '999999999', suggestedTargetCPA: money('1.20'), countryOrRegion: ['US'], appCategory: 'Productivity' })));

    app.post('/v1/change-history/query', async (c) => { const auth = requireAuth(c); if (auth) return auth; const q = queryRows(state(store).changeHistory, await readBody(c)); return c.json({ dataType: 'AuditSummary', ...envelope(q.selected.map(({ details, detailId, entityId, ...row }) => row), q.pagination) }); });
    app.get('/v1/change-history/:detailId', (c) => { const auth = requireAuth(c); if (auth) return auth; const row = state(store).changeHistory.find((item) => item.detailId === c.req.param('detailId')); return row ? c.json({ dataType: 'ChangeDetail', ...page([row], 0, 1) }) : apiError(c, 'NOT_FOUND', 'Change detail not found.', 404); });

    app.get('/inspect/contract', (c) => c.json(contract));
    app.get('/inspect/state', (c) => c.json(clone(state(store))));
    app.post('/inspect/reset', (c) => { save(store, initialState()); return c.json({ reset: true }); });
  },
};

export const label = 'Apple Ads Platform API v1 emulator';
export const endpoints = contract.scope.join(', ');
export const initConfig = { appleAds: { apiBaseUrl: 'same emulator origin', accessToken: TOKEN, adAccountId: AD_ACCOUNT_ID } };
export default plugin;
