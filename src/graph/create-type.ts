import { createRelation as grcCreateRelation, type Op } from '@geoprotocol/grc-20';
import { PROPERTIES, SCHEMA_TYPE, TYPES_PROPERTY } from '../core/ids/system.js';
import { Id } from '../id.js';
import { assertValid, generate, toGrcId } from '../id-utils.js';
import type { CreateResult, CreateTypeParams } from '../types.js';
import { createEntity } from './create-entity.js';

/**
 * Creates a type with the given name, description, cover and properties.
 * All IDs passed to this function (cover, property IDs) are validated.
 * If any invalid ID is provided, the function will throw an error.
 *
 * @example
 * ```ts
 * const { id, ops } = createType({
 *   id: typeId, // optional and will be generated if not provided
 *   name: 'name of the type',
 *   description: 'description of the type',
 *   cover: imageEntityId,
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
  for (const propertyId of properties ?? []) {
    assertValid(propertyId, '`properties` in `createType`');
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
  (ops as Op[]).push(
    grcCreateRelation({
      id: toGrcId(generate()),
      entity: toGrcId(generate()),
      from: toGrcId(id),
      to: toGrcId(SCHEMA_TYPE),
      relationType: toGrcId(TYPES_PROPERTY),
    }),
  );

  if (properties) {
    for (const propertyId of properties) {
      assertValid(propertyId, '`propertyId` in `createType`');
      // Set Properties on the Type
      (ops as Op[]).push(
        grcCreateRelation({
          id: toGrcId(generate()),
          entity: toGrcId(generate()),
          from: toGrcId(id),
          to: toGrcId(propertyId),
          relationType: toGrcId(PROPERTIES),
        }),
      );
    }
  }

  return { id: Id(id), ops };
};
