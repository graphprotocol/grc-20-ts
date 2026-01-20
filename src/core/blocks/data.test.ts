import { expect, it } from 'vitest';
import { make } from './data.js';

it('should generate ops for a data block entity', () => {
  const ops = make({
    fromId: '5871e8f7b71948979c4dcf7c518d32ef',
    sourceType: 'QUERY',
    position: 'test-position',
  });

  const [blockTypeOp, blockSourceTypeOp, blockRelationOp] = ops;

  // Check types relation for data block
  expect(blockTypeOp?.type).toBe('createRelation');

  // Check data source type relation
  expect(blockSourceTypeOp?.type).toBe('createRelation');

  // Check blocks relation
  expect(blockRelationOp?.type).toBe('createRelation');

  expect(ops.length).toBe(3);
});

it('should generate ops for a data block entity with a name', () => {
  const ops = make({
    fromId: '5871e8f7b71948979c4dcf7c518d32ef',
    sourceType: 'QUERY',
    position: 'test-position',
    name: 'test-name',
  });

  const [blockTypeOp, blockSourceTypeOp, blockRelationOp, blockNameOp] = ops;

  // Check types relation for data block
  expect(blockTypeOp?.type).toBe('createRelation');

  // Check data source type relation
  expect(blockSourceTypeOp?.type).toBe('createRelation');

  // Check blocks relation
  expect(blockRelationOp?.type).toBe('createRelation');

  // Check name entity update
  expect(blockNameOp?.type).toBe('createEntity');

  expect(ops.length).toBe(4);
});
