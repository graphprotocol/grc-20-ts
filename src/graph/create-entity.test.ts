import { describe, expect, it } from 'vitest';
import {
  AUTHORS_ATTRIBUTE,
  CLAIM_TYPE,
  DISCLAIMER_ATTRIBUTE,
  NEWS_STORY_TYPE,
  ROLES_ATTRIBUTE,
  WEB_URL_ATTRIBUTE,
} from '../core/ids/content.js';
import { NAME_ATTRIBUTE, TYPES_ATTRIBUTE } from '../core/ids/system.js';
import { generate } from '../id.js';
import { createEntity } from './create-entity.js';

describe('createEntity', () => {
  it('creates a basic entity without properties', async () => {
    const entity = await createEntity({});
    expect(entity).toBeDefined();
    expect(typeof entity.id).toBe('string');
    expect(entity.ops).toBeDefined();
    expect(entity.ops).toHaveLength(0);
  });

  it('creates an entity with types', async () => {
    const entity = await createEntity({
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
          type: TYPES_ATTRIBUTE,
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
          type: TYPES_ATTRIBUTE,
        },
        type: 'CREATE_RELATION',
      });
    }
  });

  it('creates an entity with only triple attributes', async () => {
    const entity = await createEntity({
      name: 'Test Entity',
      properties: {
        [DISCLAIMER_ATTRIBUTE]: { value: 'Test Entity', type: 'TEXT' },
        [WEB_URL_ATTRIBUTE]: { value: 'https://example.com', type: 'URL' },
      },
    });

    expect(entity).toBeDefined();
    expect(typeof entity.id).toBe('string');
    expect(entity.ops).toHaveLength(3);

    // Check triples
    expect(entity.ops[0]?.type).toBe('SET_TRIPLE');
    expect(entity.ops[0]).toMatchObject({
      triple: {
        attribute: NAME_ATTRIBUTE,
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
        attribute: DISCLAIMER_ATTRIBUTE,
        entity: entity.id,
        value: { type: 'TEXT', value: 'Test Entity' },
      },
      type: 'SET_TRIPLE',
    });

    expect(entity.ops[2]?.type).toBe('SET_TRIPLE');
    expect(entity.ops[2]).toMatchObject({
      triple: {
        attribute: WEB_URL_ATTRIBUTE,
        entity: entity.id,
        value: { type: 'URL', value: 'https://example.com' },
      },
      type: 'SET_TRIPLE',
    });
  });

  it('creates an entity with relations', async () => {
    const entity = await createEntity({
      properties: {
        [AUTHORS_ATTRIBUTE]: { to: 'some-author-id' },
        [ROLES_ATTRIBUTE]: [{ to: 'some-role-id' }, { to: 'some-role-id-2' }],
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
          toEntity: 'some-author-id',
          type: AUTHORS_ATTRIBUTE,
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
          toEntity: 'some-role-id',
          type: ROLES_ATTRIBUTE,
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
          toEntity: 'some-role-id-2',
          type: ROLES_ATTRIBUTE,
        },
        type: 'CREATE_RELATION',
      });
    }
  });

  it('creates an entity with custom relation ids', async () => {
    const authorRelationId = generate();
    const firstRoleRelationId = generate();
    const entity = await createEntity({
      properties: {
        [AUTHORS_ATTRIBUTE]: { to: 'some-author-id', id: authorRelationId },
        [ROLES_ATTRIBUTE]: [{ to: 'some-role-id', id: firstRoleRelationId }, { to: 'some-role-id-2' }],
      },
    });

    expect(entity.ops[0]?.type).toBe('CREATE_RELATION');
    if (entity.ops[0]?.type === 'CREATE_RELATION') {
      expect(entity.ops[0]).toMatchObject({
        relation: {
          fromEntity: entity.id,
          id: authorRelationId,
          index: entity.ops[0]?.relation?.index,
          toEntity: 'some-author-id',
          type: AUTHORS_ATTRIBUTE,
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
          toEntity: 'some-role-id',
          type: ROLES_ATTRIBUTE,
        },
        type: 'CREATE_RELATION',
      });
    }
  });

  it('creates an entity with a nested properties', async () => {
    const authorRelationId = generate();
    const roleRelationId = generate();
    const newsStoryRelationId = generate();
    const entity = await createEntity({
      properties: {
        [AUTHORS_ATTRIBUTE]: {
          to: 'some-author-id',
          id: authorRelationId,
          properties: {
            [ROLES_ATTRIBUTE]: {
              to: 'some-role-id',
              id: roleRelationId,
              properties: {
                [NEWS_STORY_TYPE]: {
                  to: 'some-role-id-2',
                  id: newsStoryRelationId,
                },
                [WEB_URL_ATTRIBUTE]: {
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
          toEntity: 'some-author-id',
          type: AUTHORS_ATTRIBUTE,
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
          toEntity: 'some-role-id',
          type: ROLES_ATTRIBUTE,
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
          toEntity: 'some-role-id-2',
          type: NEWS_STORY_TYPE,
        },
        type: 'CREATE_RELATION',
      });
    }

    expect(entity.ops[3]?.type).toBe('SET_TRIPLE');
    if (entity.ops[3]?.type === 'SET_TRIPLE') {
      expect(entity.ops[3]).toMatchObject({
        triple: {
          attribute: WEB_URL_ATTRIBUTE,
          entity: entity.id,
          value: { type: 'URL', value: 'https://example.com' },
        },
        type: 'SET_TRIPLE',
      });
    }
  });

  it('creates an entity with types, triples, and relations', async () => {
    const entity = await createEntity({
      name: 'Yummy Coffee',
      description: 'A delicious coffee shop with great food and great coffee',
      cover: 'image-id',
      types: [CLAIM_TYPE, NEWS_STORY_TYPE],
      properties: {
        [DISCLAIMER_ATTRIBUTE]: { value: 'Test Entity', type: 'TEXT' },
        [WEB_URL_ATTRIBUTE]: { value: 'https://example.com', type: 'URL' },
        [AUTHORS_ATTRIBUTE]: { to: 'some-author-id' },
        [ROLES_ATTRIBUTE]: { to: 'some-role-id' },
      },
    });

    expect(entity).toBeDefined();
    expect(typeof entity.id).toBe('string');
    expect(entity.ops).toHaveLength(9);
  });
});
