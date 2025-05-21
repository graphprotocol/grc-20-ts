import type { UnsetEntityPropertiesParams, UnsetPropertiesOp } from '../typesv2.js';

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
 * @param params – {@link UnsetEntityPropertiesParams}
 * @returns The operation to unset the properties.
 */
export const unsetEntityValues = ({ id, properties }: UnsetEntityPropertiesParams) => {
  const op: UnsetPropertiesOp = {
    type: 'UNSET_ENTITY_VALUES',
    entity: id,
    properties,
  };

  return { id, ops: [op] };
};
