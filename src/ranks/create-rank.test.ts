import { describe, expect, it } from 'vitest';
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
import { Id, isValid } from '../id.js';
import { createRank } from './create-rank.js';

describe('createRank', () => {
  const movie1Id = Id('f47ac10b-58cc-4372-a567-0e02b2c3d479');
  const movie2Id = Id('550e8400-e29b-41d4-a716-446655440000');
  const movie3Id = Id('6ba7b810-9dad-11d1-80b4-00c04fd430c8');

  describe('ordinal ranks', () => {
    it('creates a basic ordinal rank with one vote', () => {
      const rank = createRank({
        name: 'My Favorite Movie',
        rankType: 'ORDINAL',
        votes: [{ entityId: movie1Id }],
      });

      expect(rank).toBeDefined();
      expect(typeof rank.id).toBe('string');
      expect(rank.ops).toBeDefined();
      expect(rank.voteIds).toHaveLength(1);

      // 1 UPDATE_ENTITY (rank) + 1 CREATE_RELATION (type) + 1 CREATE_RELATION (vote) + 1 UPDATE_ENTITY (vote value)
      expect(rank.ops).toHaveLength(4);

      // Check rank entity creation
      expect(rank.ops[0]).toMatchObject({
        type: 'UPDATE_ENTITY',
        entity: {
          id: rank.id,
          values: expect.arrayContaining([
            { property: NAME_PROPERTY, value: 'My Favorite Movie' },
            { property: RANK_TYPE_PROPERTY, value: 'ORDINAL' },
          ]),
        },
      });

      // Check type relation to RANK_TYPE
      expect(rank.ops[1]).toMatchObject({
        type: 'CREATE_RELATION',
        relation: {
          fromEntity: rank.id,
          toEntity: RANK_TYPE,
          type: TYPES_PROPERTY,
        },
      });

      // Check vote relation
      expect(rank.ops[2]).toMatchObject({
        type: 'CREATE_RELATION',
        relation: {
          fromEntity: rank.id,
          toEntity: movie1Id,
          type: RANK_VOTES_RELATION_TYPE,
        },
      });

      // Check vote entity with ordinal value
      expect(rank.ops[3]).toMatchObject({
        type: 'UPDATE_ENTITY',
        entity: {
          id: rank.voteIds[0],
          values: [
            {
              property: VOTE_ORDINAL_VALUE_PROPERTY,
              value: expect.any(String), // fractional index
            },
          ],
        },
      });
    });

    it('creates an ordinal rank with multiple votes in order', () => {
      const rank = createRank({
        name: 'Top 3 Movies',
        rankType: 'ORDINAL',
        votes: [{ entityId: movie1Id }, { entityId: movie2Id }, { entityId: movie3Id }],
      });

      expect(rank.voteIds).toHaveLength(3);
      // 1 UPDATE_ENTITY + 1 type relation + 3 vote relations + 3 vote entities = 8 ops
      expect(rank.ops).toHaveLength(8);

      // Verify fractional indices are in ascending order
      const ordinalValue1 = (rank.ops[3] as { entity: { values: { value: string }[] } }).entity.values[0]?.value;
      const ordinalValue2 = (rank.ops[5] as { entity: { values: { value: string }[] } }).entity.values[0]?.value;
      const ordinalValue3 = (rank.ops[7] as { entity: { values: { value: string }[] } }).entity.values[0]?.value;

      expect(ordinalValue1 && ordinalValue2 && ordinalValue1 < ordinalValue2).toBe(true);
      expect(ordinalValue2 && ordinalValue3 && ordinalValue2 < ordinalValue3).toBe(true);
    });

    it('creates an ordinal rank with optional description', () => {
      const rank = createRank({
        name: 'My Movies',
        description: 'A ranked list of my favorite movies',
        rankType: 'ORDINAL',
        votes: [{ entityId: movie1Id }],
      });

      expect(rank.ops[0]).toMatchObject({
        type: 'UPDATE_ENTITY',
        entity: {
          id: rank.id,
          values: expect.arrayContaining([
            { property: NAME_PROPERTY, value: 'My Movies' },
            { property: RANK_TYPE_PROPERTY, value: 'ORDINAL' },
            { property: DESCRIPTION_PROPERTY, value: 'A ranked list of my favorite movies' },
          ]),
        },
      });
    });
  });

  describe('weighted ranks', () => {
    it('creates a basic weighted rank with one vote', () => {
      const rank = createRank({
        name: 'Restaurant Rating',
        rankType: 'WEIGHTED',
        votes: [{ entityId: movie1Id, value: 4.5 }],
      });

      expect(rank).toBeDefined();
      expect(rank.voteIds).toHaveLength(1);
      expect(rank.ops).toHaveLength(4);

      // Check rank entity has WEIGHTED type
      expect(rank.ops[0]).toMatchObject({
        type: 'UPDATE_ENTITY',
        entity: {
          values: expect.arrayContaining([{ property: RANK_TYPE_PROPERTY, value: 'WEIGHTED' }]),
        },
      });

      // Check vote entity with weighted value (serialized as string)
      expect(rank.ops[3]).toMatchObject({
        type: 'UPDATE_ENTITY',
        entity: {
          id: rank.voteIds[0],
          values: [
            {
              property: VOTE_WEIGHTED_VALUE_PROPERTY,
              value: '4.5', // serialized number
            },
          ],
        },
      });
    });

    it('creates a weighted rank with multiple votes', () => {
      const rank = createRank({
        name: 'Movie Scores',
        rankType: 'WEIGHTED',
        votes: [
          { entityId: movie1Id, value: 9.2 },
          { entityId: movie2Id, value: 8.5 },
          { entityId: movie3Id, value: 7.8 },
        ],
      });

      expect(rank.voteIds).toHaveLength(3);
      expect(rank.ops).toHaveLength(8);

      // Verify weighted values are correct
      expect(rank.ops[3]).toMatchObject({
        type: 'UPDATE_ENTITY',
        entity: {
          values: [{ property: VOTE_WEIGHTED_VALUE_PROPERTY, value: '9.2' }],
        },
      });
      expect(rank.ops[5]).toMatchObject({
        type: 'UPDATE_ENTITY',
        entity: {
          values: [{ property: VOTE_WEIGHTED_VALUE_PROPERTY, value: '8.5' }],
        },
      });
      expect(rank.ops[7]).toMatchObject({
        type: 'UPDATE_ENTITY',
        entity: {
          values: [{ property: VOTE_WEIGHTED_VALUE_PROPERTY, value: '7.8' }],
        },
      });
    });

    it('handles integer weighted values', () => {
      const rank = createRank({
        name: 'Star Ratings',
        rankType: 'WEIGHTED',
        votes: [{ entityId: movie1Id, value: 5 }],
      });

      expect(rank.ops[3]).toMatchObject({
        type: 'UPDATE_ENTITY',
        entity: {
          values: [{ property: VOTE_WEIGHTED_VALUE_PROPERTY, value: '5' }],
        },
      });
    });
  });

  describe('provided id', () => {
    it('uses provided id when specified', () => {
      const providedId = Id('b1dc6e5c-63e1-43ba-b3d4-755b251a4ea1');
      const rank = createRank({
        id: providedId,
        name: 'My Rank',
        rankType: 'ORDINAL',
        votes: [{ entityId: movie1Id }],
      });

      expect(rank.id).toBe(providedId);
    });

    it('generates id when not provided', () => {
      const rank = createRank({
        name: 'My Rank',
        rankType: 'ORDINAL',
        votes: [{ entityId: movie1Id }],
      });

      expect(typeof rank.id).toBe('string');
      expect(isValid(rank.id)).toBe(true);
    });
  });

  describe('error handling', () => {
    it('throws an error if the provided id is invalid', () => {
      expect(() =>
        createRank({
          id: 'invalid',
          name: 'My Rank',
          rankType: 'ORDINAL',
          votes: [{ entityId: movie1Id }],
        }),
      ).toThrow('Invalid id: "invalid" for `id` in `createRank`');
    });

    it('throws an error if a vote entityId is invalid', () => {
      expect(() =>
        createRank({
          name: 'My Rank',
          rankType: 'ORDINAL',
          votes: [{ entityId: 'invalid-entity-id' }],
        }),
      ).toThrow('Invalid id: "invalid-entity-id" for `entityId` in `votes` in `createRank`');
    });
  });

  describe('empty votes', () => {
    it('creates a rank with no votes', () => {
      const rank = createRank({
        name: 'Empty Rank',
        rankType: 'ORDINAL',
        votes: [],
      });

      expect(rank.voteIds).toHaveLength(0);
      // Only UPDATE_ENTITY (rank) + CREATE_RELATION (type)
      expect(rank.ops).toHaveLength(2);
    });
  });
});

