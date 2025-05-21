import type { UnsetRelationOp, UnsetRelationParams } from '../typesv2.js';

/**
 * Unsets fields from a relation.
 *
 * @example
 * ```ts
 * const { ops } = await unsetRelation({
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
export const unsetRelation = ({
  id,
  fromSpace,
  fromVersion,
  toSpace,
  toVersion,
  position,
  verified,
}: UnsetRelationParams) => {
  const op: UnsetRelationOp = {
    type: 'UNSET_RELATION',
    id,
    fromSpace,
    fromVersion,
    toSpace,
    toVersion,
    position,
    verified,
  };

  return { id, ops: [op] };
};
