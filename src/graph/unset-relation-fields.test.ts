import { describe, expect, it } from 'vitest';
import { Id } from '../id.js';
import { unsetRelationFields } from './unset-relation-fields.js';

describe('unsetRelationFields', () => {
  it('should create an unset relation operation with valid parameters', () => {
    const id = Id('5cade575-7ecd-41ae-8348-1b22ffc2f94e');
    const fromSpace = true;
    const fromVersion = true;
    const toSpace = true;
    const toVersion = true;
    const position = true;
    const verified = true;

    const result = unsetRelationFields({
      id,
      fromSpace,
      fromVersion,
      toSpace,
      toVersion,
      position,
      verified,
    });

    expect(result).toEqual({
      id,
      ops: [
        {
          type: 'UNSET_RELATION_FIELDS',
          unsetRelationFields: {
            id,
            fromSpace,
            fromVersion,
            toSpace,
            toVersion,
            position,
            verified,
          },
        },
      ],
    });
  });

  it('should handle optional parameters', () => {
    const id = Id('5cade575-7ecd-41ae-8348-1b22ffc2f94e');
    const fromSpace = true;
    const toSpace = true;
    const position = true;
    const verified = true;

    const result = unsetRelationFields({
      id,
      fromSpace,
      toSpace,
      position,
      verified,
    });

    expect(result).toEqual({
      id,
      ops: [
        {
          type: 'UNSET_RELATION_FIELDS',
          unsetRelationFields: {
            id,
            fromSpace,
            toSpace,
            position,
            verified,
          },
        },
      ],
    });
  });
});
