import { COVER_PROPERTY, DESCRIPTION_PROPERTY, NAME_PROPERTY } from '../core/ids/system.js';
import { Id, assertValid, generate, toBase64 } from '../id.js';
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
  const ops: Array<Op> = [];

  const newValues: Array<Value> = [];
  if (name) {
    newValues.push({
      propertyId: toBase64(NAME_PROPERTY),
      value: name,
    });
  }
  if (description) {
    newValues.push({
      propertyId: toBase64(DESCRIPTION_PROPERTY),
      value: description,
    });
  }
  for (const [key, value] of Object.entries(values ?? {})) {
    newValues.push({
      propertyId: toBase64(Id(key)),
      value: value.value,
    });
  }

  const op: UpdateEntityOp = {
    type: 'UPDATE_ENTITY',
    entity: {
      id: toBase64(Id(id)),
      values: newValues,
    },
  };
  ops.push(op);

  if (cover) {
    assertValid(cover);
    ops.push({
      type: 'CREATE_RELATION',
      relation: {
        id: toBase64(generate()),
        entity: toBase64(generate()),
        fromEntity: toBase64(Id(id)),
        toEntity: toBase64(Id(cover)),
        type: toBase64(COVER_PROPERTY),
      },
    });
  }

  return { id, ops };
};
