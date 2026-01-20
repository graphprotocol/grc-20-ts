import type { CreateEntity, CreateRelation } from '@geoprotocol/grc-20';
import { describe, expect, it } from 'vitest';
import { JOB_TYPE, ROLES_PROPERTY } from '../core/ids/content.js';
import { NAME_PROPERTY, PROPERTY, RELATION_VALUE_RELATIONSHIP_TYPE, TYPES_PROPERTY } from '../core/ids/system.js';
import { Id } from '../id.js';
import { toGrcId } from '../id-utils.js';
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

    // Check entity creation
    const entityOp = property.ops[0] as CreateEntity;
    expect(entityOp.type).toBe('createEntity');
    expect(entityOp.id).toEqual(toGrcId(property.id));

    // Verify name value
    const nameValue = entityOp.values.find(v => {
      const propBytes = v.property;
      return propBytes.every((b, i) => b === toGrcId(NAME_PROPERTY)[i]);
    });
    expect(nameValue).toBeDefined();
    expect(nameValue?.value.type).toBe('text');
    if (nameValue?.value.type === 'text') {
      expect(nameValue.value.value).toBe('Disclaimer');
    }

    // Check type relation to PROPERTY
    const typeRelOp = property.ops[1] as CreateRelation;
    expect(typeRelOp.type).toBe('createRelation');
    expect(typeRelOp.from).toEqual(toGrcId(property.id));
    expect(typeRelOp.to).toEqual(toGrcId(PROPERTY));
    expect(typeRelOp.relationType).toEqual(toGrcId(TYPES_PROPERTY));
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

    // Check entity creation
    const entityOp = property.ops[0] as CreateEntity;
    expect(entityOp.type).toBe('createEntity');
    expect(entityOp.id).toEqual(toGrcId(property.id));

    // Check type relation to PROPERTY
    const typeRelOp = property.ops[1] as CreateRelation;
    expect(typeRelOp.type).toBe('createRelation');
    expect(typeRelOp.from).toEqual(toGrcId(property.id));
    expect(typeRelOp.to).toEqual(toGrcId(PROPERTY));
    expect(typeRelOp.relationType).toEqual(toGrcId(TYPES_PROPERTY));
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

    // Check entity creation
    const entityOp = property.ops[0] as CreateEntity;
    expect(entityOp.type).toBe('createEntity');
    expect(entityOp.id).toEqual(toGrcId(property.id));

    // Check type relation to PROPERTY
    const typeRelOp = property.ops[1] as CreateRelation;
    expect(typeRelOp.type).toBe('createRelation');
    expect(typeRelOp.from).toEqual(toGrcId(property.id));
    expect(typeRelOp.to).toEqual(toGrcId(PROPERTY));
    expect(typeRelOp.relationType).toEqual(toGrcId(TYPES_PROPERTY));
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

    // Check entity creation
    const entityOp = property.ops[0] as CreateEntity;
    expect(entityOp.type).toBe('createEntity');
    expect(entityOp.id).toEqual(toGrcId(property.id));

    // Check type relation to PROPERTY
    const typeRelOp = property.ops[1] as CreateRelation;
    expect(typeRelOp.type).toBe('createRelation');
    expect(typeRelOp.from).toEqual(toGrcId(property.id));
    expect(typeRelOp.to).toEqual(toGrcId(PROPERTY));
    expect(typeRelOp.relationType).toEqual(toGrcId(TYPES_PROPERTY));

    // Check property relation (ROLES_PROPERTY)
    const propRelOp = property.ops[2] as CreateRelation;
    expect(propRelOp.type).toBe('createRelation');
    expect(propRelOp.from).toEqual(toGrcId(property.id));
    expect(propRelOp.to).toEqual(toGrcId(ROLES_PROPERTY));
    expect(propRelOp.relationType).toEqual(toGrcId(PROPERTY));

    // Check relation value type relation (JOB_TYPE)
    const valueTypeRelOp = property.ops[3] as CreateRelation;
    expect(valueTypeRelOp.type).toBe('createRelation');
    expect(valueTypeRelOp.from).toEqual(toGrcId(property.id));
    expect(valueTypeRelOp.to).toEqual(toGrcId(JOB_TYPE));
    expect(valueTypeRelOp.relationType).toEqual(toGrcId(RELATION_VALUE_RELATIONSHIP_TYPE));
  });

  it('creates a property with a provided id', async () => {
    const providedId = Id('b1dc6e5c63e143bab3d4755b251a4ea1');
    const property = createProperty({
      id: providedId,
      name: 'Price',
      dataType: 'NUMBER',
    });

    expect(property).toBeDefined();
    expect(property.id).toBe('b1dc6e5c63e143bab3d4755b251a4ea1');

    // Verify the entity op uses the provided ID
    const entityOp = property.ops[0] as CreateEntity;
    expect(entityOp.id).toEqual(toGrcId(providedId));

    // Verify the type relation uses the provided ID
    const typeRelOp = property.ops[1] as CreateRelation;
    expect(typeRelOp.from).toEqual(toGrcId(providedId));
  });

  it('throws an error if the provided id is invalid', async () => {
    // @ts-expect-error - invalid id type
    expect(() => createProperty({ id: 'invalid' })).toThrow('Invalid id: "invalid" for `id` in `createProperty`');
  });

  it('throws an error if a property id in properties is invalid', async () => {
    expect(() =>
      createProperty({
        name: 'City',
        dataType: 'RELATION',
        properties: ['invalid-prop'],
      }),
    ).toThrow('Invalid id: "invalid-prop" for `properties` in `createProperty`');
  });

  it('throws an error if a relation value type id is invalid', async () => {
    expect(() =>
      createProperty({
        name: 'City',
        dataType: 'RELATION',
        relationValueTypes: ['invalid-type'],
      }),
    ).toThrow('Invalid id: "invalid-type" for `relationValueTypes` in `createProperty`');
  });

  it('creates a BOOLEAN property', async () => {
    const property = createProperty({
      name: 'Is Active',
      dataType: 'BOOLEAN',
    });

    expect(property).toBeDefined();
    expect(property.ops.length).toBe(2);

    const entityOp = property.ops[0] as CreateEntity;
    expect(entityOp.type).toBe('createEntity');

    const typeRelOp = property.ops[1] as CreateRelation;
    expect(typeRelOp.type).toBe('createRelation');
    expect(typeRelOp.to).toEqual(toGrcId(PROPERTY));
  });

  it('creates a TIME property', async () => {
    const property = createProperty({
      name: 'Opening Time',
      dataType: 'TIME',
    });

    expect(property).toBeDefined();
    expect(property.ops.length).toBe(2);

    const typeRelOp = property.ops[1] as CreateRelation;
    expect(typeRelOp.type).toBe('createRelation');
    expect(typeRelOp.to).toEqual(toGrcId(PROPERTY));
  });

  it('creates a POINT property', async () => {
    const property = createProperty({
      name: 'Location',
      dataType: 'POINT',
    });

    expect(property).toBeDefined();
    expect(property.ops.length).toBe(2);

    const typeRelOp = property.ops[1] as CreateRelation;
    expect(typeRelOp.type).toBe('createRelation');
    expect(typeRelOp.to).toEqual(toGrcId(PROPERTY));
  });
});
