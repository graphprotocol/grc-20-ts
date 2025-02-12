/**
 * This module provides utility functions for working with knowledge graph
 * images in TypeScript.
 *
 * @since 0.0.6
 */

import { make as makeId } from '../id.js';
import { Relation } from '../relation.js';
import { SYSTEM_IDS } from '../system-ids.js';
import type { CreateRelationOp, Op, SetTripleOp } from '../types.js';

type MakeImageReturnType = {
  imageId: string;
  ops: [CreateRelationOp, SetTripleOp];
};

/**
 * Creates an entity representing an Image.
 *
 * @example
 * ```ts
 * const { imageId, ops } = Image.make('https://example.com/image.png');
 * console.log(imageId); // 'gw9uTVTnJdhtczyuzBkL3X'
 * console.log(ops); // [...]
 * ```
 *
 * @returns imageId – base58 encoded v4 uuid representing the image entity: {@link MakeImageReturnType}
 * @returns ops – The ops for the Image entity: {@link MakeImageReturnType}
 */
export function make(src: string): MakeImageReturnType {
  const entityId = makeId();

  return {
    imageId: entityId,
    ops: [
      Relation.make({
        fromId: entityId,
        toId: SYSTEM_IDS.IMAGE_TYPE,
        relationTypeId: SYSTEM_IDS.TYPES_ATTRIBUTE,
      }),
      {
        type: 'SET_TRIPLE',
        triple: {
          entity: entityId,
          attribute: SYSTEM_IDS.IMAGE_URL_ATTRIBUTE,
          value: {
            type: 'URL',
            value: src,
          },
        },
      },
    ],
  };
}
