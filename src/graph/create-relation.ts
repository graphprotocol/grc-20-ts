import { Id } from '../id.js';
import { assertValid, generate } from '../id-utils.js';
import type { CreateResult, Op, RelationParams } from '../types.js';
import { createEntity } from './create-entity.js';

/**
 * Creates a relation.
 *
 * @example
 * ```ts
 * const { id, ops } = createRelation({
 *   id: relationId,
 *   fromEntity: entityId1,
 *   toEntity: entityId2,
 *   type: relationTypeId,
 *   toSpace: spaceId,
 *   position: 'position of the relation',
 *   entityId: entityId3, // optional and will be generated if not provided
 *   entityValues: {
 *     propertyId1: { value: 'value1' },
 *     propertyId2: { value: 'value2' },
 *   },
 *   entityRelations: {
 *     relationTypeId1: { to: entityId3, type: relationTypeId2 },
 *   },
 *   entityTypes: [typeId1, typeId2],
 *   entityName: 'name of the relation entity',
 *   entityDescription: 'description of the relation entity',
 *   entityCover: imageEntityId,
 * });
 * ```
 * @param params – {@link RelationParams}
 * @returns – {@link CreateResult}
 * @throws Will throw an error if any provided ID is invalid
 */
export const createRelation = ({
  id: providedId,
  fromEntity,
  toEntity,
  position,
  toSpace,
  type,
  entityId: providedEntityId,
  entityName,
  entityDescription,
  entityCover,
  entityValues,
  entityRelations,
  entityTypes,
}: RelationParams): CreateResult => {
  if (providedId) assertValid(providedId, '`id` in `createRelation`');
  if (fromEntity) assertValid(fromEntity, '`fromEntity` in `createRelation`');
  if (toEntity) assertValid(toEntity, '`toEntity` in `createRelation`');
  if (toSpace) assertValid(toSpace, '`toSpace` in `createRelation`');
  if (type) assertValid(type, '`type` in `createRelation`');
  if (providedEntityId) assertValid(providedEntityId, '`entityId` in `createRelation`');
  if (entityCover) assertValid(entityCover, '`entityCover` in `createRelation`');
  for (const [key] of Object.entries(entityValues ?? {})) {
    assertValid(key, '`entityValues` in `createRelation`');
  }
  for (const [key] of Object.entries(entityRelations ?? {})) {
    assertValid(key, '`entityRelations` in `createRelation`');
  }
  for (const type of entityTypes ?? []) {
    assertValid(type, '`entityTypes` in `createRelation`');
  }

  const id = providedId ?? generate();
  const entityId = providedEntityId ?? generate();

  const ops: Array<Op> = [];

  ops.push({
    type: 'CREATE_RELATION',
    relation: {
      id: Id(id),
      entity: Id(entityId),
      fromEntity: Id(fromEntity),
      position,
      toEntity: Id(toEntity),
      toSpace: toSpace ? Id(toSpace) : undefined,
      type: Id(type),
    },
  });

  if (entityName || entityDescription || entityCover || entityValues || entityRelations || entityTypes) {
    const { ops: entityOps } = createEntity({
      id: entityId,
      name: entityName,
      description: entityDescription,
      cover: entityCover,
      values: entityValues,
      relations: entityRelations,
      types: entityTypes,
    });
    ops.push(...entityOps);
  }

  return { id: Id(id), ops };
};
