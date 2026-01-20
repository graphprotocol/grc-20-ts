import type { CreateEntity, CreateRelation } from '@geoprotocol/grc-20';
import { describe, expect, it } from 'vitest';
import { AUTHORS_PROPERTY, WEBSITE_PROPERTY } from '../core/ids/content.js';
import { NAME_PROPERTY, PROPERTIES, SCHEMA_TYPE, TYPES_PROPERTY } from '../core/ids/system.js';
import { Id } from '../id.js';
import { toGrcId } from '../id-utils.js';
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
    const entityOp = type.ops[0] as CreateEntity;
    expect(entityOp.type).toBe('createEntity');
    expect(entityOp.id).toEqual(toGrcId(type.id));

    // Verify name value
    const nameValue = entityOp.values.find(v => {
      const propBytes = v.property;
      return propBytes.every((b, i) => b === toGrcId(NAME_PROPERTY)[i]);
    });
    expect(nameValue).toBeDefined();
    expect(nameValue?.value.type).toBe('text');
    if (nameValue?.value.type === 'text') {
      expect(nameValue.value.value).toBe('Article');
    }

    // Check type relation to SCHEMA_TYPE
    const typeRelOp = type.ops[1] as CreateRelation;
    expect(typeRelOp.type).toBe('createRelation');
    expect(typeRelOp.from).toEqual(toGrcId(type.id));
    expect(typeRelOp.to).toEqual(toGrcId(SCHEMA_TYPE));
    expect(typeRelOp.relationType).toEqual(toGrcId(TYPES_PROPERTY));
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
    const entityOp = type.ops[0] as CreateEntity;
    expect(entityOp.type).toBe('createEntity');
    expect(entityOp.id).toEqual(toGrcId(type.id));

    // Check types relation to SCHEMA_TYPE
    const typeRelOp = type.ops[1] as CreateRelation;
    expect(typeRelOp.type).toBe('createRelation');
    expect(typeRelOp.from).toEqual(toGrcId(type.id));
    expect(typeRelOp.to).toEqual(toGrcId(SCHEMA_TYPE));
    expect(typeRelOp.relationType).toEqual(toGrcId(TYPES_PROPERTY));

    // Check first property relation
    const prop1RelOp = type.ops[2] as CreateRelation;
    expect(prop1RelOp.type).toBe('createRelation');
    expect(prop1RelOp.from).toEqual(toGrcId(type.id));
    expect(prop1RelOp.to).toEqual(toGrcId(WEBSITE_PROPERTY));
    expect(prop1RelOp.relationType).toEqual(toGrcId(PROPERTIES));

    // Check second property relation
    const prop2RelOp = type.ops[3] as CreateRelation;
    expect(prop2RelOp.type).toBe('createRelation');
    expect(prop2RelOp.from).toEqual(toGrcId(type.id));
    expect(prop2RelOp.to).toEqual(toGrcId(AUTHORS_PROPERTY));
    expect(prop2RelOp.relationType).toEqual(toGrcId(PROPERTIES));
  });

  it('creates a type with a provided id', async () => {
    const providedId = Id('b1dc6e5c63e143bab3d4755b251a4ea1');
    const type = createType({
      id: providedId,
      name: 'Article',
    });

    expect(type).toBeDefined();
    expect(type.id).toBe('b1dc6e5c63e143bab3d4755b251a4ea1');

    // Verify the entity op uses the provided ID
    const entityOp = type.ops[0] as CreateEntity;
    expect(entityOp.id).toEqual(toGrcId(providedId));

    // Verify the type relation uses the provided ID
    const typeRelOp = type.ops[1] as CreateRelation;
    expect(typeRelOp.from).toEqual(toGrcId(providedId));
  });

  it('throws an error if the provided id is invalid', () => {
    expect(() => createType({ id: 'invalid' })).toThrow('Invalid id: "invalid" for `id` in `createType`');
  });

  it('throws an error if a property id is invalid', () => {
    expect(() =>
      createType({
        name: 'Article',
        properties: ['invalid-property'],
      }),
    ).toThrow('Invalid id: "invalid-property" for `properties` in `createType`');
  });

  it('creates a type with name, description, and cover', async () => {
    const coverId = Id('30145d36d5a54244be593d111d879ba5');
    const type = createType({
      name: 'Article',
      description: 'A news article type',
      cover: coverId,
    });

    expect(type).toBeDefined();
    // 1 createEntity + 1 cover relation + 1 type relation to SCHEMA_TYPE
    expect(type.ops.length).toBe(3);

    // Check entity op has name and description
    const entityOp = type.ops[0] as CreateEntity;
    expect(entityOp.type).toBe('createEntity');
    expect(entityOp.values.length).toBe(2); // name + description

    // Check cover relation
    const coverRelOp = type.ops[1] as CreateRelation;
    expect(coverRelOp.type).toBe('createRelation');
    expect(coverRelOp.to).toEqual(toGrcId(coverId));

    // Check type relation to SCHEMA_TYPE
    const typeRelOp = type.ops[2] as CreateRelation;
    expect(typeRelOp.type).toBe('createRelation');
    expect(typeRelOp.to).toEqual(toGrcId(SCHEMA_TYPE));
  });
});
