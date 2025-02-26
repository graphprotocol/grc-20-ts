import { expect, it } from 'vitest';
import { INITIAL_RELATION_INDEX_VALUE } from '~/constants.js';
import { SystemIds } from '../system-ids.js';
import { make } from './image.js';

it('should generate ops for an image entity', () => {
  const { id, ops } = make({ cid: 'https://example.com/image.png' });

  // We check each field individually since we don't know the id of the relation
  expect(typeof id).toBe('string');
  expect(ops.length).toBe(2);
  if (ops[0]?.type === 'CREATE_RELATION') {
    expect(ops[0].relation.type).toBe(SystemIds.TYPES_PROPERTY);
    expect(ops[0].relation.fromEntity).toBe(id);
    expect(ops[0].relation.toEntity).toBe(SystemIds.IMAGE_TYPE);
    expect(ops[0].relation.index).toBe(INITIAL_RELATION_INDEX_VALUE);
  }

  if (ops[1]?.type === 'SET_TRIPLE') {
    expect(ops[1].triple.attribute).toBe(SystemIds.IMAGE_URL_PROPERTY);
    expect(ops[1].triple.entity).toBe(id);
    expect(ops[1].triple.value.type).toBe('URL');
    expect(ops[1].triple.value.value).toBe('https://example.com/image.png');
  }
});

it('should generate ops for an image entity with dimensions', () => {
  const { id, ops } = make({ cid: 'https://example.com/image.png', dimensions: { width: 200, height: 100 } });

  expect(typeof id).toBe('string');
  expect(ops.length).toBe(4);
  if (ops[0]?.type === 'CREATE_RELATION') {
    expect(ops[0].relation.type).toBe(SystemIds.TYPES_PROPERTY);
    expect(ops[0].relation.fromEntity).toBe(id);
    expect(ops[0].relation.toEntity).toBe(SystemIds.IMAGE_TYPE);
    expect(ops[0].relation.index).toBe(INITIAL_RELATION_INDEX_VALUE);
  }
  if (ops[1]?.type === 'SET_TRIPLE') {
    expect(ops[1].triple.attribute).toBe(SystemIds.IMAGE_URL_PROPERTY);
    expect(ops[1].triple.entity).toBe(id);
    expect(ops[1].triple.value.type).toBe('URL');
    expect(ops[1].triple.value.value).toBe('https://example.com/image.png');
  }
  if (ops[2]?.type === 'SET_TRIPLE') {
    expect(ops[2].triple.attribute).toBe(SystemIds.IMAGE_HEIGHT_PROPERTY);
    expect(ops[2].triple.entity).toBe(id);
    expect(ops[2].triple.value.type).toBe('NUMBER');
    expect(ops[2].triple.value.value).toBe('100');
  }
  if (ops[3]?.type === 'SET_TRIPLE') {
    expect(ops[3].triple.attribute).toBe(SystemIds.IMAGE_WIDTH_PROPERTY);
    expect(ops[3].triple.entity).toBe(id);
    expect(ops[3].triple.value.type).toBe('NUMBER');
    expect(ops[3].triple.value.value).toBe('200');
  }
});
