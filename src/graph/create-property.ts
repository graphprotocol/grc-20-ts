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
import { Id, assertValid, generate, toBase64 } from '../id.js';
import type { CreatePropertyParams, CreateResult } from '../types.js';
import { createEntity } from './create-entity.js';
import { createRelation } from './create-relation.js';

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
  if (cover) assertValid(cover, '`cover` in `createProperty`');
  if (params.type === 'RELATION') {
    for (const propertyId of params.properties ?? []) {
      assertValid(propertyId, '`properties` in `createProperty`');
    }
    for (const relationValueTypeId of params.relationValueTypes ?? []) {
      assertValid(relationValueTypeId, '`relationValueTypes` in `createProperty`');
    }
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
      id: toBase64(generate()),
      entity: toBase64(generate()),
      fromEntity: toBase64(Id(entityId)),
      toEntity: toBase64(PROPERTY),
      type: toBase64(TYPES_PROPERTY),
    },
  });

  // add "Type" as "Types property"
  ops.push({
    type: 'CREATE_RELATION',
    relation: {
      id: toBase64(generate()),
      entity: toBase64(generate()),
      fromEntity: toBase64(Id(entityId)),
      toEntity: toBase64(SCHEMA_TYPE),
      type: toBase64(TYPES_PROPERTY),
    },
  });

  if (params.type === 'RELATION') {
    const { ops: valueTypeRelationOps } = createRelation({
      toEntity: RELATION,
      fromEntity: entityId,
      type: VALUE_TYPE_PROPERTY,
    });
    ops.push(...valueTypeRelationOps);

    // add the provided properties to property "Properties"
    if (params.properties) {
      for (const propertyId of params.properties) {
        assertValid(propertyId);
        const { ops: relationOps } = createRelation({
          fromEntity: entityId,
          toEntity: propertyId,
          type: PROPERTY,
        });
        ops.push(...relationOps);
      }
    }
    if (params.relationValueTypes) {
      // add the provided relation value types to property "Relation Value Types"
      for (const relationValueTypeId of params.relationValueTypes) {
        assertValid(relationValueTypeId);
        const { ops: relationOps } = createRelation({
          fromEntity: entityId,
          toEntity: relationValueTypeId,
          type: RELATION_VALUE_RELATIONSHIP_TYPE,
        });
        ops.push(...relationOps);
      }
    }
  } else {
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
        // @ts-expect-error
        throw new Error(`Unsupported type: ${params.type}`);
    }

    // add the provided type to property "Value Types"
    ops.push({
      type: 'CREATE_RELATION',
      relation: {
        id: toBase64(generate()),
        entity: toBase64(generate()),
        fromEntity: toBase64(Id(entityId)),
        toEntity: toBase64(toId),
        type: toBase64(VALUE_TYPE_PROPERTY),
      },
    });
  }

  return { id: Id(entityId), ops };
};
