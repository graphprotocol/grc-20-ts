import { assertValid } from '../id-utils.js';
import { Id } from '../id.js';
import type { UnsetRelationFieldsOp, UnsetRelationParams } from '../types.js';

/**
 * Unsets fields from a relation.
 *
 * @example
 * ```ts
 * const { ops } = await unsetRelationFields({
 *   id: relationId,
 *   fromSpace: true, // optional
 *   fromVersion: true, // optional
 *   toSpace: true, // optional
 *   toVersion: true, // optional
 *   position: true, // optional
 *   verified: true, // optional
 * });
 * ```
 *
 * @param params – {@link UnsetRelationParams}
 * @returns The operation to unset the relation.
 */
export const unsetRelationFields = ({
  id,
  fromSpace,
  fromVersion,
  toSpace,
  toVersion,
  position,
  verified,
}: UnsetRelationParams) => {
  assertValid(id, '`id` in `unsetRelationFields`');

  const op: UnsetRelationFieldsOp = {
    type: 'UNSET_RELATION_FIELDS',
    unsetRelationFields: {
      id: Id(id),
      fromSpace,
      fromVersion,
      toSpace,
      toVersion,
      position,
      verified,
    },
  };

  return { id, ops: [op] };
};
