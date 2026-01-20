import { describe, expect, it } from 'vitest';
import { CLAIM_TYPE, NEWS_STORY_TYPE } from '../core/ids/content.js';
import { COVER_PROPERTY, TYPES_PROPERTY } from '../core/ids/system.js';
import { Id } from '../id.js';
import { toGrcId } from '../id-utils.js';
import { createEntity } from './create-entity.js';

describe('createEntity', () => {
  const coverId = Id('30145d36d5a54244be593d111d879ba5');

  it('creates a basic entity without properties', () => {
    const entity = createEntity({});
    expect(entity).toBeDefined();
    expect(typeof entity.id).toBe('string');
    expect(entity.ops).toBeDefined();
    expect(entity.ops).toHaveLength(1); // One createEntity op
    expect(entity.ops[0]?.type).toBe('createEntity');
  });

  it('creates an entity with types', () => {
    const entity = createEntity({
      types: [CLAIM_TYPE, NEWS_STORY_TYPE],
    });

    expect(entity).toBeDefined();
    expect(typeof entity.id).toBe('string');
    expect(entity.ops).toHaveLength(3); // One createEntity + two createRelation ops

    // Check createEntity op
    expect(entity.ops[0]?.type).toBe('createEntity');

    // Check first type relation
    expect(entity.ops[1]).toMatchObject({
      type: 'createRelation',
      from: toGrcId(entity.id),
      to: toGrcId(CLAIM_TYPE),
      relationType: toGrcId(TYPES_PROPERTY),
    });

    // Check second type relation
    expect(entity.ops[2]).toMatchObject({
      type: 'createRelation',
      from: toGrcId(entity.id),
      to: toGrcId(NEWS_STORY_TYPE),
      relationType: toGrcId(TYPES_PROPERTY),
    });
  });

  it('creates an entity with name and description', () => {
    const entity = createEntity({
      name: 'Test Entity',
      description: 'Test Description',
    });

    expect(entity).toBeDefined();
    expect(typeof entity.id).toBe('string');
    expect(entity.ops).toHaveLength(1);

    expect(entity.ops[0]?.type).toBe('createEntity');
  });

  it('creates an entity with cover', () => {
    const entity = createEntity({
      cover: coverId,
    });

    expect(entity).toBeDefined();
    expect(typeof entity.id).toBe('string');
    expect(entity.ops).toHaveLength(2);

    // Check createEntity op
    expect(entity.ops[0]?.type).toBe('createEntity');

    // Check cover relation
    expect(entity.ops[1]).toMatchObject({
      type: 'createRelation',
      from: toGrcId(entity.id),
      to: toGrcId(coverId),
      relationType: toGrcId(COVER_PROPERTY),
    });
  });

  it('creates an entity with custom text values', () => {
    const customPropertyId = Id('fa269fd3de9849cf90c44235d905a67c');
    const entity = createEntity({
      values: [{ property: customPropertyId, type: 'text', value: 'custom value' }],
    });

    expect(entity).toBeDefined();
    expect(typeof entity.id).toBe('string');
    expect(entity.ops).toHaveLength(1);

    expect(entity.ops[0]?.type).toBe('createEntity');
  });

  it('creates an entity with a text value with language', () => {
    const entity = createEntity({
      values: [
        {
          property: '295c8bc61ae342cbb2a65b61080906ff',
          type: 'text',
          value: 'test',
          language: Id('0a4e9810f78f429ea4ceb1904a43251d'),
        },
      ],
    });

    expect(entity).toBeDefined();
    expect(typeof entity.id).toBe('string');
    expect(entity.ops).toHaveLength(1);

    expect(entity.ops[0]?.type).toBe('createEntity');
  });

  it('creates an entity with a text value in two different languages', () => {
    const entity = createEntity({
      values: [
        {
          property: '295c8bc61ae342cbb2a65b61080906ff',
          type: 'text',
          value: 'test',
          language: Id('0a4e9810f78f429ea4ceb1904a43251d'),
        },
        {
          property: '295c8bc61ae342cbb2a65b61080906ff',
          type: 'text',
          value: 'prueba',
          language: Id('dad6e52a5e944e559411cfe3a3c3ea64'),
        },
      ],
    });

    expect(entity).toBeDefined();
    expect(typeof entity.id).toBe('string');
    expect(entity.ops).toHaveLength(1);

    expect(entity.ops[0]?.type).toBe('createEntity');
  });

  it('creates an entity with a float64 value', () => {
    const entity = createEntity({
      values: [
        {
          property: '295c8bc61ae342cbb2a65b61080906ff',
          type: 'float64',
          value: 42,
        },
      ],
    });

    expect(entity).toBeDefined();
    expect(typeof entity.id).toBe('string');
    expect(entity.ops).toHaveLength(1);

    expect(entity.ops[0]?.type).toBe('createEntity');
  });

  it('creates an entity with a float64 value with unit', () => {
    const entity = createEntity({
      values: [
        {
          property: '295c8bc61ae342cbb2a65b61080906ff',
          type: 'float64',
          value: 42,
          unit: '016c9b1cd8a84e4d9e844e40878bb235',
        },
      ],
    });

    expect(entity).toBeDefined();
    expect(typeof entity.id).toBe('string');
    expect(entity.ops).toHaveLength(1);

    expect(entity.ops[0]?.type).toBe('createEntity');
  });

  it('creates an entity with a boolean value', () => {
    const entity = createEntity({
      values: [
        {
          property: '295c8bc61ae342cbb2a65b61080906ff',
          type: 'bool',
          value: true,
        },
      ],
    });

    expect(entity).toBeDefined();
    expect(entity.ops[0]?.type).toBe('createEntity');
  });

  it('creates an entity with a point value', () => {
    const entity = createEntity({
      values: [
        {
          property: '295c8bc61ae342cbb2a65b61080906ff',
          type: 'point',
          lon: -122.4194,
          lat: 37.7749,
        },
      ],
    });

    expect(entity).toBeDefined();
    expect(entity.ops[0]?.type).toBe('createEntity');
  });

  it('creates an entity with a date value', () => {
    const entity = createEntity({
      values: [
        {
          property: '295c8bc61ae342cbb2a65b61080906ff',
          type: 'date',
          value: '2024-03-20',
        },
      ],
    });

    expect(entity).toBeDefined();
    expect(entity.ops[0]?.type).toBe('createEntity');
  });

  it('creates an entity with relations', () => {
    const providedId = Id('b1dc6e5c63e143bab3d4755b251a4ea1');
    const entity = createEntity({
      id: providedId,
      relations: {
        '295c8bc61ae342cbb2a65b61080906ff': {
          toEntity: 'd8fd9b48e090430db52c6b33d897d0f3',
        },
      },
    });

    expect(entity).toBeDefined();
    expect(entity.id).toBe(providedId);
    expect(entity.ops).toHaveLength(2);
    expect(entity.ops[0]?.type).toBe('createEntity');
    expect(entity.ops[1]).toMatchObject({
      type: 'createRelation',
      from: toGrcId(entity.id),
      relationType: toGrcId('295c8bc61ae342cbb2a65b61080906ff'),
      to: toGrcId('d8fd9b48e090430db52c6b33d897d0f3'),
    });
  });

  it('throws an error if the provided id is invalid', () => {
    expect(() => createEntity({ id: 'invalid' })).toThrow('Invalid id: "invalid" for `id` in `createEntity`');
  });
});
