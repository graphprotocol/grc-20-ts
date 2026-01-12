import { describe, expect, it } from 'vitest';

import {
  daysToSeconds,
  getCreateDaoSpaceCalldata,
  MINIMUM_VOTING_DURATION,
  MINIMUM_VOTING_DURATION_DAYS,
  percentageToRatio,
  RATIO_BASE,
  toContractVotingSettings,
  validateIpfsUri,
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

describe('validateIpfsUri', () => {
  it('should return null for valid CIDv0', () => {
    expect(validateIpfsUri('ipfs://QmP6aJhM3SgoRSPUccBQK9VMHNqqezixG1Qvjy2xPWvPh5')).toBeNull();
  });

  it('should return null for valid CIDv1', () => {
    expect(validateIpfsUri('ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi')).toBeNull();
  });

  it('should reject URI without ipfs:// prefix', () => {
    expect(validateIpfsUri('QmP6aJhM3SgoRSPUccBQK9VMHNqqezixG1Qvjy2xPWvPh5')).toBe(
      'IPFS URI must start with "ipfs://"',
    );
  });

  it('should reject empty CID', () => {
    expect(validateIpfsUri('ipfs://')).toBe('IPFS URI must contain a CID after "ipfs://"');
  });

  it('should reject invalid CID format', () => {
    expect(validateIpfsUri('ipfs://invalid')).toBe('IPFS URI contains an invalid CID format');
  });

  it('should reject http URLs', () => {
    expect(validateIpfsUri('https://example.com/file')).toBe('IPFS URI must start with "ipfs://"');
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
      'fastPathFlatThreshold must be between 0 and 5 (number of initial editors)',
    );
  });

  it('should reject quorum above total editors', () => {
    const settings = { ...validSettings, quorum: 10 };
    expect(validateVotingSettingsInput(settings, 5)).toBe('quorum must be between 0 and 5 (number of initial editors)');
  });

  it('should reject durationInDays below minimum', () => {
    const settings = { ...validSettings, durationInDays: 1 };
    expect(validateVotingSettingsInput(settings, 5)).toBe(
      `durationInDays must be at least ${MINIMUM_VOTING_DURATION_DAYS} days`,
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
    initialEditorSpaceIds: [
      '0x12345678901234567890123456789012' as `0x${string}`,
      '0x22345678901234567890123456789012' as `0x${string}`,
      '0x32345678901234567890123456789012' as `0x${string}`,
    ],
    initialMemberSpaceIds: ['0xabcdefabcdefabcdefabcdefabcdefab' as `0x${string}`],
  };

  it('should generate valid calldata', () => {
    const calldata = getCreateDaoSpaceCalldata(validArgs);
    expect(calldata).toBeTypeOf('string');
    expect(calldata.startsWith('0x')).toBe(true);
  });

  it('should throw if no initial editors provided', () => {
    const args = { ...validArgs, initialEditorSpaceIds: [] as `0x${string}`[] };
    expect(() => getCreateDaoSpaceCalldata(args)).toThrow('At least one initial editor space ID is required');
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
      `durationInDays must be at least ${MINIMUM_VOTING_DURATION_DAYS} days`,
    );
  });

  it('should accept empty initial members', () => {
    const args = { ...validArgs, initialMemberSpaceIds: [] as `0x${string}`[] };
    const calldata = getCreateDaoSpaceCalldata(args);
    expect(calldata).toBeTypeOf('string');
    expect(calldata.startsWith('0x')).toBe(true);
  });

  it('should accept space IDs', () => {
    const calldata = getCreateDaoSpaceCalldata(validArgs);
    expect(calldata).toBeTypeOf('string');
  });

  it('should generate calldata without initialEditsContentUri', () => {
    const calldata = getCreateDaoSpaceCalldata(validArgs);
    expect(calldata).toBeTypeOf('string');
    expect(calldata.startsWith('0x')).toBe(true);
  });

  it('should generate calldata with initialEditsContentUri', () => {
    const args = {
      ...validArgs,
      initialEditsContentUri: 'ipfs://QmP6aJhM3SgoRSPUccBQK9VMHNqqezixG1Qvjy2xPWvPh5',
    };
    const calldata = getCreateDaoSpaceCalldata(args);
    expect(calldata).toBeTypeOf('string');
    expect(calldata.startsWith('0x')).toBe(true);
    // Calldata with URI should be longer than without
    const calldataWithoutUri = getCreateDaoSpaceCalldata(validArgs);
    expect(calldata.length).toBeGreaterThan(calldataWithoutUri.length);
  });

  it('should generate different calldata for different URIs', () => {
    const calldata1 = getCreateDaoSpaceCalldata({
      ...validArgs,
      initialEditsContentUri: 'ipfs://QmP6aJhM3SgoRSPUccBQK9VMHNqqezixG1Qvjy2xPWvPh5',
    });
    const calldata2 = getCreateDaoSpaceCalldata({
      ...validArgs,
      initialEditsContentUri: 'ipfs://QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG',
    });
    expect(calldata1).not.toBe(calldata2);
  });

  it('should throw for invalid IPFS URI', () => {
    const args = {
      ...validArgs,
      initialEditsContentUri: 'https://example.com/file',
    };
    expect(() => getCreateDaoSpaceCalldata(args)).toThrow('IPFS URI must start with "ipfs://"');
  });

  it('should throw for invalid CID format', () => {
    const args = {
      ...validArgs,
      initialEditsContentUri: 'ipfs://invalid-cid',
    };
    expect(() => getCreateDaoSpaceCalldata(args)).toThrow('IPFS URI contains an invalid CID format');
  });
});
