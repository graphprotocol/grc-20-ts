import { generate } from '../idv2.js';
import type { Op } from '../typesv2.js';
import { ActionType, Edit, Entity, Op as OpBinary, OpType, Relation } from './gen/src/proto/ipfsv2_pb.js';

type MakeEditProposalParams = {
  name: string;
  ops: Op[];
  author: string;
};

export function encode({ name, ops, author }: MakeEditProposalParams): Uint8Array {
  return new Edit({
    type: ActionType.ADD_EDIT,
    version: '1.0.0',
    id: generate(),
    name,
    ops: opsToBinary(ops),
    authors: [author],
  }).toBinary();
}

function opsToBinary(ops: Op[]): OpBinary[] {
  return ops.map(o => {
    switch (o.type) {
      case 'CREATE_RELATION':
        return new OpBinary({
          type: OpType.CREATE_RELATION,
          relation: Relation.fromJson(o.relation),
        });
      case 'DELETE_RELATION':
        return new OpBinary({
          type: OpType.DELETE_RELATION,
          relation: Relation.fromJson({
            id: o.relation.id,
          }),
        });
      case 'CREATE_ENTITY':
        return new OpBinary({
          type: OpType.CREATE_ENTITY,
          entity: Entity.fromJson(o.entity),
        });
      case 'UPDATE_ENTITY':
        return new OpBinary({
          type: OpType.UPDATE_ENTITY,
          entity: Entity.fromJson(o.entity),
        });
      case 'UNSET_PROPERTIES':
        return new OpBinary({
          type: OpType.UNSET_PROPERTIES,
          entity: Entity.fromJson(o.entity),
        });
      case 'DELETE_ENTITY':
        return new OpBinary({
          type: OpType.DELETE_ENTITY,
          entity: Entity.fromJson({
            id: o.entity.id,
          }),
        });
      case 'UPDATE_RELATION':
        return new OpBinary({
          type: OpType.UPDATE_RELATION,
          relation: Relation.fromJson(o.relation),
        });
    }
  });
}
