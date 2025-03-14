/**
 * This module provides utility functions for working with knowledge graph
 * images in TypeScript.
 *
 * @since 0.0.6
 */

import { type Id, generate } from '../id.js';
import { Relation } from '../relation.js';
import { SystemIds } from '../system-ids.js';
import type { Op } from '../types.js';

type MakeImageReturnType = {
  id: Id;
  ops: Array<Op>;
};

type MakeImageParams = {
  cid: string;
  dimensions?: {
    width: number;
    height: number;
  };
  id?: Id;
};

/**
 * Creates an entity representing an Image.
 *
 * @example
 * ```ts
 * const { id, ops } = Image.make({
 *   cid: 'https://example.com/image.png',
 *   dimensions: { width: 100, height: 100 },
 *   id: imageId, // optional and will be generated if not provided
 * });
 * console.log(id); // 'gw9uTVTnJdhtczyuzBkL3X'
 * console.log(ops); // [...]
 * ```
 *
 * @returns id – base58 encoded v4 uuid representing the image entity: {@link MakeImageReturnType}
 * @returns ops – The ops for the Image entity: {@link MakeImageReturnType}
 */
export function make({ cid, dimensions, id }: MakeImageParams): MakeImageReturnType {
  const entityId = id ?? generate();
  const ops: Array<Op> = [
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
          value: cid,
        },
      },
    },
  ];

  if (dimensions) {
    ops.push({
      type: 'SET_TRIPLE',
      triple: {
        entity: entityId,
        attribute: SystemIds.IMAGE_HEIGHT_PROPERTY,
        value: {
          type: 'NUMBER',
          value: dimensions.height.toString(),
        },
      },
    });
    ops.push({
      type: 'SET_TRIPLE',
      triple: {
        entity: entityId,
        attribute: SystemIds.IMAGE_WIDTH_PROPERTY,
        value: {
          type: 'NUMBER',
          value: dimensions.width.toString(),
        },
      },
    });
  }

  return {
    id: entityId,
    ops,
  };
}
