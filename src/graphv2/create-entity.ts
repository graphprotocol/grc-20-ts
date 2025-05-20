import { COVER_PROPERTY, DESCRIPTION_PROPERTY, NAME_PROPERTY, TYPES_PROPERTY } from '../core/idsv2/system.js';
import { Id, assertValid, generate } from '../idv2.js';
import type { CreateEntityOp, CreateResult, EntityParams, Op, Value } from '../typesv2.js';
import { createRelation } from './create-relation.js';

/**
 * Creates an entity with the given name, description, cover, properties, and types.
 * All IDs passed to this function (cover, types, property IDs, relation IDs, etc.) are validated.
 * If any invalid ID is provided, the function will throw an error.
 *
 * @example
 * ```ts
 * const { id, ops } = createEntity({
 *   id: entityId, // optional and will be generated if not provided
 *   name: 'name of the entity',
 *   description: 'description of the entity',
 *   cover: imageEntityId,
 *   types: [typeEntityId1, typeEntityId2],
 *   values: {
 *     // value property like text, number, url, time, point, checkbox
 *     [propertyId]: {
 *       value: 'value of the property',
 *     }
 *   },
 *   relations: {
 *     [relationId]: {
 *       to: 'id of the entity',
 *       id: 'id of the relation', // optional
 *       fromProperty: 'id of the from property', // optional
 *       toSpace: 'id of the to space', // optional
 *       position: positionString, // optional
 *       entityId: 'id of the relation entity', // optional and will be generated if not provided
 *       entityName: 'name of the relation entity', // optional
 *       entityDescription: 'description of the relation entity', // optional
 *       entityCover: 'id of the cover', // optional
 *       entityValues: { // optional values for the relation entity
 *         [propertyId]: {
 *           value: 'value of the property',
 *         },
 *       },
 *       entityRelations: {
 *         [relationId]: {
 *           to: 'id of the entity',
 *           id: 'id of the relation', // optional
 *           position: positionString, // optional
 *         },
 *       },
 *     },
 *   },
 * });
 * ```
 * @param params – {@link EntityParams}
 * @returns – {@link CreateResult}
 * @throws Will throw an error if any provided ID is invalid
 */
export const createEntity = ({
  id: providedId,
  name,
  description,
  cover,
  values,
  relations,
  types,
}: EntityParams): CreateResult => {
  if (providedId) {
    assertValid(providedId, '`id` in `createEntity`');
  }
  const id = providedId ?? generate();
  let ops: Array<Op> = [];

  const newValues: Array<Value> = [];
  if (name) {
    newValues.push({
      propertyId: NAME_PROPERTY,
      value: name,
    });
  }
  if (description) {
    newValues.push({
      propertyId: DESCRIPTION_PROPERTY,
      value: description,
    });
  }
  for (const [key, value] of Object.entries(values ?? {})) {
    newValues.push({
      propertyId: Id(key),
      value: value.value,
    });
  }

  const op: CreateEntityOp = {
    type: 'CREATE_ENTITY',
    entity: {
      id,
      values: newValues,
    },
  };
  ops.push(op);

  if (cover) {
    assertValid(cover);
    ops.push({
      type: 'CREATE_RELATION',
      relation: {
        id: generate(),
        entity: generate(),
        fromEntity: id,
        toEntity: cover,
        type: COVER_PROPERTY,
      },
    });
  }

  if (types) {
    for (const typeId of types) {
      assertValid(typeId);
      ops.push({
        type: 'CREATE_RELATION',
        relation: {
          id: generate(),
          entity: generate(),
          fromEntity: id,
          toEntity: typeId,
          type: TYPES_PROPERTY,
        },
      });
    }
  }

  for (const [typeId, value] of Object.entries(relations ?? {})) {
    const relationsEntries = Array.isArray(value) ? value : [value];
    for (const relation of relationsEntries) {
      const relationId = relation.relationId ?? generate();
      assertValid(relationId);
      const relationEntityId = relation.id ?? generate();
      assertValid(relationEntityId);
      const { ops: relationOps } = createRelation({
        fromEntity: id,
        toEntity: relation.toEntity,
        type: Id(typeId),
        position: relation.position,
        fromProperty: relation.fromProperty,
        toSpace: relation.toSpace,
        entityId: relationEntityId,
        entityName: relation.entityName,
        entityDescription: relation.entityDescription,
        entityCover: relation.entityCover,
        entityValues: relation.entityValues,
        entityRelations: relation.entityRelations,
        entityTypes: relation.entityTypes,
      });
      ops = ops.concat(relationOps);
    }
  }

  return { id, ops };
};
