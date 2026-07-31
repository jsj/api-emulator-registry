# @api-emulator/apple

Apple provides Sign in with Apple, CloudKit/iCloud app data, APNs, device, and platform services for iOS and macOS apps.

Part of [api-emulator](https://github.com/jsj/api-emulator) — local drop-in replacement services for CI and no-network sandboxes.

## Install

```bash
npm install @api-emulator/apple
```

## Run

```bash
npx -p api-emulator api --plugin ./@apple/api-emulator/src/index.ts --service apple
```

## Fidelity

- Tier: `smoke-only`
- Evidence: direct smoke test exists; no conformance manifest yet

## Endpoints

- `GET /bag.xml`
- `POST /v1/signSapSetup`
- `POST /auth/signin`
- `GET /auth/authorize`
- `POST /auth/token`
- `POST /auth/revoke`
- `GET /auth/keys`
- `GET /inspect/last-sign-sap-setup`
- `GET /inspect/last-sign-sap-setup-response`
- `GET /inspect/last-signin`
- `GET /v1/users`
- `GET /v1/users/:id`
- `GET /v1/ciProducts/:productId/additionalRepositories`
- `GET /v1/userInvitations`
- `POST /3/device/:token`
- `POST /apns/send`
- `POST /apns/control/register-team`
- `POST /apns/control/register-key`
- `POST /apns/control/register-topic`
- `POST /apns/control/register-device`
- `POST /apns/control/unregister-device`
- `POST /apns/control/set-device-status`
- `POST /apns/control/throttle`
- `POST /apns/control/flush-pending`
- `POST /apns/control/fail`
- `POST /apns/control/reset`
- `GET /inspect/apns/state`
- `GET /inspect/apns/collapsed`
- `GET /inspect/apns/pending`
- `GET /inspect/apns/unregistered`
- `GET /inspect/apns/deliveries`
- `GET /inspect/apns/last-delivery`
- `GET /inspect/apns/failures`
- `GET /inspect/apns/notifications`
- `GET /database/1/:container/:environment/:database/users/current`
- `POST /database/1/:container/:environment/:database/records/lookup`
- `POST /database/1/:container/:environment/:database/records/query`
- `POST /database/1/:container/:environment/:database/records/modify`
- `POST /database/1/:container/:environment/:database/zones/list`
- `POST /database/1/:container/:environment/:database/zones/modify`

## Auth

Uses fake local credentials only; provide any deterministic bearer token or API key expected by the client under test.

## Seed Configuration

```yaml
apple:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.apple.com/documentation/appstoreconnectapi)
- [api-emulator](https://github.com/jsj/api-emulator)
