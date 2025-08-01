import { describe, expect, it } from 'vitest';
import { Id } from '../id.js';
import type { Op, UpdateRelationOp } from '../types.js';
import { updateRelation } from './update-relation.js';

const isUpdateRelationOp = (op: Op): op is UpdateRelationOp => {
  return op.type === 'UPDATE_RELATION';
};

describe('updateRelation', () => {
  const relationId = Id('30145d36-d5a5-4244-be59-3d111d879ba5');
  const fromSpaceId = Id('c1dc6e5c-63e1-43ba-b3d4-755b251a4ea2');
  const toSpaceId = Id('d1dc6e5c-63e1-43ba-b3d4-755b251a4ea3');
  const fromVersionId = Id('e1dc6e5c-63e1-43ba-b3d4-755b251a4ea4');
  const toVersionId = Id('f1dc6e5c-63e1-43ba-b3d4-755b251a4ea5');

  it('updates a relation with only position', () => {
    const result = updateRelation({
      id: relationId,
      position: '1',
    });

    expect(result).toBeDefined();
    expect(result.id).toBe(relationId);
    expect(result.ops).toHaveLength(1);
    expect(result.ops[0]).toMatchObject({
      type: 'UPDATE_RELATION',
      relation: {
        id: relationId,
        position: '1',
      },
    });
  });

  it('updates a relation with position and verified', () => {
    const result = updateRelation({
      id: relationId,
      position: '2',
      verified: true,
    });

    expect(result).toBeDefined();
    expect(result.id).toBe(relationId);
    expect(result.ops).toHaveLength(1);
    expect(result.ops[0]).toMatchObject({
      type: 'UPDATE_RELATION',
      relation: {
        id: relationId,
        position: '2',
        verified: true,
      },
    });
  });

  it('updates a relation with fromSpace and toSpace', () => {
    const result = updateRelation({
      id: relationId,
      fromSpace: fromSpaceId,
      toSpace: toSpaceId,
    });

    expect(result).toBeDefined();
    expect(result.id).toBe(relationId);
    expect(result.ops).toHaveLength(1);
    expect(result.ops[0]).toMatchObject({
      type: 'UPDATE_RELATION',
      relation: {
        id: relationId,
        fromSpace: fromSpaceId,
        toSpace: toSpaceId,
      },
    });
  });

  it('updates a relation with fromVersion and toVersion', () => {
    const result = updateRelation({
      id: relationId,
      fromVersion: fromVersionId,
      toVersion: toVersionId,
    });

    expect(result).toBeDefined();
    expect(result.id).toBe(relationId);
    expect(result.ops).toHaveLength(1);
    expect(result.ops[0]).toMatchObject({
      type: 'UPDATE_RELATION',
      relation: {
        id: relationId,
        fromVersion: fromVersionId,
        toVersion: toVersionId,
      },
    });
  });

  it('updates a relation with all optional fields', () => {
    const result = updateRelation({
      id: relationId,
      position: '3',
      fromSpace: fromSpaceId,
      toSpace: toSpaceId,
      fromVersion: fromVersionId,
      toVersion: toVersionId,
      verified: false,
    });

    expect(result).toBeDefined();
    expect(result.id).toBe(relationId);
    expect(result.ops).toHaveLength(1);
    expect(result.ops[0]).toMatchObject({
      type: 'UPDATE_RELATION',
      relation: {
        id: relationId,
        position: '3',
        fromSpace: fromSpaceId,
        toSpace: toSpaceId,
        fromVersion: fromVersionId,
        toVersion: toVersionId,
        verified: false,
      },
    });
  });

  it('updates a relation with only verified field', () => {
    const result = updateRelation({
      id: relationId,
      verified: true,
    });

    expect(result).toBeDefined();
    expect(result.id).toBe(relationId);
    expect(result.ops).toHaveLength(1);
    expect(result.ops[0]).toMatchObject({
      type: 'UPDATE_RELATION',
      relation: {
        id: relationId,
        verified: true,
      },
    });
  });

  it('updates a relation with only fromSpace', () => {
    const result = updateRelation({
      id: relationId,
      fromSpace: fromSpaceId,
    });

    expect(result).toBeDefined();
    expect(result.id).toBe(relationId);
    expect(result.ops).toHaveLength(1);
    expect(result.ops[0]).toMatchObject({
      type: 'UPDATE_RELATION',
      relation: {
        id: relationId,
        fromSpace: fromSpaceId,
      },
    });
  });

  it('updates a relation with only toSpace', () => {
    const result = updateRelation({
      id: relationId,
      toSpace: toSpaceId,
    });

    expect(result).toBeDefined();
    expect(result.id).toBe(relationId);
    expect(result.ops).toHaveLength(1);
    expect(result.ops[0]).toMatchObject({
      type: 'UPDATE_RELATION',
      relation: {
        id: relationId,
        toSpace: toSpaceId,
      },
    });
  });

  it('updates a relation with only fromVersion', () => {
    const result = updateRelation({
      id: relationId,
      fromVersion: fromVersionId,
    });

    expect(result).toBeDefined();
    expect(result.id).toBe(relationId);
    expect(result.ops).toHaveLength(1);
    expect(result.ops[0]).toMatchObject({
      type: 'UPDATE_RELATION',
      relation: {
        id: relationId,
        fromVersion: fromVersionId,
      },
    });
  });

  it('updates a relation with only toVersion', () => {
    const result = updateRelation({
      id: relationId,
      toVersion: toVersionId,
    });

    expect(result).toBeDefined();
    expect(result.id).toBe(relationId);
    expect(result.ops).toHaveLength(1);
    expect(result.ops[0]).toMatchObject({
      type: 'UPDATE_RELATION',
      relation: {
        id: relationId,
        toVersion: toVersionId,
      },
    });
  });

  it('throws an error if the relation id is invalid', () => {
    expect(() =>
      updateRelation({
        id: 'invalid',
        position: '1',
      }),
    ).toThrow('Invalid id: "invalid" for `id` in `updateRelation`');
  });

  it('throws an error if fromSpace is invalid', () => {
    expect(() =>
      updateRelation({
        id: relationId,
        fromSpace: 'invalid',
      }),
    ).toThrow('Invalid id: "invalid" for `fromSpace` in `updateRelation`');
  });

  it('throws an error if toSpace is invalid', () => {
    expect(() =>
      updateRelation({
        id: relationId,
        toSpace: 'invalid',
      }),
    ).toThrow('Invalid id: "invalid" for `toSpace` in `updateRelation`');
  });

  it('throws an error if fromVersion is invalid', () => {
    expect(() =>
      updateRelation({
        id: relationId,
        fromVersion: 'invalid',
      }),
    ).toThrow('Invalid id: "invalid" for `fromVersion` in `updateRelation`');
  });

  it('throws an error if toVersion is invalid', () => {
    expect(() =>
      updateRelation({
        id: relationId,
        toVersion: 'invalid',
      }),
    ).toThrow('Invalid id: "invalid" for `toVersion` in `updateRelation`');
  });

  it('handles undefined values correctly', () => {
    const result = updateRelation({
      id: relationId,
      position: undefined,
      fromSpace: undefined,
      toSpace: undefined,
      fromVersion: undefined,
      toVersion: undefined,
      verified: undefined,
    });

    expect(result).toBeDefined();
    expect(result.id).toBe(relationId);
    expect(result.ops).toHaveLength(1);
    expect(result.ops[0]).toMatchObject({
      type: 'UPDATE_RELATION',
      relation: {
        id: relationId,
        position: undefined,
        fromSpace: undefined,
        toSpace: undefined,
        fromVersion: undefined,
        toVersion: undefined,
        verified: undefined,
      },
    });
  });

  it('validates the op structure correctly', () => {
    const result = updateRelation({
      id: relationId,
      position: 'test-position',
      verified: true,
    });

    const op = result.ops[0];
    expect(isUpdateRelationOp(op)).toBe(true);
    
    if (isUpdateRelationOp(op)) {
      expect(op.relation.id).toBe(relationId);
      expect(op.relation.position).toBe('test-position');
      expect(op.relation.verified).toBe(true);
    }
  });
}); 