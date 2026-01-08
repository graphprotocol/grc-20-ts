import type { Id } from '../id.js';
import type { CreateResult } from '../types.js';

export type RankType = 'ORDINAL' | 'WEIGHTED';

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
  value: number;
};

export type Vote = VoteOrdinal | VoteWeighted;

export type CreateRankParams = {
  id?: Id | string;
  name: string;
  description?: string;
  rankType: RankType;
  votes: Vote[];
};

export type CreateRankResult = CreateResult & {
  voteIds: Id[]; // IDs of created vote entities for reference
};
