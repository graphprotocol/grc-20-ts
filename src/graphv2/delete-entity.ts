import type { Id } from '../idv2.js';
import { assertValid } from '../idv2.js';
import type { CreateResult, DeleteEntityOp } from '../typesv2.js';

/**
 * Deletes an entity from a space.
 *
 * @example
 * ```ts
 * const { ops } = await deleteEntity({ id: entityId });
 * ```
 *
 * @param params - The parameters for the entity to delete.
 * @returns The operations to delete the entity.
 */
export const deleteEntity = ({ id }: { id: Id }): CreateResult => {
  assertValid(id);
  const op: DeleteEntityOp = {
    type: 'DELETE_ENTITY',
    entity: {
      id,
    },
  };

  return { id, ops: [op] };
};
