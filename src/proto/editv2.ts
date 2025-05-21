import { type Id, generate, toBytes } from '../idv2.js';
import type { Op } from '../typesv2.js';
import { Edit, Entity, Op as OpBinary, Relation, RelationUpdate, UnsetRelation } from './gen/src/proto/ipfsv2_pb.js';

type MakeEditProposalParams = {
  name: string;
  ops: Op[];
  author: Id;
  language?: Id;
};

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
            value: Relation.fromJson(o),
          },
        });
      case 'DELETE_RELATION':
        return new OpBinary({
          payload: {
            case: 'deleteRelation',
            value: toBytes(o.id),
          },
        });
      case 'CREATE_ENTITY':
        return new OpBinary({
          payload: {
            case: 'createEntity',
            value: Entity.fromJson(o.entity),
          },
        });
      case 'UPDATE_ENTITY':
        return new OpBinary({
          payload: {
            case: 'updateEntity',
            value: Entity.fromJson(o.entity),
          },
        });
      case 'UNSET_PROPERTIES':
        return new OpBinary({
          payload: {
            case: 'unsetProperties',
            value: {
              id: toBytes(o.entity),
              properties: o.properties.map(toBytes),
            },
          },
        });
      case 'DELETE_ENTITY':
        return new OpBinary({
          payload: {
            case: 'deleteEntity',
            value: toBytes(o.id),
          },
        });
      case 'UPDATE_RELATION':
        return new OpBinary({
          payload: {
            case: 'updateRelation',
            value: RelationUpdate.fromJson(o.relation),
          },
        });
      case 'UNSET_RELATION':
        return new OpBinary({
          payload: {
            case: 'unsetRelation',
            value: UnsetRelation.fromJson(o),
          },
        });
    }
  });
}
