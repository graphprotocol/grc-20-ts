/**
 * This module provides utility functions for working with knowledge graph
 * images in TypeScript.
 *
 * @since 0.0.6
 */

import { generate } from '../id.js';
import { Relation } from '../relation.js';
import { SystemIds } from '../system-ids.js';
import type { CreateRelationOp, SetTripleOp } from '../types.js';

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
  const entityId = generate();

  return {
    imageId: entityId,
    ops: [
      Relation.make({
        fromId: entityId,
        toId: SystemIds.IMAGE_TYPE,
        relationTypeId: SystemIds.TYPES_PROPERTY,
      }),
      {
        type: 'SET_TRIPLE',
        triple: {
          entity: entityId,
          attribute: SystemIds.IMAGE_URL_PROPERTY,
          value: {
            type: 'URL',
            value: src,
          },
        },
      },
    ],
  };
}
