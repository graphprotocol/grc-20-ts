import { expect, it } from 'vitest';
import { SystemIds } from '~/src/system-ids.js';
import { make } from './data.js';

it('should generate ops for a data block entity', () => {
  const ops = make({
    fromId: 'test-entity-id',
    sourceType: 'QUERY',
    position: 'test-position',
  });

  const [blockTypeOp, blockSourceTypeOp, blockRelationOp] = ops;

  expect(blockTypeOp?.type).toBe('CREATE_RELATION');
  if (blockTypeOp?.type === 'CREATE_RELATION') {
    expect(blockTypeOp?.relation.type).toBe(SystemIds.TYPES_PROPERTY);
    expect(blockTypeOp?.relation.toEntity).toBe(SystemIds.DATA_BLOCK);
  }

  expect(blockSourceTypeOp?.type).toBe('CREATE_RELATION');
  if (blockSourceTypeOp?.type === 'CREATE_RELATION') {
    expect(blockSourceTypeOp?.relation.type).toBe(SystemIds.DATA_SOURCE_TYPE_RELATION_TYPE);
    expect(blockSourceTypeOp?.relation.toEntity).toBe(SystemIds.QUERY_DATA_SOURCE);
  }

  expect(blockRelationOp?.type).toBe('CREATE_RELATION');
  if (blockRelationOp?.type === 'CREATE_RELATION') {
    expect(blockRelationOp?.relation.type).toBe(SystemIds.BLOCKS);
    expect(blockRelationOp?.relation.fromEntity).toBe('test-entity-id');
  }

  expect(ops.length).toBe(3);
});

it('should generate ops for a data block entity with a name', () => {
  const ops = make({
    fromId: 'test-entity-id',
    sourceType: 'QUERY',
    position: 'test-position',
    name: 'test-name',
  });

  const [blockTypeOp, blockSourceTypeOp, blockRelationOp, blockNameOp] = ops;

  expect(blockTypeOp?.type).toBe('CREATE_RELATION');
  if (blockTypeOp?.type === 'CREATE_RELATION') {
    expect(blockTypeOp?.relation.type).toBe(SystemIds.TYPES_PROPERTY);
    expect(blockTypeOp?.relation.toEntity).toBe(SystemIds.DATA_BLOCK);
  }

  expect(blockSourceTypeOp?.type).toBe('CREATE_RELATION');
  if (blockSourceTypeOp?.type === 'CREATE_RELATION') {
    expect(blockSourceTypeOp?.relation.type).toBe(SystemIds.DATA_SOURCE_TYPE_RELATION_TYPE);
    expect(blockSourceTypeOp?.relation.toEntity).toBe(SystemIds.QUERY_DATA_SOURCE);
  }

  expect(blockRelationOp?.type).toBe('CREATE_RELATION');
  if (blockRelationOp?.type === 'CREATE_RELATION') {
    expect(blockRelationOp?.relation.type).toBe(SystemIds.BLOCKS);
    expect(blockRelationOp?.relation.fromEntity).toBe('test-entity-id');
  }

  expect(blockNameOp?.type).toBe('SET_TRIPLE');
  if (blockNameOp?.type === 'SET_TRIPLE') {
    expect(blockNameOp?.triple.attribute).toBe(SystemIds.NAME_PROPERTY);
    expect(blockNameOp?.triple.value.type).toBe('TEXT');
    expect(blockNameOp?.triple.value.value).toBe('test-name');
  }
});
