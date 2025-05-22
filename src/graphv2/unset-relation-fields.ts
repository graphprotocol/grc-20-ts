import { Id, toBase64 } from '../idv2.js';
import type { UnsetRelationFieldsOp, UnsetRelationParams } from '../typesv2.js';

/**
 * Unsets fields from a relation.
 *
 * @example
 * ```ts
 * const { ops } = await unsetRelationFields({
 *   id: relationId,
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
  fromVersion,
  toSpace,
  toVersion,
  position,
  verified,
}: UnsetRelationParams) => {
  const op: UnsetRelationFieldsOp = {
    type: 'UNSET_RELATION_FIELDS',
    unsetRelationFields: {
      id: toBase64(Id(id)),
      fromVersion,
      toSpace,
      toVersion,
      position,
      verified,
    },
  };

  return { id, ops: [op] };
};
