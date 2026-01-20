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
  dataType: 'TEXT', // BOOLEAN | INTEGER | FLOAT64 | DECIMAL | TEXT | BYTES | DATE | TIME | DATETIME | SCHEDULE | POINT | EMBEDDING | RELATION
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
      type: 'text',
      value: 'value of the property',
    }
  ],
  relations: {
    // relation property
    [relationPropertyId]: {
      toEntity: 'id of the entity',
      id: 'id of the relation', // optional
      position: positionString, // optional
    },
  },
});
```

#### Typed values

Values are passed as typed objects with a `type` field that determines the value format:

```ts
import { Graph, Id } from '@graphprotocol/grc-20';

const { id: personId, ops: createPersonOps } = Graph.createEntity({
  values: [
    // Text value (with optional language)
    {
      property: someTextPropertyId,
      type: 'text',
      value: 'Hello',
      language: Id('dad6e52a5e944e559411cfe3a3c3ea64'), // optional
    },
    // Number value (with optional unit)
    {
      property: someNumberPropertyId,
      type: 'float64',
      value: 42.5,
      unit: Id('016c9b1cd8a84e4d9e844e40878bb235'), // optional
    },
    // Boolean value
    {
      property: someBooleanPropertyId,
      type: 'bool',
      value: true,
    },
    // Point value (with optional altitude)
    {
      property: somePointPropertyId,
      type: 'point',
      lon: -122.4194,
      lat: 37.7749,
      alt: 10.5, // optional
    },
    // Date value (ISO 8601 format: YYYY-MM-DD)
    {
      property: someDatePropertyId,
      type: 'date',
      value: '2024-01-15',
    },
    // Time value (ISO 8601 format with timezone)
    {
      property: someTimePropertyId,
      type: 'time',
      value: '14:30:00Z',
    },
    // Datetime value (ISO 8601 combined format)
    {
      property: someDatetimePropertyId,
      type: 'datetime',
      value: '2024-01-15T14:30:00Z',
    },
    // Schedule value (iCalendar RRULE format)
    {
      property: someSchedulePropertyId,
      type: 'schedule',
      value: 'FREQ=WEEKLY;BYDAY=MO,WE,FR',
    },
  ]
});
```

#### Example Flow

```ts
import { Graph, type GrcOp } from '@graphprotocol/grc-20';

const ops: Array<GrcOp> = [];

// create an age property
const { id: agePropertyId, ops: createAgePropertyOps } = Graph.createProperty({
  dataType: 'INTEGER',
  name: 'Age',
});
ops.push(...createAgePropertyOps);

// create a likes property
const { id: likesPropertyId, ops: createLikesPropertyOps } = Graph.createProperty({
  dataType: 'RELATION',
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
      type: 'text',
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
      type: 'float64',
      value: 42,
    },
  ],
  relations: {
    [likesPropertyId]: {
      toEntity: restaurantId,
    },
  },
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

const { cid, editId } = await Ipfs.publishEdit({
  name: 'Edit name',
  ops: ops,
  author: '0x000000000000000000000000000000000000',
  network: 'TESTNET_V2', // MAINNET | TESTNET | TESTNET_V2 | TESTNET_V3 (defaults to MAINNET)
})
```

### Publishing an edit onchain using SpaceRegistry

Once you've uploaded the binary encoded Edit to IPFS and have correctly formed `ipfs://hash`, you can write this to a space using the SpaceRegistry contract.

```ts
import { createPublicClient, encodeAbiParameters, encodeFunctionData, type Hex, http, keccak256, toHex } from 'viem';
import { SpaceRegistryAbi, getWalletClient } from '@graphprotocol/grc-20';

// Contract addresses for testnet
const SPACE_REGISTRY_ADDRESS = '0xB01683b2f0d38d43fcD4D9aAB980166988924132' as const;
const EDITS_PUBLISHED = keccak256(toHex('GOVERNANCE.EDITS_PUBLISHED'));

// You'll need your space ID in hex format (bytes16) and an IPFS CID
const spaceIdHex = '0x...' as Hex; // bytes16 space ID
const cid = 'ipfs://hash';

const walletClient = await getWalletClient({
  privateKey: addressPrivateKey,
});

// Encode the CID as a single string
const enterData = encodeAbiParameters([{ type: 'string' }], [cid]);

const calldata = encodeFunctionData({
  abi: SpaceRegistryAbi,
  functionName: 'enter',
  args: [
    spaceIdHex, // fromSpaceId (bytes16)
    spaceIdHex, // toSpaceId (bytes16)
    EDITS_PUBLISHED, // action
    '0x0000000000000000000000000000000000000000000000000000000000000000' as Hex, // topic
    enterData, // data
    '0x' as Hex, // signature (empty for direct calls)
  ],
});

const txResult = await walletClient.sendTransaction({
  account: walletClient.account,
  to: SPACE_REGISTRY_ADDRESS,
  value: 0n,
  data: calldata,
});
```

### Getting a wallet client

```ts
import { privateKeyToAccount } from 'viem/accounts';
import { getWalletClient } from "@graphprotocol/grc-20";

// IMPORTANT: Be careful with your private key. Don't commit it to version control.
// You can get your private key using https://www.geobrowser.io/export-wallet
const addressPrivateKey = '0xTODO';
const { address } = privateKeyToAccount(addressPrivateKey);

// Take the address and enter it in Faucet to get some testnet ETH https://faucet.conduit.xyz/geo-test-zc16z3tcvf

const walletClient = await getWalletClient({
  privateKey: addressPrivateKey,
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
```

### Creating a personal space

You can create personal spaces using the SpaceRegistry contract. Personal spaces are owned by a single address and don't require voting for governance.

```ts
import { createPublicClient, encodeAbiParameters, encodeFunctionData, type Hex, http, keccak256, toHex } from 'viem';
import { SpaceRegistryAbi, getWalletClient } from '@graphprotocol/grc-20';

const SPACE_REGISTRY_ADDRESS = '0xB01683b2f0d38d43fcD4D9aAB980166988924132' as const;
const EMPTY_SPACE_ID = '0x00000000000000000000000000000000' as Hex;

const walletClient = await getWalletClient({
  privateKey: addressPrivateKey,
});

const account = walletClient.account;
const rpcUrl = walletClient.chain?.rpcUrls?.default?.http?.[0];

const publicClient = createPublicClient({
  transport: http(rpcUrl),
});

// Check if a personal space already exists for this address
let spaceIdHex = await publicClient.readContract({
  address: SPACE_REGISTRY_ADDRESS,
  abi: SpaceRegistryAbi,
  functionName: 'addressToSpaceId',
  args: [account.address],
}) as Hex;

// Create a personal space if one doesn't exist
if (spaceIdHex.toLowerCase() === EMPTY_SPACE_ID.toLowerCase()) {
  const createSpaceTxHash = await walletClient.sendTransaction({
    account: walletClient.account,
    to: SPACE_REGISTRY_ADDRESS,
    value: 0n,
    data: encodeFunctionData({
      abi: SpaceRegistryAbi,
      functionName: 'registerSpaceId',
      args: [
        keccak256(toHex('EOA_SPACE')), // _type
        encodeAbiParameters([{ type: 'string' }], ['1.0.0']), // _version
      ],
    }),
  });

  await publicClient.waitForTransactionReceipt({ hash: createSpaceTxHash });

  // Re-fetch the space ID after creation
  spaceIdHex = await publicClient.readContract({
    address: SPACE_REGISTRY_ADDRESS,
    abi: SpaceRegistryAbi,
    functionName: 'addressToSpaceId',
    args: [account.address],
  }) as Hex;
}

// Convert bytes16 hex to UUID string (without dashes)
const spaceId = spaceIdHex.slice(2, 34).toLowerCase();
```

## Full Publishing Flow

This example shows the complete flow for creating a personal space and publishing an edit on testnet.

```ts
import { createPublicClient, encodeAbiParameters, encodeFunctionData, type Hex, http, keccak256, toHex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { Graph, Ipfs, SpaceRegistryAbi, getWalletClient } from '@graphprotocol/grc-20';

// Contract addresses for testnet
const SPACE_REGISTRY_ADDRESS = '0xB01683b2f0d38d43fcD4D9aAB980166988924132' as const;
const EMPTY_SPACE_ID = '0x00000000000000000000000000000000' as Hex;
const EDITS_PUBLISHED = keccak256(toHex('GOVERNANCE.EDITS_PUBLISHED'));

// IMPORTANT: Be careful with your private key. Don't commit it to version control.
// You can get your private key using https://www.geobrowser.io/export-wallet
const addressPrivateKey = '0xTODO' as `0x${string}`;
const { address } = privateKeyToAccount(addressPrivateKey);

// Take the address and enter it in Faucet to get some testnet ETH https://faucet.conduit.xyz/geo-test-zc16z3tcvf

// Get wallet client for testnet
const walletClient = await getWalletClient({
  privateKey: addressPrivateKey,
});

const account = walletClient.account;
const rpcUrl = walletClient.chain?.rpcUrls?.default?.http?.[0];

const publicClient = createPublicClient({
  transport: http(rpcUrl),
});

// Check if a personal space already exists for this address
let spaceIdHex = await publicClient.readContract({
  address: SPACE_REGISTRY_ADDRESS,
  abi: SpaceRegistryAbi,
  functionName: 'addressToSpaceId',
  args: [account.address],
}) as Hex;

// Create a personal space if one doesn't exist
if (spaceIdHex.toLowerCase() === EMPTY_SPACE_ID.toLowerCase()) {
  console.log('Creating personal space...');

  const createSpaceTxHash = await walletClient.sendTransaction({
    account: walletClient.account,
    to: SPACE_REGISTRY_ADDRESS,
    value: 0n,
    data: encodeFunctionData({
      abi: SpaceRegistryAbi,
      functionName: 'registerSpaceId',
      args: [
        keccak256(toHex('EOA_SPACE')), // _type
        encodeAbiParameters([{ type: 'string' }], ['1.0.0']), // _version
      ],
    }),
  });

  await publicClient.waitForTransactionReceipt({ hash: createSpaceTxHash });

  // Re-fetch the space ID after creation
  spaceIdHex = await publicClient.readContract({
    address: SPACE_REGISTRY_ADDRESS,
    abi: SpaceRegistryAbi,
    functionName: 'addressToSpaceId',
    args: [account.address],
  }) as Hex;
}

// Convert bytes16 hex to UUID string (without dashes)
const spaceId = spaceIdHex.slice(2, 34).toLowerCase();
console.log('spaceId', spaceId);

// Create an entity with some data
const { ops, id: entityId } = Graph.createEntity({
  name: 'Test Entity',
  description: 'Created via SDK',
});
console.log('entityId', entityId);

// Publish the edit to IPFS
const { cid, editId } = await Ipfs.publishEdit({
  name: 'Test Edit',
  ops,
  author: account.address,
  network: 'TESTNET_V2',
});
console.log('cid', cid);
console.log('editId', editId);

// Publish edit on-chain via SpaceRegistry.enter(...)
const enterData = encodeAbiParameters([{ type: 'string' }], [cid]);

const calldata = encodeFunctionData({
  abi: SpaceRegistryAbi,
  functionName: 'enter',
  args: [
    spaceIdHex, // fromSpaceId (bytes16)
    spaceIdHex, // toSpaceId (bytes16)
    EDITS_PUBLISHED, // action
    '0x0000000000000000000000000000000000000000000000000000000000000000' as Hex, // topic
    enterData, // data
    '0x' as Hex, // signature (empty for direct calls)
  ],
});

const publishTxHash = await walletClient.sendTransaction({
  account: walletClient.account,
  to: SPACE_REGISTRY_ADDRESS,
  value: 0n,
  data: calldata,
});
console.log('publishTxHash', publishTxHash);

const publishReceipt = await publicClient.waitForTransactionReceipt({ hash: publishTxHash });
console.log('Successfully published edit to space', spaceId);
```