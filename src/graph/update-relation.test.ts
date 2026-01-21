import type { Op, UpdateRelation } from '@geoprotocol/grc-20';
import { describe, expect, it } from 'vitest';
import { Id } from '../id.js';
import { toGrcId } from '../id-utils.js';
import { updateRelation } from './update-relation.js';

const isUpdateRelationOp = (op: Op): op is UpdateRelation => {
  return op.type === 'updateRelation';
};

describe('updateRelation', () => {
  const relationId = Id('30145d36d5a54244be593d111d879ba5');
  const fromSpaceId = Id('c1dc6e5c63e143bab3d4755b251a4ea2');
  const toSpaceId = Id('d1dc6e5c63e143bab3d4755b251a4ea3');
  const fromVersionId = Id('e1dc6e5c63e143bab3d4755b251a4ea4');
  const toVersionId = Id('f1dc6e5c63e143bab3d4755b251a4ea5');

  it('updates a relation with only position', () => {
    const result = updateRelation({
      id: relationId,
      position: '1',
    });

    expect(result).toBeDefined();
    expect(result.id).toBe(relationId);
    expect(result.ops).toHaveLength(1);

    const op = result.ops[0] as UpdateRelation;
    expect(op.type).toBe('updateRelation');
    expect(isUpdateRelationOp(op)).toBe(true);
    expect(op.id).toEqual(toGrcId(relationId));
    expect(op.position).toBe('1');
    expect(op.unset).toEqual([]);
  });

  it('updates a relation with position', () => {
    const result = updateRelation({
      id: relationId,
      position: '2',
    });

    expect(result).toBeDefined();
    expect(result.id).toBe(relationId);
    expect(result.ops).toHaveLength(1);

    const op = result.ops[0] as UpdateRelation;
    expect(op.type).toBe('updateRelation');
    expect(op.id).toEqual(toGrcId(relationId));
    expect(op.position).toBe('2');
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

    const op = result.ops[0] as UpdateRelation;
    expect(op.type).toBe('updateRelation');
    expect(op.id).toEqual(toGrcId(relationId));
    expect(op.fromSpace).toEqual(toGrcId(fromSpaceId));
    expect(op.toSpace).toEqual(toGrcId(toSpaceId));
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

    const op = result.ops[0] as UpdateRelation;
    expect(op.type).toBe('updateRelation');
    expect(op.id).toEqual(toGrcId(relationId));
    expect(op.fromVersion).toEqual(toGrcId(fromVersionId));
    expect(op.toVersion).toEqual(toGrcId(toVersionId));
  });

  it('updates a relation with all optional fields', () => {
    const result = updateRelation({
      id: relationId,
      position: '3',
      fromSpace: fromSpaceId,
      toSpace: toSpaceId,
      fromVersion: fromVersionId,
      toVersion: toVersionId,
    });

    expect(result).toBeDefined();
    expect(result.id).toBe(relationId);
    expect(result.ops).toHaveLength(1);

    const op = result.ops[0] as UpdateRelation;
    expect(op.type).toBe('updateRelation');
    expect(op.id).toEqual(toGrcId(relationId));
    expect(op.position).toBe('3');
    expect(op.fromSpace).toEqual(toGrcId(fromSpaceId));
    expect(op.toSpace).toEqual(toGrcId(toSpaceId));
    expect(op.fromVersion).toEqual(toGrcId(fromVersionId));
    expect(op.toVersion).toEqual(toGrcId(toVersionId));
  });

  it('updates a relation with only fromSpace', () => {
    const result = updateRelation({
      id: relationId,
      fromSpace: fromSpaceId,
    });

    expect(result).toBeDefined();
    expect(result.id).toBe(relationId);
    expect(result.ops).toHaveLength(1);

    const op = result.ops[0] as UpdateRelation;
    expect(op.type).toBe('updateRelation');
    expect(op.id).toEqual(toGrcId(relationId));
    expect(op.fromSpace).toEqual(toGrcId(fromSpaceId));
    expect(op.toSpace).toBeUndefined();
    expect(op.fromVersion).toBeUndefined();
    expect(op.toVersion).toBeUndefined();
    expect(op.position).toBeUndefined();
  });

  it('updates a relation with only toSpace', () => {
    const result = updateRelation({
      id: relationId,
      toSpace: toSpaceId,
    });

    expect(result).toBeDefined();
    expect(result.id).toBe(relationId);
    expect(result.ops).toHaveLength(1);

    const op = result.ops[0] as UpdateRelation;
    expect(op.type).toBe('updateRelation');
    expect(op.id).toEqual(toGrcId(relationId));
    expect(op.toSpace).toEqual(toGrcId(toSpaceId));
    expect(op.fromSpace).toBeUndefined();
  });

  it('updates a relation with only fromVersion', () => {
    const result = updateRelation({
      id: relationId,
      fromVersion: fromVersionId,
    });

    expect(result).toBeDefined();
    expect(result.id).toBe(relationId);
    expect(result.ops).toHaveLength(1);

    const op = result.ops[0] as UpdateRelation;
    expect(op.type).toBe('updateRelation');
    expect(op.id).toEqual(toGrcId(relationId));
    expect(op.fromVersion).toEqual(toGrcId(fromVersionId));
    expect(op.toVersion).toBeUndefined();
  });

  it('updates a relation with only toVersion', () => {
    const result = updateRelation({
      id: relationId,
      toVersion: toVersionId,
    });

    expect(result).toBeDefined();
    expect(result.id).toBe(relationId);
    expect(result.ops).toHaveLength(1);

    const op = result.ops[0] as UpdateRelation;
    expect(op.type).toBe('updateRelation');
    expect(op.id).toEqual(toGrcId(relationId));
    expect(op.toVersion).toEqual(toGrcId(toVersionId));
    expect(op.fromVersion).toBeUndefined();
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
    });

    expect(result).toBeDefined();
    expect(result.id).toBe(relationId);
    expect(result.ops).toHaveLength(1);

    const op = result.ops[0] as UpdateRelation;
    expect(op.type).toBe('updateRelation');
    expect(op.id).toEqual(toGrcId(relationId));
    expect(op.position).toBeUndefined();
    expect(op.fromSpace).toBeUndefined();
    expect(op.toSpace).toBeUndefined();
    expect(op.fromVersion).toBeUndefined();
    expect(op.toVersion).toBeUndefined();
    expect(op.unset).toEqual([]);
  });

  it('validates the op structure correctly', () => {
    const result = updateRelation({
      id: relationId,
      position: 'test-position',
    });

    expect(result.ops).toHaveLength(1);
    const op = result.ops[0];
    expect(op).toBeDefined();
    expect(op?.type).toBe('updateRelation');

    if (op && isUpdateRelationOp(op)) {
      expect(op.id).toEqual(toGrcId(relationId));
      expect(op.position).toBe('test-position');
    } else {
      throw new Error('Expected op to be defined and of type updateRelation');
    }
  });

  it('creates an updateRelation op with empty unset array by default', () => {
    const result = updateRelation({
      id: relationId,
      position: 'a',
    });

    const op = result.ops[0] as UpdateRelation;
    expect(op.unset).toEqual([]);
  });
});
