import { createRelation as grcCreateRelation, type Op } from '@geoprotocol/grc-20';
import {
  BOOLEAN,
  BYTES,
  DATA_TYPE,
  DATE,
  DATETIME,
  DECIMAL,
  EMBEDDING,
  FLOAT64,
  INT64,
  POINT,
  PROPERTY,
  RELATION_VALUE_RELATIONSHIP_TYPE,
  SCHEDULE,
  TEXT,
  TIME,
  TYPES_PROPERTY,
} from '../core/ids/system.js';
import { Id } from '../id.js';
import { assertValid, generate, toGrcId } from '../id-utils.js';
import type { CreatePropertyParams, CreateResult, ValueDataType } from '../types.js';
import { createEntity } from './create-entity.js';
import { createRelation } from './create-relation.js';

const VALUE_DATA_TYPE_TO_ID: Record<ValueDataType, Id> = {
  BOOLEAN,
  INT64,
  FLOAT64,
  DECIMAL,
  TEXT,
  BYTES,
  DATE,
  TIME,
  DATETIME,
  SCHEDULE,
  POINT,
  EMBEDDING,
};

/**
 * Creates a property with the given name, description, cover, and dataType.
 * All IDs passed to this function (cover, relation value types, properties) are validated.
 * If any invalid ID is provided, the function will throw an error.
 *
 * @example
 * ```ts
 * const { id, ops } = createProperty({
 *   id: propertyId, // optional and will be generated if not provided
 *   dataType: 'TEXT',
 *   name: 'name of the property', // optional
 *   description: 'description of the property', // optional
 *   cover: imageEntityId, // optional
 *   properties: [propertyId1, propertyId2], // optional
 *   relationValueTypes: [relationValueTypeId1, relationValueTypeId2], // optional
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
  if (params.dataType === 'RELATION') {
    for (const propertyId of params.properties ?? []) {
      assertValid(propertyId, '`properties` in `createProperty`');
    }
    for (const relationValueTypeId of params.relationValueTypes ?? []) {
      assertValid(relationValueTypeId, '`relationValueTypes` in `createProperty`');
    }
  }
  const entityId = id ?? generate();

  const ops: Array<Op> = [];

  // Create the property entity
  const { ops: entityOps } = createEntity({
    id: entityId,
    name,
    description,
    cover,
  });
  ops.push(...entityOps);

  // add "Property" as "Types property"
  ops.push(
    grcCreateRelation({
      id: toGrcId(generate()),
      entity: toGrcId(generate()),
      from: toGrcId(entityId),
      to: toGrcId(PROPERTY),
      relationType: toGrcId(TYPES_PROPERTY),
    }),
  );

  if (params.dataType === 'RELATION') {
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
    // add the data type relation for value types
    const dataTypeId = VALUE_DATA_TYPE_TO_ID[params.dataType];
    const { ops: relationOps } = createRelation({
      fromEntity: entityId,
      toEntity: dataTypeId,
      type: DATA_TYPE,
    });
    ops.push(...relationOps);
  }

  return { id: Id(entityId), ops };
};
