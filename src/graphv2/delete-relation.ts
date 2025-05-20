import type { Id } from '../idv2.js';
import { assertValid } from '../idv2.js';
import type { CreateResult, DeleteRelationOp } from '../typesv2.js';

/**
 * Deletes a relation.
 *
 * @example
 * ```ts
 * const { ops } = await deleteRelation({ id: relationId });
 * ```
 *
 * @param params - The parameters for the relation to delete.
 * @returns The operations to delete the relation.
 */
export const deleteRelation = ({ id }: { id: Id }): CreateResult => {
  assertValid(id);
  const op: DeleteRelationOp = {
    type: 'DELETE_RELATION',
    id,
  };

  return { id, ops: [op] };
};
