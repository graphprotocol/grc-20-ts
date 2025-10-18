# @graphprotocol/grc-20

## 0.25.4

### Patch Changes

- ced965d: add param `network` to Graph.createImage

## 0.25.3

### Patch Changes

- 85ecc55: fix uploadImage in webbrowsers by avoiding Buffer to be defined
- 85ecc55: validate createSpace response to improve the returned type

## 0.25.2

### Patch Changes

- 3ab51a4: upgrade dependencies

## 0.25.1

### Patch Changes

- 9344248: Latest contract ABIs for updated contracts

## 0.25.0

### Minor Changes

- edb030c: Update to latest plugin repo version contract addresses

## 0.24.1

### Patch Changes

- 6b2568b: rename serializeCheckbox to serializeBoolean

## 0.24.0

### Minor Changes

- 45f70f7: Rename protobuf data types to STRING and BOOLEAN

## 0.23.1

### Patch Changes

- b0c5265: remove used graphql-request depedency
- e898210: remove @changesets/cli from depdendencies
- c67a046: remove unused ethers dependency

## 0.23.0

### Minor Changes

- 7425e73: directly export Id from the package and all other functions and types under IdUtils
- e806514: remove cover from updateEntity

### Patch Changes

- 6babbbf: add fromSpace, fromVersion, toVersion, verified to createRelation
- 4068869: add updateRelation
- 42154fb: properly handle all relation fields (`fromSpace`, `fromVersion`, `toVersion`, `verified`) for relations in createEntity
- 9e87178: add fromSpace to unsetRelationFields
- 6babbbf: fix entityValues structure for createRelation

## 0.22.0

### Minor Changes

- 9a56d1b: Added new configuration to Graph.createSpace to support deploying public spaces.

## 0.21.6

### Patch Changes

- a487de7: fix build

## 0.21.5

### Patch Changes

- 9ca687a: update testnet API endpoint and expose it under Graph.TESTNET_API_ORIGIN

## 0.21.4

### Patch Changes

- Use correct system id when creating properties on a Type

## 0.21.3

### Patch Changes

- Number unit option should be encoded as a uuid

## 0.21.2

### Patch Changes

- 7d90db4: expose getWalletClient for testnet experiments
- 76f5b65: unless provided create separate ids for relation id and relation entity id

## 0.21.1

### Patch Changes

- Adds APIs for comparing and sorting positions

## 0.21.0

### Minor Changes

- Use fractional indexing-based position API with jittering

## 0.20.2

### Patch Changes

- fae408d: use correct relation and relation entity IDs

## 0.20.1

### Patch Changes

- 827c9f0: add getWalletClient for testnet users

## 0.20.0

### Minor Changes

- Introduce optional spaceEntityId and ops when creating space

## 0.19.0

### Minor Changes

- e26f4b1: switch to new API endpoint and allow to use testnet or mainnet

## 0.18.0

### Minor Changes

- 1a664aa: remove deleteEntity

## 0.17.1

### Patch Changes

- Do not set created property as a Type

## 0.17.0

### Minor Changes

- 20d635d: change NativeTypes to DataType in protobuf and type to dataType in createProperty

## 0.16.0

### Minor Changes

- 8a2bdc7: remove native type IDs
- 51d91fa: remove Time options, remove Options format, introduce CREATE_PROPERTY Op

## 0.15.1

### Patch Changes

- d3f8f83: fix options encoding

## 0.15.0

### Minor Changes

- be6bab8: change number options unit from string to Id

## 0.14.0

### Minor Changes

- 7a79644: use an array instead of a object for values to support multiple languages per property
- 21a9b29: add options to value and change api to accept { value: string, options: Options }

## 0.13.1

### Patch Changes

- abc9651: fix relations types for createEntity
- 94bd4da: add Graph.serializeNumber, Graph.serializeCheckbox, Graph.serializeDate & Graph.serializePoint

## 0.13.0

### Minor Changes

- 2381f25: switch to plain UUID strings in Ops (prev they were base64 encoded string UUIDs)
- a9b47ba: values now accept a string instead of { value: string }

### Patch Changes

- 0db48c2: all functions accept also `string` for an ID and all IDs are asserted

## 0.12.2

### Patch Changes

- a6d2b4b: restore Base58

## 0.12.1

### Patch Changes

- 4afaa57: fix internal imports to avoid runtime errors of exported functions

## 0.12.0

### Minor Changes

- d1a22d7: Migrated to the new Entity based protocol (removed Triples, old Ids, renamed properties to values)

### Patch Changes

- 486ab3b: Create experimental protobuf for new IPFS format

## 0.11.5

### Patch Changes

- b2ef3b2: change incorrect attribute ids for currencies

## 0.11.4

### Patch Changes

- 9cabc1c: Add attributes for currency entities

## 0.11.3

### Patch Changes

- 54932ff: Add currency attribute ids

## 0.11.2

### Patch Changes

- c63c021: Add geo location property ID

## 0.11.1

### Patch Changes

- d318633: Add bullet list view

## 0.11.0

### Minor Changes

- 866fcbd: return object with cid and editId from Ipfs.publishEdit

## 0.10.0

### Minor Changes

- 21997e9: allow to provide an existing id when creating an entity, image, type or property
- 9d95766: add Graph.deleteEntity

## 0.9.5

### Patch Changes

- 5c35de1: expose GeoSmartAccount type

## 0.9.4

### Patch Changes

- Simplify CSV column metadata fields

## 0.9.3

### Patch Changes

- Add Encoding namespace

## 0.9.2

### Patch Changes

- Remove CSV writing APIs

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
