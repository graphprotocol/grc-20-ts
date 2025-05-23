import { describe, expect, it } from 'vitest';
import { Id, toBase64 } from '../id.js';
import { deleteEntity } from './delete-entity.js';

describe('deleteEntity', () => {
  it('should create a delete entity operation with valid ID', () => {
    const id = Id('5cade575-7ecd-41ae-8348-1b22ffc2f94e');
    const result = deleteEntity({ id });

    expect(result).toEqual({
      id,
      ops: [
        {
          type: 'DELETE_ENTITY',
          id: toBase64(id),
        },
      ],
    });
  });

  it('should throw an error when ID validation fails', () => {
    const id = 'invalid-id';

    expect(() => deleteEntity({ id })).toThrow('Invalid id: "invalid-id"');
  });
});
