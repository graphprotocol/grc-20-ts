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

### Triple

The structure of knowledge on The Graph is built on simple primitives that compose to create more complex structures. Triples are the atomic unit. Triples are combined into entities. Entities are linked together to form a graph.

[Read more about Triples in GRC-20](https://github.com/graphprotocol/graph-improvement-proposals/blob/main/grcs/0020-knowledge-graph.md#4-triples)

### Relations

Relations describe the edges within the graph. Relations are themselves entities that include details about the relationship. For example a Company can have Team Members. Each Team Member relation can have an attribute describing when the person joined the team. This is a model that is commonly called a property graph.

### Entities

An entity is a unique identifier representing a person, a place, an idea, a concept, or anything else. Entities are comprised of triples and relations which provide semantic meaning as to what the entity _is_. An entity's data can be composed from multiple spaces at once. This property is what enables pluralism within The Graph.

[More about entities and knowledge graphs](https://www.geobrowser.io/space/6tfhqywXtteatMeGUtd5EB/XYo6aR3VqFQSEcf6AeTikW)

[More about pluralism](https://www.geobrowser.io/space/6tfhqywXtteatMeGUtd5EB/5WHP8BuoCdSiqtfy87SYWG)

### Ops and edits

Data in The Graph is stored as an Op (operation). Ops represent a set of changes applied to entities. A change could be setting or deleting a triple or a relation. Both triples and relations are represented as Ops.

When writing data, these ops are grouped into a logical set called an "Edit." An Edit has a name, authors, and other metadata to represent the set of changes. This edit is then encoded into a binary representation for storage efficiency.

[Ops and edits in GRC-20](https://github.com/graphprotocol/graph-improvement-proposals/blob/main/grcs/0020-knowledge-graph.md#13-ops)

## Using

### Unique IDs

Entities throughout The Graph are referenced via globally unique identifiers. The SDK exposes APIs for creating these IDs.

```ts
import { ID } from 'graphprotocol/grc-20';

const newId = ID.generate();
```

### Making ops

The SDK exports a set of APIs for creating and deleting triple and relation ops.

```ts
import {
  type CreateRelationOp,
  type DeleteRelationOp,
  type DeleteTripleOp,
  Relation,
  type SetTripleOp,
  Triple,
} from '@graphprotocol/grc-20';

const setTripleOp: SetTripleOp = Triple.make({
  entityId: 'id of entity',
  attributeId: 'id of attribute',
  value: {
    type: 'TEXT', // TEXT | NUMBER | URL | TIME | POINT | CHECKBOX,
    value: 'hello world',
  },
});

const deleteTripleOp: DeleteTripleOp = Triple.remove({
  entityId: 'id of entity',
  attributeId: 'id of attribute',
});

const setRelationOp: CreateRelationOp = Relation.make({
  fromId: 'id of from entity',
  relationTypeId: 'id of relation type',
  toId: 'id of to entity',
});

const deleteRelationOp: DeleteRelationOp = Relation.remove('id of relation');
```

### Writing an edit to IPFS

Once you have a set of ops ready to publish, you'll need to binary encode them into an Edit and upload the Edit to IPFS.

Currently the indexer only supports reading a specific gateway. You should use our IPFS API to guarantee data availability for your published data while in early access.

Additionally, the indexer expects that IPFS CIDs be prefixed with `ipfs://` so it knows how to process it correctly. The API already returns the CID prefixed with `ipfs://`. 

We've abstracted the IPFS publishing and binary encoding into a single API.

```ts
import { IPFS } from '@graphprotocol/grc-20';

const cid = await IPFS.publishEdit({
  name: 'Edit name',
  ops: ops,
  author: '0x000000000000000000000000000000000000', 
})
```

### Publishing an edit onchain

Once you've uploaded the binary encoded Edit to IPFS and have correctly formed `ipfs://hash`, you can write this to a space.

The calldata used to write the edit onchain depends on the governance structure of the space. Currently The Graph supports two governance modes, one with voting and one without. The API exposes metadata about each space, its governance structure, and what smart contracts exist for it.

We expose an API for fetching the appropriate calldata for the correct contract addresses for each space.

```ts
// You'll need to know your space id and have an IPFS hash ahead of time
const spaceId = 'space-id';
const cid = 'ipfs://hash';

// This returns the correct contract address and calldata depending on the space id
const result = await fetch(`https://api.geobrowser.io/space/${spaceId}/edit/calldata`, {
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

### Deploying a space

You can deploy spaces programmatically using the API. Currently there are two types of governance modes for spaces: one with voting and one without. They're called PUBLIC or PERSONAL spaces respectively. The API only supports deploying the PERSONAL governance mode currently.

The API only supports deploying to TESTNET for now.

```ts
const editorAddress = '0x000000000000000000000000000000000000';
const spaceName = 'Example-Name';
const spaceId = await fetch("https://api.geobrowser.io/deploy", {
  method: "POST",
  body: JSON.stringify({ editorAddress, spaceName }),
});
```
