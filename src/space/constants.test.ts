import { keccak256, toHex } from 'viem';
import { describe, expect, it } from 'vitest';

import {
  EDITS_PUBLISHED_ACTION,
  EMPTY_SPACE_ID,
  EMPTY_TOPIC,
  EOA_SPACE_TYPE,
  ZERO_ADDRESS,
} from './constants.js';

describe('Space constants', () => {
  describe('EMPTY_SPACE_ID', () => {
    it('should be 32 hex characters (bytes16)', () => {
      // Remove 0x prefix and check length
      expect(EMPTY_SPACE_ID.slice(2)).toHaveLength(32);
    });

    it('should be all zeros', () => {
      expect(EMPTY_SPACE_ID).toBe('0x00000000000000000000000000000000');
    });
  });

  describe('ZERO_ADDRESS', () => {
    it('should be 40 hex characters (20 bytes)', () => {
      expect(ZERO_ADDRESS.slice(2)).toHaveLength(40);
    });

    it('should be all zeros', () => {
      expect(ZERO_ADDRESS).toBe('0x0000000000000000000000000000000000000000');
    });
  });

  describe('EMPTY_TOPIC', () => {
    it('should be 64 hex characters (bytes32)', () => {
      expect(EMPTY_TOPIC.slice(2)).toHaveLength(64);
    });

    it('should be all zeros', () => {
      expect(EMPTY_TOPIC).toBe('0x0000000000000000000000000000000000000000000000000000000000000000');
    });
  });

  describe('EDITS_PUBLISHED_ACTION', () => {
    it('should be keccak256 hash of "GOVERNANCE.EDITS_PUBLISHED"', () => {
      const expected = keccak256(toHex('GOVERNANCE.EDITS_PUBLISHED'));
      expect(EDITS_PUBLISHED_ACTION).toBe(expected);
    });

    it('should be 64 hex characters (bytes32)', () => {
      expect(EDITS_PUBLISHED_ACTION.slice(2)).toHaveLength(64);
    });
  });

  describe('EOA_SPACE_TYPE', () => {
    it('should be keccak256 hash of "EOA_SPACE"', () => {
      const expected = keccak256(toHex('EOA_SPACE'));
      expect(EOA_SPACE_TYPE).toBe(expected);
    });

    it('should be 64 hex characters (bytes32)', () => {
      expect(EOA_SPACE_TYPE.slice(2)).toHaveLength(64);
    });
  });
});
