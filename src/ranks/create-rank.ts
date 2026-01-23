import {
  type PropertyValue as GrcPropertyValue,
  createEntity as grcCreateEntity,
  createRelation as grcCreateRelation,
  languages,
  type Op,
} from '@geoprotocol/grc-20';
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
import { Id } from '../id.js';
import { assertValid, generate, toGrcId } from '../id-utils.js';
import type { CreateRankingParams, CreateRankingResult, VoteWeighted } from './types.js';

/**
 * Creates a ranking entity with the given name, description, rankingType, and votes.
 * All IDs passed to this function are validated. If any invalid ID is provided,
 * the function will throw an error.
 *
 * For ORDINAL rankings, the position is derived from the array order and fractional
 * indexing strings are generated internally.
 *
 * @example
 * ```ts
 * // Create an ordinal ranking (ordered list) - position derived from array order
 * const { id, ops, voteIds } = createRanking({
 *   id: rankingId, // optional, will be generated if not provided
 *   name: 'My Favorite Movies',
 *   description: 'A ranked list of my favorite movies', // optional
 *   rankingType: 'ORDINAL',
 *   votes: [
 *     { entityId: movie1Id },  // 1st place
 *     { entityId: movie2Id },  // 2nd place
 *     { entityId: movie3Id },  // 3rd place
 *   ],
 * });
 *
 * // Create a weighted ranking (scored list)
 * const { id, ops, voteIds } = createRanking({
 *   name: 'Restaurant Ratings',
 *   rankingType: 'WEIGHTED',
 *   votes: [
 *     { entityId: restaurant1Id, score: 4.5 },  // numeric score
 *     { entityId: restaurant2Id, score: 3.8 },
 *   ],
 * });
 * ```
 *
 * @param params – {@link CreateRankingParams}
 * @returns – {@link CreateRankingResult}
 * @throws Will throw an error if any provided ID is invalid
 * @throws Will throw an error if any entityId is duplicated in votes
 */
export const createRanking = ({
  id: providedId,
  name,
  description,
  rankingType,
  votes,
}: CreateRankingParams): CreateRankingResult => {
  // Validate all input IDs
  if (providedId) {
    assertValid(providedId, '`id` in `createRanking`');
  }
  for (const vote of votes) {
    assertValid(vote.entityId, '`entityId` in `votes` in `createRanking`');
  }

  // Validate no duplicate entity IDs in votes
  const seenEntityIds = new Set<string>();
  for (const vote of votes) {
    const entityId = String(vote.entityId);
    if (seenEntityIds.has(entityId)) {
      throw new Error(`Duplicate entityId in votes: "${entityId}". Each entity can only be voted once per ranking.`);
    }
    seenEntityIds.add(entityId);
  }

  const id = providedId ?? generate();
  const ops: Op[] = [];
  const voteIds: Id[] = [];

  // Create ranking entity values
  const rankingValues: GrcPropertyValue[] = [
    {
      property: toGrcId(NAME_PROPERTY),
      value: {
        type: 'text',
        value: name,
        language: languages.english(),
      },
    },
    {
      property: toGrcId(RANK_TYPE_PROPERTY),
      value: {
        type: 'text',
        value: rankingType,
        language: languages.english(),
      },
    },
  ];

  if (description) {
    rankingValues.push({
      property: toGrcId(DESCRIPTION_PROPERTY),
      value: {
        type: 'text',
        value: description,
        language: languages.english(),
      },
    });
  }

  // Create createEntity op for the ranking
  ops.push(
    grcCreateEntity({
      id: toGrcId(id),
      values: rankingValues,
    }),
  );

  // Create relation linking ranking to RANK_TYPE (type relation)
  ops.push(
    grcCreateRelation({
      id: toGrcId(generate()),
      entity: toGrcId(generate()),
      from: toGrcId(id),
      to: toGrcId(RANK_TYPE),
      relationType: toGrcId(TYPES_PROPERTY),
    }),
  );

  // Generate fractional indices for ordinal rankings
  const fractionalIndices = rankingType === 'ORDINAL' ? generateNJitteredKeysBetween(null, null, votes.length) : [];

  // Create votes
  votes.forEach((vote, i) => {
    const voteEntityId = generate();
    const relationId = generate();

    voteIds.push(voteEntityId);

    // Create relation from ranking to voted entity
    ops.push(
      grcCreateRelation({
        id: toGrcId(relationId),
        entity: toGrcId(voteEntityId),
        from: toGrcId(id),
        to: toGrcId(vote.entityId),
        relationType: toGrcId(RANK_VOTES_RELATION_TYPE),
      }),
    );

    // Create vote entity with the appropriate value property
    const voteValue: GrcPropertyValue =
      rankingType === 'ORDINAL'
        ? {
            property: toGrcId(VOTE_ORDINAL_VALUE_PROPERTY),
            value: {
              type: 'text',
              value: fractionalIndices[i] as string,
              language: languages.english(),
            },
          }
        : {
            property: toGrcId(VOTE_WEIGHTED_VALUE_PROPERTY),
            value: {
              type: 'float64',
              value: (vote as VoteWeighted).score,
            },
          };

    ops.push(
      grcCreateEntity({
        id: toGrcId(voteEntityId),
        values: [voteValue],
      }),
    );
  });

  return { id: Id(id), ops, voteIds };
};
