import { Id, toBase64 } from '../idv2.js';
import type { UnsetEntityValuesOp, UnsetEntityValuesParams } from '../typesv2.js';

/**
 * Unsets properties from an entity.
 *
 * @example
 * ```ts
 * const { ops } = await unsetEntityValues({
 *   id: entityId,
 *   properties: [propertyId1, propertyId2],
 * });
 * ```
 *
 * @param params – {@link UnsetEntityValuesParams}
 * @returns The operation to unset the properties.
 */
export const unsetEntityValues = ({ id, properties }: UnsetEntityValuesParams) => {
  const op: UnsetEntityValuesOp = {
    type: 'UNSET_ENTITY_VALUES',
    unsetEntityValues: {
      id: toBase64(Id(id)),
      properties: properties.map(propertyId => toBase64(Id(propertyId))),
    },
  };

  return { id, ops: [op] };
};
