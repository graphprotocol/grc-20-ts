import { Brand } from 'effect';

/**
 * This module provides utility functions for working knowledge graph
 * identifiers in TypeScript.
 *
 * @since 0.0.6
 */

import { validate as uuidValidate, v4 as uuidv4 } from 'uuid';

import { decodeBase58ToUUID, encodeBase58 } from './core/base58.js';

export type Id = string & Brand.Brand<'Id'>;

export const Id = Brand.refined<Id>(
  id => isValid(id),
  id => Brand.error(`Expected ${id} to be a valid Id`),
);

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
export function generate(): Id {
  const uuid = uuidv4();
  const stripped = uuid.replaceAll(/-/g, '');
  const rawId = encodeBase58(stripped);

  // In extremely rare occasions the id generator may result in ids that are
  // 21 characters instead of 22. Theoretically the smallest length the id can
  // generate is 16 characters, but only in specifically engineered cases.
  //
  // If this occurs we can generate again until we get a valid id.
  if (rawId.length === 22) {
    return Id(rawId);
  }

  return generate();
}

export function isValid(id: string): boolean {
  if (id.length !== 22 && id.length !== 21) {
    return false;
  }

  try {
    const decoded = decodeBase58ToUUID(id);
    return uuidValidate(decoded);
  } catch (error) {
    return false;
  }
}

export function assertValid(id: string, sourceHint?: string) {
  if (!isValid(id)) {
    throw new Error(`Invalid id: "${id}"${sourceHint ? ` for ${sourceHint}` : ''}`);
  }
}
