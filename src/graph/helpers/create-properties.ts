import { assertValid, generate } from '../../id.js';
import { Relation } from '../../relation.js';
import { Triple } from '../../triple.js';
import type { Op, PropertiesParam } from '../../types.js';

type CreatePropertiesParams = {
  entityId: string;
  properties: PropertiesParam;
};

export const createProperties = (params: CreatePropertiesParams) => {
  const { entityId, properties } = params;
  const ops: Op[] = [];

  for (const [attributeId, property] of Object.entries(properties)) {
    assertValid(attributeId);
    if ('type' in property) {
      const propertyTripleOp = Triple.make({
        entityId,
        attributeId,
        value: property,
      });
      ops.push(propertyTripleOp);
    } else if ('to' in property) {
      const relationId = property.relationId ?? generate();
      assertValid(relationId);
      assertValid(property.to);
      const propertyRelationOp = Relation.make({
        relationId,
        fromId: entityId,
        relationTypeId: attributeId,
        toId: property.to,
        position: property.position,
      });
      ops.push(propertyRelationOp);
      if (property.properties) {
        ops.push(...createProperties({ entityId, properties: property.properties }));
      }
    } else if (Array.isArray(property)) {
      for (const relation of property) {
        const relationId = relation.relationId ?? generate();
        assertValid(relationId);
        assertValid(relation.to);
        const propertyRelationOp = Relation.make({
          relationId,
          fromId: entityId,
          relationTypeId: attributeId,
          toId: relation.to,
        });
        ops.push(propertyRelationOp);
        if (relation.properties) {
          ops.push(...createProperties({ entityId, properties: relation.properties }));
        }
      }
    }
  }

  return ops;
};
