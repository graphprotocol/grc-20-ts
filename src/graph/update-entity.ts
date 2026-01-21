import {
  type PropertyValue as GrcPropertyValue,
  createEntity as grcCreateEntity,
  languages,
  type Op,
} from '@geoprotocol/grc-20';
import { DESCRIPTION_PROPERTY, NAME_PROPERTY } from '../core/ids/system.js';
import { Id } from '../id.js';
import { assertValid, toGrcId } from '../id-utils.js';
import type { CreateResult, UpdateEntityParams } from '../types.js';

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

  const op: Op = grcCreateEntity({
    id: toGrcId(id),
    values: newValues,
  });

  return { id: Id(id), ops: [op] };
};
