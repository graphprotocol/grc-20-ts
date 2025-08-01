import { Brand } from 'effect';
import { parse as uuidParse, stringify as uuidStringify, v4 as uuidv4 } from 'uuid';
import { Id, isValid } from './id.js';

export { isValid };

/**
 * This module provides utility functions for working knowledge graph
 * identifiers in TypeScript.
 */

export type IdBase64 = string & Brand.Brand<'IdBase64'>;


export const IdBase64 = Brand.refined<IdBase64>(
  id => isValidBase64(id),
  id => Brand.error(`Expected ${id} to be a valid IdBase64`),
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

export function isValidBase64(id: string): boolean {
  try {
    // @ts-expect-error
    const uuid = fromBase64(id);
    return isValid(uuid);
  } catch (error) {
    return false;
  }
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

const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

export function toBase64(id: Id): IdBase64 {
  const bytes = toBytes(id);
  let result = '';
  let i: number;

  for (i = 0; i < bytes.length; i += 3) {
    const a = bytes[i];
    const b = bytes[i + 1] ?? 0;
    const c = bytes[i + 2] ?? 0;

    // @ts-expect-error
    const triple = (a << 16) | (b << 8) | c;

    result += base64Chars[(triple >> 18) & 0x3f];
    result += base64Chars[(triple >> 12) & 0x3f];
    result += i + 1 < bytes.length ? base64Chars[(triple >> 6) & 0x3f] : '=';
    result += i + 2 < bytes.length ? base64Chars[triple & 0x3f] : '=';
  }

  return IdBase64(result);
}

export function fromBase64(id: IdBase64): Id {
  const bytes = [];

  for (let i = 0; i < id.length; i += 4) {
    // @ts-expect-error
    const c1 = base64Chars.indexOf(id[i]);
    // @ts-expect-error
    const c2 = base64Chars.indexOf(id[i + 1]);
    // @ts-expect-error
    const c3 = base64Chars.indexOf(id[i + 2]);
    // @ts-expect-error
    const c4 = base64Chars.indexOf(id[i + 3]);

    const triple = (c1 << 18) | (c2 << 12) | ((c3 & 63) << 6) | (c4 & 63);

    bytes.push((triple >> 16) & 0xff);
    if (c3 !== -1 && c3 !== 64) bytes.push((triple >> 8) & 0xff);
    if (c4 !== -1 && c4 !== 64) bytes.push(triple & 0xff);
  }

  return fromBytes(new Uint8Array(bytes));
}

