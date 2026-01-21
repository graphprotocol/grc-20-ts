import { createRelation as grcCreateRelation, type Op } from '@geoprotocol/grc-20';
import { Id } from '../id.js';
import { assertValid, generate, toGrcId } from '../id-utils.js';
import type { CreateResult, RelationParams } from '../types.js';
import { createEntity } from './create-entity.js';

/**
 * Creates a relation.
 *
 * @example
 * ```ts
 * const { id, ops } = createRelation({
 *   id: relationId, // optional
 *   fromEntity: entityId1,
 *   toEntity: entityId2,
 *   type: relationTypeId,
 *   fromSpace: spaceId1, // optional
 *   toSpace: spaceId2, // optional
 *   fromVersion: versionId1, // optional
 *   toVersion: versionId2, // optional
 *   position: 'position of the relation', // optional
 *   entityId: entityId3, // optional and will be generated if not provided
 *   entityValues: [ // optional
 *     { property: propertyId1, value: 'value1' },
 *     { property: propertyId2, value: 'value2' },
 *   ],
 *   entityRelations: { // optional
 *     relationTypeId1: {
 *       toEntity: entityId3,
 *       type: relationTypeId2,
 *       toSpace: spaceId3,
 *       toVersion: versionId3,
 *       position: 'position of the relation',
 *     },
 *   },
 *   entityTypes: [typeId1, typeId2], // optional
 *   entityName: 'name of the relation entity', // optional
 *   entityDescription: 'description of the relation entity', // optional
 *   entityCover: imageEntityId, // optional
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
  fromSpace,
  toSpace,
  fromVersion,
  toVersion,
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
  if (fromSpace) assertValid(fromSpace, '`fromSpace` in `createRelation`');
  if (toSpace) assertValid(toSpace, '`toSpace` in `createRelation`');
  if (fromVersion) assertValid(fromVersion, '`fromVersion` in `createRelation`');
  if (toVersion) assertValid(toVersion, '`toVersion` in `createRelation`');
  if (type) assertValid(type, '`type` in `createRelation`');
  if (providedEntityId) assertValid(providedEntityId, '`entityId` in `createRelation`');
  if (entityCover) assertValid(entityCover, '`entityCover` in `createRelation`');
  for (const valueEntry of entityValues ?? []) {
    assertValid(valueEntry.property, '`entityValues` in `createRelation`');
    // Validate IDs in typed values
    if (valueEntry.type === 'text' && valueEntry.language) {
      assertValid(valueEntry.language, '`language` in `entityValues` in `createRelation`');
    }
    if (valueEntry.type === 'float64' && valueEntry.unit) {
      assertValid(valueEntry.unit, '`unit` in `entityValues` in `createRelation`');
    }
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

  ops.push(
    grcCreateRelation({
      id: toGrcId(id),
      entity: toGrcId(entityId),
      from: toGrcId(fromEntity),
      to: toGrcId(toEntity),
      relationType: toGrcId(type),
      ...(fromSpace ? { fromSpace: toGrcId(fromSpace) } : {}),
      ...(fromVersion ? { fromVersion: toGrcId(fromVersion) } : {}),
      ...(toSpace ? { toSpace: toGrcId(toSpace) } : {}),
      ...(toVersion ? { toVersion: toGrcId(toVersion) } : {}),
      ...(position !== undefined ? { position } : {}),
    }),
  );

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
