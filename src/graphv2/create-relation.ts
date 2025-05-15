import { assertValid, generate } from '../idv2.js';
import type { CreateResult, Op, RelationParams } from '../typesv2.js';
import { createEntity } from './create-entity.js';

/**
 * Creates a relation.
 *
 * @example
 * ```ts
 * const { id, ops } = createRelation({
 *   fromEntity: entityId1,
 *   toEntity: entityId2,
 *   type: relationTypeId,
 *   toSpace: spaceId,
 *   fromProperty: propertyId1,
 *   position: 'position of the relation',
 *   entityId: entityId3, // optional and will be generated if not provided
 *   entityProperties: {
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
  fromProperty,
  position,
  toSpace,
  type,
  entityId: providedEntityId,
  entityName,
  entityDescription,
  entityCover,
  entityProperties,
  entityRelations,
  entityTypes,
}: RelationParams): CreateResult => {
  if (providedId) {
    assertValid(providedId, '`id` in `createType`');
  }
  const id = providedId ?? generate();
  const entityId = providedEntityId ?? generate();

  const ops: Array<Op> = [];

  ops.push({
    type: 'CREATE_RELATION',
    relation: {
      id,
      entity: entityId,
      fromEntity,
      fromProperty,
      index: position,
      toEntity,
      toSpace,
      type,
    },
  });

  if (entityName || entityDescription || entityCover || entityProperties || entityRelations || entityTypes) {
    const { ops: entityOps } = createEntity({
      id: entityId,
      name: entityName,
      description: entityDescription,
      cover: entityCover,
      properties: entityProperties,
      relations: entityRelations,
      types: entityTypes,
    });
    ops.push(...entityOps);
  }

  return { id, ops };
};
