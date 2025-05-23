import { COVER_PROPERTY, DESCRIPTION_PROPERTY, NAME_PROPERTY } from '../core/ids/system.js';
import { Id, assertValid, generate } from '../id.js';
import type { CreateResult, Op, UpdateEntityOp, UpdateEntityParams, Value } from '../types.js';

/**
 * Updates an entity with the given name, description, cover and properties.
 * All IDs passed to this function (cover, property IDs) are validated.
 * If any invalid ID is provided, the function will throw an error.
 *
 * @example
 * ```ts
 * const { id, ops } = updateEntity({
 *   id: entityId,
 *   name: 'name of the entity',
 *   description: 'description of the entity',
 *   cover: imageEntityId,
 *   values: {
 *     // value property like text, number, url, time, point, checkbox
 *     [propertyId]: {
 *       type: 'TEXT', // TEXT | NUMBER | URL | TIME | POINT | CHECKBOX,
 *       value: 'value of the property',
 *     }
 *   },
 * });
 * ```
 * @param params – {@link UpdateEntityParams}
 * @returns – {@link CreateResult}
 * @throws Will throw an error if any provided ID is invalid
 */
export const updateEntity = ({ id, name, description, cover, values }: UpdateEntityParams): CreateResult => {
  assertValid(id, '`id` in `updateEntity`');
  if (cover) assertValid(cover, '`cover` in `updateEntity`');
  for (const [key] of Object.entries(values ?? {})) {
    assertValid(key, '`values` in `updateEntity`');
  }
  const ops: Array<Op> = [];

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
      value,
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

  return { id: Id(id), ops };
};
