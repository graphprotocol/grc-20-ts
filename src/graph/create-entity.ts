import {
  type PropertyValue as GrcPropertyValue,
  createEntity as grcCreateEntity,
  createRelation as grcCreateRelation,
  languages,
  type Op,
} from '@geoprotocol/grc-20';
import { COVER_PROPERTY, DESCRIPTION_PROPERTY, NAME_PROPERTY, TYPES_PROPERTY } from '../core/ids/system.js';
import { Id } from '../id.js';
import { assertValid, generate, toGrcId } from '../id-utils.js';
import type { CreateResult, EntityParams } from '../types.js';
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
 *       toEntity: 'id of the entity',
 *       id: 'id of the relation', // optional
 *       toSpace: 'id of the to space', // optional
 *       fromSpace: 'id of the from space', // optional
 *       fromVersion: 'id of the from version', // optional
 *       toVersion: 'id of the to version', // optional
 *       position: positionString, // optional
 *       entityId: 'id of the relation entity', // optional and will be generated if not provided
 *       entityName: 'name of the relation entity', // optional
 *       entityDescription: 'description of the relation entity', // optional
 *       entityCover: 'id of the cover', // optional
 *       entityValues: [ // optional values for the relation entity
 *         { property: propertyId, value: 'value of the property' },
 *       ],
 *       entityRelations: { // same structure as `relations` and can be nested
 *         [relationPropertyId]: {
 *           toEntity: 'id of the entity',
 *           id: 'id of the relation', // optional
 *           position: positionString, // optional
 *         },
 *       },
 *       entityTypes: [typeEntityId1, typeEntityId2], // optional
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
    // Validate IDs in typed values
    if (valueEntry.type === 'text' && valueEntry.language) {
      assertValid(valueEntry.language, '`language` in `values` in `createEntity`');
    }
    if (valueEntry.type === 'float64' && valueEntry.unit) {
      assertValid(valueEntry.unit, '`unit` in `values` in `createEntity`');
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
      if (relationEntry.fromSpace) assertValid(relationEntry.fromSpace, '`fromSpace` in `relations` in `createEntity`');
      if (relationEntry.fromVersion)
        assertValid(relationEntry.fromVersion, '`fromVersion` in `relations` in `createEntity`');
      if (relationEntry.toVersion) assertValid(relationEntry.toVersion, '`toVersion` in `relations` in `createEntity`');
      if (relationEntry.entityId) assertValid(relationEntry.entityId, '`entityId` in `relations` in `createEntity`');
      if (relationEntry.entityCover)
        assertValid(relationEntry.entityCover, '`entityCover` in `relations` in `createEntity`');
    }
  }
  for (const typeId of types ?? []) {
    assertValid(typeId, '`types` in `createEntity`');
  }

  const id = providedId ?? generate();
  let ops: Array<Op> = [];

  const newValues: Array<GrcPropertyValue> = [];
  if (name) {
    newValues.push({
      property: toGrcId(NAME_PROPERTY),
      value: {
        type: 'text',
        value: name,
        language: languages.english(),
      },
    });
  }
  if (description) {
    newValues.push({
      property: toGrcId(DESCRIPTION_PROPERTY),
      value: {
        type: 'text',
        value: description,
        language: languages.english(),
      },
    });
  }
  for (const valueEntry of values ?? []) {
    const property = toGrcId(valueEntry.property);

    if (valueEntry.type === 'text') {
      newValues.push({
        property,
        value: {
          type: 'text',
          value: valueEntry.value,
          language: valueEntry.language ? toGrcId(valueEntry.language) : languages.english(),
        },
      });
    } else if (valueEntry.type === 'float64') {
      newValues.push({
        property,
        value: {
          type: 'float64',
          value: valueEntry.value,
          ...(valueEntry.unit ? { unit: toGrcId(valueEntry.unit) } : {}),
        },
      });
    } else if (valueEntry.type === 'bool') {
      newValues.push({
        property,
        value: {
          type: 'bool',
          value: valueEntry.value,
        },
      });
    } else if (valueEntry.type === 'point') {
      newValues.push({
        property,
        value: {
          type: 'point',
          lon: valueEntry.lon,
          lat: valueEntry.lat,
          ...(valueEntry.alt !== undefined ? { alt: valueEntry.alt } : {}),
        },
      });
    } else if (valueEntry.type === 'date') {
      newValues.push({
        property,
        value: {
          type: 'date',
          value: valueEntry.value,
        },
      });
    } else if (valueEntry.type === 'time') {
      newValues.push({
        property,
        value: {
          type: 'time',
          value: valueEntry.value,
        },
      });
    } else if (valueEntry.type === 'datetime') {
      newValues.push({
        property,
        value: {
          type: 'datetime',
          value: valueEntry.value,
        },
      });
    } else if (valueEntry.type === 'schedule') {
      newValues.push({
        property,
        value: {
          type: 'schedule',
          value: valueEntry.value,
        },
      });
    } else {
      // Exhaustive check - this will cause a TypeScript error if a new type is added
      // to TypedValue but not handled here
      const exhaustiveCheck: never = valueEntry;
      throw new Error(`Unsupported value type: ${(exhaustiveCheck as { type: string }).type}`);
    }
  }

  ops.push(
    grcCreateEntity({
      id: toGrcId(id),
      values: newValues,
    }),
  );

  if (cover) {
    ops.push(
      grcCreateRelation({
        id: toGrcId(generate()),
        entity: toGrcId(generate()),
        from: toGrcId(id),
        to: toGrcId(cover),
        relationType: toGrcId(COVER_PROPERTY),
      }),
    );
  }

  if (types) {
    for (const typeId of types) {
      ops.push(
        grcCreateRelation({
          id: toGrcId(generate()),
          entity: toGrcId(generate()),
          from: toGrcId(id),
          to: toGrcId(typeId),
          relationType: toGrcId(TYPES_PROPERTY),
        }),
      );
    }
  }

  for (const [typeId, value] of Object.entries(relations ?? {})) {
    const relationsEntries = Array.isArray(value) ? value : [value];
    for (const relation of relationsEntries) {
      const relationId = relation.id ?? generate();
      const relationEntityId = relation.entityId ?? generate();
      const { ops: relationOps } = createRelation({
        id: relationId,
        fromEntity: id,
        toEntity: relation.toEntity,
        type: Id(typeId),
        position: relation.position,
        fromSpace: relation.fromSpace,
        toSpace: relation.toSpace,
        fromVersion: relation.fromVersion,
        toVersion: relation.toVersion,
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
