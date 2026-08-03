# @api-emulator/app-store-connect

App Store Connect provides APIs for iOS and macOS app metadata, builds, TestFlight, review submissions, users, and app operations.

This package is part of [api-emulator](https://github.com/jsj/api-emulator). It provides a local service for CI and offline sandboxes.

## Install

```bash
npm install @api-emulator/app-store-connect
```

## Run

```bash
npx -p api-emulator api --plugin ./providers/@app-store-connect/api-emulator.mjs --service app-store-connect
```

## Fidelity

- Tier: `stub`
- Evidence: starter surface with smoke coverage

## Endpoints

The emulator source lists the supported local API endpoints.

## Authentication

The emulator does not require production credentials. Use fake local credentials in each client test.

## Seed configuration

```yaml
app-store-connect:
  # Add provider-specific seed state here.
```

## Links

- [Official API docs](https://developer.apple.com/documentation/appstoreconnectapi)
- [api-emulator](https://github.com/jsj/api-emulator)
