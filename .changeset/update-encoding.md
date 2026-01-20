---
"@graphprotocol/grc-20": minor
---

Update encoding to use @geoprotocol/grc-20 package

**Breaking Changes:**
- Removed `unsetEntityValues` function
- Removed `unsetRelationFields` function
- Removed `serialize` utility

**New Features:**
- Added `TESTNET_V3` network support pointing to `https://testnet-api-staging.geobrowser.io`
- Added JSDoc documentation for date/time TypedValue formats

**Changes:**
- Replaced internal protobuf encoding with `@geoprotocol/grc-20` package
- Added exhaustive type checks for value types in `createEntity` and `updateEntity`
- Updated full-flow test to use SpaceRegistry contract directly
- Added comprehensive encoding/decoding tests
