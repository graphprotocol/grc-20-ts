/**
 * This module provides common constants used in the knowledge graph.
 *
 * @since 0.0.6
 */

import { generateJitteredKeyBetween } from "fractional-indexing-jittered";
import { Position } from "./src/position.js";

export const INITIAL_RELATION_INDEX_VALUE = Position.generateBetween(
  null,
  null
);
