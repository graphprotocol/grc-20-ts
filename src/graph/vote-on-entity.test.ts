import { describe, expect, it } from 'vitest';
import { voteOnEntity } from './vote-on-entity.js';

describe('vote-on-entity', () => {
  describe('uuidToHex', () => {
    it('converts a UUID to hex format', () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      const expectedHex = '0x550e8400e29b41d4a716446655440000';
      
      // Since uuidToHex is not exported, we test it indirectly through voteOnEntity
      // The function is tested as part of the voteOnEntity tests below
    });
  });

  describe('voteOnEntity', () => {
    const validEntityId = '3138715a-62a7-4b9f-b2a9-13bedf987a1b';
    const validSpaceId = '550e8400-e29b-41d4-a716-446655440000';

    it('encodes an upvote action correctly', () => {
      const result = voteOnEntity({
        entityId: validEntityId,
        spaceId: validSpaceId,
        voteType: 'up',
      });

      expect(result).toBeDefined();
      expect(result).toMatch(/^0x/);
      expect(typeof result).toBe('string');
      // The result should contain the encoded parameters including the UUIDs without hyphens
      expect(result).toContain('550e8400e29b41d4a716446655440000');
      expect(result).toContain('3138715a62a74b9fb2a913bedf987a1b');
    });

    it('encodes a downvote action correctly', () => {
      const result = voteOnEntity({
        entityId: validEntityId,
        spaceId: validSpaceId,
        voteType: 'down',
      });

      expect(result).toBeDefined();
      expect(result).toMatch(/^0x/);
      expect(typeof result).toBe('string');
    });

    it('encodes a remove vote action correctly', () => {
      const result = voteOnEntity({
        entityId: validEntityId,
        spaceId: validSpaceId,
        voteType: 'remove',
      });

      expect(result).toBeDefined();
      expect(result).toMatch(/^0x/);
      expect(typeof result).toBe('string');
    });

    it('throws InvalidEntityIdError for invalid entity ID', () => {
      const invalidEntityId = 'not-a-valid-uuid';
      
      expect(() =>
        voteOnEntity({
          entityId: invalidEntityId,
          spaceId: validSpaceId,
          voteType: 'up',
        })
      ).toThrow('Invalid entity ID: not-a-valid-uuid');
    });

    it('throws InvalidSpaceIdError for invalid space ID', () => {
      const invalidSpaceId = 'invalid-space-id';
      
      expect(() =>
        voteOnEntity({
          entityId: validEntityId,
          spaceId: invalidSpaceId,
          voteType: 'up',
        })
      ).toThrow('Invalid space ID: invalid-space-id');
    });

    it('throws InvalidVoteTypeError for invalid vote type', () => {
      expect(() =>
        voteOnEntity({
          entityId: validEntityId,
          spaceId: validSpaceId,
          voteType: 'invalid' as any,
        })
      ).toThrow("Invalid vote type: invalid. Must be 'up', 'down', or 'remove'");
    });

    it('produces different payloads for different vote types', () => {
      const upvoteResult = voteOnEntity({
        entityId: validEntityId,
        spaceId: validSpaceId,
        voteType: 'up',
      });

      const downvoteResult = voteOnEntity({
        entityId: validEntityId,
        spaceId: validSpaceId,
        voteType: 'down',
      });

      const removeResult = voteOnEntity({
        entityId: validEntityId,
        spaceId: validSpaceId,
        voteType: 'remove',
      });

      // The results should be different due to different vote type payloads
      expect(upvoteResult).not.toBe(downvoteResult);
      expect(upvoteResult).not.toBe(removeResult);
      expect(downvoteResult).not.toBe(removeResult);
    });
  });
});