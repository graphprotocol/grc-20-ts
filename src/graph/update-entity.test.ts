import { describe, expect, it } from 'vitest';
import { COVER_PROPERTY, DESCRIPTION_PROPERTY, NAME_PROPERTY } from '../core/ids/system.js';
import { Id, toBase64 } from '../id.js';
import { updateEntity } from './update-entity.js';

describe('updateEntity', () => {
  const entityId = Id('b1dc6e5c-63e1-43ba-b3d4-755b251a4ea1');
  const coverId = Id('30145d36-d5a5-4244-be59-3d111d879ba5');

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
        id: toBase64(entityId),
        values: [
          {
            propertyId: toBase64(NAME_PROPERTY),
            value: 'Updated Entity',
          },
          {
            propertyId: toBase64(DESCRIPTION_PROPERTY),
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
        id: toBase64(entityId),
        values: [
          {
            propertyId: toBase64(NAME_PROPERTY),
            value: 'Updated Entity',
          },
        ],
      },
    });
  });

  it('updates an entity with cover', async () => {
    const result = updateEntity({
      id: entityId,
      cover: coverId,
    });

    expect(result).toBeDefined();
    expect(result.id).toBe(entityId);
    expect(result.ops).toHaveLength(2);

    // Check UPDATE_ENTITY op
    expect(result.ops[0]).toMatchObject({
      type: 'UPDATE_ENTITY',
      entity: {
        id: toBase64(entityId),
        values: [],
      },
    });

    // Check cover relation
    expect(result.ops[1]).toMatchObject({
      type: 'CREATE_RELATION',
      relation: {
        fromEntity: toBase64(entityId),
        toEntity: toBase64(coverId),
        type: toBase64(COVER_PROPERTY),
      },
    });
  });

  it('updates an entity with custom values', async () => {
    const customPropertyId = Id('fa269fd3-de98-49cf-90c4-4235d905a67c');
    const result = updateEntity({
      id: entityId,
      values: {
        [customPropertyId]: {
          value: 'updated custom value',
        },
      },
    });

    expect(result).toBeDefined();
    expect(result.id).toBe(entityId);
    expect(result.ops).toHaveLength(1);

    expect(result.ops[0]).toMatchObject({
      type: 'UPDATE_ENTITY',
      entity: {
        id: toBase64(entityId),
        values: [
          {
            propertyId: toBase64(customPropertyId),
            value: 'updated custom value',
          },
        ],
      },
    });
  });

  it('throws an error if the provided id is invalid', () => {
    // @ts-expect-error - invalid id type
    expect(() => updateEntity({ id: 'invalid' })).toThrow('Invalid id: "invalid" for `id` in `updateEntity`');
  });

  it('throws an error if the provided cover id is invalid', () => {
    // @ts-expect-error - invalid cover id type
    expect(() => updateEntity({ id: entityId, cover: 'invalid' })).toThrow('Invalid id: "invalid"');
  });
});
