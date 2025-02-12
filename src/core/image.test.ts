import { expect, it } from 'vitest';
import { make } from './image.js';
import { SYSTEM_IDS } from '../system-ids.js';
import { INITIAL_RELATION_INDEX_VALUE } from '~/constants.js';

it('should generate ops for an image entity', () => {
  const { imageId, ops } = make('https://example.com/image.png');
  const [createRelationOp, setTripleOp] = ops;

  // We check each field individually since we don't know the id of the relation
  expect(createRelationOp.type).toEqual('CREATE_RELATION');
  expect(createRelationOp.relation.type).toBe(SYSTEM_IDS.TYPES_ATTRIBUTE);
  expect(createRelationOp.relation.fromEntity).toBe(imageId);
  expect(createRelationOp.relation.toEntity).toBe(SYSTEM_IDS.IMAGE_TYPE);
  expect(createRelationOp.relation.index).toBe(INITIAL_RELATION_INDEX_VALUE);

  expect(setTripleOp).toEqual({
    type: 'SET_TRIPLE',
    triple: {
      attribute: SYSTEM_IDS.IMAGE_URL_ATTRIBUTE,
      entity: imageId,
      value: {
        type: 'URL',
        value: 'https://example.com/image.png',
      },
    },
  });
});
