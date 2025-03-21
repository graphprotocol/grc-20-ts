import { describe, expect, it } from 'vitest';
import {
  AUTHORS_PROPERTY,
  CLAIM_TYPE,
  DISCLAIMER_PROPERTY,
  NEWS_STORY_TYPE,
  ROLES_PROPERTY,
  WEB_URL_PROPERTY,
} from '../core/ids/content.js';
import { NAME_PROPERTY, TYPES_PROPERTY } from '../core/ids/system.js';
import { Id, generate } from '../id.js';
import { createEntity } from './create-entity.js';

describe('createEntity', () => {
  const someAuthorId = Id('M5uDP7nCw3nvfQPUryn9gx');
  const someRoleId = Id('GscJ2GELQjmLoaVrYyR3xm');
  const someRoleId2 = Id('VdTsW1mGiy1XSooJaBBLc4');
  const coverId = Id('6wMJ7P1AHpu8EWFX3roMye');

  it('creates a basic entity without properties', async () => {
    const entity = createEntity({});
    expect(entity).toBeDefined();
    expect(typeof entity.id).toBe('string');
    expect(entity.ops).toBeDefined();
    expect(entity.ops).toHaveLength(0);
  });

  it('creates an entity with types', async () => {
    const entity = createEntity({
      types: [CLAIM_TYPE, NEWS_STORY_TYPE],
    });

    expect(entity).toBeDefined();
    expect(typeof entity.id).toBe('string');
    expect(entity.ops).toHaveLength(2);

    // Check first type relation
    expect(entity.ops[0]?.type).toBe('CREATE_RELATION');
    if (entity.ops[0]?.type === 'CREATE_RELATION') {
      expect(entity.ops[0]).toMatchObject({
        relation: {
          fromEntity: entity.id,
          id: entity.ops[0].relation?.id,
          index: entity.ops[0].relation?.index,
          toEntity: CLAIM_TYPE,
          type: TYPES_PROPERTY,
        },
        type: 'CREATE_RELATION',
      });
    }

    // Check second type relation
    expect(entity.ops[1]?.type).toBe('CREATE_RELATION');
    if (entity.ops[1]?.type === 'CREATE_RELATION') {
      expect(entity.ops[1]).toMatchObject({
        relation: {
          fromEntity: entity.id,
          id: entity.ops[1]?.relation?.id,
          index: entity.ops[1]?.relation?.index,
          toEntity: NEWS_STORY_TYPE,
          type: TYPES_PROPERTY,
        },
        type: 'CREATE_RELATION',
      });
    }
  });

  it('creates an entity with only triple attributes', async () => {
    const entity = createEntity({
      name: 'Test Entity',
      properties: {
        [DISCLAIMER_PROPERTY]: { value: 'Test Entity', type: 'TEXT' },
        [WEB_URL_PROPERTY]: { value: 'https://example.com', type: 'URL' },
      },
    });

    expect(entity).toBeDefined();
    expect(typeof entity.id).toBe('string');
    expect(entity.ops).toHaveLength(3);

    // Check triples
    expect(entity.ops[0]?.type).toBe('SET_TRIPLE');
    expect(entity.ops[0]).toMatchObject({
      triple: {
        attribute: NAME_PROPERTY,
        entity: entity.id,
        value: {
          type: 'TEXT',
          value: 'Test Entity',
        },
      },
      type: 'SET_TRIPLE',
    });

    expect(entity.ops[1]?.type).toBe('SET_TRIPLE');
    expect(entity.ops[1]).toMatchObject({
      triple: {
        attribute: DISCLAIMER_PROPERTY,
        entity: entity.id,
        value: { type: 'TEXT', value: 'Test Entity' },
      },
      type: 'SET_TRIPLE',
    });

    expect(entity.ops[2]?.type).toBe('SET_TRIPLE');
    expect(entity.ops[2]).toMatchObject({
      triple: {
        attribute: WEB_URL_PROPERTY,
        entity: entity.id,
        value: { type: 'URL', value: 'https://example.com' },
      },
      type: 'SET_TRIPLE',
    });
  });

  it('creates an entity with relations', async () => {
    const entity = createEntity({
      properties: {
        [AUTHORS_PROPERTY]: { to: someAuthorId },
        [ROLES_PROPERTY]: [{ to: someRoleId }, { to: someRoleId2 }],
      },
    });

    expect(entity).toBeDefined();
    expect(typeof entity.id).toBe('string');
    expect(entity.ops).toHaveLength(3);

    // Check relations
    expect(entity.ops[0]?.type).toBe('CREATE_RELATION');
    if (entity.ops[0]?.type === 'CREATE_RELATION') {
      expect(entity.ops[0]).toMatchObject({
        relation: {
          fromEntity: entity.id,
          id: entity.ops[0]?.relation?.id,
          index: entity.ops[0]?.relation?.index,
          toEntity: someAuthorId,
          type: AUTHORS_PROPERTY,
        },
        type: 'CREATE_RELATION',
      });
    }

    expect(entity.ops[1]?.type).toBe('CREATE_RELATION');
    if (entity.ops[1]?.type === 'CREATE_RELATION') {
      expect(entity.ops[1]).toMatchObject({
        relation: {
          fromEntity: entity.id,
          id: entity.ops[1]?.relation?.id,
          index: entity.ops[1]?.relation?.index,
          toEntity: someRoleId,
          type: ROLES_PROPERTY,
        },
        type: 'CREATE_RELATION',
      });
    }

    expect(entity.ops[2]?.type).toBe('CREATE_RELATION');
    if (entity.ops[2]?.type === 'CREATE_RELATION') {
      expect(entity.ops[2]).toMatchObject({
        relation: {
          fromEntity: entity.id,
          id: entity.ops[2]?.relation?.id,
          index: entity.ops[2]?.relation?.index,
          toEntity: someRoleId2,
          type: ROLES_PROPERTY,
        },
        type: 'CREATE_RELATION',
      });
    }
  });

  it('creates an entity with custom relation ids', async () => {
    const authorRelationId = generate();
    const firstRoleRelationId = generate();
    const entity = createEntity({
      properties: {
        [AUTHORS_PROPERTY]: { to: someAuthorId, relationId: authorRelationId },
        [ROLES_PROPERTY]: [{ to: someRoleId, relationId: firstRoleRelationId }, { to: someRoleId2 }],
      },
    });

    expect(entity.ops[0]?.type).toBe('CREATE_RELATION');
    if (entity.ops[0]?.type === 'CREATE_RELATION') {
      expect(entity.ops[0]).toMatchObject({
        relation: {
          fromEntity: entity.id,
          id: authorRelationId,
          index: entity.ops[0]?.relation?.index,
          toEntity: someAuthorId,
          type: AUTHORS_PROPERTY,
        },
        type: 'CREATE_RELATION',
      });
    }

    expect(entity.ops[1]?.type).toBe('CREATE_RELATION');
    if (entity.ops[1]?.type === 'CREATE_RELATION') {
      expect(entity.ops[1]).toMatchObject({
        relation: {
          fromEntity: entity.id,
          id: firstRoleRelationId,
          index: entity.ops[1]?.relation?.index,
          toEntity: someRoleId,
          type: ROLES_PROPERTY,
        },
        type: 'CREATE_RELATION',
      });
    }
  });

  it('creates an entity with a nested properties', async () => {
    const authorRelationId = generate();
    const roleRelationId = generate();
    const newsStoryRelationId = generate();
    const entity = createEntity({
      properties: {
        [AUTHORS_PROPERTY]: {
          to: someAuthorId,
          relationId: authorRelationId,
          properties: {
            [ROLES_PROPERTY]: {
              to: someRoleId,
              relationId: roleRelationId,
              properties: {
                [NEWS_STORY_TYPE]: {
                  to: someRoleId2,
                  relationId: newsStoryRelationId,
                },
                [WEB_URL_PROPERTY]: {
                  value: 'https://example.com',
                  type: 'URL',
                },
              },
            },
          },
        },
      },
    });

    expect(entity.ops[0]?.type).toBe('CREATE_RELATION');
    if (entity.ops[0]?.type === 'CREATE_RELATION') {
      expect(entity.ops[0]).toMatchObject({
        relation: {
          fromEntity: entity.id,
          id: authorRelationId,
          index: entity.ops[0]?.relation?.index,
          toEntity: someAuthorId,
          type: AUTHORS_PROPERTY,
        },
        type: 'CREATE_RELATION',
      });
    }

    expect(entity.ops[1]?.type).toBe('CREATE_RELATION');
    if (entity.ops[1]?.type === 'CREATE_RELATION') {
      expect(entity.ops[1]).toMatchObject({
        relation: {
          fromEntity: entity.id,
          id: roleRelationId,
          index: entity.ops[1]?.relation?.index,
          toEntity: someRoleId,
          type: ROLES_PROPERTY,
        },
        type: 'CREATE_RELATION',
      });
    }

    expect(entity.ops[2]?.type).toBe('CREATE_RELATION');
    if (entity.ops[2]?.type === 'CREATE_RELATION') {
      expect(entity.ops[2]).toMatchObject({
        relation: {
          fromEntity: entity.id,
          id: newsStoryRelationId,
          index: entity.ops[2]?.relation?.index,
          toEntity: someRoleId2,
          type: NEWS_STORY_TYPE,
        },
        type: 'CREATE_RELATION',
      });
    }

    expect(entity.ops[3]?.type).toBe('SET_TRIPLE');
    if (entity.ops[3]?.type === 'SET_TRIPLE') {
      expect(entity.ops[3]).toMatchObject({
        triple: {
          attribute: WEB_URL_PROPERTY,
          entity: entity.id,
          value: { type: 'URL', value: 'https://example.com' },
        },
        type: 'SET_TRIPLE',
      });
    }
  });

  it('creates an entity with types, triples, and relations', async () => {
    const entity = createEntity({
      name: 'Yummy Coffee',
      description: 'A delicious coffee shop with great food and great coffee',
      cover: coverId,
      types: [CLAIM_TYPE, NEWS_STORY_TYPE],
      properties: {
        [DISCLAIMER_PROPERTY]: { value: 'Test Entity', type: 'TEXT' },
        [WEB_URL_PROPERTY]: { value: 'https://example.com', type: 'URL' },
        [AUTHORS_PROPERTY]: { to: someAuthorId },
        [ROLES_PROPERTY]: { to: someRoleId },
      },
    });

    expect(entity).toBeDefined();
    expect(typeof entity.id).toBe('string');
    expect(entity.ops).toHaveLength(9);
  });

  it('creates an entity with a provided id', async () => {
    const entity = createEntity({
      id: Id('WeUPYRkhnQLmHPH4S1ioc4'),
      name: 'Yummy Coffee',
    });

    expect(entity).toBeDefined();
    expect(entity.id).toBe('WeUPYRkhnQLmHPH4S1ioc4');
    expect(entity.ops).toHaveLength(1);
    expect(entity.ops[0]).toMatchObject({
      type: 'SET_TRIPLE',
      triple: {
        attribute: NAME_PROPERTY,
        entity: entity.id,
        value: { type: 'TEXT', value: 'Yummy Coffee' },
      },
    });
  });
  
  it('throws an error if the provided id is invalid', () => {
    // @ts-expect-error - invalid id type
    expect(() => createEntity({ id: 'invalid' })).toThrow('Invalid id: "invalid" for `id` in `createEntity`');
  });
});
