import { createPublicClient, type Hex, http } from 'viem';

import { TESTNET } from '../../contracts.js';
import { SpaceRegistryAbi } from '../abis/index.js';
import { EMPTY_SPACE_ID } from './constants.js';
import type { Network } from './types.js';

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
 * Parameters for getting a space ID
 */
export type GetSpaceIdParams = {
  /**
   * The wallet address to look up
   */
  address: Hex;

  /**
   * Which network to use
   * @default 'TESTNET'
   */
  network?: Network;
};

/**
 * Gets the space ID for a given wallet address.
 *
 * @example
 * ```typescript
 * import { getSpaceId } from '@graphprotocol/grc-20';
 *
 * const spaceId = await getSpaceId({
 *   address: '0x1234...',
 *   network: 'TESTNET',
 * });
 *
 * if (spaceId) {
 *   console.log('User has space:', spaceId);
 * } else {
 *   console.log('User has no space - they need to create one');
 * }
 * ```
 *
 * @param params - {@link GetSpaceIdParams}
 * @returns The space ID in bytes16 hex format, or null if the address has no space
 */
export async function getSpaceId({ address, network = 'TESTNET' }: GetSpaceIdParams): Promise<Hex | null> {
  const spaceRegistryAddress = getSpaceRegistryAddress(network);
  const rpcUrl = RPC_URLS[network];

  const publicClient = createPublicClient({
    transport: http(rpcUrl),
  });

  const spaceId = (await publicClient.readContract({
    address: spaceRegistryAddress,
    abi: SpaceRegistryAbi,
    functionName: 'addressToSpaceId',
    args: [address],
  })) as Hex;

  if (spaceId.toLowerCase() === EMPTY_SPACE_ID.toLowerCase()) {
    return null;
  }

  return spaceId;
}
