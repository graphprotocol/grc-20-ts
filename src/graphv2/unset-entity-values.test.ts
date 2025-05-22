import { describe, expect, it } from 'vitest';
import { Id, toBase64 } from '../idv2.js';
import { unsetEntityValues } from './unset-entity-values.js';

describe('unsetEntityValues', () => {
  it('should create an unset properties operation with valid ID and properties', () => {
    const id = Id('5cade575-7ecd-41ae-8348-1b22ffc2f94e');
    const properties = [Id('77e30275-8446-45ec-b3e8-99af0fcda375'), Id('3b7092c4-9035-479c-9cc9-aeb976b63c39')];
    const result = unsetEntityValues({ id, properties });

    expect(result).toEqual({
      id,
      ops: [
        {
          type: 'UNSET_ENTITY_VALUES',
          unsetEntityValues: {
            id: toBase64(id),
            properties: properties.map(property => toBase64(property)),
          },
        },
      ],
    });
  });

  it('should handle empty properties array', () => {
    const id = Id('5cade575-7ecd-41ae-8348-1b22ffc2f94e');
    const properties: Id[] = [];
    const result = unsetEntityValues({ id, properties });

    expect(result).toEqual({
      id,
      ops: [
        {
          type: 'UNSET_ENTITY_VALUES',
          unsetEntityValues: {
            id: toBase64(id),
            properties: [],
          },
        },
      ],
    });
  });
});
