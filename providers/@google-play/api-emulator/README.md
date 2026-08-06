# @api-emulator/google-play

Google Play provides Android Publisher and Play Developer Reporting APIs for tracks, reviews, products, subscriptions, and vitals.

Use this emulator for local tests, CI, and offline agent runs. It keeps your tests separate from the production API.

## Start the emulator

1. Install the package.

```bash
npm install @api-emulator/google-play
```

2. From this registry, start the emulator.

```bash
npx -p api-emulator api --plugin ./providers/@google-play/api-emulator.mjs --service google-play
```

The emulator uses the local URL that api-emulator prints. Set your client base URL to this local URL.

## Supported API

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

## Coverage

- Level: `smoke-only`
- Meaning: A smoke test starts the emulator and checks its main behavior.
- Evidence: a direct smoke test exists, but a conformance manifest does not exist.

## Credentials

You do not need production credentials. Use fixed local credentials if your client requires them.

## Test data

Add repeatable test data to the provider configuration.

```yaml
google-play:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developers.google.com/android-publisher)
- [api-emulator](https://github.com/jsj/api-emulator)
