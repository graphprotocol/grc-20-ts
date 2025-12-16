import { describe, expect, it } from 'vitest';

import {
  MINIMUM_VOTING_DURATION,
  MINIMUM_VOTING_DURATION_DAYS,
  RATIO_BASE,
  daysToSeconds,
  getCreateDaoSpaceCalldata,
  percentageToRatio,
  toContractVotingSettings,
  validateVotingSettingsInput,
} from './get-create-dao-space-calldata.js';

describe('percentageToRatio', () => {
  it('should convert 100% to RATIO_BASE', () => {
    expect(percentageToRatio(100)).toBe(RATIO_BASE);
  });

  it('should convert 50% to half of RATIO_BASE', () => {
    expect(percentageToRatio(50)).toBe(RATIO_BASE / BigInt(2));
  });

  it('should convert 0% to 0', () => {
    expect(percentageToRatio(0)).toBe(BigInt(0));
  });

  it('should handle decimal percentages', () => {
    expect(percentageToRatio(33.33)).toBe(BigInt(3333000));
  });
});

describe('daysToSeconds', () => {
  it('should convert 1 day to 86400 seconds', () => {
    expect(daysToSeconds(1)).toBe(BigInt(86400));
  });

  it('should convert 2 days to 172800 seconds', () => {
    expect(daysToSeconds(2)).toBe(MINIMUM_VOTING_DURATION);
  });

  it('should handle fractional days', () => {
    expect(daysToSeconds(0.5)).toBe(BigInt(43200));
  });
});

describe('toContractVotingSettings', () => {
  it('should convert user-friendly settings to contract format', () => {
    const input = {
      slowPathPercentageThreshold: 50,
      fastPathFlatThreshold: 3,
      quorum: 2,
      durationInDays: 7,
    };

    const result = toContractVotingSettings(input);

    expect(result.slowPathPercentageThreshold).toBe(percentageToRatio(50));
    expect(result.fastPathFlatThreshold).toBe(BigInt(3));
    expect(result.quorum).toBe(BigInt(2));
    expect(result.duration).toBe(daysToSeconds(7));
  });
});

describe('validateVotingSettingsInput', () => {
  const validSettings = {
    slowPathPercentageThreshold: 50,
    fastPathFlatThreshold: 3,
    quorum: 2,
    durationInDays: 7,
  };

  it('should return null for valid settings', () => {
    expect(validateVotingSettingsInput(validSettings, 5)).toBeNull();
  });

  it('should reject slowPathPercentageThreshold below 0', () => {
    const settings = { ...validSettings, slowPathPercentageThreshold: -1 };
    expect(validateVotingSettingsInput(settings, 5)).toBe('slowPathPercentageThreshold must be between 0 and 100');
  });

  it('should reject slowPathPercentageThreshold above 100', () => {
    const settings = { ...validSettings, slowPathPercentageThreshold: 101 };
    expect(validateVotingSettingsInput(settings, 5)).toBe('slowPathPercentageThreshold must be between 0 and 100');
  });

  it('should reject fastPathFlatThreshold above total editors', () => {
    const settings = { ...validSettings, fastPathFlatThreshold: 10 };
    expect(validateVotingSettingsInput(settings, 5)).toBe(
      'fastPathFlatThreshold must be between 0 and 5 (number of initial editors)'
    );
  });

  it('should reject quorum above total editors', () => {
    const settings = { ...validSettings, quorum: 10 };
    expect(validateVotingSettingsInput(settings, 5)).toBe('quorum must be between 0 and 5 (number of initial editors)');
  });

  it('should reject durationInDays below minimum', () => {
    const settings = { ...validSettings, durationInDays: 1 };
    expect(validateVotingSettingsInput(settings, 5)).toBe(
      `durationInDays must be at least ${MINIMUM_VOTING_DURATION_DAYS} days`
    );
  });
});

describe('getCreateDaoSpaceCalldata', () => {
  const validArgs = {
    votingSettings: {
      slowPathPercentageThreshold: 50,
      fastPathFlatThreshold: 2,
      quorum: 1,
      durationInDays: 7,
    },
    initialEditors: [
      '0x1234567890123456789012345678901234567890',
      '0x2234567890123456789012345678901234567890',
      '0x3234567890123456789012345678901234567890',
    ],
    initialMembers: ['0xabcdefabcdefabcdefabcdefabcdefabcdefabcd'],
  };

  it('should generate valid calldata', () => {
    const calldata = getCreateDaoSpaceCalldata(validArgs);
    expect(calldata).toBeTypeOf('string');
    expect(calldata.startsWith('0x')).toBe(true);
  });

  it('should throw if no initial editors provided', () => {
    const args = { ...validArgs, initialEditors: [] };
    expect(() => getCreateDaoSpaceCalldata(args)).toThrow('At least one initial editor is required');
  });

  it('should throw if voting settings are invalid', () => {
    const args = {
      ...validArgs,
      votingSettings: { ...validArgs.votingSettings, slowPathPercentageThreshold: 150 },
    };
    expect(() => getCreateDaoSpaceCalldata(args)).toThrow('slowPathPercentageThreshold must be between 0 and 100');
  });

  it('should throw if duration is below minimum', () => {
    const args = {
      ...validArgs,
      votingSettings: { ...validArgs.votingSettings, durationInDays: 1 },
    };
    expect(() => getCreateDaoSpaceCalldata(args)).toThrow(
      `durationInDays must be at least ${MINIMUM_VOTING_DURATION_DAYS} days`
    );
  });

  it('should accept empty initial members', () => {
    const args = { ...validArgs, initialMembers: [] };
    const calldata = getCreateDaoSpaceCalldata(args);
    expect(calldata).toBeTypeOf('string');
    expect(calldata.startsWith('0x')).toBe(true);
  });

  it('should checksum addresses', () => {
    // Should not throw with lowercase addresses - uses validArgs which has 3 editors
    const calldata = getCreateDaoSpaceCalldata(validArgs);
    expect(calldata).toBeTypeOf('string');
  });
});
