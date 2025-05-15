import type { Id } from '../idv2.js';
import type { UnsetPropertiesOp } from '../typesv2.js';

/**
 * Removes properties from an entity.
 *
 * @example
 * ```ts
 * const { ops } = await removeEntityProperties({
 *   id: entityId,
 *   properties: [propertyId1, propertyId2],
 * });
 * ```
 *
 * @param id - The id of the entity.
 * @param properties - The property IDs to remove.
 * @returns The operation to unset the properties.
 */
export const removeEntityProperties = async ({ id, properties }: { id: Id; properties: Id[] }) => {
  const op: UnsetPropertiesOp = {
    type: 'UNSET_PROPERTIES',
    entity: id,
    properties,
  };

  return { id, ops: [op] };
};
