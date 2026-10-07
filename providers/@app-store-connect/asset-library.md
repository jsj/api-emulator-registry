# Asset Library emulator

The Apple plugin includes an App Store Connect API 4.5.1 subset for Asset Library.
The App Store Connect plugin uses the same implementation.

Supported operations include library reads, image and video reservations, byte transfers, upload commits, lifecycle changes, placements, ordering, and standalone review items.
Collection reads support filters, sorting, pagination, and relationship linkage.

## Run focused tests

From `providers/@apple/api-emulator`, run the focused tests.

```sh
npm test -- src/__tests__/asset-library.test.ts src/__tests__/crud.test.ts src/__tests__/review-submissions.test.ts
```

## Test the xc CLI

Set `XC_ASC_BINARY` to the built CLI path.
Run the smoke script with Bun.

```sh
XC_ASC_BINARY=/path/to/xc bun src/__tests__/xc-asset-library-smoke.mjs
```

The script starts a local server and creates temporary credentials.
It tests library reads, uploads, lifecycle changes, placements, ordering, pagination, and review items.
It deletes temporary credentials after the run.

## Fidelity limits

Media specifications are deterministic fixtures.
Upload commits become ready for review immediately after complete byte transfer.
The emulator does not decode media or reproduce Apple's processing and App Review.
Placement contexts use supplied localization IDs without creating their parent resources.
Tests set approval state directly through `assetLibraryState` when they need approved media.

Source: [Apple's official OpenAPI specification](https://developer.apple.com/sample-code/app-store-connect/app-store-connect-openapi-specification.zip).
