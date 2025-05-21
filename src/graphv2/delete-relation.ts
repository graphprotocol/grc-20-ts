import { assertValid } from '../idv2.js';
import type { CreateResult, DeleteRelationOp, DeleteRelationParams } from '../typesv2.js';

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
  assertValid(id);
  const op: DeleteRelationOp = {
    type: 'DELETE_RELATION',
    id,
  };

  return { id, ops: [op] };
};
