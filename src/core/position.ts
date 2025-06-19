/**
 * This module provides utility functions for working with fractional indexes in TypeScript.
 *
 * @since 0.0.6
 */

import { generateJitteredKeyBetween } from "fractional-indexing-jittered";

export function generateBetween(first: string | null, second: string | null) {
  return generateJitteredKeyBetween(first, second);
}
