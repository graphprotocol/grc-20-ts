import { expect, it } from 'vitest';
import { INITIAL_RELATION_INDEX_VALUE } from '~/constants.js';
import { SystemIds } from '../system-ids.js';
import { make } from './image.js';

it('should generate ops for an image entity', () => {
  const { imageId, ops } = make('https://example.com/image.png');
  const [createRelationOp, setTripleOp] = ops;

  // We check each field individually since we don't know the id of the relation
  expect(createRelationOp.type).toEqual('CREATE_RELATION');
  expect(createRelationOp.relation.type).toBe(SystemIds.TYPES_PROPERTY);
  expect(createRelationOp.relation.fromEntity).toBe(imageId);
  expect(createRelationOp.relation.toEntity).toBe(SystemIds.IMAGE_TYPE);
  expect(createRelationOp.relation.index).toBe(INITIAL_RELATION_INDEX_VALUE);

  expect(setTripleOp).toEqual({
    type: 'SET_TRIPLE',
    triple: {
      attribute: SystemIds.IMAGE_URL_PROPERTY,
      entity: imageId,
      value: {
        type: 'URL',
        value: 'https://example.com/image.png',
      },
    },
  });
});
