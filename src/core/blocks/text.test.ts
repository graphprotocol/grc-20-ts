import { expect, it } from 'vitest';
import { Id } from '../../id.js';
import { SystemIds } from '../../system-ids.js';
import { make } from './text.js';

it('should generate ops for a text block entity', () => {
  const ops = make({
    fromId: '5871e8f7b71948979c4dcf7c518d32ef',
    text: 'test-text',
    position: 'test-position',
  });

  const [blockTypeOp, blockMarkdownTextOp, blockRelationOp] = ops;

  expect(blockTypeOp?.type).toBe('CREATE_RELATION');
  if (blockTypeOp?.type === 'CREATE_RELATION') {
    expect(blockTypeOp?.relation.type).toBe(SystemIds.TYPES_PROPERTY);
    expect(blockTypeOp?.relation.toEntity).toBe(SystemIds.TEXT_BLOCK);
  }

  expect(blockMarkdownTextOp?.type).toBe('UPDATE_ENTITY');
  if (blockMarkdownTextOp?.type === 'UPDATE_ENTITY' && blockMarkdownTextOp?.entity.values?.[0]) {
    expect(blockMarkdownTextOp.entity.values[0].property).toBe(SystemIds.MARKDOWN_CONTENT);
    expect(blockMarkdownTextOp.entity.values[0].value).toBe('test-text');
  }

  expect(blockRelationOp?.type).toBe('CREATE_RELATION');
  if (blockRelationOp?.type === 'CREATE_RELATION') {
    expect(blockRelationOp?.relation.type).toBe(SystemIds.BLOCKS);
    expect(blockRelationOp?.relation.fromEntity).toBe(Id('5871e8f7b71948979c4dcf7c518d32ef'));
  }

  expect(ops.length).toBe(3);
});
