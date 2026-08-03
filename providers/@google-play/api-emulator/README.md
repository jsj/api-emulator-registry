# @api-emulator/google-play

Google Play provides Android Publisher and Play Developer Reporting APIs for tracks, reviews, products, subscriptions, and vitals.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/google-play
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@google-play/api-emulator.mjs --service google-play
```

## Fidelity

- Tier: `smoke-only`
- Evidence: a direct smoke test exists, but a conformance manifest does not exist

## Endpoints

- `POST /androidpublisher/v3/applications/:packageName/edits`
- `POST /androidpublisher/v3/applications/:packageName/edits/:editId:commit`
- `GET /androidpublisher/v3/applications/:packageName/edits/:editId/tracks`
- `GET /androidpublisher/v3/applications/:packageName/edits/:editId/tracks/:track`
- `PUT /androidpublisher/v3/applications/:packageName/edits/:editId/tracks/:track`
- `GET /androidpublisher/v3/applications/:packageName/reviews`
- `POST /androidpublisher/v3/applications/:packageName/reviews/:reviewId:reply`
- `GET /androidpublisher/v3/applications/:packageName/inappproducts`
- `GET /androidpublisher/v3/applications/:packageName/subscriptions`
- `GET /androidpublisher/v3/applications/:packageName/monetization/subscriptions`
- `GET /v1beta1/apps/:packageName/errorIssues:search`
- `GET /inspect/contract`
- `GET /inspect/state`

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
google-play:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developers.google.com/android-publisher)
- [api-emulator](https://github.com/jsj/api-emulator)
