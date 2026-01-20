import { describe, expect, it } from 'vitest';
import { JOB_TYPE, ROLES_PROPERTY } from '../core/ids/content.js';
import { Id } from '../id.js';
import { createProperty } from './create-property.js';

describe('createProperty', () => {
  it('creates a TEXT property', async () => {
    const property = createProperty({
      name: 'Disclaimer',
      description: 'This is a disclaimer',
      dataType: 'STRING',
    });
    expect(property).toBeDefined();
    expect(typeof property.id).toBe('string');
    expect(property.ops).toBeDefined();
    // 1 createEntity + 1 createRelation (type)
    expect(property.ops.length).toBe(2);
    expect(property.ops[0]?.type).toBe('createEntity');
    expect(property.ops[1]?.type).toBe('createRelation');
  });

  it('creates a NUMBER property', async () => {
    const property = createProperty({
      name: 'Price',
      description: 'The price of the product',
      dataType: 'NUMBER',
    });

    expect(property).toBeDefined();
    expect(typeof property.id).toBe('string');
    expect(property.ops).toBeDefined();
    // 1 createEntity + 1 createRelation (type)
    expect(property.ops.length).toBe(2);
    expect(property.ops[0]?.type).toBe('createEntity');
    expect(property.ops[1]?.type).toBe('createRelation');
  });

  it('creates a RELATION property', async () => {
    const property = createProperty({
      name: 'City',
      dataType: 'RELATION',
    });

    expect(property).toBeDefined();
    expect(typeof property.id).toBe('string');
    expect(property.ops).toBeDefined();
    // 1 createEntity + 1 createRelation (type)
    expect(property.ops.length).toBe(2);
    expect(property.ops[0]?.type).toBe('createEntity');
    expect(property.ops[1]?.type).toBe('createRelation');
  });

  it('creates a RELATION property with properties and relation value types', async () => {
    const property = createProperty({
      name: 'City',
      dataType: 'RELATION',
      properties: [ROLES_PROPERTY],
      relationValueTypes: [JOB_TYPE],
    });

    expect(property).toBeDefined();
    expect(typeof property.id).toBe('string');
    expect(property.ops).toBeDefined();
    // 1 createEntity + 1 createRelation (type) + 1 createRelation (property) + 1 createRelation (value type)
    expect(property.ops.length).toBe(4);
    expect(property.ops[0]?.type).toBe('createEntity');
    expect(property.ops[1]?.type).toBe('createRelation');
    expect(property.ops[2]?.type).toBe('createRelation');
    expect(property.ops[3]?.type).toBe('createRelation');
  });

  it('creates a property with a provided id', async () => {
    const property = createProperty({
      id: Id('b1dc6e5c63e143bab3d4755b251a4ea1'),
      name: 'Price',
      dataType: 'NUMBER',
    });

    expect(property).toBeDefined();
    expect(property.id).toBe('b1dc6e5c63e143bab3d4755b251a4ea1');
  });

  it('throws an error if the provided id is invalid', async () => {
    // @ts-expect-error - invalid id type
    expect(() => createProperty({ id: 'invalid' })).toThrow('Invalid id: "invalid" for `id` in `createProperty`');
  });
});
