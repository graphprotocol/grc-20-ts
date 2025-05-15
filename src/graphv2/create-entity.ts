import { COVER_PROPERTY, DESCRIPTION_PROPERTY, NAME_PROPERTY, TYPES_PROPERTY } from '../core/idsv2/system.js';
import { assertValid, generate } from '../idv2.js';
import type {
  CreateEntityOp,
  CreateResult,
  DefaultProperties,
  Op,
  PropertiesParam,
  RelationsParam,
  Value,
} from '../typesv2.js';

type CreateEntityParams = DefaultProperties & {
  properties?: PropertiesParam;
  relations?: RelationsParam;
  types?: Array<string>;
};

/**
 * @param params – {@link CreateEntityParams}
 * @returns – {@link CreateResult}
 * @throws Will throw an error if any provided ID is invalid
 */
export const createEntity = ({
  id: providedId,
  name,
  description,
  cover,
  properties,
  relations,
  types,
}: CreateEntityParams): CreateResult => {
  if (providedId) {
    assertValid(providedId, '`id` in `createEntity`');
  }
  const id = providedId ?? generate();
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
  if (cover) {
    newValues.push({
      propertyId: COVER_PROPERTY,
      value: cover,
    });
  }
  for (const [key, value] of Object.entries(properties ?? {})) {
    newValues.push({
      propertyId: key,
      value: value.value,
    });
  }

  const op: CreateEntityOp = {
    type: 'CREATE_ENTITY',
    entity: {
      id,
      values: newValues,
    },
  };
  ops.push(op);

  if (types) {
    for (const typeId of types) {
      assertValid(typeId);
      ops.push({
        type: 'CREATE_RELATION',
        relation: {
          id: generate(),
          fromEntity: id,
          toEntity: typeId,
          type: TYPES_PROPERTY,
        },
      });
    }
  }

  for (const [typeId, value] of Object.entries(relations ?? {})) {
    if (Array.isArray(value)) {
      for (const relation of value) {
        const relationId = relation.relationId ?? generate();
        assertValid(relationId);
        ops.push({
          type: 'CREATE_RELATION',
          relation: {
            id: relationId,
            fromEntity: id,
            toEntity: relation.to,
            index: relation.position,
            type: typeId,
          },
        });
      }
    } else {
      const relationId = value.relationId ?? generate();
      assertValid(relationId);
      ops.push({
        type: 'CREATE_RELATION',
        relation: {
          id: relationId,
          fromEntity: id,
          toEntity: value.to,
          index: value.position,
          type: typeId,
        },
      });
    }
  }

  return { id, ops };
};
