import type { CreateEntity, CreateRelation } from '@geoprotocol/grc-20';
import { expect, it } from 'vitest';
import { Id } from '../../id.js';
import { toGrcId } from '../../id-utils.js';
import { SystemIds } from '../../system-ids.js';
import {
  BLOCKS,
  DATA_BLOCK,
  DATA_SOURCE_TYPE_RELATION_TYPE,
  NAME_PROPERTY,
  QUERY_DATA_SOURCE,
  TYPES_PROPERTY,
} from '../ids/system.js';
import { make } from './data.js';

it('should generate ops for a data block entity', () => {
  const fromId = Id('5871e8f7b71948979c4dcf7c518d32ef');
  const ops = make({
    fromId,
    sourceType: 'QUERY',
    position: 'test-position',
  });

  const [blockTypeOp, blockSourceTypeOp, blockRelationOp] = ops;

  expect(ops.length).toBe(3);

  // Check types relation for data block
  expect(blockTypeOp?.type).toBe('createRelation');
  const typeRelOp = blockTypeOp as CreateRelation;
  expect(typeRelOp.to).toEqual(toGrcId(DATA_BLOCK));
  expect(typeRelOp.relationType).toEqual(toGrcId(TYPES_PROPERTY));

  // Check data source type relation
  expect(blockSourceTypeOp?.type).toBe('createRelation');
  const sourceTypeRelOp = blockSourceTypeOp as CreateRelation;
  expect(sourceTypeRelOp.to).toEqual(toGrcId(QUERY_DATA_SOURCE));
  expect(sourceTypeRelOp.relationType).toEqual(toGrcId(DATA_SOURCE_TYPE_RELATION_TYPE));

  // Check blocks relation
  expect(blockRelationOp?.type).toBe('createRelation');
  const blocksRelOp = blockRelationOp as CreateRelation;
  expect(blocksRelOp.from).toEqual(toGrcId(fromId));
  expect(blocksRelOp.relationType).toEqual(toGrcId(BLOCKS));
  expect(blocksRelOp.position).toBe('test-position');
});

it('should generate ops for a data block entity with a name', () => {
  const fromId = Id('5871e8f7b71948979c4dcf7c518d32ef');
  const ops = make({
    fromId,
    sourceType: 'QUERY',
    position: 'test-position',
    name: 'test-name',
  });

  const [blockTypeOp, blockSourceTypeOp, blockRelationOp, blockNameOp] = ops;

  expect(ops.length).toBe(4);

  // Check types relation for data block
  expect(blockTypeOp?.type).toBe('createRelation');
  const typeRelOp = blockTypeOp as CreateRelation;
  expect(typeRelOp.to).toEqual(toGrcId(DATA_BLOCK));
  expect(typeRelOp.relationType).toEqual(toGrcId(TYPES_PROPERTY));

  // Check data source type relation
  expect(blockSourceTypeOp?.type).toBe('createRelation');
  const sourceTypeRelOp = blockSourceTypeOp as CreateRelation;
  expect(sourceTypeRelOp.to).toEqual(toGrcId(QUERY_DATA_SOURCE));
  expect(sourceTypeRelOp.relationType).toEqual(toGrcId(DATA_SOURCE_TYPE_RELATION_TYPE));

  // Check blocks relation
  expect(blockRelationOp?.type).toBe('createRelation');
  const blocksRelOp = blockRelationOp as CreateRelation;
  expect(blocksRelOp.from).toEqual(toGrcId(fromId));
  expect(blocksRelOp.relationType).toEqual(toGrcId(BLOCKS));

  // Check name entity update
  expect(blockNameOp?.type).toBe('createEntity');
  const nameEntityOp = blockNameOp as CreateEntity;

  // Verify name value
  const nameValue = nameEntityOp.values.find(v => {
    const propBytes = v.property;
    return propBytes.every((b, i) => b === toGrcId(NAME_PROPERTY)[i]);
  });
  expect(nameValue).toBeDefined();
  expect(nameValue?.value.type).toBe('text');
  if (nameValue?.value.type === 'text') {
    expect(nameValue.value.value).toBe('test-name');
  }
});

it('should generate ops for a COLLECTION data source type', () => {
  const fromId = Id('5871e8f7b71948979c4dcf7c518d32ef');
  const ops = make({
    fromId,
    sourceType: 'COLLECTION',
    position: 'a',
  });

  const sourceTypeRelOp = ops[1] as CreateRelation;
  expect(sourceTypeRelOp.type).toBe('createRelation');
  expect(sourceTypeRelOp.to).toEqual(toGrcId(SystemIds.COLLECTION_DATA_SOURCE));
  expect(sourceTypeRelOp.relationType).toEqual(toGrcId(DATA_SOURCE_TYPE_RELATION_TYPE));
});

it('should generate ops for a GEO data source type', () => {
  const fromId = Id('5871e8f7b71948979c4dcf7c518d32ef');
  const ops = make({
    fromId,
    sourceType: 'GEO',
    position: 'a',
  });

  const sourceTypeRelOp = ops[1] as CreateRelation;
  expect(sourceTypeRelOp.type).toBe('createRelation');
  expect(sourceTypeRelOp.to).toEqual(toGrcId(SystemIds.ALL_OF_GEO_DATA_SOURCE));
  expect(sourceTypeRelOp.relationType).toEqual(toGrcId(DATA_SOURCE_TYPE_RELATION_TYPE));
});
