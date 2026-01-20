import { deleteRelation as grcDeleteRelation } from '@geoprotocol/grc-20';
import { Id } from '../id.js';
import { assertValid, toGrcId } from '../id-utils.js';
import type { CreateResult, DeleteRelationParams } from '../types.js';

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

  return { id: Id(id), ops: [grcDeleteRelation(toGrcId(id))] };
};
