import { expect, it } from 'vitest';
import { Id, toBase64 } from '../../id.js';
import { SystemIds } from '../../system-ids.js';
import { make } from './data.js';

it('should generate ops for a data block entity', () => {
  const ops = make({
    fromId: '5871e8f7-b719-4897-9c4d-cf7c518d32ef',
    sourceType: 'QUERY',
    position: 'test-position',
  });

  const [blockTypeOp, blockSourceTypeOp, blockRelationOp] = ops;

  expect(blockTypeOp?.type).toBe('CREATE_RELATION');
  if (blockTypeOp?.type === 'CREATE_RELATION') {
    expect(blockTypeOp?.relation.type).toBe(toBase64(SystemIds.TYPES_PROPERTY));
    expect(blockTypeOp?.relation.toEntity).toBe(toBase64(SystemIds.DATA_BLOCK));
  }

  expect(blockSourceTypeOp?.type).toBe('CREATE_RELATION');
  if (blockSourceTypeOp?.type === 'CREATE_RELATION') {
    expect(blockSourceTypeOp?.relation.type).toBe(toBase64(SystemIds.DATA_SOURCE_TYPE_RELATION_TYPE));
    expect(blockSourceTypeOp?.relation.toEntity).toBe(toBase64(SystemIds.QUERY_DATA_SOURCE));
  }

  expect(blockRelationOp?.type).toBe('CREATE_RELATION');
  if (blockRelationOp?.type === 'CREATE_RELATION') {
    expect(blockRelationOp?.relation.type).toBe(toBase64(SystemIds.BLOCKS));
    expect(blockRelationOp?.relation.fromEntity).toBe(toBase64(Id('5871e8f7-b719-4897-9c4d-cf7c518d32ef')));
  }

  expect(ops.length).toBe(3);
});

it('should generate ops for a data block entity with a name', () => {
  const ops = make({
    fromId: '5871e8f7-b719-4897-9c4d-cf7c518d32ef',
    sourceType: 'QUERY',
    position: 'test-position',
    name: 'test-name',
  });

  const [blockTypeOp, blockSourceTypeOp, blockRelationOp, blockNameOp] = ops;

  expect(blockTypeOp?.type).toBe('CREATE_RELATION');
  if (blockTypeOp?.type === 'CREATE_RELATION') {
    expect(blockTypeOp?.relation.type).toBe(toBase64(SystemIds.TYPES_PROPERTY));
    expect(blockTypeOp?.relation.toEntity).toBe(toBase64(SystemIds.DATA_BLOCK));
  }

  expect(blockSourceTypeOp?.type).toBe('CREATE_RELATION');
  if (blockSourceTypeOp?.type === 'CREATE_RELATION') {
    expect(blockSourceTypeOp?.relation.type).toBe(toBase64(SystemIds.DATA_SOURCE_TYPE_RELATION_TYPE));
    expect(blockSourceTypeOp?.relation.toEntity).toBe(toBase64(SystemIds.QUERY_DATA_SOURCE));
  }

  expect(blockRelationOp?.type).toBe('CREATE_RELATION');
  if (blockRelationOp?.type === 'CREATE_RELATION') {
    expect(blockRelationOp?.relation.type).toBe(toBase64(SystemIds.BLOCKS));
    expect(blockRelationOp?.relation.fromEntity).toBe(toBase64(Id('5871e8f7-b719-4897-9c4d-cf7c518d32ef')));
  }

  expect(blockNameOp?.type).toBe('UPDATE_ENTITY');
  if (blockNameOp?.type === 'UPDATE_ENTITY' && blockNameOp?.entity.values?.[0]) {
    expect(blockNameOp.entity.values[0].propertyId).toBe(toBase64(SystemIds.NAME_PROPERTY));
    expect(blockNameOp.entity.values[0].value).toBe('test-name');
  }
});
