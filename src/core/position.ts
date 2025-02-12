/**
 * This module provides utility functions for working with fractional indexes in TypeScript.
 *
 * @since 0.0.6
 */

import { PositionSource } from 'position-strings';

export const Position = new PositionSource();

export const PositionRange = {
  FIRST: PositionSource.FIRST,
  LAST: PositionSource.LAST,
};
