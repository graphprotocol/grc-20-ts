import { createPublicClient, encodeAbiParameters, encodeFunctionData, type Hex, http } from 'viem';

import { TESTNET } from '../../contracts.js';
import { SpaceRegistryAbi } from '../abis/index.js';
import { DEFAULT_SPACE_VERSION, EMPTY_SPACE_ID, EOA_SPACE_TYPE } from './constants.js';
import type { CreatePersonalSpaceParams, CreatePersonalSpaceResult, Network } from './types.js';

/**
 * RPC URLs for each network
 */
const RPC_URLS: Record<Network, string> = {
  MAINNET: 'https://rpc.geo.network', // TODO: Confirm mainnet RPC
  TESTNET: 'https://rpc-geo-test-zc16z3tcvf.t.conduit.xyz',
};

/**
 * Get the SpaceRegistry address for a network
 */
function getSpaceRegistryAddress(network: Network): Hex {
  if (network === 'TESTNET') {
    return TESTNET.SPACE_REGISTRY_ADDRESS as Hex;
  }
  // TODO: Add mainnet address when available
  throw new Error('Mainnet SpaceRegistry address not yet configured');
}

/**
 * Creates a personal (EOA) space for the caller's address.
 *
 * A personal space is owned by a single wallet address. Only the owner
 * can publish edits to it directly - no voting required.
 *
 * This function:
 * 1. Checks if the address already has a space
 * 2. If not, registers a new space on-chain
 * 3. Returns the space ID and transaction hash
 *
 * @example
 * ```typescript
 * import { createPersonalSpace } from '@graphprotocol/grc-20';
 * import { createWalletClient, http } from 'viem';
 * import { privateKeyToAccount } from 'viem/accounts';
 *
 * const account = privateKeyToAccount('0x...');
 * const walletClient = createWalletClient({
 *   account,
 *   transport: http('https://rpc-geo-test...'),
 * });
 *
 * const { spaceId, txHash } = await createPersonalSpace({
 *   walletClient,
 *   network: 'TESTNET',
 * });
 *
 * console.log('Created space:', spaceId);
 * ```
 *
 * @param params - {@link CreatePersonalSpaceParams}
 * @returns The created space ID and transaction hash
 * @throws Error if the wallet already has a space registered
 */
export async function createPersonalSpace({
  walletClient,
  publicClient: providedPublicClient,
  network = 'TESTNET',
}: CreatePersonalSpaceParams): Promise<CreatePersonalSpaceResult> {
  const account = walletClient.account;
  if (!account) {
    throw new Error('Wallet client must have an account');
  }

  const spaceRegistryAddress = getSpaceRegistryAddress(network);
  const rpcUrl = RPC_URLS[network];

  // Create public client if not provided
  const publicClient =
    providedPublicClient ??
    createPublicClient({
      transport: http(rpcUrl),
    });

  // Check if the address already has a space
  const existingSpaceId = (await publicClient.readContract({
    address: spaceRegistryAddress,
    abi: SpaceRegistryAbi,
    functionName: 'addressToSpaceId',
    args: [account.address],
  })) as Hex;

  if (existingSpaceId.toLowerCase() !== EMPTY_SPACE_ID.toLowerCase()) {
    throw new Error(
      `Address ${account.address} already has a space: ${existingSpaceId}. ` + 'Use getSpaceId() to retrieve it.',
    );
  }

  // Encode the version parameter
  const encodedVersion = encodeAbiParameters([{ type: 'string' }], [DEFAULT_SPACE_VERSION]);

  // Build the calldata
  const calldata = encodeFunctionData({
    abi: SpaceRegistryAbi,
    functionName: 'registerSpaceId',
    args: [EOA_SPACE_TYPE, encodedVersion],
  });

  // Send the transaction
  const txHash = await walletClient.sendTransaction({
    account,
    chain: walletClient.chain ?? null,
    to: spaceRegistryAddress,
    data: calldata,
    value: 0n,
  });

  // Wait for the transaction to be mined
  await publicClient.waitForTransactionReceipt({ hash: txHash });

  // Fetch the newly created space ID
  const spaceId = (await publicClient.readContract({
    address: spaceRegistryAddress,
    abi: SpaceRegistryAbi,
    functionName: 'addressToSpaceId',
    args: [account.address],
  })) as Hex;

  if (spaceId.toLowerCase() === EMPTY_SPACE_ID.toLowerCase()) {
    throw new Error('Space registration failed - space ID is empty after transaction');
  }

  return { spaceId, txHash };
}
