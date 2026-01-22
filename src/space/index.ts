/**
 * Space module for GRC-20
 *
 * Provides functions for creating and managing spaces directly on the blockchain.
 * This replaces the deprecated API-based approach with direct smart contract calls.
 *
 * @example
 * ```typescript
 * import { Space } from '@graphprotocol/grc-20';
 *
 * // Check if user has a space
 * const existingSpaceId = await Space.getSpaceId({
 *   address: walletAddress,
 *   network: 'TESTNET',
 * });
 *
 * // Create a personal space (if they don't have one)
 * if (!existingSpaceId) {
 *   const { spaceId } = await Space.createPersonal({
 *     walletClient,
 *     network: 'TESTNET',
 *   });
 * }
 *
 * // Publish edits to a space
 * await Space.publishEdit({
 *   walletClient,
 *   spaceId,
 *   cid: 'bafybeig...',
 *   network: 'TESTNET',
 * });
 * ```
 *
 * @module
 */

// Constants (for advanced usage)
export {
  EDITS_PUBLISHED_ACTION,
  EMPTY_SPACE_ID,
  EMPTY_TOPIC,
  EOA_SPACE_TYPE,
  ZERO_ADDRESS,
} from './constants.js';
// Main functions
export { createPersonalSpace } from './create-personal-space.js';
export type { GetSpaceIdParams } from './get-space-id.js';
export { getSpaceId } from './get-space-id.js';
export { publishEditToSpace } from './publish-edit-to-space.js';
// Types
export type {
  CreatePersonalSpaceParams,
  CreatePersonalSpaceResult,
  Network,
  PublishEditToSpaceParams,
  PublishEditToSpaceResult,
} from './types.js';
// Utilities
export { hexToFormattedUuid, hexToUuid, parseSpaceId } from './utils.js';

// Convenient namespace export
import { createPersonalSpace } from './create-personal-space.js';
import { getSpaceId } from './get-space-id.js';
import { publishEditToSpace } from './publish-edit-to-space.js';

/**
 * Space namespace providing all space-related functions.
 *
 * @example
 * ```typescript
 * import { Space } from '@graphprotocol/grc-20';
 *
 * await Space.createPersonal({ walletClient });
 * await Space.publishEdit({ walletClient, spaceId, cid });
 * await Space.getSpaceId({ address });
 * ```
 */
export const Space = {
  /**
   * Create a personal (EOA) space for the wallet.
   * @see {@link createPersonalSpace}
   */
  createPersonal: createPersonalSpace,

  /**
   * Publish edits to a space by recording the IPFS CID on-chain.
   * @see {@link publishEditToSpace}
   */
  publishEdit: publishEditToSpace,

  /**
   * Get the space ID for a wallet address.
   * @see {@link getSpaceId}
   */
  getSpaceId,
};
