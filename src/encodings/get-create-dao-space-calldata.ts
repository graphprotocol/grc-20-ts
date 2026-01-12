import { encodeFunctionData, toHex } from 'viem';

import { DaoSpaceFactoryAbi } from '../abis/index.js';

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
 * Validate an IPFS URI format.
 *
 * @param uri - The URI to validate
 * @returns Error message if invalid, null if valid
 */
export function validateIpfsUri(uri: string): string | null {
  if (!uri.startsWith('ipfs://')) {
    return 'IPFS URI must start with "ipfs://"';
  }

  const cid = uri.slice(7); // Remove 'ipfs://' prefix
  if (cid.length === 0) {
    return 'IPFS URI must contain a CID after "ipfs://"';
  }

  // CIDv0 starts with Qm (46 chars), CIDv1 starts with bafy (59 chars for base32)
  const isValidCidV0 = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/.test(cid);
  const isValidCidV1 = /^b[a-z2-7]{58,}$/.test(cid);

  if (!isValidCidV0 && !isValidCidV1) {
    return 'IPFS URI contains an invalid CID format';
  }

  return null;
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
  /** Space IDs of initial editors (at least one required). Must be bytes16 hex strings without dashes. */
  initialEditorSpaceIds: `0x${string}`[];
  /** Space IDs of initial members (can be empty). Must be bytes16 hex strings without dashes. */
  initialMemberSpaceIds: `0x${string}`[];
  /** Initial edits content URI, e.g. "ipfs://Qm..." (optional) */
  initialEditsContentUri?: string;
  /** Initial topic ID as UUID string (optional - if provided, declares a topic on creation) */
  initialTopicId?: string;
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
 *   initialEditorSpaceIds: ['0x01234567890abcdef01234567890abcd', '0x56789abcdef01234567890abcdef0123'],
 *   initialMemberSpaceIds: ['0xabcdef01234567890abcdef012345678'],
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
  const initialEditorSpaceIds = args.initialEditorSpaceIds;
  const initialMemberSpaceIds = args.initialMemberSpaceIds;

  if (initialEditorSpaceIds.length === 0) {
    throw new Error('At least one initial editor space ID is required');
  }

  const validationError = validateVotingSettingsInput(args.votingSettings, initialEditorSpaceIds.length);
  if (validationError) {
    throw new Error(validationError);
  }

  const contractVotingSettings = toContractVotingSettings(args.votingSettings);

  let initialEditsContentUri: `0x${string}` = '0x';
  if (args.initialEditsContentUri) {
    const ipfsError = validateIpfsUri(args.initialEditsContentUri);
    if (ipfsError) {
      throw new Error(ipfsError);
    }
    initialEditsContentUri = toHex(args.initialEditsContentUri);
  }

  // Convert UUID to bytes16 hex if provided
  let initialTopicId: `0x${string}` = '0x00000000000000000000000000000000';
  if (args.initialTopicId) {
    // Remove dashes from UUID and add 0x prefix
    initialTopicId = `0x${args.initialTopicId.replace(/-/g, '')}`;
  }

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
      initialEditorSpaceIds,
      initialMemberSpaceIds,
      initialEditsContentUri,
      '0x', // initialEditsMetadata
      initialTopicId,
      '0x', // initialTopicData
    ],
  });
}
