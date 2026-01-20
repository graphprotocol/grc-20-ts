import type { CreateRelation, Op as GrcOp } from '@geoprotocol/grc-20';
import { describe, expect, it } from 'vitest';
import { CLAIM_TYPE, NEWS_STORY_TYPE } from '../core/ids/content.js';
import { NAME_PROPERTY } from '../core/ids/system.js';
import { Id } from '../id.js';
import { createRelation } from './create-relation.js';

const isCreateRelationOp = (op: GrcOp): op is CreateRelation => {
  return op.type === 'createRelation';
};

describe('createRelation', () => {
  const fromEntityId = Id('30145d36d5a54244be593d111d879ba5');
  const toEntityId = Id('b1dc6e5c63e143bab3d4755b251a4ea1');
  const coverId = Id('fa269fd3de9849cf90c44235d905a67c');
  const testSpaceId = Id('c1dc6e5c63e143bab3d4755b251a4ea2');
  const fromSpaceId = Id('d1dc6e5c63e143bab3d4755b251a4ea3');
  const fromVersionId = Id('e1dc6e5c63e143bab3d4755b251a4ea4');
  const toVersionId = Id('f1dc6e5c63e143bab3d4755b251a4ea5');

  it('creates a basic relation without additional properties', async () => {
    const relation = createRelation({
      fromEntity: fromEntityId,
      toEntity: toEntityId,
      type: NAME_PROPERTY,
    });

    expect(relation).toBeDefined();
    expect(typeof relation.id).toBe('string');
    expect(relation.ops).toBeDefined();
    expect(relation.ops).toHaveLength(1); // One createRelation op
    expect(relation.ops[0]?.type).toBe('createRelation');
    if (relation.ops[0]) {
      expect(isCreateRelationOp(relation.ops[0])).toBe(true);
    }
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
    expect(relation.ops[0]?.type).toBe('createRelation');
  });

  it('creates a relation with fromSpace, fromVersion, and toVersion', async () => {
    const relation = createRelation({
      fromEntity: fromEntityId,
      toEntity: toEntityId,
      type: NAME_PROPERTY,
      fromSpace: fromSpaceId,
      fromVersion: fromVersionId,
      toVersion: toVersionId,
    });

    expect(relation).toBeDefined();
    expect(relation.ops).toHaveLength(1);
    expect(relation.ops[0]?.type).toBe('createRelation');
  });

  it('creates a relation with all optional fields', async () => {
    const relation = createRelation({
      fromEntity: fromEntityId,
      toEntity: toEntityId,
      type: NAME_PROPERTY,
      position: '1',
      fromSpace: fromSpaceId,
      toSpace: testSpaceId,
      fromVersion: fromVersionId,
      toVersion: toVersionId,
    });

    expect(relation).toBeDefined();
    expect(relation.ops).toHaveLength(1);
    expect(relation.ops[0]?.type).toBe('createRelation');
  });

  it('creates a relation with a provided id', async () => {
    const providedId = Id('c1dc6e5c63e143bab3d4755b251a4ea1');
    const relation = createRelation({
      id: providedId,
      fromEntity: fromEntityId,
      toEntity: toEntityId,
      type: NAME_PROPERTY,
    });

    expect(relation).toBeDefined();
    expect(relation.id).toBe(providedId);
    expect(relation.ops).toHaveLength(1);
    expect(relation.ops[0]?.type).toBe('createRelation');
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
    expect(relation.ops).toHaveLength(2); // createRelation + createEntity

    // Check createRelation op
    expect(relation.ops[0]?.type).toBe('createRelation');

    // Check createEntity op
    expect(relation.ops[1]?.type).toBe('createEntity');
  });

  it('creates a relation with an entity that has types', async () => {
    const relation = createRelation({
      fromEntity: fromEntityId,
      toEntity: toEntityId,
      type: NAME_PROPERTY,
      entityTypes: [CLAIM_TYPE, NEWS_STORY_TYPE],
    });

    expect(relation).toBeDefined();
    expect(relation.ops).toHaveLength(4); // createRelation + createEntity + two type relations

    // Check createRelation op
    expect(relation.ops[0]?.type).toBe('createRelation');

    // Check createEntity op
    expect(relation.ops[1]?.type).toBe('createEntity');

    // Check type relations
    expect(relation.ops[2]?.type).toBe('createRelation');
    expect(relation.ops[3]?.type).toBe('createRelation');
  });

  it('creates a relation with an entity that has a cover', async () => {
    const relation = createRelation({
      fromEntity: fromEntityId,
      toEntity: toEntityId,
      type: NAME_PROPERTY,
      entityCover: coverId,
    });

    expect(relation).toBeDefined();
    expect(relation.ops).toHaveLength(3); // createRelation + createEntity + cover relation

    // Check createRelation op
    expect(relation.ops[0]?.type).toBe('createRelation');

    // Check createEntity op
    expect(relation.ops[1]?.type).toBe('createEntity');

    // Check cover relation
    expect(relation.ops[2]?.type).toBe('createRelation');
  });

  it('throws an error if the provided id is invalid', () => {
    expect(() =>
      createRelation({
        id: 'invalid',
        fromEntity: fromEntityId,
        toEntity: toEntityId,
        type: NAME_PROPERTY,
      }),
    ).toThrow('Invalid id: "invalid" for `id` in `createRelation`');
  });

  it('throws an error if fromSpace is invalid', () => {
    expect(() =>
      createRelation({
        fromEntity: fromEntityId,
        toEntity: toEntityId,
        type: NAME_PROPERTY,
        fromSpace: 'invalid',
      }),
    ).toThrow('Invalid id: "invalid" for `fromSpace` in `createRelation`');
  });

  it('throws an error if fromVersion is invalid', () => {
    expect(() =>
      createRelation({
        fromEntity: fromEntityId,
        toEntity: toEntityId,
        type: NAME_PROPERTY,
        fromVersion: 'invalid',
      }),
    ).toThrow('Invalid id: "invalid" for `fromVersion` in `createRelation`');
  });

  it('throws an error if toVersion is invalid', () => {
    expect(() =>
      createRelation({
        fromEntity: fromEntityId,
        toEntity: toEntityId,
        type: NAME_PROPERTY,
        toVersion: 'invalid',
      }),
    ).toThrow('Invalid id: "invalid" for `toVersion` in `createRelation`');
  });

  it('creates a relation with entityValues', () => {
    const customPropertyId = Id('fa269fd3de9849cf90c44235d905a67c');
    const relation = createRelation({
      fromEntity: fromEntityId,
      toEntity: toEntityId,
      type: NAME_PROPERTY,
      entityValues: [{ property: customPropertyId, type: 'text', value: 'custom value' }],
    });

    expect(relation).toBeDefined();
    expect(relation.ops).toHaveLength(2); // createRelation + createEntity

    // Check createRelation op
    expect(relation.ops[0]?.type).toBe('createRelation');

    // Check createEntity op
    expect(relation.ops[1]?.type).toBe('createEntity');
  });

  it('creates a relation with entityValues that have language', () => {
    const customPropertyId = Id('fa269fd3de9849cf90c44235d905a67c');
    const languageId = Id('0a4e9810f78f429ea4ceb1904a43251d');
    const relation = createRelation({
      fromEntity: fromEntityId,
      toEntity: toEntityId,
      type: NAME_PROPERTY,
      entityValues: [
        {
          property: customPropertyId,
          type: 'text',
          value: 'test',
          language: languageId,
        },
      ],
    });

    expect(relation).toBeDefined();
    expect(relation.ops).toHaveLength(2); // createRelation + createEntity

    // Check createRelation op
    expect(relation.ops[0]?.type).toBe('createRelation');

    // Check createEntity op
    expect(relation.ops[1]?.type).toBe('createEntity');
  });

  it('throws an error if entityValues property is invalid', () => {
    expect(() =>
      createRelation({
        fromEntity: fromEntityId,
        toEntity: toEntityId,
        type: NAME_PROPERTY,
        entityValues: [{ property: 'invalid', type: 'text', value: 'test' }],
      }),
    ).toThrow('Invalid id: "invalid" for `entityValues` in `createRelation`');
  });
});
