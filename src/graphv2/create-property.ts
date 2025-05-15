import {
  CHECKBOX,
  NUMBER,
  POINT,
  PROPERTY,
  SCHEMA_TYPE,
  TEXT,
  TIME,
  TYPES_PROPERTY,
  URL,
  VALUE_TYPE_PROPERTY,
} from '../core/idsv2/system.js';
import type { Id } from '../idv2.js';
import { assertValid, generate } from '../idv2.js';
import type { CreateResult, DefaultProperties, ValueType } from '../typesv2.js';
import { createEntity } from './create-entity.js';

type CreatePropertyParams = DefaultProperties & { type: ValueType };

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

  const { ops } = createEntity({
    id: entityId,
    name,
    description,
    cover,
  });

  // add "Property" as "Types property"
  ops.push({
    type: 'CREATE_RELATION',
    relation: {
      id: generate(),
      entity: generate(),
      fromEntity: entityId,
      toEntity: PROPERTY,
      type: TYPES_PROPERTY,
    },
  });

  // add "Type" as "Types property"
  ops.push({
    type: 'CREATE_RELATION',
    relation: {
      id: generate(),
      entity: generate(),
      fromEntity: entityId,
      toEntity: SCHEMA_TYPE,
      type: TYPES_PROPERTY,
    },
  });

  let toId: Id;
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
      throw new Error(`Unsupported type: ${params.type}`);
  }
  // add the provided type to property "Value Types"
  ops.push({
    type: 'CREATE_RELATION',
    relation: {
      id: generate(),
      entity: generate(),
      fromEntity: entityId,
      toEntity: toId,
      type: VALUE_TYPE_PROPERTY,
    },
  });

  return { id: entityId, ops };
};
