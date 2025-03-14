import {
  CHECKBOX,
  NUMBER,
  POINT,
  PROPERTY,
  RELATION,
  RELATION_VALUE_RELATIONSHIP_TYPE,
  SCHEMA_TYPE,
  TEXT,
  TIME,
  TYPES_PROPERTY,
  URL,
  VALUE_TYPE_PROPERTY,
} from '../core/ids/system.js';
import { assertValid, generate } from '../id.js';
import { Relation } from '../relation.js';
import type { CreateResult, DefaultProperties, Op, ValueType } from '../types.js';
import { createDefaultProperties } from './helpers/create-default-properties.js';

type CreatePropertyParams = DefaultProperties &
  ({ type: ValueType } | { type: 'RELATION'; properties?: Array<string>; relationValueTypes?: Array<string> });

/**
 * Creates a property with the given name, description, cover, and type.
 * All IDs passed to this function (cover, relation value types) are validated.
 * If any invalid ID is provided, the function will throw an error.
 *
 * @example
 * ```ts
 * const { id, ops } = createProperty({
 *   name: 'name of the property',
 *   type: 'TEXT'
 *   description: 'description of the property',
 *   cover: imageEntityId,
 *   id: propertyId, // optional and will be generated if not provided
 * });
 * ```
 * @param params – {@link CreatePropertyParams}
 * @returns – {@link CreateResult}
 * @throws Will throw an error if any provided ID is invalid
 */
export const createProperty = (params: CreatePropertyParams): CreateResult => {
  const { id, name, description, cover } = params;
  if (id) {
    assertValid(id, '`id` in `createProperty`');
  }
  const entityId = id ?? generate();
  const ops: Op[] = [];

  ops.push(...createDefaultProperties({ entityId, name, description, cover }));

  // add "Property" as "Types property"
  const typesRelationOp = Relation.make({
    fromId: entityId,
    relationTypeId: TYPES_PROPERTY,
    toId: PROPERTY,
  });
  ops.push(typesRelationOp);

  // add "Type" as "Types property"
  const typeRelationOps = Relation.make({
    fromId: entityId,
    relationTypeId: TYPES_PROPERTY,
    toId: SCHEMA_TYPE,
  });
  ops.push(typeRelationOps);

  if (params.type === 'RELATION') {
    const valueTypeRelationOp = Relation.make({
      fromId: entityId,
      relationTypeId: VALUE_TYPE_PROPERTY,
      toId: RELATION,
    });
    ops.push(valueTypeRelationOp);

    // add the provided properties to property "Properties"
    if (params.properties) {
      for (const propertyId of params.properties) {
        assertValid(propertyId);
        const relationOp = Relation.make({
          fromId: entityId,
          relationTypeId: PROPERTY,
          toId: propertyId,
        });
        ops.push(relationOp);
      }
    }
    if (params.relationValueTypes) {
      // add the provided relation value types to property "Relation Value Types"
      for (const relationValueTypeId of params.relationValueTypes) {
        assertValid(relationValueTypeId);
        const relationOp = Relation.make({
          fromId: entityId,
          relationTypeId: RELATION_VALUE_RELATIONSHIP_TYPE,
          toId: relationValueTypeId,
        });
        ops.push(relationOp);
      }
    }
  } else {
    let toId: string;
    switch (params.type) {
      case 'TEXT':
        toId = TEXT;
        break;
      case 'NUMBER':
        toId = NUMBER;
        break;
      case 'URL':
        toId = URL;
        break;
      case 'TIME':
        toId = TIME;
        break;
      case 'POINT':
        toId = POINT;
        break;
      case 'CHECKBOX':
        toId = CHECKBOX;
        break;
      default:
        // @ts-expect-error params.type is never after eliminating all other cases
        throw new Error(`Unsupported type: ${params.type}`);
    }
    // add the provided type to property "Value Types"
    const valueTypeRelationOp = Relation.make({
      fromId: entityId,
      relationTypeId: VALUE_TYPE_PROPERTY,
      toId,
    });
    ops.push(valueTypeRelationOp);
  }

  return { id: entityId, ops };
};
