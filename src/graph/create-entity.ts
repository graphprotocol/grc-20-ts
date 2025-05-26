import { COVER_PROPERTY, DESCRIPTION_PROPERTY, NAME_PROPERTY, TYPES_PROPERTY } from '../core/ids/system.js';
import { Id, assertValid, generate } from '../id.js';
import type { CreateResult, EntityParams, Op, UpdateEntityOp, Value, ValueOptions } from '../types.js';
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
 *   values: [
 *     {
 *       property: propertyId,
 *       value: 'value of the property'
 *     }
 *   ],
 *   relations: {
 *     [relationPropertyId]: {
 *       to: 'id of the entity',
 *       id: 'id of the relation', // optional
 *       toSpace: 'id of the to space', // optional
 *       fromSpace: 'id of the from space', // optional
 *       fromVersion: 'id of the from version', // optional
 *       toVersion: 'id of the to version', // optional
 *       verified: true, // optional
 *       position: positionString, // optional
 *       entityId: 'id of the relation entity', // optional and will be generated if not provided
 *       entityName: 'name of the relation entity', // optional
 *       entityDescription: 'description of the relation entity', // optional
 *       entityCover: 'id of the cover', // optional
 *       entityValues: { // optional values for the relation entity
 *         [propertyId]: { value: 'value of the property' },
 *       },
 *       entityRelations: {
 *         [relationPropertyId]: {
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
  if (providedId) assertValid(providedId, '`id` in `createEntity`');
  if (cover) assertValid(cover, '`cover` in `createEntity`');
  for (const valueEntry of values ?? []) {
    assertValid(valueEntry.property, '`values` in `createEntity`');
    if (valueEntry.options) {
      const optionsParam = valueEntry.options;
      switch (optionsParam.type) {
        case 'text':
          if (optionsParam.language) {
            assertValid(optionsParam.language, '`language` in `options` in `values` in `createEntity`');
          }
          break;
        case 'number':
          break;
        case 'time':
          if (optionsParam.timezone) {
            assertValid(optionsParam.timezone, '`timezone` in `options` in `values` in `createEntity`');
          }
          break;
        default:
          // @ts-expect-error - we only support text, number, and time options
          throw new Error(`Invalid option type: ${optionsParam.type}`);
      }
    }
    // we only assert Ids one level deep for a better experience here, but multiple levels deep are
    // asserted since we use createRelation and createEntity internally
    for (const [key, relationEntry] of Object.entries(relations ?? {})) {
      assertValid(key, '`relations` in `createEntity`');
      if (Array.isArray(relationEntry)) {
        for (const relation of relationEntry) {
          assertValid(relation.toEntity, '`toEntity` in `relations` in `createEntity`');
          if (relation.toSpace) assertValid(relation.toSpace, '`toSpace` in `relations` in `createEntity`');
          if (relation.fromSpace) assertValid(relation.fromSpace, '`fromSpace` in `relations` in `createEntity`');
          if (relation.fromVersion) assertValid(relation.fromVersion, '`fromVersion` in `relations` in `createEntity`');
          if (relation.toVersion) assertValid(relation.toVersion, '`toVersion` in `relations` in `createEntity`');
          if (relation.entityId) assertValid(relation.entityId, '`entityId` in `relations` in `createEntity`');
          if (relation.entityCover) assertValid(relation.entityCover, '`entityCover` in `relations` in `createEntity`');
        }
      } else {
        assertValid(relationEntry.toEntity, '`toEntity` in `relations` in `createEntity`');
        if (relationEntry.toSpace) assertValid(relationEntry.toSpace, '`toSpace` in `relations` in `createEntity`');
        if (relationEntry.fromSpace)
          assertValid(relationEntry.fromSpace, '`fromSpace` in `relations` in `createEntity`');
        if (relationEntry.fromVersion)
          assertValid(relationEntry.fromVersion, '`fromVersion` in `relations` in `createEntity`');
        if (relationEntry.toVersion)
          assertValid(relationEntry.toVersion, '`toVersion` in `relations` in `createEntity`');
        if (relationEntry.entityId) assertValid(relationEntry.entityId, '`entityId` in `relations` in `createEntity`');
        if (relationEntry.entityCover)
          assertValid(relationEntry.entityCover, '`entityCover` in `relations` in `createEntity`');
      }
    }
  }
  for (const typeId of types ?? []) {
    assertValid(typeId, '`types` in `createEntity`');
  }

  const id = providedId ?? generate();
  let ops: Array<Op> = [];

  const newValues: Array<Value> = [];
  if (name) {
    newValues.push({
      property: NAME_PROPERTY,
      value: name,
    });
  }
  if (description) {
    newValues.push({
      property: DESCRIPTION_PROPERTY,
      value: description,
    });
  }
  for (const valueEntry of values ?? []) {
    let options: ValueOptions | undefined = undefined;
    if (valueEntry.options) {
      const optionsParam = valueEntry.options;
      switch (optionsParam.type) {
        case 'text':
          options = {
            text: {
              language: optionsParam.language,
            },
          };
          break;
        case 'number':
          options = {
            number: {
              format: optionsParam.format,
              unit: optionsParam.unit,
            },
          };
          break;
        case 'time':
          options = {
            time: {
              format: optionsParam.format,
              timezone: optionsParam.timezone,
              hasDate: optionsParam.hasDate,
              hasTime: optionsParam.hasTime,
            },
          };
          break;
      }
    }

    newValues.push({
      property: Id(valueEntry.property),
      value: valueEntry.value,
      options,
    });
  }

  const op: UpdateEntityOp = {
    type: 'UPDATE_ENTITY',
    entity: {
      id: Id(id),
      values: newValues,
    },
  };
  ops.push(op);

  if (cover) {
    ops.push({
      type: 'CREATE_RELATION',
      relation: {
        id: generate(),
        entity: generate(),
        fromEntity: Id(id),
        toEntity: Id(cover),
        type: COVER_PROPERTY,
      },
    });
  }

  if (types) {
    for (const typeId of types) {
      ops.push({
        type: 'CREATE_RELATION',
        relation: {
          id: generate(),
          entity: generate(),
          fromEntity: Id(id),
          toEntity: Id(typeId),
          type: TYPES_PROPERTY,
        },
      });
    }
  }

  for (const [typeId, value] of Object.entries(relations ?? {})) {
    const relationsEntries = Array.isArray(value) ? value : [value];
    for (const relation of relationsEntries) {
      const relationEntityId = relation.id ?? generate();
      const { ops: relationOps } = createRelation({
        fromEntity: id,
        toEntity: relation.toEntity,
        type: Id(typeId),
        position: relation.position,
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

  return { id: Id(id), ops };
};
