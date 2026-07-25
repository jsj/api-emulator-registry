import { registerRoutes } from './src/routes/http.mjs';

export const contract = {
  provider: 'fal',
  source: 'fal Platform OpenAPI v1 and per-model OpenAPI 3 schemas',
  openapi: 'https://api.fal.ai/v1/openapi.json',
  docs: 'https://docs.fal.ai',
  baseUrl: 'https://api.fal.ai',
  scope: ['platform-v1-subset', 'queue', 'seedance-2-text-to-video', 'seedance-2-image-to-video', 'seedance-2-reference-to-video'],
  fidelity: 'openapi-derived-subset',
};

export const plugin = {
  name: 'fal',
  register(app, store) {
    registerRoutes(app, store);
  },
};

export const label = 'fal API emulator';
export const endpoints = 'Platform APIs v1, generic queue model APIs, Seedance 2 text/image/reference-to-video';
export const capabilities = contract.scope;
export const initConfig = { fal: {} };
