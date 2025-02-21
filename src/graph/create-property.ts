import { PROPERTY, RELATION_VALUE_RELATIONSHIP_TYPE, SCHEMA_TYPE, VALUE_TYPE_PROPERTY } from '../core/ids/system.js';
import { generate } from '../id.js';
import { Relation } from '../relation.js';
import type { DefaultProperties, Op, ValueType } from '../types.js';
import { createDefaultProperties } from './helpers/create-default-properties.js';

type Params = DefaultProperties &
  ({ type: ValueType } | { type: 'RELATION'; properties?: Array<string>; relationValueTypes?: Array<string> });

/**
 * Creates a property with the given name, description, cover, and type.
 */
export const createProperty = (params: Params) => {
  const { name, description, cover } = params;
  const entityId = generate();
  const ops: Op[] = [];

  ops.push(...createDefaultProperties({ entityId, name, description, cover }));

  // add "Property" to property "Types"
  const typesRelationOp = Relation.make({
    fromId: entityId,
    relationTypeId: PROPERTY,
    toId: SCHEMA_TYPE,
  });
  ops.push(typesRelationOp);

  if (params.type === 'RELATION') {
    // add the provided properties to property "Properties"
    if (params.properties) {
      for (const propertyId of params.properties) {
        const relationOp = Relation.make({
          fromId: entityId,
          relationTypeId: PROPERTY,
          toId: propertyId,
        });
        ops.push(relationOp);
      }
    }
    if (params.relationValueTypes) {
      // add the provided relation value types to property "Relation Value Types"
      for (const relationValueTypeId of params.relationValueTypes) {
        const relationOp = Relation.make({
          fromId: entityId,
          relationTypeId: RELATION_VALUE_RELATIONSHIP_TYPE,
          toId: relationValueTypeId,
        });
        ops.push(relationOp);
      }
    }
  } else {
    // add the provided type to property "Value Types"
    const valueTypeRelationOp = Relation.make({
      fromId: entityId,
      relationTypeId: VALUE_TYPE_PROPERTY,
      toId: params.type,
    });
    ops.push(valueTypeRelationOp);
  }

  return { id: entityId, ops };
};
