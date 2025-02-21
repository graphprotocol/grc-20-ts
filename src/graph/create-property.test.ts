import { describe, expect, it } from 'vitest';
import { JOB_TYPE, ROLES_PROPERTY } from '../core/ids/content.js';
import { createProperty } from './create-property.js';

describe('createProperty', () => {
  it('creates a TEXT property', async () => {
    const property = createProperty({
      name: 'Disclaimer',
      description: 'This is a disclaimer',
      type: 'TEXT',
    });
    expect(property).toBeDefined();
    expect(typeof property.id).toBe('string');
    expect(property.ops).toBeDefined();
    expect(property.ops.length).toBe(5);
    expect(property.ops[0]?.type).toBe('SET_TRIPLE');
    expect(property.ops[1]?.type).toBe('SET_TRIPLE');
    expect(property.ops[2]?.type).toBe('CREATE_RELATION');
    expect(property.ops[3]?.type).toBe('CREATE_RELATION');
    expect(property.ops[4]?.type).toBe('CREATE_RELATION');
  });

  it('creates a NUMBER property', async () => {
    const property = createProperty({
      name: 'Price',
      description: 'The price of the product',
      type: 'NUMBER',
    });

    expect(property).toBeDefined();
    expect(typeof property.id).toBe('string');
    expect(property.ops).toBeDefined();
    expect(property.ops.length).toBe(5);
    expect(property.ops[0]?.type).toBe('SET_TRIPLE');
    expect(property.ops[1]?.type).toBe('SET_TRIPLE');
    expect(property.ops[2]?.type).toBe('CREATE_RELATION');
    expect(property.ops[3]?.type).toBe('CREATE_RELATION');
    expect(property.ops[4]?.type).toBe('CREATE_RELATION');
  });

  it('creates a RELATION property', async () => {
    const property = createProperty({
      name: 'City',
      type: 'RELATION',
    });

    expect(property).toBeDefined();
    expect(typeof property.id).toBe('string');
    expect(property.ops).toBeDefined();
    expect(property.ops.length).toBe(4);
    expect(property.ops[0]?.type).toBe('SET_TRIPLE');
    expect(property.ops[1]?.type).toBe('CREATE_RELATION');
    expect(property.ops[2]?.type).toBe('CREATE_RELATION');
    expect(property.ops[3]?.type).toBe('CREATE_RELATION');
  });

  it('creates a RELATION property with properties and relation value types', async () => {
    const property = createProperty({
      name: 'City',
      type: 'RELATION',
      properties: [ROLES_PROPERTY],
      relationValueTypes: [JOB_TYPE],
    });

    expect(property).toBeDefined();
    expect(typeof property.id).toBe('string');
    expect(property.ops).toBeDefined();
    expect(property.ops.length).toBe(6);
    expect(property.ops[0]?.type).toBe('SET_TRIPLE');
    expect(property.ops[1]?.type).toBe('CREATE_RELATION');
    expect(property.ops[2]?.type).toBe('CREATE_RELATION');
    expect(property.ops[3]?.type).toBe('CREATE_RELATION');
    expect(property.ops[4]?.type).toBe('CREATE_RELATION');
    expect(property.ops[5]?.type).toBe('CREATE_RELATION');
  });
});
