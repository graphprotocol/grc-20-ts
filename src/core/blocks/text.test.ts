import { expect, it } from 'vitest';
import { make } from './text.js';

it('should generate ops for a text block entity', () => {
  const ops = make({
    fromId: '5871e8f7b71948979c4dcf7c518d32ef',
    text: 'test-text',
    position: 'test-position',
  });

  const [blockTypeOp, blockMarkdownTextOp, blockRelationOp] = ops;

  // Check types relation for text block
  expect(blockTypeOp?.type).toBe('createRelation');

  // Check entity update with markdown text
  expect(blockMarkdownTextOp?.type).toBe('createEntity');

  // Check blocks relation
  expect(blockRelationOp?.type).toBe('createRelation');

  expect(ops.length).toBe(3);
});
