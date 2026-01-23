import type { Id } from '../id.js';
import type { CreateResult } from '../types.js';

export type RankingType = 'ORDINAL' | 'WEIGHTED';

/**
 * Vote with ordinal positioning.
 * Position is derived from the array order; fractional indexing is generated internally.
 */
export type VoteOrdinal = {
  entityId: Id | string;
};

/**
 * Vote with weighted numeric scoring.
 * Used for ranked lists where the magnitude of the score matters.
 */
export type VoteWeighted = {
  entityId: Id | string;
  score: number;
};

export type Vote = VoteOrdinal | VoteWeighted;

export type CreateRankingParams = {
  id?: Id | string;
  name: string;
  description?: string;
  rankingType: RankingType;
  votes: Vote[];
};

export type CreateRankingResult = CreateResult & {
  voteIds: Id[]; // IDs of created vote entities for reference
};
