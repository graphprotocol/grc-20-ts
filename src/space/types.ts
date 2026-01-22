import type { Hex, PublicClient, WalletClient } from 'viem';

/**
 * Supported networks for GRC-20 space operations
 */
export type Network = 'MAINNET' | 'TESTNET';

/**
 * Parameters for creating a personal space
 */
export type CreatePersonalSpaceParams = {
  /**
   * Wallet client for signing transactions.
   * Can be a standard viem WalletClient or a Smart Account client.
   */
  walletClient: WalletClient;

  /**
   * Public client for reading contract state.
   * If not provided, one will be created using the wallet client's chain.
   */
  publicClient?: PublicClient;

  /**
   * Which network to use.
   * @default 'TESTNET'
   */
  network?: Network;
};

/**
 * Parameters for publishing edits to a space
 */
export type PublishEditToSpaceParams = {
  /**
   * Wallet client for signing transactions.
   */
  walletClient: WalletClient;

  /**
   * Public client for reading contract state.
   * If not provided, one will be created.
   */
  publicClient?: PublicClient;

  /**
   * The space ID to publish to.
   * Accepts UUID format (with or without dashes) or bytes16 hex format.
   */
  spaceId: string;

  /**
   * The IPFS CID containing the operations.
   * This should be the result of Ipfs.publishEdit().
   */
  cid: string;

  /**
   * Which network to use.
   * @default 'TESTNET'
   */
  network?: Network;
};

/**
 * Result from creating a personal space
 */
export type CreatePersonalSpaceResult = {
  /**
   * The created space ID in bytes16 hex format
   */
  spaceId: Hex;

  /**
   * The transaction hash for the space creation
   */
  txHash: Hex;
};

/**
 * Result from publishing edits
 */
export type PublishEditToSpaceResult = {
  /**
   * The transaction hash
   */
  txHash: Hex;

  /**
   * The normalized space ID in bytes16 hex format
   */
  spaceId: Hex;
};
