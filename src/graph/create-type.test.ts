import { describe, expect, it } from 'vitest';
import { AUTHORS_PROPERTY, WEBSITE_PROPERTY } from '../core/ids/content.js';
import { NAME_PROPERTY, PROPERTIES, SCHEMA_TYPE, TYPES_PROPERTY } from '../core/ids/system.js';
import { Id } from '../id.js';
import { createType } from './create-type.js';

describe('createType', () => {
  it('creates a basic type', async () => {
    const type = createType({
      name: 'Article',
    });

    expect(type).toBeDefined();
    expect(typeof type.id).toBe('string');
    expect(type.ops).toBeDefined();
    expect(type.ops.length).toBe(2);

    // Check entity creation
    expect(type.ops[0]?.type).toBe('UPDATE_ENTITY');
    expect(type.ops[0]).toMatchObject({
      entity: {
        id: type.id,
        values: [
          {
            property: NAME_PROPERTY,
            value: 'Article',
          },
        ],
      },
      type: 'UPDATE_ENTITY',
    });

    // Check type relation to itself (marking it as a type)
    expect(type.ops[1]?.type).toBe('CREATE_RELATION');
    if (type.ops[1]?.type === 'CREATE_RELATION') {
      expect(type.ops[1]).toMatchObject({
        relation: {
          fromEntity: type.id,
          toEntity: SCHEMA_TYPE,
          type: TYPES_PROPERTY,
        },
        type: 'CREATE_RELATION',
      });
    }
  });

  it('creates a type with multiple properties', async () => {
    const type = createType({
      name: 'Article',
      properties: [WEBSITE_PROPERTY, AUTHORS_PROPERTY],
    });

    expect(type).toBeDefined();
    expect(typeof type.id).toBe('string');
    expect(type.ops).toBeDefined();
    expect(type.ops.length).toBe(4);

    // Check entity creation
    expect(type.ops[0]?.type).toBe('UPDATE_ENTITY');
    expect(type.ops[0]).toMatchObject({
      entity: {
        id: type.id,
        values: [
          {
            property: NAME_PROPERTY,
            value: 'Article',
          },
        ],
      },
      type: 'UPDATE_ENTITY',
    });

    // Check types relation
    expect(type.ops[1]?.type).toBe('CREATE_RELATION');
    expect(type.ops[1]).toMatchObject({
      relation: {
        fromEntity: type.id,
        toEntity: SCHEMA_TYPE,
        type: TYPES_PROPERTY,
      },
      type: 'CREATE_RELATION',
    });

    // Check website relation
    expect(type.ops[2]?.type).toBe('CREATE_RELATION');
    expect(type.ops[2]).toMatchObject({
      relation: {
        fromEntity: type.id,
        toEntity: WEBSITE_PROPERTY,
        type: PROPERTIES,
      },
      type: 'CREATE_RELATION',
    });

    // Check author relation
    expect(type.ops[3]?.type).toBe('CREATE_RELATION');
    expect(type.ops[3]).toMatchObject({
      relation: {
        fromEntity: type.id,
        toEntity: AUTHORS_PROPERTY,
        type: PROPERTIES,
      },
      type: 'CREATE_RELATION',
    });
  });

  it('creates a type with a provided id', async () => {
    const type = createType({
      id: Id('b1dc6e5c-63e1-43ba-b3d4-755b251a4ea1'),
      name: 'Article',
    });

    expect(type).toBeDefined();
    expect(type.id).toBe('b1dc6e5c-63e1-43ba-b3d4-755b251a4ea1');
  });

  it('throws an error if the provided id is invalid', () => {
    expect(() => createType({ id: 'invalid' })).toThrow('Invalid id: "invalid" for `id` in `createType`');
  });
});
