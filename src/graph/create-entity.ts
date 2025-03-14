import { TYPES_PROPERTY } from '../core/ids/system.js';
import { assertValid, generate } from '../id.js';
import { Relation } from '../relation.js';
import type { CreateResult, DefaultProperties, Op, PropertiesParam } from '../types.js';
import { createDefaultProperties } from './helpers/create-default-properties.js';
import { createProperties } from './helpers/create-properties.js';
type CreateEntityParams = DefaultProperties & {
  properties?: PropertiesParam;
  types?: Array<string>;
};

/**
 * Creates an entity with the given name, description, cover, properties, and types.
 * All IDs passed to this function (cover, types, property IDs, relation IDs, etc.) are validated.
 * If any invalid ID is provided, the function will throw an error.
 *
 * @example
 * ```ts
 * const { id, ops } = createEntity({
 *   name: 'name of the entity',
 *   description: 'description of the entity',
 *   cover: imageEntityId,
 *   types: [typeEntityId1, typeEntityId2],
 *   id: entityId, // optional and will be generated if not provided
 *   properties: {
 *     // value property like text, number, url, time, point, checkbox
 *     [propertyId]: {
 *       type: 'TEXT', // TEXT | NUMBER | URL | TIME | POINT | CHECKBOX,
 *       value: 'value of the property',
 *     },
 *     // relation property
 *     [propertyId]: {
 *       to: 'id of the entity',
 *       relationId: 'id of the relation', // optional
 *       position: positionString, // optional
 *       properties: { // optional properties for the relation
 *         [propertyId]: {
 *           type: 'TEXT', // TEXT | NUMBER | URL | TIME | POINT | CHECKBOX,
 *           value: 'value of the property',
 *         },
 *         [propertyId]: {
 *           to: 'id of the entity',
 *         },
 *       },
 *     },
 *   },
 * });
 * ```
 * @param params – {@link CreateEntityParams}
 * @returns – {@link CreateResult}
 * @throws Will throw an error if any provided ID is invalid
 */
export const createEntity = ({ id: providedId, name, description, cover, properties, types }: CreateEntityParams): CreateResult => {
  if (providedId) {
    assertValid(providedId, '`id` in `createEntity`');
  }
  const id = providedId ?? generate();
  const ops: Array<Op> = [];

  ops.push(...createDefaultProperties({ entityId: id, name, description, cover }));

  // add property "Types" to the provided types
  if (types) {
    for (const typeId of types) {
      assertValid(typeId);
      const typeRelationOp = Relation.make({
        fromId: id,
        relationTypeId: TYPES_PROPERTY,
        toId: typeId,
      });
      ops.push(typeRelationOp);
    }
  }

  if (properties) {
    ops.push(...createProperties({ entityId: id, properties }));
  }

  return { id, ops };
};
