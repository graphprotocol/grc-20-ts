import { assertValid } from '../idv2.js';
import type { CreateResult, DeleteEntityOp, DeleteEntityParams } from '../typesv2.js';

/**
 * Deletes an entity from a space.
 *
 * @example
 * ```ts
 * const { ops } = await deleteEntity({ id: entityId });
 * ```
 *
 * @param params – {@link DeleteEntityParams}
 * @returns The operations to delete the entity.
 */
export const deleteEntity = ({ id }: DeleteEntityParams): CreateResult => {
  assertValid(id);
  const op: DeleteEntityOp = {
    type: 'DELETE_ENTITY',
    id,
  };

  return { id, ops: [op] };
};
