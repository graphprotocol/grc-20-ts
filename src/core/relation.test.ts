import { expect, it } from 'vitest';
import { RELATION_INDEX } from './ids/system.js';
import { Position, PositionRange } from './position.js';
import { make, remove, reorder } from './relation.js';

it('should generate CreateRelationOp for CREATE_RELATION', () => {
  const op = make({
    relationId: 'test-relation-id',
    fromId: 'test-entity-id',
    relationTypeId: 'test-relation-type-id',
    toId: 'test-entity-id',
    position: 'test-position',
  });

  expect(op).toEqual({
    type: 'CREATE_RELATION',
    relation: {
      id: 'test-relation-id',
      type: 'test-relation-type-id',
      fromEntity: 'test-entity-id',
      toEntity: 'test-entity-id',
      index: 'test-position',
    },
  });
});

it('should generate DeleteRelationOp for DELETE_RELATION', () => {
  const op = remove('test-relation-id');

  expect(op).toEqual({
    type: 'DELETE_RELATION',
    relation: {
      id: 'test-relation-id',
    },
  });
});

it('should generate Op that places the fractional indexer between the two provided values', () => {
  const op = reorder({
    relationId: 'test-relation-id',
    beforeIndex: PositionRange.FIRST,
    afterIndex: PositionRange.LAST,
  });

  expect(op.type).toBe('SET_TRIPLE');
  expect(op.triple.attribute).toBe(RELATION_INDEX);
  expect(op.triple.entity).toBe('test-relation-id');
  expect(op.triple.value.type).toBe('TEXT');
  // @TODO how do we test that the resulting value is in-between the two indexes?
});
