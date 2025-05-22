import { type Id, fromBase64, generate, toBytes } from '../idv2.js';
import type { Op } from '../typesv2.js';
import {
  Edit,
  Entity,
  Op as OpBinary,
  Relation,
  RelationUpdate,
  UnsetEntityValues,
  UnsetRelationFields,
} from './gen/src/proto/ipfsv2_pb.js';

type MakeEditProposalParams = {
  name: string;
  ops: Op[];
  author: Id;
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

export function encode({ name, ops, author, language }: MakeEditProposalParams): Uint8Array {
  return new Edit({
    id: toBytes(generate()),
    name,
    ops: opsToBinary(ops),
    authors: [toBytes(author)],
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
            value: UnsetEntityValues.fromJson(o),
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
