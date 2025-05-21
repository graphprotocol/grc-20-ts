import type { Id } from '../idv2.js';
import type { UnsetRelationOp } from '../typesv2.js';

type UnsetRelationParams = {
  id: Id;
  fromSpace?: boolean;
  fromVersion?: boolean;
  toSpace?: boolean;
  toVersion?: boolean;
  position?: boolean;
  verified?: boolean;
};

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
export const unsetRelation = async ({
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
