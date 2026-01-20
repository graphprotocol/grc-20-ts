import { updateRelation as grcUpdateRelation } from '@geoprotocol/grc-20';
import { Id } from '../id.js';
import { assertValid, toGrcId } from '../id-utils.js';
import type { CreateResult, UpdateRelationParams } from '../types.js';

/**
 * Updates a relation.
 *
 * @example
 * ```ts
 * const { id, ops } = updateRelation({
 *   id: relationId,
 *   position: 'position of the relation', // optional
 *   fromSpace: 'id of the from space', // optional
 *   toSpace: 'id of the to space', // optional
 *   fromVersion: 'id of the from version', // optional
 *   toVersion: 'id of the to version', // optional
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
}: UpdateRelationParams): CreateResult => {
  assertValid(id, '`id` in `updateRelation`');
  if (fromSpace) assertValid(fromSpace, '`fromSpace` in `updateRelation`');
  if (toSpace) assertValid(toSpace, '`toSpace` in `updateRelation`');
  if (fromVersion) assertValid(fromVersion, '`fromVersion` in `updateRelation`');
  if (toVersion) assertValid(toVersion, '`toVersion` in `updateRelation`');

  const op = grcUpdateRelation({
    id: toGrcId(id),
    ...(position !== undefined ? { position } : {}),
    ...(fromSpace ? { fromSpace: toGrcId(fromSpace) } : {}),
    ...(toSpace ? { toSpace: toGrcId(toSpace) } : {}),
    ...(fromVersion ? { fromVersion: toGrcId(fromVersion) } : {}),
    ...(toVersion ? { toVersion: toGrcId(toVersion) } : {}),
    unset: [],
  });

  return { id: Id(id), ops: [op] };
};
