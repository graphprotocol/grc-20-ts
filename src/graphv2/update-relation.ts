import { assertValid } from '../idv2.js';
import type { CreateResult, Op, UpdateRelationParams } from '../typesv2.js';

/**
 * Updates a relation.
 *
 * @example
 * ```ts
 * const { id, ops } = updateRelation({
 *   id: relationId,
 *   position: 'position of the relation',
 *   fromProperty: 'id of the from property',
 *   toSpace: 'id of the to space',
 * });
 * ```
 * @param params – {@link UpdateRelationParams}
 * @returns – {@link CreateResult}
 * @throws Will throw an error if any provided ID is invalid
 */
export const updateRelation = ({ id, position, toSpace, fromProperty }: UpdateRelationParams): CreateResult => {
  assertValid(id, '`id` in `updateRelation`');

  const ops: Array<Op> = [];

  ops.push({
    type: 'UPDATE_RELATION',
    relation: {
      id,
      fromProperty,
      position,
      toSpace,
    },
  });

  return { id, ops };
};
