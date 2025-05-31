import { describe, expect, it } from 'vitest';
import { JOB_TYPE, ROLES_PROPERTY } from '../core/ids/content.js';
import { Id } from '../id.js';
import { createProperty } from './create-property.js';

describe('createProperty', () => {
  it('creates a TEXT property', async () => {
    const property = createProperty({
      name: 'Disclaimer',
      description: 'This is a disclaimer',
      dataType: 'TEXT',
    });
    expect(property).toBeDefined();
    expect(typeof property.id).toBe('string');
    expect(property.ops).toBeDefined();
    expect(property.ops.length).toBe(4);
    expect(property.ops[0]?.type).toBe('CREATE_PROPERTY');
    expect(property.ops[1]?.type).toBe('UPDATE_ENTITY');
    expect(property.ops[2]?.type).toBe('CREATE_RELATION');
    expect(property.ops[3]?.type).toBe('CREATE_RELATION');
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
    expect(property.ops.length).toBe(4);
    expect(property.ops[0]?.type).toBe('CREATE_PROPERTY');
    expect(property.ops[1]?.type).toBe('UPDATE_ENTITY');
    expect(property.ops[2]?.type).toBe('CREATE_RELATION');
    expect(property.ops[3]?.type).toBe('CREATE_RELATION');
  });

  it('creates a RELATION property', async () => {
    const property = createProperty({
      name: 'City',
      dataType: 'RELATION',
    });

    expect(property).toBeDefined();
    expect(typeof property.id).toBe('string');
    expect(property.ops).toBeDefined();
    expect(property.ops.length).toBe(4);
    expect(property.ops[0]?.type).toBe('CREATE_PROPERTY');
    expect(property.ops[1]?.type).toBe('UPDATE_ENTITY');
    expect(property.ops[2]?.type).toBe('CREATE_RELATION');
    expect(property.ops[3]?.type).toBe('CREATE_RELATION');
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
    expect(property.ops.length).toBe(6);
    expect(property.ops[0]?.type).toBe('CREATE_PROPERTY');
    expect(property.ops[1]?.type).toBe('UPDATE_ENTITY');
    expect(property.ops[2]?.type).toBe('CREATE_RELATION');
    expect(property.ops[3]?.type).toBe('CREATE_RELATION');
    expect(property.ops[4]?.type).toBe('CREATE_RELATION');
    expect(property.ops[5]?.type).toBe('CREATE_RELATION');
  });

  it('creates a property with a provided id', async () => {
    const property = createProperty({
      id: Id('b1dc6e5c-63e1-43ba-b3d4-755b251a4ea1'),
      name: 'Price',
      dataType: 'NUMBER',
    });

    expect(property).toBeDefined();
    expect(property.id).toBe('b1dc6e5c-63e1-43ba-b3d4-755b251a4ea1');
  });

  it('throws an error if the provided id is invalid', async () => {
    // @ts-expect-error - invalid id type
    expect(() => createProperty({ id: 'invalid' })).toThrow('Invalid id: "invalid" for `id` in `createProperty`');
  });
});
