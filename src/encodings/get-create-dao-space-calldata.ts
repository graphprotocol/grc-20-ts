import { encodeFunctionData } from 'viem';

import { DaoSpaceFactoryAbi } from '../abis/index.js';
import { getChecksumAddress } from '../core/get-checksum-address.js';

// Contract constants from DAOSpace.sol
/**
 * The base value for percentage ratios in the contract.
 * 100% = 10e6 (10,000,000), so 50% = 5e6 (5,000,000)
 */
export const RATIO_BASE = BigInt(10e6);

/** Minimum voting duration in seconds (2 days) */
export const MINIMUM_VOTING_DURATION = BigInt(2 * 24 * 60 * 60);

/** Minimum voting duration in days */
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
 * Convert a percentage (0-100) to the contract's ratio format.
 *
 * @param percentage - A number between 0 and 100
 * @returns The ratio value used by the contract (where 10e6 = 100%)
 *
 * @example
 * ```ts
 * percentageToRatio(100) // 10000000n (100%)
 * percentageToRatio(50)  // 5000000n (50%)
 * percentageToRatio(0)   // 0n (0%)
 * ```
 */
export function percentageToRatio(percentage: number): bigint {
  return BigInt(Math.floor((percentage * 10e6) / 100));
}

/**
 * Convert days to seconds.
 *
 * @param days - Number of days
 * @returns The equivalent duration in seconds as a bigint
 *
 * @example
 * ```ts
 * daysToSeconds(1) // 86400n
 * daysToSeconds(7) // 604800n
 * ```
 */
export function daysToSeconds(days: number): bigint {
  return BigInt(Math.floor(days * 24 * 60 * 60));
}

/**
 * Convert user-friendly voting settings to contract format.
 *
 * @param input - User-friendly voting settings with percentages and days
 * @returns Contract-level voting settings with bigint values
 *
 * @example
 * ```ts
 * const contractSettings = toContractVotingSettings({
 *   slowPathPercentageThreshold: 50,  // 50%
 *   fastPathFlatThreshold: 3,         // 3 editors
 *   quorum: 2,                        // 2 editors minimum
 *   durationInDays: 7,                // 7 days
 * });
 * // Returns: { slowPathPercentageThreshold: 5000000n, fastPathFlatThreshold: 3n, quorum: 2n, duration: 604800n }
 * ```
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
 * Validate voting settings input.
 *
 * @param settings - The voting settings to validate
 * @param totalEditors - The total number of initial editors
 * @returns Error message if invalid, null if valid
 *
 * @example
 * ```ts
 * const error = validateVotingSettingsInput(
 *   { slowPathPercentageThreshold: 50, fastPathFlatThreshold: 3, quorum: 2, durationInDays: 7 },
 *   5  // total editors
 * );
 * if (error) {
 *   console.error(error);
 * }
 * ```
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
  /** Voting settings for the DAO space */
  votingSettings: VotingSettingsInput;
  /** Addresses of initial editors (at least one required) */
  initialEditors: string[];
  /** Addresses of initial members (can be empty) */
  initialMembers: string[];
};

/**
 * Get the calldata for creating a DAO space proxy.
 *
 * This function encodes the `createDAOSpaceProxy` function call for the DAO Space Factory contract.
 * The returned calldata can be used with viem or wagmi to send a transaction.
 *
 * @param args - The parameters for creating the DAO space
 * @returns Encoded calldata for the transaction
 * @throws Error if validation fails (e.g., no editors, invalid voting settings)
 *
 * @example
 * ```ts
 * import { getCreateDaoSpaceCalldata, TESTNET } from '@graphprotocol/grc-20';
 * import { createWalletClient, http } from 'viem';
 *
 * const calldata = getCreateDaoSpaceCalldata({
 *   votingSettings: {
 *     slowPathPercentageThreshold: 50,  // 50% approval needed
 *     fastPathFlatThreshold: 3,         // 3 editors for fast path
 *     quorum: 2,                        // minimum 2 editors must vote
 *     durationInDays: 7,                // 7 day voting period
 *   },
 *   initialEditors: ['0x1234...', '0x5678...'],
 *   initialMembers: ['0xabcd...'],
 * });
 *
 * // Using viem
 * const hash = await walletClient.sendTransaction({
 *   to: TESTNET.DAO_SPACE_FACTORY_ADDRESS,
 *   data: calldata,
 * });
 *
 * // Using wagmi
 * const { sendTransaction } = useSendTransaction();
 * sendTransaction({
 *   to: TESTNET.DAO_SPACE_FACTORY_ADDRESS,
 *   data: calldata,
 * });
 * ```
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
