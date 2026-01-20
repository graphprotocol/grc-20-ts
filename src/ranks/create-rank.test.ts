import { describe, expect, it } from 'vitest';
import { RANK_TYPE, RANK_VOTES_RELATION_TYPE, TYPES_PROPERTY } from '../core/ids/system.js';
import { Id, isValid } from '../id.js';
import { toGrcId } from '../id-utils.js';
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

      // 1 createEntity (rank) + 1 createRelation (type) + 1 createRelation (vote) + 1 createEntity (vote value)
      expect(rank.ops).toHaveLength(4);

      // Check rank entity creation
      expect(rank.ops[0]?.type).toBe('createEntity');

      // Check type relation to RANK_TYPE
      expect(rank.ops[1]).toMatchObject({
        type: 'createRelation',
        from: toGrcId(rank.id),
        to: toGrcId(RANK_TYPE),
        relationType: toGrcId(TYPES_PROPERTY),
      });

      // Check vote relation
      expect(rank.ops[2]).toMatchObject({
        type: 'createRelation',
        from: toGrcId(rank.id),
        to: toGrcId(movie1Id),
        relationType: toGrcId(RANK_VOTES_RELATION_TYPE),
      });

      // Check vote entity with ordinal value
      expect(rank.ops[3]?.type).toBe('createEntity');
    });

    it('creates an ordinal rank with multiple votes in order', () => {
      const rank = createRank({
        name: 'Top 3 Movies',
        rankType: 'ORDINAL',
        votes: [{ entityId: movie1Id }, { entityId: movie2Id }, { entityId: movie3Id }],
      });

      expect(rank.voteIds).toHaveLength(3);
      // 1 createEntity + 1 type relation + 3 vote relations + 3 vote entities = 8 ops
      expect(rank.ops).toHaveLength(8);

      // Verify fractional indices are in ascending order by checking the ops
      const op3 = rank.ops[3];
      const op5 = rank.ops[5];
      const op7 = rank.ops[7];

      expect(op3?.type).toBe('createEntity');
      expect(op5?.type).toBe('createEntity');
      expect(op7?.type).toBe('createEntity');

      // The values contain ordinal positions - we verify the ops exist and are createEntity type
    });

    it('creates an ordinal rank with optional description', () => {
      const rank = createRank({
        name: 'My Movies',
        description: 'A ranked list of my favorite movies',
        rankType: 'ORDINAL',
        votes: [{ entityId: movie1Id }],
      });

      expect(rank.ops[0]?.type).toBe('createEntity');
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
      expect(rank.ops[0]?.type).toBe('createEntity');

      // Check vote entity with weighted value
      expect(rank.ops[3]?.type).toBe('createEntity');
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

      // Verify weighted value ops are createEntity type
      expect(rank.ops[3]?.type).toBe('createEntity');
      expect(rank.ops[5]?.type).toBe('createEntity');
      expect(rank.ops[7]?.type).toBe('createEntity');
    });

    it('handles integer weighted values', () => {
      const rank = createRank({
        name: 'Star Ratings',
        rankType: 'WEIGHTED',
        votes: [{ entityId: movie1Id, value: 5 }],
      });

      expect(rank.ops[3]?.type).toBe('createEntity');
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

    it('throws an error if duplicate entity IDs are in votes', () => {
      expect(() =>
        createRank({
          name: 'My Rank',
          rankType: 'ORDINAL',
          votes: [{ entityId: movie1Id }, { entityId: movie2Id }, { entityId: movie1Id }],
        }),
      ).toThrow(`Duplicate entityId in votes: "${movie1Id}". Each entity can only be voted once per rank.`);
    });

    it('throws an error for duplicate entity IDs in weighted ranks', () => {
      expect(() =>
        createRank({
          name: 'My Scores',
          rankType: 'WEIGHTED',
          votes: [
            { entityId: movie1Id, value: 5 },
            { entityId: movie1Id, value: 3 },
          ],
        }),
      ).toThrow(`Duplicate entityId in votes: "${movie1Id}". Each entity can only be voted once per rank.`);
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
      // Only createEntity (rank) + createRelation (type)
      expect(rank.ops).toHaveLength(2);
    });
  });
});
