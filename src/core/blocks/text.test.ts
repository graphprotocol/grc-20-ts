import { expect, it } from 'vitest';
import { Id, toBase64 } from '~/src/idv2.js';
import { SystemIds } from '../../system-ids-v2.js';
import { make } from './text.js';

it('should generate ops for a text block entity', () => {
  const ops = make({
    fromId: '5871e8f7-b719-4897-9c4d-cf7c518d32ef',
    text: 'test-text',
    position: 'test-position',
  });

  const [blockTypeOp, blockMarkdownTextOp, blockRelationOp] = ops;

  expect(blockTypeOp?.type).toBe('CREATE_RELATION');
  if (blockTypeOp?.type === 'CREATE_RELATION') {
    expect(blockTypeOp?.relation.type).toBe(toBase64(SystemIds.TYPES_PROPERTY));
    expect(blockTypeOp?.relation.toEntity).toBe(toBase64(SystemIds.TEXT_BLOCK));
  }

  expect(blockMarkdownTextOp?.type).toBe('UPDATE_ENTITY');
  if (blockMarkdownTextOp?.type === 'UPDATE_ENTITY' && blockMarkdownTextOp?.entity.values?.[0]) {
    expect(blockMarkdownTextOp.entity.values[0].propertyId).toBe(toBase64(SystemIds.MARKDOWN_CONTENT));
    expect(blockMarkdownTextOp.entity.values[0].value).toBe('test-text');
  }

  expect(blockRelationOp?.type).toBe('CREATE_RELATION');
  if (blockRelationOp?.type === 'CREATE_RELATION') {
    expect(blockRelationOp?.relation.type).toBe(toBase64(SystemIds.BLOCKS));
    expect(blockRelationOp?.relation.fromEntity).toBe(toBase64(Id('5871e8f7-b719-4897-9c4d-cf7c518d32ef')));
  }

  expect(ops.length).toBe(3);
});
