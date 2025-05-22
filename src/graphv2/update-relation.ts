import { assertValid, toBase64 } from '../idv2.js';
import type { CreateResult, Op, UpdateRelationParams } from '../typesv2.js';

/**
 * Updates a relation.
 *
 * @example
 * ```ts
 * const { id, ops } = updateRelation({
 *   id: relationId,
 *   position: 'position of the relation',
 *   toSpace: 'id of the to space',
 *   fromVersion: 'id of the from version',
 *   toVersion: 'id of the to version',
 *   verified: true,
 * });
 * ```
 * @param params – {@link UpdateRelationParams}
 * @returns – {@link CreateResult}
 * @throws Will throw an error if any provided ID is invalid
 */
export const updateRelation = ({
  id,
  position,
  fromSpace,
  toSpace,
  fromVersion,
  toVersion,
  verified,
}: UpdateRelationParams): CreateResult => {
  assertValid(id, '`id` in `updateRelation`');

  const ops: Array<Op> = [];

  ops.push({
    type: 'UPDATE_RELATION',
    relation: {
      id: toBase64(id),
      position,
      fromSpace: fromSpace ? toBase64(fromSpace) : undefined,
      toSpace: toSpace ? toBase64(toSpace) : undefined,
      fromVersion: fromVersion ? toBase64(fromVersion) : undefined,
      toVersion: toVersion ? toBase64(toVersion) : undefined,
      verified,
    },
  });

  return { id, ops };
};
