import { describe, expect, it } from 'vitest';
import { DESCRIPTION_PROPERTY, NAME_PROPERTY } from '../core/ids/system.js';
import { Id } from '../id.js';
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

    expect(result.ops[0]).toMatchObject({
      type: 'UPDATE_ENTITY',
      entity: {
        id: entityId,
        values: [
          {
            property: NAME_PROPERTY,
            type: 'text',
            value: 'Updated Entity',
          },
          {
            property: DESCRIPTION_PROPERTY,
            type: 'text',
            value: 'Updated Description',
          },
        ],
      },
    });
  });

  it('updates an entity with only name', async () => {
    const result = updateEntity({
      id: entityId,
      name: 'Updated Entity',
    });

    expect(result).toBeDefined();
    expect(result.id).toBe(entityId);
    expect(result.ops).toHaveLength(1);

    expect(result.ops[0]).toMatchObject({
      type: 'UPDATE_ENTITY',
      entity: {
        id: entityId,
        values: [
          {
            property: NAME_PROPERTY,
            type: 'text',
            value: 'Updated Entity',
          },
        ],
      },
    });
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

    expect(result.ops[0]).toMatchObject({
      type: 'UPDATE_ENTITY',
      entity: {
        id: entityId,
        values: [
          {
            property: customPropertyId,
            type: 'text',
            value: 'updated custom value',
          },
        ],
      },
    });
  });

  it('updates an entity with a float64 value', async () => {
    const customPropertyId = Id('fa269fd3de9849cf90c44235d905a67c');
    const result = updateEntity({
      id: entityId,
      values: [{ property: customPropertyId, type: 'float64', value: 42.5 }],
    });

    expect(result).toBeDefined();
    expect(result.ops[0]).toMatchObject({
      type: 'UPDATE_ENTITY',
      entity: {
        id: entityId,
        values: [
          {
            property: customPropertyId,
            type: 'float64',
            value: 42.5,
          },
        ],
      },
    });
  });

  it('throws an error if the provided id is invalid', () => {
    expect(() => updateEntity({ id: 'invalid' })).toThrow('Invalid id: "invalid" for `id` in `updateEntity`');
  });
});
