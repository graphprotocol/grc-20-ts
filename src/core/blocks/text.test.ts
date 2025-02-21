import { expect, it } from 'vitest';
import { SystemIds } from '~/src/system-ids.js';
import { make } from './text.js';

it('should generate ops for a text block entity', () => {
  const ops = make({
    fromId: 'test-entity-id',
    text: 'test-text',
    position: 'test-position',
  });

  const [blockTypeOp, blockMarkdownTextOp, blockRelationOp] = ops;

  expect(blockTypeOp?.type).toBe('CREATE_RELATION');
  if (blockTypeOp?.type === 'CREATE_RELATION') {
    expect(blockTypeOp?.relation.type).toBe(SystemIds.TYPES_PROPERTY);
    expect(blockTypeOp?.relation.toEntity).toBe(SystemIds.TEXT_BLOCK);
  }

  expect(blockMarkdownTextOp?.type).toBe('SET_TRIPLE');
  if (blockMarkdownTextOp?.type === 'SET_TRIPLE') {
    expect(blockMarkdownTextOp?.triple.attribute).toBe(SystemIds.MARKDOWN_CONTENT);
    expect(blockMarkdownTextOp?.triple.value.type).toBe('TEXT');
    expect(blockMarkdownTextOp?.triple.value.value).toBe('test-text');
  }

  expect(blockRelationOp?.type).toBe('CREATE_RELATION');
  if (blockRelationOp?.type === 'CREATE_RELATION') {
    expect(blockRelationOp?.relation.type).toBe(SystemIds.BLOCKS);
    expect(blockRelationOp?.relation.fromEntity).toBe('test-entity-id');
  }

  expect(ops.length).toBe(3);
});
