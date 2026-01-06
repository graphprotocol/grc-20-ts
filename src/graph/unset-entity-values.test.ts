import { describe, expect, it } from 'vitest';
import { Id } from '../id.js';
import { unsetEntityValues } from './unset-entity-values.js';

describe('unsetEntityValues', () => {
  it('should create an unset properties operation with valid ID and properties', () => {
    const id = Id('5cade5757ecd41ae83481b22ffc2f94e');
    const properties = [Id('77e30275844645ecb3e899af0fcda375'), Id('3b7092c49035479c9cc9aeb976b63c39')];
    const result = unsetEntityValues({ id, properties });

    expect(result).toEqual({
      id,
      ops: [
        {
          type: 'UNSET_ENTITY_VALUES',
          unsetEntityValues: {
            id: id,
            properties: properties,
          },
        },
      ],
    });
  });

  it('should handle empty properties array', () => {
    const id = Id('5cade5757ecd41ae83481b22ffc2f94e');
    const properties: Id[] = [];
    const result = unsetEntityValues({ id, properties });

    expect(result).toEqual({
      id,
      ops: [
        {
          type: 'UNSET_ENTITY_VALUES',
          unsetEntityValues: {
            id: id,
            properties: [],
          },
        },
      ],
    });
  });
});
