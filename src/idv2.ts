import { Brand } from 'effect';

/**
 * This module provides utility functions for working knowledge graph
 * identifiers in TypeScript.
 */

import { parse as uuidParse, stringify as uuidStringify, validate as uuidValidate, v4 as uuidv4 } from 'uuid';

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
 * console.log(id)
 * ```
 *
 * @returns v4 UUID
 */
export function generate(): Id {
  const uuid = uuidv4();
  return Id(uuid);
}

export function isValid(id: string): boolean {
  return uuidValidate(id);
}

export function assertValid(id: string, sourceHint?: string) {
  if (!isValid(id)) {
    throw new Error(`Invalid id: "${id}"${sourceHint ? ` for ${sourceHint}` : ''}`);
  }
}

export function toBytes(id: Id): Uint8Array {
  return uuidParse(id);
}

export function fromBytes(bytes: Uint8Array): Id {
  return Id(uuidStringify(bytes));
}
