import type { CreateEntity } from '@geoprotocol/grc-20';
import { describe, expect, it } from 'vitest';
import { DESCRIPTION_PROPERTY, NAME_PROPERTY } from '../core/ids/system.js';
import { Id } from '../id.js';
import { toGrcId } from '../id-utils.js';
import { updateEntity } from './update-entity.js';

describe('updateEntity', () => {
  const entityId = Id('b1dc6e5c63e143bab3d4755b251a4ea1');
  const _coverId = Id('30145d36d5a54244be593d111d879ba5');

  it('updates an entity with name and description', async () => {
    const result = updateEntity({
      id: entityId,
      name: 'Updated Entity',
      description: 'Updated Description',
    });

    expect(result).toBeDefined();
    expect(result.id).toBe(entityId);
    expect(result.ops).toHaveLength(1);

    const entityOp = result.ops[0] as CreateEntity;
    expect(entityOp.type).toBe('createEntity');
    expect(entityOp.id).toEqual(toGrcId(entityId));

    // Verify name value
    const nameValue = entityOp.values.find(v => {
      const propBytes = v.property;
      return propBytes.every((b, i) => b === toGrcId(NAME_PROPERTY)[i]);
    });
    expect(nameValue).toBeDefined();
    expect(nameValue?.value.type).toBe('text');
    if (nameValue?.value.type === 'text') {
      expect(nameValue.value.value).toBe('Updated Entity');
    }

    // Verify description value
    const descValue = entityOp.values.find(v => {
      const propBytes = v.property;
      return propBytes.every((b, i) => b === toGrcId(DESCRIPTION_PROPERTY)[i]);
    });
    expect(descValue).toBeDefined();
    expect(descValue?.value.type).toBe('text');
    if (descValue?.value.type === 'text') {
      expect(descValue.value.value).toBe('Updated Description');
    }
  });

  it('updates an entity with only name', async () => {
    const result = updateEntity({
      id: entityId,
      name: 'Updated Entity',
    });

    expect(result).toBeDefined();
    expect(result.id).toBe(entityId);
    expect(result.ops).toHaveLength(1);

    const entityOp = result.ops[0] as CreateEntity;
    expect(entityOp.type).toBe('createEntity');
    expect(entityOp.id).toEqual(toGrcId(entityId));
    expect(entityOp.values).toHaveLength(1);

    // Verify name value
    const nameValue = entityOp.values[0];
    expect(nameValue?.property).toEqual(toGrcId(NAME_PROPERTY));
    expect(nameValue?.value.type).toBe('text');
    if (nameValue?.value.type === 'text') {
      expect(nameValue.value.value).toBe('Updated Entity');
    }
  });

  it('updates an entity with custom typed values', async () => {
    const customPropertyId = Id('fa269fd3de9849cf90c44235d905a67c');
    const result = updateEntity({
      id: entityId,
      values: [{ property: customPropertyId, type: 'text', value: 'updated custom value' }],
    });

    expect(result).toBeDefined();
    expect(result.id).toBe(entityId);
    expect(result.ops).toHaveLength(1);

    const entityOp = result.ops[0] as CreateEntity;
    expect(entityOp.type).toBe('createEntity');
    expect(entityOp.id).toEqual(toGrcId(entityId));
    expect(entityOp.values).toHaveLength(1);

    // Verify custom value
    const customValue = entityOp.values[0];
    expect(customValue?.property).toEqual(toGrcId(customPropertyId));
    expect(customValue?.value.type).toBe('text');
    if (customValue?.value.type === 'text') {
      expect(customValue.value.value).toBe('updated custom value');
    }
  });

  it('updates an entity with a float64 value', async () => {
    const customPropertyId = Id('fa269fd3de9849cf90c44235d905a67c');
    const result = updateEntity({
      id: entityId,
      values: [{ property: customPropertyId, type: 'float64', value: 42.5 }],
    });

    expect(result).toBeDefined();

    const entityOp = result.ops[0] as CreateEntity;
    expect(entityOp.type).toBe('createEntity');
    expect(entityOp.id).toEqual(toGrcId(entityId));
    expect(entityOp.values).toHaveLength(1);

    const floatValue = entityOp.values[0];
    expect(floatValue?.property).toEqual(toGrcId(customPropertyId));
    expect(floatValue?.value.type).toBe('float64');
    if (floatValue?.value.type === 'float64') {
      expect(floatValue.value.value).toBe(42.5);
    }
  });

  it('updates an entity with a float64 value with unit', async () => {
    const customPropertyId = Id('fa269fd3de9849cf90c44235d905a67c');
    const unitId = Id('016c9b1cd8a84e4d9e844e40878bb235');
    const result = updateEntity({
      id: entityId,
      values: [{ property: customPropertyId, type: 'float64', value: 42.5, unit: unitId }],
    });

    expect(result).toBeDefined();

    const entityOp = result.ops[0] as CreateEntity;
    expect(entityOp.type).toBe('createEntity');

    const floatValue = entityOp.values[0];
    expect(floatValue?.value.type).toBe('float64');
    if (floatValue?.value.type === 'float64') {
      expect(floatValue.value.value).toBe(42.5);
      expect(floatValue.value.unit).toEqual(toGrcId(unitId));
    }
  });

  it('updates an entity with a boolean value', async () => {
    const customPropertyId = Id('fa269fd3de9849cf90c44235d905a67c');
    const result = updateEntity({
      id: entityId,
      values: [{ property: customPropertyId, type: 'bool', value: true }],
    });

    expect(result).toBeDefined();

    const entityOp = result.ops[0] as CreateEntity;
    expect(entityOp.type).toBe('createEntity');

    const boolValue = entityOp.values[0];
    expect(boolValue?.property).toEqual(toGrcId(customPropertyId));
    expect(boolValue?.value.type).toBe('bool');
    if (boolValue?.value.type === 'bool') {
      expect(boolValue.value.value).toBe(true);
    }
  });

  it('updates an entity with a point value', async () => {
    const customPropertyId = Id('fa269fd3de9849cf90c44235d905a67c');
    const result = updateEntity({
      id: entityId,
      values: [{ property: customPropertyId, type: 'point', lon: -122.4, lat: 37.8 }],
    });

    expect(result).toBeDefined();

    const entityOp = result.ops[0] as CreateEntity;
    expect(entityOp.type).toBe('createEntity');

    const pointValue = entityOp.values[0];
    expect(pointValue?.property).toEqual(toGrcId(customPropertyId));
    expect(pointValue?.value.type).toBe('point');
    if (pointValue?.value.type === 'point') {
      expect(pointValue.value.lon).toBe(-122.4);
      expect(pointValue.value.lat).toBe(37.8);
    }
  });

  it('updates an entity with a date value', async () => {
    const customPropertyId = Id('fa269fd3de9849cf90c44235d905a67c');
    const result = updateEntity({
      id: entityId,
      values: [{ property: customPropertyId, type: 'date', value: '2024-03-20' }],
    });

    expect(result).toBeDefined();

    const entityOp = result.ops[0] as CreateEntity;
    expect(entityOp.type).toBe('createEntity');

    const dateValue = entityOp.values[0];
    expect(dateValue?.property).toEqual(toGrcId(customPropertyId));
    expect(dateValue?.value.type).toBe('date');
    if (dateValue?.value.type === 'date') {
      expect(dateValue.value.value).toBe('2024-03-20');
    }
  });

  it('updates an entity with a text value with language', async () => {
    const customPropertyId = Id('fa269fd3de9849cf90c44235d905a67c');
    const languageId = Id('0a4e9810f78f429ea4ceb1904a43251d');
    const result = updateEntity({
      id: entityId,
      values: [{ property: customPropertyId, type: 'text', value: 'localized text', language: languageId }],
    });

    expect(result).toBeDefined();

    const entityOp = result.ops[0] as CreateEntity;
    expect(entityOp.type).toBe('createEntity');

    const textValue = entityOp.values[0];
    expect(textValue?.value.type).toBe('text');
    if (textValue?.value.type === 'text') {
      expect(textValue.value.value).toBe('localized text');
      expect(textValue.value.language).toEqual(toGrcId(languageId));
    }
  });

  it('throws an error if the provided id is invalid', () => {
    expect(() => updateEntity({ id: 'invalid' })).toThrow('Invalid id: "invalid" for `id` in `updateEntity`');
  });

  it('throws an error if a property id in values is invalid', () => {
    expect(() =>
      updateEntity({
        id: entityId,
        values: [{ property: 'invalid-prop', type: 'text', value: 'test' }],
      }),
    ).toThrow('Invalid id: "invalid-prop" for `values` in `updateEntity`');
  });

  it('throws an error if a language id in values is invalid', () => {
    const customPropertyId = Id('fa269fd3de9849cf90c44235d905a67c');
    expect(() =>
      updateEntity({
        id: entityId,
        values: [{ property: customPropertyId, type: 'text', value: 'test', language: 'invalid-lang' }],
      }),
    ).toThrow('Invalid id: "invalid-lang" for `language` in `values` in `updateEntity`');
  });

  it('throws an error if a unit id in values is invalid', () => {
    const customPropertyId = Id('fa269fd3de9849cf90c44235d905a67c');
    expect(() =>
      updateEntity({
        id: entityId,
        values: [{ property: customPropertyId, type: 'float64', value: 42, unit: 'invalid-unit' }],
      }),
    ).toThrow('Invalid id: "invalid-unit" for `unit` in `values` in `updateEntity`');
  });
});
