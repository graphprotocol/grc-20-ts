import { PROPERTY, SCHEMA_TYPE, TYPES_PROPERTY } from '../core/ids/system.js';
import { type Id, assertValid, generate } from '../id.js';
import { Relation } from '../relation.js';
import type { CreateRelationOp, CreateResult, DefaultProperties, Op } from '../types.js';
import { createDefaultProperties } from './helpers/create-default-properties.js';
type CreateTypeParams = DefaultProperties & {
  properties?: Array<Id>;
};

/**
 * Creates a type with the given name, description, cover, and properties.
 * All IDs passed to this function (cover, property IDs) are validated.
 * If any invalid ID is provided, the function will throw an error.
 *
 * @example
 * ```ts
 * const { id, ops } = createType({
 *   name: 'name of the type',
 *   description: 'description of the type',
 *   cover: imageEntityId,
 *   id: typeId, // optional and will be generated if not provided
 *   properties: [propertyEntityId1, propertyEntityId2],
 * });
 * ```
 * @param params – {@link CreateTypeParams}
 * @returns – {@link CreateResult}
 * @throws Will throw an error if any provided ID is invalid
 */
export const createType = ({ id: providedId, name, description, cover, properties }: CreateTypeParams): CreateResult => {
  const id = providedId ?? generate();
  const ops: Op[] = [];

  ops.push(...createDefaultProperties({ entityId: id, name, description, cover }));

  // set property "Types" to "Type"
  assertValid(id);
  const relationOp = Relation.make({
    fromId: id,
    relationTypeId: TYPES_PROPERTY,
    toId: SCHEMA_TYPE,
  });
  ops.push(relationOp);

  if (properties) {
    for (const propertyId of properties) {
      assertValid(propertyId);
      const relationOp: CreateRelationOp = Relation.make({
        fromId: id,
        relationTypeId: PROPERTY,
        toId: propertyId,
      });
      ops.push(relationOp);
    }
  }

  return { id, ops };
};
