import { expect, it } from 'vitest';
import { make } from './text.js';
import { SYSTEM_IDS } from '~/src/system-ids.js';

it('should generate ops for a text block entity', () => {
  const ops = make({
    fromId: 'test-entity-id',
    text: 'test-text',
    position: 'test-position',
  });

  const [blockTypeOp, blockMarkdownTextOp, blockRelationOp] = ops;

  expect(blockTypeOp?.type).toBe('CREATE_RELATION');
  if (blockTypeOp?.type === 'CREATE_RELATION') {
    expect(blockTypeOp?.relation.type).toBe(SYSTEM_IDS.TYPES_ATTRIBUTE);
    expect(blockTypeOp?.relation.toEntity).toBe(SYSTEM_IDS.TEXT_BLOCK);
  }

  expect(blockMarkdownTextOp?.type).toBe('SET_TRIPLE');
  if (blockMarkdownTextOp?.type === 'SET_TRIPLE') {
    expect(blockMarkdownTextOp?.triple.attribute).toBe(SYSTEM_IDS.MARKDOWN_CONTENT);
    expect(blockMarkdownTextOp?.triple.value.type).toBe('TEXT');
    expect(blockMarkdownTextOp?.triple.value.value).toBe('test-text');
  }

  expect(blockRelationOp?.type).toBe('CREATE_RELATION');
  if (blockRelationOp?.type === 'CREATE_RELATION') {
    expect(blockRelationOp?.relation.type).toBe(SYSTEM_IDS.BLOCKS);
    expect(blockRelationOp?.relation.fromEntity).toBe('test-entity-id');
  }

  expect(ops.length).toBe(3);
});
