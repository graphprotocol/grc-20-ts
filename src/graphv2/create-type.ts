import { PROPERTY, SCHEMA_TYPE, TYPES_PROPERTY } from '../core/idsv2/system.js';
import { assertValid, generate, toBase64 } from '../idv2.js';
import type { CreateResult, CreateTypeParams } from '../typesv2.js';
import { createEntity } from './create-entity.js';

/**
 * Creates a type with the given name, description, cover and properties.
 * All IDs passed to this function (cover, property IDs) are validated.
 * If any invalid ID is provided, the function will throw an error.
 *
 * @example
 * ```ts
 * const { id, ops } = createType({
 *   name: 'name of the type',
 *   description: 'description of the type',
 *   cover: imageEntityId,
 *   id: typeId, // optional and will be generated if not provided
 *   properties: [propertyEntityId1, propertyEntityId2],
 * });
 * ```
 * @param params – {@link CreateTypeParams}
 * @returns – {@link CreateResult}
 * @throws Will throw an error if any provided ID is invalid
 */
export const createType = ({
  id: providedId,
  name,
  description,
  cover,
  properties,
}: CreateTypeParams): CreateResult => {
  if (providedId) {
    assertValid(providedId, '`id` in `createType`');
  }
  const id = providedId ?? generate();

  const { ops } = createEntity({
    id,
    name,
    description,
    cover,
  });

  // set property "Types" to "Type"
  assertValid(id);
  ops.push({
    type: 'CREATE_RELATION',
    relation: {
      id: toBase64(generate()),
      entity: toBase64(generate()),
      fromEntity: toBase64(id),
      toEntity: toBase64(SCHEMA_TYPE),
      type: toBase64(TYPES_PROPERTY),
    },
  });

  if (properties) {
    for (const propertyId of properties) {
      assertValid(propertyId);
      TYPES_PROPERTY;
      ops.push({
        type: 'CREATE_RELATION',
        relation: {
          id: toBase64(generate()),
          entity: toBase64(generate()),
          fromEntity: toBase64(id),
          toEntity: toBase64(propertyId),
          type: toBase64(PROPERTY),
        },
      });
    }
  }

  return { id, ops };
};
