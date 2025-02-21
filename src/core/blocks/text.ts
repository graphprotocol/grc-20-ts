/**
 * This module provides utility functions for working with text blocks
 * in TypeScript.
 *
 * @since 0.0.6
 */

import { generate } from '../../id.js';
import { Relation } from '../../relation.js';
import { SystemIds } from '../../system-ids.js';
import type { Op } from '../../types.js';

type TextBlockArgs = { fromId: string; text: string; position?: string };

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
 * @param param args {@link TextBlockArgs}
 * @returns ops – The ops for the Text Block entity: {@link Op}[]
 */
export function make({ fromId, text, position }: TextBlockArgs): Op[] {
  const newBlockId = generate();

  const textBlockType = Relation.make({
    fromId: newBlockId,
    relationTypeId: SystemIds.TYPES_PROPERTY,
    toId: SystemIds.TEXT_BLOCK,
  });

  const textBlockMarkdownText = {
    type: 'SET_TRIPLE',
    triple: {
      attribute: SystemIds.MARKDOWN_CONTENT,
      entity: newBlockId,
      value: {
        type: 'TEXT',
        value: text,
      },
    },
  } as const;

  const textBlockRelation = Relation.make({
    fromId,
    relationTypeId: SystemIds.BLOCKS,
    toId: newBlockId,
    position,
  });

  return [textBlockType, textBlockMarkdownText, textBlockRelation];
}
