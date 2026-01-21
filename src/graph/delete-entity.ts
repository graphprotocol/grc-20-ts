import { deleteEntity as grcDeleteEntity } from '@geoprotocol/grc-20';
import { Id } from '../id.js';
import { assertValid, toGrcId } from '../id-utils.js';
import type { CreateResult, DeleteEntityParams } from '../types.js';

/**
 * Deletes an entity.
 *
 * @example
 * ```ts
 * const { ops } = deleteEntity({ id: entityId });
 * ```
 *
 * @param params – {@link DeleteEntityParams}
 * @returns The operations to delete the entity.
 */
export const deleteEntity = ({ id }: DeleteEntityParams): CreateResult => {
  assertValid(id, '`id` in `deleteEntity`');

  return { id: Id(id), ops: [grcDeleteEntity(toGrcId(id))] };
};
