import type { CreateEntity, CreateRelation } from '@geoprotocol/grc-20';
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
import { toGrcId } from '../id-utils.js';
import { createRanking } from './create-rank.js';

describe('createRanking', () => {
  const movie1Id = Id('f47ac10b-58cc-4372-a567-0e02b2c3d479');
  const movie2Id = Id('550e8400-e29b-41d4-a716-446655440000');
  const movie3Id = Id('6ba7b810-9dad-11d1-80b4-00c04fd430c8');

  describe('ordinal rankings', () => {
    it('creates a basic ordinal ranking with one vote', () => {
      const ranking = createRanking({
        name: 'My Favorite Movie',
        rankingType: 'ORDINAL',
        votes: [{ entityId: movie1Id }],
      });

      expect(ranking).toBeDefined();
      expect(typeof ranking.id).toBe('string');
      expect(ranking.ops).toBeDefined();
      expect(ranking.voteIds).toHaveLength(1);

      // 1 createEntity (ranking) + 1 createRelation (type) + 1 createRelation (vote) + 1 createEntity (vote value)
      expect(ranking.ops).toHaveLength(4);

      // Check ranking entity creation
      const rankingEntityOp = ranking.ops[0] as CreateEntity;
      expect(rankingEntityOp.type).toBe('createEntity');
      expect(rankingEntityOp.id).toEqual(toGrcId(ranking.id));

      // Verify name value on ranking entity
      const nameValue = rankingEntityOp.values.find(v => {
        const propBytes = v.property;
        return propBytes.every((b, i) => b === toGrcId(NAME_PROPERTY)[i]);
      });
      expect(nameValue).toBeDefined();
      expect(nameValue?.value.type).toBe('text');
      if (nameValue?.value.type === 'text') {
        expect(nameValue.value.value).toBe('My Favorite Movie');
      }

      // Verify ranking type property (ORDINAL)
      const rankingTypeValue = rankingEntityOp.values.find(v => {
        const propBytes = v.property;
        return propBytes.every((b, i) => b === toGrcId(RANK_TYPE_PROPERTY)[i]);
      });
      expect(rankingTypeValue).toBeDefined();
      expect(rankingTypeValue?.value.type).toBe('text');
      if (rankingTypeValue?.value.type === 'text') {
        expect(rankingTypeValue.value.value).toBe('ORDINAL');
      }

      // Check type relation to RANK_TYPE
      const typeRelOp = ranking.ops[1] as CreateRelation;
      expect(typeRelOp.type).toBe('createRelation');
      expect(typeRelOp.from).toEqual(toGrcId(ranking.id));
      expect(typeRelOp.to).toEqual(toGrcId(RANK_TYPE));
      expect(typeRelOp.relationType).toEqual(toGrcId(TYPES_PROPERTY));

      // Check vote relation
      const voteRelOp = ranking.ops[2] as CreateRelation;
      expect(voteRelOp.type).toBe('createRelation');
      expect(voteRelOp.from).toEqual(toGrcId(ranking.id));
      expect(voteRelOp.to).toEqual(toGrcId(movie1Id));
      expect(voteRelOp.relationType).toEqual(toGrcId(RANK_VOTES_RELATION_TYPE));

      // Check vote entity with ordinal value
      const voteEntityOp = ranking.ops[3] as CreateEntity;
      expect(voteEntityOp.type).toBe('createEntity');
      // biome-ignore lint/style/noNonNullAssertion: test file - we verified voteIds has 1 element
      expect(voteEntityOp.id).toEqual(toGrcId(ranking.voteIds[0]!));

      // Verify ordinal value property
      const ordinalValue = voteEntityOp.values.find(v => {
        const propBytes = v.property;
        return propBytes.every((b, i) => b === toGrcId(VOTE_ORDINAL_VALUE_PROPERTY)[i]);
      });
      expect(ordinalValue).toBeDefined();
      expect(ordinalValue?.value.type).toBe('text');
      // Value should be a fractional index string
      if (ordinalValue?.value.type === 'text') {
        expect(typeof ordinalValue.value.value).toBe('string');
        expect(ordinalValue.value.value.length).toBeGreaterThan(0);
      }
    });

    it('creates an ordinal ranking with multiple votes in order', () => {
      const ranking = createRanking({
        name: 'Top 3 Movies',
        rankingType: 'ORDINAL',
        votes: [{ entityId: movie1Id }, { entityId: movie2Id }, { entityId: movie3Id }],
      });

      expect(ranking.voteIds).toHaveLength(3);
      // 1 createEntity + 1 type relation + 3 vote relations + 3 vote entities = 8 ops
      expect(ranking.ops).toHaveLength(8);

      // Extract ordinal values and verify they are in ascending order
      const voteEntityOps = [ranking.ops[3], ranking.ops[5], ranking.ops[7]] as CreateEntity[];

      const ordinalValues: string[] = [];
      for (const op of voteEntityOps) {
        expect(op.type).toBe('createEntity');
        const ordinalValue = op.values.find(v => {
          const propBytes = v.property;
          return propBytes.every((b, i) => b === toGrcId(VOTE_ORDINAL_VALUE_PROPERTY)[i]);
        });
        expect(ordinalValue?.value.type).toBe('text');
        if (ordinalValue?.value.type === 'text') {
          ordinalValues.push(ordinalValue.value.value);
        }
      }

      // Verify fractional indices are in ascending order
      expect(ordinalValues.length).toBe(3);
      // biome-ignore lint/style/noNonNullAssertion: test file - we just verified length is 3
      expect(ordinalValues[0]! < ordinalValues[1]!).toBe(true);
      // biome-ignore lint/style/noNonNullAssertion: test file - we just verified length is 3
      expect(ordinalValues[1]! < ordinalValues[2]!).toBe(true);
    });

    it('creates an ordinal ranking with optional description', () => {
      const ranking = createRanking({
        name: 'My Movies',
        description: 'A ranked list of my favorite movies',
        rankingType: 'ORDINAL',
        votes: [{ entityId: movie1Id }],
      });

      const rankingEntityOp = ranking.ops[0] as CreateEntity;
      expect(rankingEntityOp.type).toBe('createEntity');

      // Verify name value
      const nameValue = rankingEntityOp.values.find(v => {
        const propBytes = v.property;
        return propBytes.every((b, i) => b === toGrcId(NAME_PROPERTY)[i]);
      });
      expect(nameValue?.value.type).toBe('text');
      if (nameValue?.value.type === 'text') {
        expect(nameValue.value.value).toBe('My Movies');
      }

      // Verify ranking type value
      const rankingTypeValue = rankingEntityOp.values.find(v => {
        const propBytes = v.property;
        return propBytes.every((b, i) => b === toGrcId(RANK_TYPE_PROPERTY)[i]);
      });
      expect(rankingTypeValue?.value.type).toBe('text');
      if (rankingTypeValue?.value.type === 'text') {
        expect(rankingTypeValue.value.value).toBe('ORDINAL');
      }

      // Verify description value
      const descValue = rankingEntityOp.values.find(v => {
        const propBytes = v.property;
        return propBytes.every((b, i) => b === toGrcId(DESCRIPTION_PROPERTY)[i]);
      });
      expect(descValue).toBeDefined();
      expect(descValue?.value.type).toBe('text');
      if (descValue?.value.type === 'text') {
        expect(descValue.value.value).toBe('A ranked list of my favorite movies');
      }
    });
  });

  describe('weighted rankings', () => {
    it('creates a basic weighted ranking with one vote', () => {
      const ranking = createRanking({
        name: 'Restaurant Rating',
        rankingType: 'WEIGHTED',
        votes: [{ entityId: movie1Id, score: 4.5 }],
      });

      expect(ranking).toBeDefined();
      expect(ranking.voteIds).toHaveLength(1);
      expect(ranking.ops).toHaveLength(4);

      // Check ranking entity has WEIGHTED type
      const rankingEntityOp = ranking.ops[0] as CreateEntity;
      expect(rankingEntityOp.type).toBe('createEntity');

      const rankingTypeValue = rankingEntityOp.values.find(v => {
        const propBytes = v.property;
        return propBytes.every((b, i) => b === toGrcId(RANK_TYPE_PROPERTY)[i]);
      });
      expect(rankingTypeValue?.value.type).toBe('text');
      if (rankingTypeValue?.value.type === 'text') {
        expect(rankingTypeValue.value.value).toBe('WEIGHTED');
      }

      // Check vote entity with weighted score
      const voteEntityOp = ranking.ops[3] as CreateEntity;
      expect(voteEntityOp.type).toBe('createEntity');

      const weightedValue = voteEntityOp.values.find(v => {
        const propBytes = v.property;
        return propBytes.every((b, i) => b === toGrcId(VOTE_WEIGHTED_VALUE_PROPERTY)[i]);
      });
      expect(weightedValue).toBeDefined();
      expect(weightedValue?.value.type).toBe('float64');
      if (weightedValue?.value.type === 'float64') {
        expect(weightedValue.value.value).toBe(4.5);
      }
    });

    it('creates a weighted ranking with multiple votes', () => {
      const ranking = createRanking({
        name: 'Movie Scores',
        rankingType: 'WEIGHTED',
        votes: [
          { entityId: movie1Id, score: 9.2 },
          { entityId: movie2Id, score: 8.5 },
          { entityId: movie3Id, score: 7.8 },
        ],
      });

      expect(ranking.voteIds).toHaveLength(3);
      expect(ranking.ops).toHaveLength(8);

      // Verify weighted scores are correct
      const voteEntityOps = [ranking.ops[3], ranking.ops[5], ranking.ops[7]] as CreateEntity[];
      const expectedScores = [9.2, 8.5, 7.8];

      voteEntityOps.forEach((op, i) => {
        expect(op.type).toBe('createEntity');
        const weightedValue = op.values.find(v => {
          const propBytes = v.property;
          return propBytes.every((b, j) => b === toGrcId(VOTE_WEIGHTED_VALUE_PROPERTY)[j]);
        });
        expect(weightedValue?.value.type).toBe('float64');
        if (weightedValue?.value.type === 'float64') {
          expect(weightedValue.value.value).toBe(expectedScores[i]);
        }
      });
    });

    it('handles integer weighted scores', () => {
      const ranking = createRanking({
        name: 'Star Ratings',
        rankingType: 'WEIGHTED',
        votes: [{ entityId: movie1Id, score: 5 }],
      });

      const voteEntityOp = ranking.ops[3] as CreateEntity;
      expect(voteEntityOp.type).toBe('createEntity');

      const weightedValue = voteEntityOp.values.find(v => {
        const propBytes = v.property;
        return propBytes.every((b, i) => b === toGrcId(VOTE_WEIGHTED_VALUE_PROPERTY)[i]);
      });
      expect(weightedValue?.value.type).toBe('float64');
      if (weightedValue?.value.type === 'float64') {
        expect(weightedValue.value.value).toBe(5);
      }
    });
  });

  describe('provided id', () => {
    it('uses provided id when specified', () => {
      const providedId = Id('b1dc6e5c-63e1-43ba-b3d4-755b251a4ea1');
      const ranking = createRanking({
        id: providedId,
        name: 'My Ranking',
        rankingType: 'ORDINAL',
        votes: [{ entityId: movie1Id }],
      });

      expect(ranking.id).toBe(providedId);

      // Verify the entity op uses the provided ID
      const rankingEntityOp = ranking.ops[0] as CreateEntity;
      expect(rankingEntityOp.id).toEqual(toGrcId(providedId));

      // Verify the type relation uses the provided ID
      const typeRelOp = ranking.ops[1] as CreateRelation;
      expect(typeRelOp.from).toEqual(toGrcId(providedId));
    });

    it('generates id when not provided', () => {
      const ranking = createRanking({
        name: 'My Ranking',
        rankingType: 'ORDINAL',
        votes: [{ entityId: movie1Id }],
      });

      expect(typeof ranking.id).toBe('string');
      expect(isValid(ranking.id)).toBe(true);
    });
  });

  describe('error handling', () => {
    it('throws an error if the provided id is invalid', () => {
      expect(() =>
        createRanking({
          id: 'invalid',
          name: 'My Ranking',
          rankingType: 'ORDINAL',
          votes: [{ entityId: movie1Id }],
        }),
      ).toThrow('Invalid id: "invalid" for `id` in `createRanking`');
    });

    it('throws an error if a vote entityId is invalid', () => {
      expect(() =>
        createRanking({
          name: 'My Ranking',
          rankingType: 'ORDINAL',
          votes: [{ entityId: 'invalid-entity-id' }],
        }),
      ).toThrow('Invalid id: "invalid-entity-id" for `entityId` in `votes` in `createRanking`');
    });

    it('throws an error if duplicate entity IDs are in votes', () => {
      expect(() =>
        createRanking({
          name: 'My Ranking',
          rankingType: 'ORDINAL',
          votes: [{ entityId: movie1Id }, { entityId: movie2Id }, { entityId: movie1Id }],
        }),
      ).toThrow(`Duplicate entityId in votes: "${movie1Id}". Each entity can only be voted once per ranking.`);
    });

    it('throws an error for duplicate entity IDs in weighted rankings', () => {
      expect(() =>
        createRanking({
          name: 'My Scores',
          rankingType: 'WEIGHTED',
          votes: [
            { entityId: movie1Id, score: 5 },
            { entityId: movie1Id, score: 3 },
          ],
        }),
      ).toThrow(`Duplicate entityId in votes: "${movie1Id}". Each entity can only be voted once per ranking.`);
    });
  });

  describe('empty votes', () => {
    it('creates a ranking with no votes', () => {
      const ranking = createRanking({
        name: 'Empty Ranking',
        rankingType: 'ORDINAL',
        votes: [],
      });

      expect(ranking.voteIds).toHaveLength(0);
      // Only createEntity (ranking) + createRelation (type)
      expect(ranking.ops).toHaveLength(2);

      // Verify ranking entity was created
      const rankingEntityOp = ranking.ops[0] as CreateEntity;
      expect(rankingEntityOp.type).toBe('createEntity');
      expect(rankingEntityOp.id).toEqual(toGrcId(ranking.id));

      // Verify type relation was created
      const typeRelOp = ranking.ops[1] as CreateRelation;
      expect(typeRelOp.type).toBe('createRelation');
      expect(typeRelOp.to).toEqual(toGrcId(RANK_TYPE));
    });
  });

  describe('vote relations', () => {
    it('creates vote relations with correct entity references', () => {
      const ranking = createRanking({
        name: 'My Ranking',
        rankingType: 'ORDINAL',
        votes: [{ entityId: movie1Id }, { entityId: movie2Id }],
      });

      // Vote relations are at indices 2 and 4 (after ranking entity and type relation)
      const voteRel1 = ranking.ops[2] as CreateRelation;
      const voteRel2 = ranking.ops[4] as CreateRelation;

      // Verify first vote relation
      expect(voteRel1.type).toBe('createRelation');
      expect(voteRel1.from).toEqual(toGrcId(ranking.id));
      expect(voteRel1.to).toEqual(toGrcId(movie1Id));
      expect(voteRel1.relationType).toEqual(toGrcId(RANK_VOTES_RELATION_TYPE));
      // biome-ignore lint/style/noNonNullAssertion: test file - we verified voteIds has 2 elements
      expect(voteRel1.entity).toEqual(toGrcId(ranking.voteIds[0]!));

      // Verify second vote relation
      expect(voteRel2.type).toBe('createRelation');
      expect(voteRel2.from).toEqual(toGrcId(ranking.id));
      expect(voteRel2.to).toEqual(toGrcId(movie2Id));
      expect(voteRel2.relationType).toEqual(toGrcId(RANK_VOTES_RELATION_TYPE));
      // biome-ignore lint/style/noNonNullAssertion: test file - we verified voteIds has 2 elements
      expect(voteRel2.entity).toEqual(toGrcId(ranking.voteIds[1]!));
    });
  });
});
