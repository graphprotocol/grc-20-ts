import { generateNJitteredKeysBetween } from 'fractional-indexing-jittered';
import {
  DESCRIPTION_PROPERTY,
  NAME_PROPERTY,
  RANK_TYPE,
  RANK_TYPE_PROPERTY,
  RANK_VOTES_RELATION_TYPE,
  TYPES_PROPERTY,
  VOTE_ORDINAL_VALUE_PROPERTY,
  VOTE_WEIGHTED_VALUE_PROPERTY,
} from '../core/ids/system.js';
import { serializeNumber } from '../graph/serialize.js';
import { Id } from '../id.js';
import { assertValid, generate } from '../id-utils.js';
import type { Op, Value } from '../types.js';
import type { CreateRankParams, CreateRankResult, VoteWeighted } from './types.js';

/**
 * Creates a rank entity with the given name, description, rankType, and votes.
 * All IDs passed to this function are validated. If any invalid ID is provided,
 * the function will throw an error.
 *
 * For ORDINAL ranks, the position is derived from the array order and fractional
 * indexing strings are generated internally.
 *
 * @example
 * ```ts
 * // Create an ordinal rank (ordered list) - position derived from array order
 * const { id, ops, voteIds } = createRank({
 *   id: rankId, // optional, will be generated if not provided
 *   name: 'My Favorite Movies',
 *   description: 'A ranked list of my favorite movies', // optional
 *   rankType: 'ORDINAL',
 *   votes: [
 *     { entityId: movie1Id },  // 1st place
 *     { entityId: movie2Id },  // 2nd place
 *     { entityId: movie3Id },  // 3rd place
 *   ],
 * });
 *
 * // Create a weighted rank (scored list)
 * const { id, ops, voteIds } = createRank({
 *   name: 'Restaurant Ratings',
 *   rankType: 'WEIGHTED',
 *   votes: [
 *     { entityId: restaurant1Id, value: 4.5 },  // numeric score
 *     { entityId: restaurant2Id, value: 3.8 },
 *   ],
 * });
 * ```
 *
 * @param params – {@link CreateRankParams}
 * @returns – {@link CreateRankResult}
 * @throws Will throw an error if any provided ID is invalid
 * @throws Will throw an error if any entityId is duplicated in votes
 */
export const createRank = ({
  id: providedId,
  name,
  description,
  rankType,
  votes,
}: CreateRankParams): CreateRankResult => {
  // Validate all input IDs
  if (providedId) {
    assertValid(providedId, '`id` in `createRank`');
  }
  for (const vote of votes) {
    assertValid(vote.entityId, '`entityId` in `votes` in `createRank`');
  }

  // Validate no duplicate entity IDs in votes
  const seenEntityIds = new Set<string>();
  for (const vote of votes) {
    const entityId = String(vote.entityId);
    if (seenEntityIds.has(entityId)) {
      throw new Error(`Duplicate entityId in votes: "${entityId}". Each entity can only be voted once per rank.`);
    }
    seenEntityIds.add(entityId);
  }

  const id = providedId ?? generate();
  const ops: Op[] = [];
  const voteIds: Id[] = [];

  // Create rank entity values
  const rankValues: Value[] = [
    {
      property: NAME_PROPERTY,
      value: name,
    },
    {
      property: RANK_TYPE_PROPERTY,
      value: rankType,
    },
  ];

  if (description) {
    rankValues.push({
      property: DESCRIPTION_PROPERTY,
      value: description,
    });
  }

  // Create UPDATE_ENTITY op for the rank
  ops.push({
    type: 'UPDATE_ENTITY',
    entity: {
      id: Id(id),
      values: rankValues,
    },
  });

  // Create relation linking rank to RANK_TYPE (type relation)
  ops.push({
    type: 'CREATE_RELATION',
    relation: {
      id: generate(),
      entity: generate(),
      fromEntity: Id(id),
      toEntity: RANK_TYPE,
      type: TYPES_PROPERTY,
    },
  });

  // Generate fractional indices for ordinal ranks
  const fractionalIndices = rankType === 'ORDINAL' ? generateNJitteredKeysBetween(null, null, votes.length) : [];

  // Create votes
  votes.forEach((vote, i) => {
    const voteEntityId = generate();
    const relationId = generate();

    voteIds.push(voteEntityId);

    // Create relation from rank to voted entity
    ops.push({
      type: 'CREATE_RELATION',
      relation: {
        id: relationId,
        entity: voteEntityId,
        fromEntity: Id(id),
        toEntity: Id(vote.entityId),
        type: RANK_VOTES_RELATION_TYPE,
      },
    });

    // Create vote entity with the appropriate value property
    const voteValue: Value =
      rankType === 'ORDINAL'
        ? {
            property: VOTE_ORDINAL_VALUE_PROPERTY,
            value: fractionalIndices[i] as string,
          }
        : {
            property: VOTE_WEIGHTED_VALUE_PROPERTY,
            value: serializeNumber((vote as VoteWeighted).value),
          };

    ops.push({
      type: 'UPDATE_ENTITY',
      entity: {
        id: voteEntityId,
        values: [voteValue],
      },
    });
  });

  return { id: Id(id), ops, voteIds };
};
