import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const operations = [
  ['get', '/search/apps', 'searchApps'],
  ['post', '/eligibilities/apps/query', 'queryAppEligibilities'],
  ['get', '/apps/{id}', 'getApp'],
  ['post', '/apps/{id}/locale-details/query', 'queryAppLocaleDetails'],
  ['post', '/campaigns', 'createCampaign'],
  ['get', '/campaigns/{id}', 'getCampaign'],
  ['post', '/campaigns/query', 'queryCampaigns'],
  ['put', '/campaigns/{id}', 'updateCampaign'],
  ['delete', '/campaigns/{id}', 'deleteCampaign'],
  ['get', '/campaigns/{id}/legacy-app-limited-status-reason-details', 'getCampaignLegacyStatusReasonDetails'],
  ['post', '/adgroups', 'createAdGroup'],
  ['get', '/adgroups/{id}', 'getAdGroup'],
  ['post', '/adgroups/query', 'queryAdGroups'],
  ['put', '/adgroups/{id}', 'updateAdGroup'],
  ['delete', '/adgroups/{id}', 'deleteAdGroup'],
  ['post', '/keywords', 'createKeyword'],
  ['get', '/keywords/{id}', 'getKeyword'],
  ['post', '/keywords/query', 'queryKeywords'],
  ['put', '/keywords/{id}', 'updateKeyword'],
  ['delete', '/keywords/{id}', 'deleteKeyword'],
  ['post', '/keywords/bulk-create', 'bulkCreateKeywords'],
  ['post', '/keywords/bulk-update', 'bulkUpdateKeywords'],
  ['post', '/keywords/bulk-delete', 'bulkDeleteKeywords'],
  ['post', '/negative-keywords', 'createNegativeKeyword'],
  ['get', '/negative-keywords/{id}', 'getNegativeKeyword'],
  ['post', '/negative-keywords/query', 'queryNegativeKeywords'],
  ['put', '/negative-keywords/{id}', 'updateNegativeKeyword'],
  ['delete', '/negative-keywords/{id}', 'deleteNegativeKeyword'],
  ['post', '/negative-keywords/bulk-create', 'bulkCreateNegativeKeywords'],
  ['post', '/negative-keywords/bulk-update', 'bulkUpdateNegativeKeywords'],
  ['post', '/negative-keywords/bulk-delete', 'bulkDeleteNegativeKeywords'],
  ['post', '/ads', 'createAd'],
  ['get', '/ads/{id}', 'getAd'],
  ['post', '/ads/query', 'queryAds'],
  ['put', '/ads/{id}', 'updateAd'],
  ['delete', '/ads/{id}', 'deleteAd'],
  ['post', '/shared-budgets', 'createSharedBudget'],
  ['get', '/shared-budgets/{id}', 'getSharedBudget'],
  ['post', '/shared-budgets/query', 'querySharedBudgets'],
  ['put', '/shared-budgets/{id}', 'updateSharedBudget'],
  ['delete', '/shared-budgets/{id}', 'deleteSharedBudget'],
  ['post', '/creatives', 'createCreative'],
  ['get', '/creatives/{id}', 'getCreative'],
  ['post', '/creatives/query', 'queryCreatives'],
  ['put', '/creatives/{id}', 'updateCreative'],
  ['delete', '/creatives/{id}', 'deleteCreative'],
  ['post', '/product-pages/query', 'queryProductPages'],
  ['get', '/product-pages/{id}', 'getProductPage'],
  ['post', '/product-pages/locale-details/query', 'queryProductPageLocaleDetails'],
  ['post', '/rejection-reasons/apps/query', 'queryAppRejectionReasons'],
  ['get', '/rejection-reasons/apps/{id}', 'getAppRejectionReason'],
  ['post', '/assets/query', 'queryAssets'],
  ['post', '/assets/upload', 'uploadAsset'],
  ['get', '/assets/{id}', 'getAsset'],
  ['delete', '/assets/{id}', 'deleteAsset'],
  ['post', '/reports/apps/campaigns/query', 'queryCampaignReport'],
  ['post', '/reports/apps/adgroups/query', 'queryAdGroupReport'],
  ['post', '/reports/apps/ads/query', 'queryAdReport'],
  ['post', '/reports/apps/keywords/query', 'queryKeywordReport'],
  ['post', '/reports/apps/searchterms/query', 'querySearchTermReport'],
  ['post', '/business-brands/query', 'queryBusinessBrands'],
  ['get', '/business-brands/{id}', 'getBusinessBrand'],
  ['post', '/business-categories/query', 'queryBusinessCategories'],
  ['get', '/business-categories/{id}', 'getBusinessCategory'],
  ['post', '/rejection-reasons/business-brands/query', 'queryBusinessBrandRejectionReasons'],
  ['post', '/reports/business-brands/campaigns/query', 'queryBusinessBrandCampaignReport'],
  ['post', '/reports/business-brands/adgroups/query', 'queryBusinessBrandAdGroupReport'],
  ['post', '/reports/business-brands/ads/query', 'queryBusinessBrandAdReport'],
  ['post', '/reports/business-brands/keywords/query', 'queryBusinessBrandKeywordReport'],
  ['post', '/reports/business-brands/searchterms/query', 'queryBusinessBrandSearchTermReport'],
  ['post', '/insights/apps/impression-share/query', 'queryImpressionShare'],
  ['post', '/ad-accounts', 'createAdAccount'],
  ['get', '/ad-accounts/{id}', 'getAdAccount'],
  ['put', '/ad-accounts/{id}', 'updateAdAccount'],
  ['get', '/advertiser-resources', 'getAdvertiserResources'],
  ['post', '/metadata/apps/supported-languages/query', 'querySupportedAppLanguages'],
  ['get', '/search/geo', 'searchGeolocations'],
  ['post', '/search/geo', 'resolveGeolocations'],
  ['post', '/location-groups', 'createLocationGroup'],
  ['post', '/location-groups/query', 'queryLocationGroups'],
  ['get', '/location-groups/{id}', 'getLocationGroup'],
  ['put', '/location-groups/{id}', 'updateLocationGroup'],
  ['delete', '/location-groups/{id}', 'deleteLocationGroup'],
  ['post', '/locations/query', 'queryLocations'],
  ['get', '/locations/{id}', 'getLocation'],
  ['get', '/orgs/{id}', 'getOrganization'],
  ['get', '/me', 'getCurrentUser'],
  ['get', '/acls', 'getAccessControlList'],
  ['post', '/recommendations/keywords/query', 'queryKeywordRecommendations'],
  ['post', '/recommendations/keywords/apply', 'applyKeywordRecommendations'],
  ['post', '/recommendations/keywords/dismiss', 'dismissKeywordRecommendations'],
  ['post', '/recommendations/target-cpas/query', 'queryTargetCpaRecommendations'],
  ['post', '/recommendations/target-cpas/apply', 'applyTargetCpaRecommendations'],
  ['post', '/recommendations/target-cpas/dismiss', 'dismissTargetCpaRecommendations'],
  ['post', '/recommendations/daily-budgets/query', 'queryDailyBudgetRecommendations'],
  ['post', '/recommendations/daily-budgets/apply', 'applyDailyBudgetRecommendations'],
  ['post', '/recommendations/daily-budgets/dismiss', 'dismissDailyBudgetRecommendations'],
  ['post', '/suggestions/keywords/query', 'queryKeywordSuggestions'],
  ['post', '/suggestions/phrases/query', 'queryPhraseSuggestions'],
  ['post', '/suggestions/categories/query', 'queryCategorySuggestions'],
  ['post', '/suggestions/target-cpas/query', 'queryTargetCpaSuggestions'],
  ['post', '/insights/apps/search-term-popularity/query', 'querySearchTermPopularity'],
  ['post', '/change-history/query', 'queryChangeHistory'],
  ['get', '/change-history/{detailId}', 'getChangeHistoryDetail'],
];

const tags = (path) => [path.split('/').filter(Boolean)[0]];
const pathParameters = (path) => [...path.matchAll(/{([^}]+)}/g)].map(([, name]) => ({
  name,
  in: 'path',
  required: true,
  schema: { type: 'string' },
}));
const summary = (operationId) => `${operationId.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/^./, (character) => character.toUpperCase())}.`;

const paths = {};
for (const [method, path, operationId] of operations) {
  const operation = {
    operationId,
    summary: summary(operationId),
    tags: tags(path),
    responses: {
      200: {
        description: 'Successful response.',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Response' } } },
      },
      400: {
        description: 'Invalid request.',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Response' } } },
      },
      default: {
        description: 'Error response.',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Response' } } },
      },
    },
  };
  const parameters = pathParameters(path);
  if (parameters.length) operation.parameters = parameters;
  if (method === 'post' || method === 'put') {
    operation.requestBody = {
      required: true,
      content: { 'application/json': { schema: { $ref: '#/components/schemas/Request' } } },
    };
  }
  paths[path] ??= {};
  paths[path][method] = operation;
}

const document = {
  openapi: '3.1.0',
  info: {
    title: 'Apple Ads Platform API v1',
    version: '1.0.0-preview-2026-07',
    description: 'Operation inventory from the Apple Ads Platform API preview guide and Apple Developer documentation.',
    license: { name: 'Apple API documentation terms', identifier: 'LicenseRef-Apple-API-Documentation' },
  },
  externalDocs: { url: 'https://ads.apple.com/adsdam/app-store/us/en_us/documents/api-preview-guide.pdf' },
  servers: [{ url: 'https://api.ads.apple.com/v1' }],
  security: [{ bearerAuth: [], adAccountContext: [] }],
  paths,
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer' },
      adAccountContext: { type: 'apiKey', in: 'header', name: 'X-AP-Context' },
    },
    schemas: {
      Request: { type: 'object', additionalProperties: true },
      Response: {
        type: 'object',
        properties: {
          result: {},
          pagination: { anyOf: [{ $ref: '#/components/schemas/Pagination' }, { type: 'null' }] },
          error: { anyOf: [{ $ref: '#/components/schemas/Error' }, { type: 'null' }] },
        },
        required: ['result'],
        additionalProperties: true,
      },
      Pagination: {
        type: 'object',
        properties: {
          offset: { type: 'integer' },
          pageSize: { type: 'integer' },
          totalCount: { type: 'integer' },
        },
        required: ['offset', 'pageSize', 'totalCount'],
      },
      Error: {
        type: 'object',
        properties: {
          code: { type: 'string' },
          message: { type: 'string' },
          details: { type: 'array', items: { type: 'object', additionalProperties: true } },
        },
        required: ['code', 'message', 'details'],
      },
    },
  },
};

const outputURL = new URL('./apple-ads-platform-api-v1.openapi.json', import.meta.url);
const output = `${JSON.stringify(document, null, 2)}\n`;
if (process.argv.includes('--check')) {
  if (readFileSync(outputURL, 'utf8') !== output) throw new Error('Apple Ads OpenAPI document is out of date.');
  console.log(`Apple Ads OpenAPI document is current with ${operations.length} operations`);
} else {
  writeFileSync(fileURLToPath(outputURL), output);
  console.log(`wrote Apple Ads Platform API v1 OpenAPI document with ${operations.length} operations`);
}
