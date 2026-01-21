/**
 * Setup script for Rank types in the knowledge graph.
 *
 * This script generates the Ops needed to create the Rank schema types:
 * - RANK_TYPE_PROPERTY: A TEXT property storing ORDINAL/WEIGHTED
 * - RANK_VOTES_RELATION_TYPE: A RELATION property linking rank to voted entities
 * - VOTE_ORDINAL_VALUE_PROPERTY: A TEXT property storing fractional indexing position
 * - VOTE_WEIGHTED_VALUE_PROPERTY: A FLOAT64 property storing numeric score
 * - RANK_TYPE: A Type entity representing a Rank
 *
 * Usage: import { ops } from './scripts/setup-rank-types.js'
 */

import type { Op } from '@geoprotocol/grc-20';
import {
  RANK_TYPE,
  RANK_TYPE_PROPERTY,
  RANK_VOTES_RELATION_TYPE,
  VOTE_ORDINAL_VALUE_PROPERTY,
  VOTE_WEIGHTED_VALUE_PROPERTY,
} from '../src/core/ids/system.js';
import { createProperty } from '../src/graph/create-property.js';
import { createType } from '../src/graph/create-type.js';

const generateRankTypeOps = (): Op[] => {
  const ops: Op[] = [];

  // 1. Create RANK_TYPE_PROPERTY - A TEXT property storing ORDINAL/WEIGHTED
  const rankTypeProperty = createProperty({
    id: RANK_TYPE_PROPERTY,
    name: 'Rank Type',
    description: 'The type of rank: ORDINAL (ordered list) or WEIGHTED (scored values)',
    dataType: 'TEXT',
  });
  ops.push(...rankTypeProperty.ops);

  // 2. Create RANK_VOTES_RELATION_TYPE - A RELATION property linking rank to voted entities
  const rankVotesRelationType = createProperty({
    id: RANK_VOTES_RELATION_TYPE,
    name: 'Rank Votes',
    description: 'Relation linking a rank to its voted entities',
    dataType: 'RELATION',
  });
  ops.push(...rankVotesRelationType.ops);

  // 3. Create VOTE_ORDINAL_VALUE_PROPERTY - A TEXT property for fractional indexing
  const voteOrdinalValueProperty = createProperty({
    id: VOTE_ORDINAL_VALUE_PROPERTY,
    name: 'Vote Ordinal Value',
    description: 'Fractional indexing string for ordered rank positions',
    dataType: 'TEXT',
  });
  ops.push(...voteOrdinalValueProperty.ops);

  // 4. Create VOTE_WEIGHTED_VALUE_PROPERTY - A FLOAT64 property for numeric scores
  const voteWeightedValueProperty = createProperty({
    id: VOTE_WEIGHTED_VALUE_PROPERTY,
    name: 'Vote Weighted Value',
    description: 'Numeric score for weighted rank values',
    dataType: 'FLOAT64',
  });
  ops.push(...voteWeightedValueProperty.ops);

  // 5. Create RANK_TYPE - A Type entity representing a Rank
  const rankType = createType({
    id: RANK_TYPE,
    name: 'Rank',
    description: 'A rank entity that contains ordered or weighted votes for other entities',
    properties: [RANK_TYPE_PROPERTY, RANK_VOTES_RELATION_TYPE],
  });
  ops.push(...rankType.ops);

  return ops;
};

// Generate and output the ops
export const ops = generateRankTypeOps();
