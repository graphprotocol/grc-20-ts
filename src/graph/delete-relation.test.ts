import { describe, expect, it } from 'vitest';
import { Id } from '../id.js';
import { deleteRelation } from './delete-relation.js';

describe('deleteRelation', () => {
  it('should create a delete relation operation with valid ID', () => {
    const id = Id('5cade575-7ecd-41ae-8348-1b22ffc2f94e');
    const result = deleteRelation({ id });

    expect(result).toEqual({
      id,
      ops: [
        {
          type: 'DELETE_RELATION',
          id: id,
        },
      ],
    });
  });

  it('should throw an error when ID validation fails', () => {
    const id = 'invalid-id';

    expect(() => deleteRelation({ id })).toThrow('Invalid id: "invalid-id"');
  });
});
