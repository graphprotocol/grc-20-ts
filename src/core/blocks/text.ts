/**
 * This module provides utility functions for working with text blocks
 * in TypeScript.
 *
 * @since 0.0.6
 */

import type { Op } from '@geoprotocol/grc-20';
import { createRelation } from '../../graph/create-relation.js';
import { updateEntity } from '../../graph/update-entity.js';
import { Id } from '../../id.js';
import { generate } from '../../id-utils.js';
import { BLOCKS, MARKDOWN_CONTENT, TEXT_BLOCK, TYPES_PROPERTY } from '../ids/system.js';

type TextBlockParams = { fromId: string; text: string; position?: string };

/**
 * Returns the ops to create an entity representing a Text Block.
 *
 * @example
 * ```ts
 * const ops = TextBlock.make({
 *   fromId: 'from-id',
 *   text: 'text',
 *   // optional
 *   position: 'position-string',
 * });
 * ```
 *
 * @param param args {@link TextBlockParams}
 * @returns ops – The ops for the Text Block entity: {@link Op}[]
 */
export function make({ fromId, text, position }: TextBlockParams): Op[] {
  const newBlockId = generate();

  const ops: Op[] = [];

  const { ops: textBlockTypeOps } = createRelation({
    fromEntity: newBlockId,
    type: TYPES_PROPERTY,
    toEntity: TEXT_BLOCK,
  });
  ops.push(...textBlockTypeOps);

  const { ops: textBlockMarkdownTextOps } = updateEntity({
    id: newBlockId,
    values: [
      {
        property: MARKDOWN_CONTENT,
        type: 'text',
        value: text,
      },
    ],
  });
  ops.push(...textBlockMarkdownTextOps);

  const { ops: textBlockRelationOps } = createRelation({
    fromEntity: Id(fromId),
    type: BLOCKS,
    toEntity: newBlockId,
    position,
  });
  ops.push(...textBlockRelationOps);

  return ops;
}
