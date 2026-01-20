import { describe, expect, it } from 'vitest';
import { AUTHORS_PROPERTY, WEBSITE_PROPERTY } from '../core/ids/content.js';
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
    expect(type.ops[0]?.type).toBe('createEntity');

    // Check type relation to SCHEMA_TYPE
    expect(type.ops[1]?.type).toBe('createRelation');
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
    expect(type.ops[0]?.type).toBe('createEntity');

    // Check types relation
    expect(type.ops[1]?.type).toBe('createRelation');

    // Check property relations
    expect(type.ops[2]?.type).toBe('createRelation');
    expect(type.ops[3]?.type).toBe('createRelation');
  });

  it('creates a type with a provided id', async () => {
    const type = createType({
      id: Id('b1dc6e5c63e143bab3d4755b251a4ea1'),
      name: 'Article',
    });

    expect(type).toBeDefined();
    expect(type.id).toBe('b1dc6e5c63e143bab3d4755b251a4ea1');
  });

  it('throws an error if the provided id is invalid', () => {
    expect(() => createType({ id: 'invalid' })).toThrow('Invalid id: "invalid" for `id` in `createType`');
  });
});
