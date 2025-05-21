import type { UnsetEntityPropertiesParams, UnsetPropertiesOp } from '../typesv2.js';

/**
 * Unsets properties from an entity.
 *
 * @example
 * ```ts
 * const { ops } = await unsetEntityProperties({
 *   id: entityId,
 *   properties: [propertyId1, propertyId2],
 * });
 * ```
 *
 * @param params – {@link UnsetEntityPropertiesParams}
 * @returns The operation to unset the properties.
 */
export const unsetEntityProperties = ({ id, properties }: UnsetEntityPropertiesParams) => {
  const op: UnsetPropertiesOp = {
    type: 'UNSET_PROPERTIES',
    entity: id,
    properties,
  };

  return { id, ops: [op] };
};
