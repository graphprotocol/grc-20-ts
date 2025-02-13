/**
 * This module provides utility functions for working knowledge graph
 * identifiers in TypeScript.
 *
 * @since 0.0.6
 */

import { v4 as uuidv4 } from 'uuid';

import { encodeBase58 } from './core/base58.js';

/**
 * Generates a globally unique knowledge graph identifier.
 *
 * @example
 * ```
 * import { ID } from '@graphprotocol/grc-20'
 *
 * const id = ID.generate();
 * console.log(id) // Gw9uTVTnJdhtczyuzBkL3X
 * ```
 *
 * @returns base58 encoded v4 UUID
 */
export function generate(): string {
  const uuid = uuidv4();
  const stripped = uuid.replaceAll(/-/g, '');
  const id = encodeBase58(stripped);

  // In extremely rare occasions the id generator may result in ids that are
  // 21 characters instead of 22. Theoretically the smallest length the id can
  // generate is 16 characters, but only in specifically engineered cases.
  //
  // If this occurs we can generate again until we get a valid id.
  if (id.length === 22) {
    return id;
  }

  return generate();
}
