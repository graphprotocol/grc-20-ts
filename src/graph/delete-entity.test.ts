import { describe, expect, it } from 'vitest';
import { Id } from '../id.js';
import { toGrcId } from '../id-utils.js';
import { deleteEntity } from './delete-entity.js';

describe('deleteEntity', () => {
  it('should create a delete entity operation with valid ID', () => {
    const id = Id('5cade5757ecd41ae83481b22ffc2f94e');
    const result = deleteEntity({ id });

    expect(result.id).toBe(id);
    expect(result.ops).toHaveLength(1);
    expect(result.ops[0]).toMatchObject({
      type: 'deleteEntity',
      id: toGrcId(id),
    });
  });

  it('should throw an error when ID validation fails', () => {
    const id = 'invalid-id';

    expect(() => deleteEntity({ id })).toThrow('Invalid id: "invalid-id"');
  });
});
