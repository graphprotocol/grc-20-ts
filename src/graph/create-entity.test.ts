import { describe, expect, it } from 'vitest';
import { CLAIM_TYPE, NEWS_STORY_TYPE } from '../core/ids/content.js';
import { COVER_PROPERTY, DESCRIPTION_PROPERTY, NAME_PROPERTY, TYPES_PROPERTY } from '../core/ids/system.js';
import { Id } from '../id.js';
import { createEntity } from './create-entity.js';
import { serializeNumber } from './serialize.js';

describe('createEntity', () => {
  const coverId = Id('30145d36-d5a5-4244-be59-3d111d879ba5');

  it('creates a basic entity without properties', () => {
    const entity = createEntity({});
    expect(entity).toBeDefined();
    expect(typeof entity.id).toBe('string');
    expect(entity.ops).toBeDefined();
    expect(entity.ops).toHaveLength(1); // One UPDATE_ENTITY op
    expect(entity.ops[0]).toMatchObject({
      type: 'UPDATE_ENTITY',
      entity: {
        id: entity.id,
        values: [],
      },
    });
  });

  it('creates an entity with types', () => {
    const entity = createEntity({
      types: [CLAIM_TYPE, NEWS_STORY_TYPE],
    });

    expect(entity).toBeDefined();
    expect(typeof entity.id).toBe('string');
    expect(entity.ops).toHaveLength(3); // One UPDATE_ENTITY + two CREATE_RELATION ops

    // Check UPDATE_ENTITY op
    expect(entity.ops[0]).toMatchObject({
      type: 'UPDATE_ENTITY',
      entity: {
        id: entity.id,
        values: [],
      },
    });

    // Check first type relation
    expect(entity.ops[1]).toMatchObject({
      type: 'CREATE_RELATION',
      relation: {
        fromEntity: entity.id,
        toEntity: CLAIM_TYPE,
        type: TYPES_PROPERTY,
      },
    });

    // Check second type relation
    expect(entity.ops[2]).toMatchObject({
      type: 'CREATE_RELATION',
      relation: {
        fromEntity: entity.id,
        toEntity: NEWS_STORY_TYPE,
        type: TYPES_PROPERTY,
      },
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

    expect(entity.ops[0]).toMatchObject({
      type: 'UPDATE_ENTITY',
      entity: {
        id: entity.id,
        values: [
          {
            property: NAME_PROPERTY,
            value: 'Test Entity',
          },
          {
            property: DESCRIPTION_PROPERTY,
            value: 'Test Description',
          },
        ],
      },
    });
  });

  it('creates an entity with cover', () => {
    const entity = createEntity({
      cover: coverId,
    });

    expect(entity).toBeDefined();
    expect(typeof entity.id).toBe('string');
    expect(entity.ops).toHaveLength(2);

    // Check UPDATE_ENTITY op
    expect(entity.ops[0]).toMatchObject({
      type: 'UPDATE_ENTITY',
      entity: {
        id: entity.id,
        values: [],
      },
    });

    // Check cover relation
    expect(entity.ops[1]).toMatchObject({
      type: 'CREATE_RELATION',
      relation: {
        fromEntity: entity.id,
        toEntity: coverId,
        type: COVER_PROPERTY,
      },
    });
  });

  it('creates an entity with custom values', () => {
    const customPropertyId = Id('fa269fd3-de98-49cf-90c4-4235d905a67c');
    const entity = createEntity({
      values: [{ property: customPropertyId, value: 'custom value' }],
    });

    expect(entity).toBeDefined();
    expect(typeof entity.id).toBe('string');
    expect(entity.ops).toHaveLength(1);

    expect(entity.ops[0]).toMatchObject({
      type: 'UPDATE_ENTITY',
      entity: {
        id: entity.id,
        values: [
          {
            property: customPropertyId,
            value: 'custom value',
          },
        ],
      },
    });
  });

  it('creates an entity with a text value with options', () => {
    const entity = createEntity({
      values: [
        {
          property: '295c8bc6-1ae3-42cb-b2a6-5b61080906ff',
          value: 'test',
          options: { type: 'text', language: Id('0a4e9810-f78f-429e-a4ce-b1904a43251d') },
        },
      ],
    });

    expect(entity).toBeDefined();
    expect(typeof entity.id).toBe('string');
    expect(entity.ops).toHaveLength(1);

    expect(entity.ops[0]).toMatchObject({
      type: 'UPDATE_ENTITY',
      entity: {
        id: entity.id,
        values: [
          {
            property: '295c8bc6-1ae3-42cb-b2a6-5b61080906ff',
            value: 'test',
            options: {
              text: {
                language: '0a4e9810-f78f-429e-a4ce-b1904a43251d',
              },
            },
          },
        ],
      },
    });
  });

  it('creates an entity with a text value in two different languages', () => {
    const entity = createEntity({
      values: [
        {
          property: '295c8bc6-1ae3-42cb-b2a6-5b61080906ff',
          value: 'test',
          options: { type: 'text', language: Id('0a4e9810-f78f-429e-a4ce-b1904a43251d') },
        },
        {
          property: '295c8bc6-1ae3-42cb-b2a6-5b61080906ff',
          value: 'prueba',
          options: { type: 'text', language: Id('dad6e52a-5e94-4e55-9411-cfe3a3c3ea64') },
        },
      ],
    });

    expect(entity).toBeDefined();
    expect(typeof entity.id).toBe('string');
    expect(entity.ops).toHaveLength(1);

    expect(entity.ops[0]).toMatchObject({
      type: 'UPDATE_ENTITY',
      entity: {
        id: entity.id,
        values: [
          {
            property: '295c8bc6-1ae3-42cb-b2a6-5b61080906ff',
            value: 'test',
            options: {
              text: {
                language: '0a4e9810-f78f-429e-a4ce-b1904a43251d',
              },
            },
          },
          {
            property: '295c8bc6-1ae3-42cb-b2a6-5b61080906ff',
            value: 'prueba',
            options: {
              text: {
                language: 'dad6e52a-5e94-4e55-9411-cfe3a3c3ea64',
              },
            },
          },
        ],
      },
    });
  });

  it('creates an entity with a number value', () => {
    const entity = createEntity({
      values: [
        {
          property: '295c8bc6-1ae3-42cb-b2a6-5b61080906ff',
          value: serializeNumber(42),
        },
      ],
    });

    expect(entity).toBeDefined();
    expect(typeof entity.id).toBe('string');
    expect(entity.ops).toHaveLength(1);

    expect(entity.ops[0]).toMatchObject({
      type: 'UPDATE_ENTITY',
      entity: {
        id: entity.id,
        values: [
          {
            property: '295c8bc6-1ae3-42cb-b2a6-5b61080906ff',
            value: '42',
          },
        ],
      },
    });
  });

  it('creates an entity with a number value with options', () => {
    const entity = createEntity({
      values: [
        {
          property: '295c8bc6-1ae3-42cb-b2a6-5b61080906ff',
          value: serializeNumber(42),
          options: {
            type: 'number',
            format: '1.2-2',
            unit: '016c9b1c-d8a8-4e4d-9e84-4e40878bb235',
          },
        },
      ],
    });

    expect(entity).toBeDefined();
    expect(typeof entity.id).toBe('string');
    expect(entity.ops).toHaveLength(1);

    expect(entity.ops[0]).toMatchObject({
      type: 'UPDATE_ENTITY',
      entity: {
        id: entity.id,
        values: [
          {
            property: '295c8bc6-1ae3-42cb-b2a6-5b61080906ff',
            value: '42',
            options: {
              number: {
                format: '1.2-2',
                unit: '016c9b1c-d8a8-4e4d-9e84-4e40878bb235',
              },
            },
          },
        ],
      },
    });
  });

  it('creates an entity with a time value with options', () => {
    const entity = createEntity({
      values: [
        {
          property: '295c8bc6-1ae3-42cb-b2a6-5b61080906ff',
          value: '2021-01-01',
          options: {
            type: 'time',
            format: 'YYYY-MM-DD',
            timezone: Id('156431a8-0edf-4093-a08e-4c4ed0d5e466'),
            hasDate: true,
            hasTime: true,
          },
        },
      ],
    });

    expect(entity).toBeDefined();
    expect(typeof entity.id).toBe('string');
    expect(entity.ops).toHaveLength(1);

    expect(entity.ops[0]).toMatchObject({
      type: 'UPDATE_ENTITY',
      entity: {
        id: entity.id,
        values: [
          {
            property: '295c8bc6-1ae3-42cb-b2a6-5b61080906ff',
            value: '2021-01-01',
            options: {
              time: {
                format: 'YYYY-MM-DD',
                timezone: Id('156431a8-0edf-4093-a08e-4c4ed0d5e466'),
                hasDate: true,
                hasTime: true,
              },
            },
          },
        ],
      },
    });
  });

  it('creates an entity with relations', () => {
    const providedId = Id('b1dc6e5c-63e1-43ba-b3d4-755b251a4ea1');
    const entity = createEntity({
      id: providedId,
      relations: {
        '295c8bc6-1ae3-42cb-b2a6-5b61080906ff': {
          toEntity: 'd8fd9b48-e090-430d-b52c-6b33d897d0f3',
        },
      },
    });

    expect(entity).toBeDefined();
    expect(entity.id).toBe(providedId);
    expect(entity.ops).toHaveLength(2);
    expect(entity.ops[0]).toMatchObject({
      type: 'UPDATE_ENTITY',
    });
    expect(entity.ops[1]).toMatchObject({
      type: 'CREATE_RELATION',
      relation: {
        fromEntity: entity.id,
        type: '295c8bc6-1ae3-42cb-b2a6-5b61080906ff',
        toEntity: 'd8fd9b48-e090-430d-b52c-6b33d897d0f3',
      },
    });
  });

  it('creates an entity with types', () => {
    const entity = createEntity({
      types: [CLAIM_TYPE, NEWS_STORY_TYPE],
    });

    expect(entity).toBeDefined();
    expect(typeof entity.id).toBe('string');
    expect(entity.ops).toHaveLength(3); // One UPDATE_ENTITY + two CREATE_RELATION ops

    // Check UPDATE_ENTITY op
    expect(entity.ops[0]).toMatchObject({
      type: 'UPDATE_ENTITY',
      entity: {
        id: entity.id,
        values: [],
      },
    });

    // Check first type relation
    expect(entity.ops[1]).toMatchObject({
      type: 'CREATE_RELATION',
      relation: {
        fromEntity: entity.id,
        toEntity: CLAIM_TYPE,
        type: TYPES_PROPERTY,
      },
    });

    // Check second type relation
    expect(entity.ops[2]).toMatchObject({
      type: 'CREATE_RELATION',
      relation: {
        fromEntity: entity.id,
        toEntity: NEWS_STORY_TYPE,
        type: TYPES_PROPERTY,
      },
    });
  });

  it('throws an error if the provided id is invalid', () => {
    expect(() => createEntity({ id: 'invalid' })).toThrow('Invalid id: "invalid" for `id` in `createEntity`');
  });
});
