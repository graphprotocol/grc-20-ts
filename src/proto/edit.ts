import { type Id, fromBase64, generate, toBytes } from '../id.js';
import type { Op } from '../types.js';
import {
  Edit,
  Entity,
  Op as OpBinary,
  Relation,
  RelationUpdate,
  UnsetEntityValues,
  UnsetRelationFields,
} from './gen/src/proto/ipfs_pb.js';

type MakeEditProposalParams = {
  name: string;
  ops: Op[];
  author: `0x${string}`;
  language?: Id;
};

interface EntityValue {
  propertyId: Id;
  value: string;
}

interface EntityData {
  id: Id;
  values: EntityValue[];
}

function hexToBytes(hex: string): Uint8Array {
  let hexString = hex;
  if (hexString.startsWith('0x')) {
    hexString = hexString.slice(2);
  }

  if (hex.length % 2 !== 0) {
    throw new Error('Invalid hex string: must have an even length');
  }

  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = Number.parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

export function encode({ name, ops, author, language }: MakeEditProposalParams): Uint8Array {
  return new Edit({
    id: toBytes(generate()),
    name,
    ops: opsToBinary(ops),
    authors: [hexToBytes(author)],
    language: language ? toBytes(language) : undefined,
  }).toBinary();
}

function opsToBinary(ops: Op[]): OpBinary[] {
  return ops.map(o => {
    switch (o.type) {
      case 'CREATE_RELATION':
        return new OpBinary({
          payload: {
            case: 'createRelation',
            value: Relation.fromJson(o.relation),
          },
        });
      case 'DELETE_RELATION':
        return new OpBinary({
          payload: {
            case: 'deleteRelation',
            value: toBytes(fromBase64(o.id)),
          },
        });
      case 'UPDATE_ENTITY':
        return new OpBinary({
          payload: {
            case: 'updateEntity',
            value: Entity.fromJson(o.entity),
          },
        });
      case 'UNSET_ENTITY_VALUES':
        return new OpBinary({
          payload: {
            case: 'unsetEntityValues',
            value: UnsetEntityValues.fromJson(o.unsetEntityValues),
          },
        });
      case 'DELETE_ENTITY':
        return new OpBinary({
          payload: {
            case: 'deleteEntity',
            value: toBytes(fromBase64(o.id)),
          },
        });
      case 'UPDATE_RELATION':
        return new OpBinary({
          payload: {
            case: 'updateRelation',
            value: RelationUpdate.fromJson(o.relation),
          },
        });
      case 'UNSET_RELATION_FIELDS':
        return new OpBinary({
          payload: {
            case: 'unsetRelationFields',
            value: UnsetRelationFields.fromJson(o.unsetRelationFields),
          },
        });
    }
  });
}
