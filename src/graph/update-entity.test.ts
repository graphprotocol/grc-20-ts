import { describe, expect, it } from 'vitest';
import { DESCRIPTION_PROPERTY, NAME_PROPERTY } from '../core/ids/system.js';
import { Id } from '../id.js';
import { updateEntity } from './update-entity.js';

describe('updateEntity', () => {
  const entityId = Id('b1dc6e5c-63e1-43ba-b3d4-755b251a4ea1');
  const _coverId = Id('30145d36-d5a5-4244-be59-3d111d879ba5');

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
            value: 'Updated Entity',
          },
          {
            property: DESCRIPTION_PROPERTY,
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
            value: 'Updated Entity',
          },
        ],
      },
    });
  });

  it('updates an entity with custom values', async () => {
    const customPropertyId = Id('fa269fd3-de98-49cf-90c4-4235d905a67c');
    const result = updateEntity({
      id: entityId,
      values: [{ property: customPropertyId, value: 'updated custom value' }],
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
            value: 'updated custom value',
          },
        ],
      },
    });
  });

  it('throws an error if the provided id is invalid', () => {
    expect(() => updateEntity({ id: 'invalid' })).toThrow('Invalid id: "invalid" for `id` in `updateEntity`');
  });
});
