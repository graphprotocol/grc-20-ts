/**
 * This module provides utility functions for working with fractional indexes in TypeScript.
 *
 * @since 0.0.6
 */

import { generateJitteredKeyBetween } from 'fractional-indexing-jittered';

export function generateBetween(first: string | null, second: string | null) {
  return generateJitteredKeyBetween(first, second);
}

/**
 * Generates a random position with jittering.
 *
 * @returns A random position as a string.
 */
export function generate(): string {
  return generateBetween(null, null);
}

type MaybePosition = string | null;

export function compare(a: MaybePosition, b: MaybePosition) {
  // This ALWAYS puts nulls at the bottom, regardless of what
  // fractional indexes exist
  if (a === null && b === null) return 0;
  if (a === null) return 1; // a goes to bottom
  if (b === null) return -1; // b goes to bottom
  return a.localeCompare(b);
}

/**
 * Sorts a list of positions in ascending order. In
 * the knowledge graph positions are optional. This
 * function sorts null positions so they are always
 * at the bottom.
 *
 * @param positions - The list of positions to sort.
 * @returns The sorted list of positions.
 */
export function sort(positions: MaybePosition[]): MaybePosition[] {
  return positions.sort(compare);
}
