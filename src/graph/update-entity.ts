import { DESCRIPTION_PROPERTY, NAME_PROPERTY } from '../core/ids/system.js';
import { Id } from '../id.js';
import { assertValid } from '../id-utils.js';
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
 *   values: [
 *     {
 *       property: propertyId,
 *       value: 'value of the property',
 *     }
 *   ]
 *   },
 * });
 * ```
 * @param params – {@link UpdateEntityParams}
 * @returns – {@link CreateResult}
 * @throws Will throw an error if any provided ID is invalid
 */
export const updateEntity = ({ id, name, description, values }: UpdateEntityParams): CreateResult => {
  assertValid(id, '`id` in `updateEntity`');
  for (const valueEntry of values ?? []) {
    assertValid(valueEntry.property, '`values` in `updateEntity`');
    // Validate IDs in typed values
    if (valueEntry.type === 'text' && valueEntry.language) {
      assertValid(valueEntry.language, '`language` in `values` in `updateEntity`');
    }
    if (valueEntry.type === 'float64' && valueEntry.unit) {
      assertValid(valueEntry.unit, '`unit` in `values` in `updateEntity`');
    }
  }
  const ops: Array<Op> = [];

  const newValues: Array<Value> = [];
  if (name) {
    newValues.push({
      property: NAME_PROPERTY,
      type: 'text',
      value: name,
    });
  }
  if (description) {
    newValues.push({
      property: DESCRIPTION_PROPERTY,
      type: 'text',
      value: description,
    });
  }
  for (const valueEntry of values ?? []) {
    // Build normalized Value based on the type
    const normalizedProperty = Id(valueEntry.property);

    if (valueEntry.type === 'text') {
      newValues.push({
        property: normalizedProperty,
        type: 'text',
        value: valueEntry.value,
        language: valueEntry.language ? Id(valueEntry.language) : undefined,
      });
    } else if (valueEntry.type === 'float64') {
      newValues.push({
        property: normalizedProperty,
        type: 'float64',
        value: valueEntry.value,
        unit: valueEntry.unit ? Id(valueEntry.unit) : undefined,
      });
    } else if (valueEntry.type === 'bool') {
      newValues.push({
        property: normalizedProperty,
        type: 'bool',
        value: valueEntry.value,
      });
    } else if (valueEntry.type === 'point') {
      newValues.push({
        property: normalizedProperty,
        type: 'point',
        lon: valueEntry.lon,
        lat: valueEntry.lat,
        alt: valueEntry.alt,
      });
    } else if (valueEntry.type === 'date') {
      newValues.push({
        property: normalizedProperty,
        type: 'date',
        value: valueEntry.value,
      });
    } else if (valueEntry.type === 'time') {
      newValues.push({
        property: normalizedProperty,
        type: 'time',
        value: valueEntry.value,
      });
    } else if (valueEntry.type === 'datetime') {
      newValues.push({
        property: normalizedProperty,
        type: 'datetime',
        value: valueEntry.value,
      });
    } else if (valueEntry.type === 'schedule') {
      newValues.push({
        property: normalizedProperty,
        type: 'schedule',
        value: valueEntry.value,
      });
    } else {
      // Exhaustive check - this will cause a TypeScript error if a new type is added
      // to TypedValue but not handled here
      const exhaustiveCheck: never = valueEntry;
      throw new Error(`Unsupported value type: ${(exhaustiveCheck as { type: string }).type}`);
    }
  }

  const op: UpdateEntityOp = {
    type: 'UPDATE_ENTITY',
    entity: {
      id: Id(id),
      values: newValues,
    },
  };
  ops.push(op);

  return { id: Id(id), ops };
};
