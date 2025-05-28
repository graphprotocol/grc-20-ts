# Knowledge Graph SDK

A collection of tools for interacting with The Graph.

## Installing

```sh
npm install @graphprotocol/grc-20
```

## Overview

### Data flow

Data in The Graph lives both offchain and onchain. This data is written to IPFS, and the resulting content identitifier is then posted onchain before being read by the indexing stack. After the indexer finishes processing the data it's exposed by the API.
![CleanShot 2025-01-22 at 10 51 23@2x](https://github.com/user-attachments/assets/f0cee8e0-43f9-4663-a2e7-54de6d962115)

### Spaces

On The Graph, knowledge is organized into spaces. Anyone can create a space for a community, project or individual. Spaces are organized onchain into a set of multiple smart contracts. These smart contracts represent the space itself, its data and its governance process. Depending on which onchain actions you're taking you might be interacting with one or more of these smart contracts.

### Relations

Relations describe the edges within the graph. Relations are themselves entities that include details about the relationship. For example a Company can have Team Members. Each Team Member relation can have an attribute describing when the person joined the team. This is a model that is commonly called a property graph.

### Entities

An entity is a unique identifier representing a person, a place, an idea, a concept, or anything else. Entities are comprised of triples and relations which provide semantic meaning as to what the entity _is_. An entity's data can be composed from multiple spaces at once. This property is what enables pluralism within The Graph.

[More about entities and knowledge graphs](https://www.geobrowser.io/space/6tfhqywXtteatMeGUtd5EB/XYo6aR3VqFQSEcf6AeTikW)

[More about pluralism](https://www.geobrowser.io/space/6tfhqywXtteatMeGUtd5EB/5WHP8BuoCdSiqtfy87SYWG)

### Ops and edits

Data in The Graph is stored as an Op (operation). Ops represent a set of changes applied to entities. A change could be setting or deleting a triple or a relation. Both triples and relations are represented as Ops.

When writing data, these ops are grouped into a logical set called an "Edit." An Edit has a name, authors, and other metadata to represent the set of changes. This edit is then encoded into a binary representation for storage efficiency.

[Ops and edits in GRC-20](https://github.com/yanivtal/graph-improvement-proposals/blob/new-ops/grcs/0020-knowledge-graph.md#101-operations-op)

## Using

### Unique IDs

Entities throughout The Graph are referenced via globally unique identifiers. The SDK exposes APIs for creating these IDs.

```ts
import { Id } from '@graphprotocol/grc-20';

const newId = Id.generate();
```

### Creating properties, types and entities

Working with triple and relations ops is a low level API and give you maximum flexibility. In order to ease the process of creating and updating data, the library also exports APIs for creating properties, types and entities.

```ts
import { Graph } from '@graphprotocol/grc-20';

// create a property
const propertyResult = Graph.createProperty({
  name: 'name of the property',
  type: 'TEXT', // TEXT | NUMBER | URL | TIME | POINT | CHECKBOX | RELATION,
});

// create a type
const { id: personTypeId, ops: createPersonTypeOps } = Graph.createType({
  name: 'name of the type',
  properties: […listOfPropertyIds],
});

// create an image
const { id: imageId, ops: createImageOps } = await Graph.createImage({
  url: 'https://example.com/image.png',
  // blob: new Blob([fs.readFileSync(path.join(__dirname, 'cover.png'))], { type: 'image/png' });
});

// create an entity
const { id: restaurantId, ops: createRestaurantOps } = Graph.createEntity({
  name: 'name of the entity',
  description: 'description of the entity',
  types: […listOfTypeIds],
  cover: imageId,
  values: [
    {
      property: propertyId,
      value: 'value of the property'
    }
  ],
  relations: {
    // relation property
    [propertyId]: {
      toEntity: 'id of the entity',
      id: 'id of the relation', // optional
      position: positionString, // optional
      values: [
        {
          property: propertyId,
          value: 'value of the property'
        }
      ],
    },
  },
});
```

#### Serializing values

All values are serialized to a string. The SDK provides helper functions for serializing values to the correct format.

```ts
import { Graph } from '@graphprotocol/grc-20';

const { id: personId, ops: createPersonOps } = Graph.createEntity({
  values: [
    {
      property: someNumberPropertyId,
      value: Graph.serializeNumber(42),
    },
    {
      property: someCheckboxPropertyId,
      value: Graph.serializeCheckbox(true),
    },
    {
      property: someDatePropertyId,
      value: Graph.serializeDate(new Date()),
    },
    {
      property: somePointPropertyId,
      value: Graph.serializePoint([1, 2]),
    },
  ]
});
```

#### Options for values

Some values have options that can be set.

- Text values can be set to a specific `language`.
- Number values can be set to a specific `format` and `unit`.
- Time values can be set to a specific `timezone`, `format`, `hasTime` and `hasDate`.

```ts
const { id: textEntityId, ops: createTextEntityOps } = Graph.createEntity({
  values: [
    {
      property: someTextPropertyId,
      value: 'Hello',
      options: {
        type: 'text',
        language: Id('dad6e52a-5e94-4e55-9411-cfe3a3c3ea64'),
      },
    },
    {
      property: someNumberPropertyId,
      value: Graph.serializeNumber(42),
      options: {
        type: 'number',
        format: '¤#,##0.00',
        unit: Id('016c9b1c-d8a8-4e4d-9e84-4e40878bb235'),
      },
    },
    {
      property: someTimePropertyId,
      value: Graph.serializeTime(new Date()),
      options: {
        type: 'time',
        timezone: Id('d697dd47-fd6f-4096-99b8-7af10b5f59aa'),
        format: 'EEEE, MMMM d, yyyy',
        hasTime: true,
        hasDate: true,
      },
    },
  ],
});
```

#### Example Flow

```ts
import { Graph } from '@graphprotocol/grc-20';

const ops: Array<Op> = [];

// create an age property
const { id: agePropertyId, ops: createAgePropertyOps } = Graph.createProperty({
  type: 'NUMBER',
  name: 'Age',
});
ops.push(...createAgePropertyOps);

// create a likes property
const { id: likesPropertyId, ops: createLikesPropertyOps } = Graph.createProperty({
  type: 'RELATION',
  name: 'Likes',
});
ops.push(...createLikesPropertyOps);

// create a person type
const { id: personTypeId, ops: createPersonTypeOps } = Graph.createType({
  name: 'Person',
  cover: personCoverId,
  properties: [agePropertyId, likesPropertyId],
});
ops.push(...createPersonTypeOps);

// create an restaurant cover image
const { id: restaurantCoverId, ops: createRestaurantCoverOps } = await Graph.createImage({
  url: 'https://example.com/image.png',
});
ops.push(...createRestaurantCoverOps);

// create a restaurant entity with a website property
const restaurantTypeId = 'A9QizqoXSqjfPUBjLoPJa2';
const { id: restaurantId, ops: createRestaurantOps } = Graph.createEntity({
  name: 'Yum Yum',
  description: 'A restaurant serving fusion cuisine',
  cover: restaurantCoverId,
  types: [restaurantTypeId],
  values: [
    {
      property: WEBSITE_PROPERTY,
      value: 'https://example.com',
    },
  ],
});
ops.push(...createRestaurantOps);

// create a person cover image
const { id: personCoverId, ops: createPersonCoverOps } = await Graph.createImage({
  url: 'https://example.com/avatar.png',
});
ops.push(...createPersonCoverOps);

// create a person entity with a likes relation to the restaurant entity
const { id: personId, ops: createPersonOps } = Graph.createEntity({
  name: 'Jane Doe',
  types: [personTypeId],
  cover: personCoverId,
  values: [
    {
      property: agePropertyId,
      value: serializeNumber(42),
    },
    {
      property: likesPropertyId,
      value: restaurantId,
    },
  ],
});
ops.push(...createPersonOps);
```

### Writing an edit to IPFS

Once you have a set of ops ready to publish, you'll need to binary encode them into an Edit and upload the Edit to IPFS.

Currently the indexer only supports reading a specific gateway. You should use our IPFS API to guarantee data availability for your published data while in early access.

Additionally, the indexer expects that IPFS CIDs be prefixed with `ipfs://` so it knows how to process it correctly. The API already returns the CID prefixed with `ipfs://`. 

We've abstracted the IPFS publishing and binary encoding into a single API.

```ts
import { Ipfs } from '@graphprotocol/grc-20';

const { cid } = await Ipfs.publishEdit({
  name: 'Edit name',
  ops: ops,
  author: '0x000000000000000000000000000000000000', 
})
```

### Publishing an edit onchain using your wallet

Once you've uploaded the binary encoded Edit to IPFS and have correctly formed `ipfs://hash`, you can write this to a space.

The calldata used to write the edit onchain depends on the governance structure of the space. Currently The Graph supports two governance modes, one with voting and one without. The API exposes metadata about each space, its governance structure, and what smart contracts exist for it.

We expose an API for fetching the appropriate calldata for the correct contract addresses for each space.

```ts
// You'll need to know your space id and have an IPFS hash ahead of time
const spaceId = 'space-id';
const cid = 'ipfs://hash';

// This returns the correct contract address and calldata depending on the space id
const result = await fetch(`https://api-testnet.grc-20.thegraph.com/space/${spaceId}/edit/calldata`, {
  method: "POST",
  body: JSON.stringify({ 
    cid: cid,
    // Optionally specify TESTNET or MAINNET. Defaults to MAINNET
    network: "TESTNET",
   }),
});

const { to, data } = await result.json();

const txResult = await walletClient.sendTransaction({
  to: to,
  value: 0n,
  data: data,
});
```

### Publishing an edit onchain using your Geo Account

The Geo Genesis browser uses a smart account associated with your account to publish edits. There may be situations where you want to use the same account in your code as you do on Geo Genesis. In order to get the smart account wallet client you can use the `getSmartAccountWalletClient` function.

To use `getSmartAccountWalletClient` you'll need the private key associated with your Geo account. You can get your private key using https://www.geobrowser.io/export-wallet.

Transaction costs from your smart account will be sponsored by the Geo team for the duration of the early access period. Eventually you will need to provide your own API key or provide funds to your smart account.

```ts
import { getSmartAccountWalletClient } from '@graphprotocol/grc-20';

// IMPORTANT: Be careful with your private key. Don't commit it to version control.
// You can get your private key using https://www.geobrowser.io/export-wallet
const privateKey = `0x${privateKeyFromGeoWallet}`;
const smartAccountWalletClient = await getSmartAccountWalletClient({
  privateKey,
  // rpcUrl, // optional
});

// publish an edit to IPFS
// get the calldata for the edit

const txResult = await smartAccountWalletClient.sendTransaction({
  to: to,
  value: 0n,
  data: data,
});
```

### Deploying a space

You can deploy spaces programmatically using the API. Currently there are two types of governance modes for spaces: one with voting and one without. They're called PUBLIC or PERSONAL spaces respectively. The API only supports deploying the PERSONAL governance mode currently.

The API supports deploying to both testnet and mainnet. By default it will deploy to mainnet.

```ts
import { Graph } from '@graphprotocol/grc-20';
const editorAddress = '0x000000000000000000000000000000000000';
const spaceName = 'Example-Name';

const spaceId = await Graph.createSpace({
  initialEditorAddress, 
  spaceName, 
  // Optionally specify TESTNET or MAINNET. Defaults to MAINNET
  network: 'TESTNET',
});
```
