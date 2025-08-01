import { Id } from '../id.js';
import { assertValid } from '../id-utils.js';
import type { CreateResult, Op, UpdateRelationParams } from '../types.js';

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
  if (fromSpace) assertValid(fromSpace, '`fromSpace` in `updateRelation`');
  if (toSpace) assertValid(toSpace, '`toSpace` in `updateRelation`');
  if (fromVersion) assertValid(fromVersion, '`fromVersion` in `updateRelation`');
  if (toVersion) assertValid(toVersion, '`toVersion` in `updateRelation`');

  const ops: Array<Op> = [];

  ops.push({
    type: 'UPDATE_RELATION',
    relation: {
      id: Id(id),
      position,
      fromSpace: fromSpace ? Id(fromSpace) : undefined,
      toSpace: toSpace ? Id(toSpace) : undefined,
      fromVersion: fromVersion ? Id(fromVersion) : undefined,
      toVersion: toVersion ? Id(toVersion) : undefined,
      verified,
    },
  });

  return { id: Id(id), ops };
};
