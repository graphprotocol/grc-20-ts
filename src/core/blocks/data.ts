/**
 * This module provides utility functions for working with data blocks
 * in TypeScript.
 *
 * @since 0.0.6
 */

import type { Op } from '@geoprotocol/grc-20';
import { createRelation } from '../../graph/create-relation.js';
import { updateEntity } from '../../graph/update-entity.js';
import { Id } from '../../id.js';
import { generate } from '../../id-utils.js';
import { SystemIds } from '../../system-ids.js';
import { BLOCKS, DATA_BLOCK, DATA_SOURCE_TYPE_RELATION_TYPE, NAME_PROPERTY, TYPES_PROPERTY } from '../ids/system.js';

type DataBlockSourceType = 'QUERY' | 'COLLECTION' | 'GEO';

function getSourceTypeId(sourceType: DataBlockSourceType) {
  switch (sourceType) {
    case 'COLLECTION':
      return SystemIds.COLLECTION_DATA_SOURCE;
    case 'GEO':
      return SystemIds.ALL_OF_GEO_DATA_SOURCE;
    case 'QUERY':
      return SystemIds.QUERY_DATA_SOURCE;
  }
}

type DataBlockParams = {
  fromId: string;
  sourceType: DataBlockSourceType;
  position?: string;
  name?: string;
};

/**
 * Returns the ops to create an entity representing a Data Block.
 *
 * @example
 * ```ts
 * const ops = DataBlock.make({
 *   fromId: 'from-id',
 *   sourceType: 'COLLECTION',
 *   // optional
 *   position: 'position-string',
 *   name: 'name',
 * });
 * ```
 *
 * @param param args {@link TextBlockParams}
 * @returns ops – The ops for the Data Block entity: {@link Op}[]
 */
export function make({ fromId, sourceType, position, name }: DataBlockParams): Op[] {
  const newBlockId = generate();

  const ops: Op[] = [];
  const { ops: dataBlockTypeOps } = createRelation({
    fromEntity: newBlockId,
    type: TYPES_PROPERTY,
    toEntity: DATA_BLOCK,
  });
  ops.push(...dataBlockTypeOps);

  const { ops: dataBlockSourceTypeOps } = createRelation({
    fromEntity: newBlockId,
    type: DATA_SOURCE_TYPE_RELATION_TYPE,
    toEntity: getSourceTypeId(sourceType),
  });
  ops.push(...dataBlockSourceTypeOps);

  const { ops: dataBlockRelationOps } = createRelation({
    fromEntity: Id(fromId),
    type: BLOCKS,
    toEntity: Id(newBlockId),
    position,
  });
  ops.push(...dataBlockRelationOps);

  if (name) {
    const { ops: nameOps } = updateEntity({
      id: newBlockId,
      values: [
        {
          property: NAME_PROPERTY,
          type: 'text',
          value: name,
        },
      ],
    });
    ops.push(...nameOps);
  }

  return ops;
}
