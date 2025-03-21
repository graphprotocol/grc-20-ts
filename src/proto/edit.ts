import { generate } from '../id.js';
import type { Op } from '../types.js';
import { ActionType, Edit, Entity, ImportCsvMetadata, Op as OpBinary, OpType, Relation, Triple } from './gen/src/proto/ipfs_pb.js';

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
      case 'SET_BATCH_TRIPLE':
        return new OpBinary({
          type: OpType.SET_TRIPLE_BATCH,
          entity: Entity.fromJson(o.entity),
          triples: o.triples.map(t => Triple.fromJson(t)),
        });
      case 'DELETE_ENTITY':
        return new OpBinary({
          type: OpType.DELETE_ENTITY,
          entity: Entity.fromJson({
            id: o.entity.id,
          }),
        });
      case 'SET_TRIPLE':
        return new OpBinary({
          type: OpType.SET_TRIPLE,
          triple: Triple.fromJson(o.triple), // janky but works
        });
      case 'DELETE_TRIPLE':
        return new OpBinary({
          type: OpType.DELETE_TRIPLE,
          triple: Triple.fromJson(o.triple), // janky but works
        });
      case 'IMPORT_FILE':
        return new OpBinary({
          type: OpType.IMPORT_FILE,
          url: o.url,
          metadata: ImportCsvMetadata.fromJson(o.metadata),
        })
    }
  });
}
