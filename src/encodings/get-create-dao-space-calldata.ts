import { encodeFunctionData } from 'viem';

import { DaoSpaceFactoryAbi } from '../abis/index.js';
import { getChecksumAddress } from '../core/get-checksum-address.js';

// Contract constants from DAOSpace.sol
/** 100% = 10e6, so 50% = 5e6 */
export const RATIO_BASE = BigInt(10e6);
/** 2 days in seconds */
export const MINIMUM_VOTING_DURATION = BigInt(2 * 24 * 60 * 60);
export const MINIMUM_VOTING_DURATION_DAYS = 2;

/**
 * User-friendly voting settings input (using percentages and days)
 */
export interface VotingSettingsInput {
  /** Percentage threshold for slow path (0-100) */
  slowPathPercentageThreshold: number;
  /** Number of editors required for fast path approval */
  fastPathFlatThreshold: number;
  /** Minimum number of editors required to vote */
  quorum: number;
  /** Voting duration in days (minimum 2 days) */
  durationInDays: number;
}

/**
 * Contract-level voting settings (using raw values)
 */
export interface VotingSettings {
  slowPathPercentageThreshold: bigint;
  fastPathFlatThreshold: bigint;
  quorum: bigint;
  duration: bigint;
}

/**
 * Convert a percentage (0-100) to the contract's ratio format
 */
export function percentageToRatio(percentage: number): bigint {
  return BigInt(Math.floor((percentage * 10e6) / 100));
}

/**
 * Convert days to seconds
 */
export function daysToSeconds(days: number): bigint {
  return BigInt(Math.floor(days * 24 * 60 * 60));
}

/**
 * Convert user-friendly voting settings to contract format
 */
export function toContractVotingSettings(input: VotingSettingsInput): VotingSettings {
  return {
    slowPathPercentageThreshold: percentageToRatio(input.slowPathPercentageThreshold),
    fastPathFlatThreshold: BigInt(input.fastPathFlatThreshold),
    quorum: BigInt(input.quorum),
    duration: daysToSeconds(input.durationInDays),
  };
}

/**
 * Validate voting settings input
 * @returns Error message if invalid, null if valid
 */
export function validateVotingSettingsInput(settings: VotingSettingsInput, totalEditors: number): string | null {
  if (settings.slowPathPercentageThreshold < 0 || settings.slowPathPercentageThreshold > 100) {
    return 'slowPathPercentageThreshold must be between 0 and 100';
  }
  if (settings.fastPathFlatThreshold < 0 || settings.fastPathFlatThreshold > totalEditors) {
    return `fastPathFlatThreshold must be between 0 and ${totalEditors} (number of initial editors)`;
  }
  if (settings.quorum < 0 || settings.quorum > totalEditors) {
    return `quorum must be between 0 and ${totalEditors} (number of initial editors)`;
  }
  if (settings.durationInDays < MINIMUM_VOTING_DURATION_DAYS) {
    return `durationInDays must be at least ${MINIMUM_VOTING_DURATION_DAYS} days`;
  }
  return null;
}

type CreateDaoSpaceCalldataParams = {
  votingSettings: VotingSettingsInput;
  initialEditors: string[];
  initialMembers: string[];
};

/**
 * Get the calldata for creating a DAO space proxy
 *
 * @throws Error if validation fails
 */
export function getCreateDaoSpaceCalldata(args: CreateDaoSpaceCalldataParams): `0x${string}` {
  const initialEditors = args.initialEditors.map(getChecksumAddress);
  const initialMembers = args.initialMembers.map(getChecksumAddress);

  if (initialEditors.length === 0) {
    throw new Error('At least one initial editor is required');
  }

  const validationError = validateVotingSettingsInput(args.votingSettings, initialEditors.length);
  if (validationError) {
    throw new Error(validationError);
  }

  const contractVotingSettings = toContractVotingSettings(args.votingSettings);

  return encodeFunctionData({
    abi: DaoSpaceFactoryAbi,
    functionName: 'createDAOSpaceProxy',
    args: [
      {
        slowPathPercentageThreshold: contractVotingSettings.slowPathPercentageThreshold,
        fastPathFlatThreshold: contractVotingSettings.fastPathFlatThreshold,
        quorum: contractVotingSettings.quorum,
        duration: contractVotingSettings.duration,
      },
      initialEditors,
      initialMembers,
    ],
  });
}
