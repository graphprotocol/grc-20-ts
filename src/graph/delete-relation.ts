import { Id, assertValid } from '../id.js';
import type { CreateResult, DeleteRelationOp, DeleteRelationParams } from '../types.js';

/**
 * Deletes a relation.
 *
 * @example
 * ```ts
 * const { ops } = await deleteRelation({ id: relationId });
 * ```
 *
 * @param params – {@link DeleteRelationParams}
 * @returns The operations to delete the relation.
 */
export const deleteRelation = ({ id }: DeleteRelationParams): CreateResult => {
  assertValid(id, '`id` in `deleteRelation`');
  const op: DeleteRelationOp = {
    type: 'DELETE_RELATION',
    id: Id(id),
  };

  return { id: Id(id), ops: [op] };
};
