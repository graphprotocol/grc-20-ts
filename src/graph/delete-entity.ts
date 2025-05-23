import { Id, assertValid } from '../id.js';
import type { CreateResult, DeleteEntityOp, DeleteEntityParams } from '../types.js';

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
  assertValid(id, '`id` in `deleteEntity`');
  const op: DeleteEntityOp = {
    type: 'DELETE_ENTITY',
    id: Id(id),
  };

  return { id: Id(id), ops: [op] };
};
