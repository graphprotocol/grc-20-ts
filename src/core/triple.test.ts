import { expect, it } from 'vitest';
import { make, remove } from './triple.js';

it('should generate SetTripleOp for SET_TRIPLE', () => {
  const op = make({
    attributeId: 'test-attribute-id',
    entityId: 'test-entity-id',
    value: {
      type: 'TEXT',
      value: 'test value',
    },
  });

  expect(op).toEqual({
    type: 'SET_TRIPLE',
    triple: {
      attribute: 'test-attribute-id',
      entity: 'test-entity-id',
      value: {
        type: 'TEXT',
        value: 'test value',
      },
    },
  });
});

it('should generate DeleteTripleOp for DELETE_TRIPLE', () => {
  const op = remove({
    attributeId: 'test-attribute-id',
    entityId: 'test-entity-id',
  });

  expect(op).toEqual({
    type: 'DELETE_TRIPLE',
    triple: {
      attribute: 'test-attribute-id',
      entity: 'test-entity-id',
    },
  });
});
