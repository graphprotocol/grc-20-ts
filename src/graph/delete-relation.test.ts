import { describe, expect, it } from 'vitest';
import { Id } from '../id.js';
import { toGrcId } from '../id-utils.js';
import { deleteRelation } from './delete-relation.js';

describe('deleteRelation', () => {
  it('should create a delete relation operation with valid ID', () => {
    const id = Id('5cade5757ecd41ae83481b22ffc2f94e');
    const result = deleteRelation({ id });

    expect(result.id).toBe(id);
    expect(result.ops).toHaveLength(1);
    expect(result.ops[0]).toMatchObject({
      type: 'deleteRelation',
      id: toGrcId(id),
    });
  });

  it('should throw an error when ID validation fails', () => {
    const id = 'invalid-id';

    expect(() => deleteRelation({ id })).toThrow('Invalid id: "invalid-id"');
  });
});
