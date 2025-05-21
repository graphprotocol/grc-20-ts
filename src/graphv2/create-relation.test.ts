import { describe, expect, it } from 'vitest';
import { CLAIM_TYPE, NEWS_STORY_TYPE } from '../core/idsv2/content.js';
import { COVER_PROPERTY, DESCRIPTION_PROPERTY, NAME_PROPERTY, TYPES_PROPERTY } from '../core/idsv2/system.js';
import { Id } from '../idv2.js';
import type { CreateRelationOp, Op } from '../typesv2.js';
import { createRelation } from './create-relation.js';

const isCreateRelationOp = (op: Op): op is CreateRelationOp => {
  return op.type === 'CREATE_RELATION';
};

describe('createRelation', () => {
  const fromEntityId = Id('30145d36-d5a5-4244-be59-3d111d879ba5');
  const toEntityId = Id('b1dc6e5c-63e1-43ba-b3d4-755b251a4ea1');
  const coverId = Id('fa269fd3-de98-49cf-90c4-4235d905a67c');
  const testSpaceId = Id('c1dc6e5c-63e1-43ba-b3d4-755b251a4ea2');

  it('creates a basic relation without additional properties', async () => {
    const relation = createRelation({
      fromEntity: fromEntityId,
      toEntity: toEntityId,
      type: NAME_PROPERTY,
    });

    expect(relation).toBeDefined();
    expect(typeof relation.id).toBe('string');
    expect(relation.ops).toBeDefined();
    expect(relation.ops).toHaveLength(1); // One CREATE_RELATION op
    expect(relation.ops[0]).toMatchObject({
      type: 'CREATE_RELATION',
      relation: {
        fromEntity: fromEntityId,
        toEntity: toEntityId,
        type: NAME_PROPERTY,
      },
    });
  });

  it('creates a relation with position and toSpace', async () => {
    const relation = createRelation({
      fromEntity: fromEntityId,
      toEntity: toEntityId,
      type: NAME_PROPERTY,
      position: '1',
      toSpace: testSpaceId,
    });

    expect(relation).toBeDefined();
    expect(relation.ops).toHaveLength(1);
    expect(relation.ops[0]).toMatchObject({
      type: 'CREATE_RELATION',
      relation: {
        fromEntity: fromEntityId,
        toEntity: toEntityId,
        type: NAME_PROPERTY,
        position: '1',
        toSpace: testSpaceId,
      },
    });
  });

  it('creates a relation with a provided id', async () => {
    const providedId = Id('c1dc6e5c-63e1-43ba-b3d4-755b251a4ea1');
    const relation = createRelation({
      id: providedId,
      fromEntity: fromEntityId,
      toEntity: toEntityId,
      type: NAME_PROPERTY,
    });

    expect(relation).toBeDefined();
    expect(relation.id).toBe(providedId);
    expect(relation.ops).toHaveLength(1);
    expect(relation.ops[0]).toMatchObject({
      type: 'CREATE_RELATION',
      relation: {
        id: providedId,
        fromEntity: fromEntityId,
        toEntity: toEntityId,
        type: NAME_PROPERTY,
      },
    });
  });

  it('creates a relation with an entity that has name and description', async () => {
    const relation = createRelation({
      fromEntity: fromEntityId,
      toEntity: toEntityId,
      type: NAME_PROPERTY,
      entityName: 'Test Entity',
      entityDescription: 'Test Description',
    });

    expect(relation).toBeDefined();
    expect(relation.ops).toHaveLength(2); // CREATE_RELATION + CREATE_ENTITY

    // Check CREATE_RELATION op
    expect(relation.ops[0]).toMatchObject({
      type: 'CREATE_RELATION',
      relation: {
        fromEntity: fromEntityId,
        toEntity: toEntityId,
        type: NAME_PROPERTY,
      },
    });

    // Check CREATE_ENTITY op
    const createRelationOp = relation.ops[0];
    if (!createRelationOp || !isCreateRelationOp(createRelationOp)) {
      throw new Error('Expected first op to be CREATE_RELATION');
    }
    expect(relation.ops[1]).toMatchObject({
      type: 'CREATE_ENTITY',
      entity: {
        values: [
          {
            propertyId: NAME_PROPERTY,
            value: 'Test Entity',
          },
          {
            propertyId: DESCRIPTION_PROPERTY,
            value: 'Test Description',
          },
        ],
      },
    });
  });

  it('creates a relation with an entity that has types', async () => {
    const relation = createRelation({
      fromEntity: fromEntityId,
      toEntity: toEntityId,
      type: NAME_PROPERTY,
      entityTypes: [CLAIM_TYPE, NEWS_STORY_TYPE],
    });

    expect(relation).toBeDefined();
    expect(relation.ops).toHaveLength(4); // CREATE_RELATION + CREATE_ENTITY + two type relations

    // Check CREATE_RELATION op
    expect(relation.ops[0]).toMatchObject({
      type: 'CREATE_RELATION',
      relation: {
        fromEntity: fromEntityId,
        toEntity: toEntityId,
        type: NAME_PROPERTY,
      },
    });

    // Check CREATE_ENTITY op
    const createRelationOp = relation.ops[0];
    if (!createRelationOp || !isCreateRelationOp(createRelationOp)) {
      throw new Error('Expected first op to be CREATE_RELATION');
    }
    expect(relation.ops[1]).toMatchObject({
      type: 'CREATE_ENTITY',
      entity: {
        values: [],
      },
    });

    // Check type relations
    expect(relation.ops[2]).toMatchObject({
      type: 'CREATE_RELATION',
      relation: {
        toEntity: CLAIM_TYPE,
        type: TYPES_PROPERTY,
      },
    });

    expect(relation.ops[3]).toMatchObject({
      type: 'CREATE_RELATION',
      relation: {
        toEntity: NEWS_STORY_TYPE,
        type: TYPES_PROPERTY,
      },
    });
  });

  it('creates a relation with an entity that has a cover', async () => {
    const relation = createRelation({
      fromEntity: fromEntityId,
      toEntity: toEntityId,
      type: NAME_PROPERTY,
      entityCover: coverId,
    });

    expect(relation).toBeDefined();
    expect(relation.ops).toHaveLength(3); // CREATE_RELATION + CREATE_ENTITY + cover relation

    // Check CREATE_RELATION op
    expect(relation.ops[0]).toMatchObject({
      type: 'CREATE_RELATION',
      relation: {
        fromEntity: fromEntityId,
        toEntity: toEntityId,
        type: NAME_PROPERTY,
      },
    });

    // Check CREATE_ENTITY op with cover relation
    const createRelationOp = relation.ops[0];
    if (!createRelationOp || !isCreateRelationOp(createRelationOp)) {
      throw new Error('Expected first op to be CREATE_RELATION');
    }
    expect(relation.ops[1]).toMatchObject({
      type: 'CREATE_ENTITY',
      entity: {
        values: [],
      },
    });

    // Check cover relation
    expect(relation.ops[2]).toMatchObject({
      type: 'CREATE_RELATION',
      relation: {
        toEntity: coverId,
        type: COVER_PROPERTY,
      },
    });
  });

  it('throws an error if the provided id is invalid', () => {
    expect(() =>
      createRelation({
        // @ts-expect-error - Testing invalid id type
        id: 'invalid',
        fromEntity: fromEntityId,
        toEntity: toEntityId,
        type: NAME_PROPERTY,
      }),
    ).toThrow('Invalid id: "invalid" for `id` in `createType`');
  });
});
