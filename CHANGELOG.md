# @graphprotocol/grc-20

## 0.9.1

### Patch Changes

- Remove jsr dep

## 0.9.0

### Minor Changes

- 33070df: Add FILE_IMPORT op

### Patch Changes

- 813c7a5: Remove several dependencies and upgrade others
- 4f8e860: add getSmartAccountWalletClient

## 0.9.0-next.0

### Minor Changes

- Add FILE_IMPORT op

## 0.8.0

### Minor Changes

- Add mainnet APIs for deploying space

## 0.7.0

### Minor Changes

- c684d49: rename types from "args" to "params" e.g. CreateTripleArgs to CreateTripleParams
- c44f027: Update `QUOTES_THAT_SUPPORT_CLAIMS_PROPERTY` and `ACADEMIC_FIELD_TYPE` values to be valid IDs
- c44f027: IDs now use a branded type `Id` instead of `string` and validate every ID param

### Patch Changes

- 454fbe2: add createImage to Graph namespace

## 0.6.4

### Patch Changes

- fix aliased paths

## 0.6.3

### Patch Changes

- Remove Graph.publish

## 0.6.2

### Patch Changes

- Fix missing Graph export

## 0.6.1

### Patch Changes

- 9c756b8: all IDs with ATTRIBUTE in the name now changed PROPERTY. The constants with ATTRIBUTE still exist and marked as deprecated
- 9c756b8: Add utility functions createProperty, createType, createEntity

## 0.6.0

### Minor Changes

- 424b98e: Add triple value options to encoding
- add1f17: Rename exports:
  IPFS -> Ipfs
  ID -> Id
  SYSTEM_IDS -> SystemIds
  NETWORK_IDS -> NetworkIds
  CONTENT_IDS -> ContentIds

  Export decodeBase58ToUUID, encodeBase58 and BASE58_ALLOWED_CHARS under named export Base58

## 0.5.2

### Patch Changes

- 5f7c358: Fix import in readme

## 0.5.1

### Patch Changes

- Remove prettier deps and config files

## 0.5.0

### Minor Changes

- Don't throw error if space id doesn't exist on scheme as it's optional.

## 0.4.1

### Patch Changes

- Export contracts as const

## 0.4.0

### Minor Changes

- Fixes example in readme for deploying space
- Updates default API URL to one operated by The Graph.

## 0.3.0

### Minor Changes

- don't use aliased imports

## 0.2.3

### Patch Changes

- Add docs for specifying network in some API calls

## 0.2.2

### Patch Changes

- Fix published artifacts

## 0.2.1

### Patch Changes

- Move retrying and validating to server instead of client

## 0.2.0

### Minor Changes

- Adds abstraction for publishing edits to IPFS using default API endpoint

## 0.1.0

### Minor Changes

- Update ID generation fn name from make -> generate

### Patch Changes

- f8035bf: Add docs for deploying space and generating calldata to publish edits.

## 0.0.9

### Patch Changes

- Add docs on deploying a personal space and generating calldata to publish.

## 0.0.7

### Patch Changes

- f47d0f3: Adds JS Doc comments to APIs
