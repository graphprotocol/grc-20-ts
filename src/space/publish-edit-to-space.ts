import { createPublicClient, encodeAbiParameters, encodeFunctionData, type Hex, http } from 'viem';

import { TESTNET } from '../../contracts.js';
import { SpaceRegistryAbi } from '../abis/index.js';
import { EDITS_PUBLISHED_ACTION, EMPTY_TOPIC, ZERO_ADDRESS } from './constants.js';
import type { Network, PublishEditToSpaceParams, PublishEditToSpaceResult } from './types.js';
import { parseSpaceId } from './utils.js';

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
 * Publishes edits to a space by recording the IPFS CID on-chain.
 *
 * This function:
 * 1. Verifies the space exists in the registry
 * 2. Encodes the CID as calldata
 * 3. Calls SpaceRegistry.enter() to record the publication
 *
 * After the transaction is confirmed, indexers will:
 * 1. See the Action event emitted by the contract
 * 2. Fetch the operations from IPFS using the CID
 * 3. Process the operations into queryable data
 *
 * @example
 * ```typescript
 * import { Ipfs, publishEditToSpace } from '@graphprotocol/grc-20';
 *
 * // First, build your operations and upload to IPFS
 * const { cid } = await Ipfs.publishEdit({
 *   name: 'Update my profile',
 *   ops: myOperations,
 *   author: walletAddress,
 *   network: 'TESTNET',
 * });
 *
 * // Then record the CID on-chain
 * const { txHash } = await publishEditToSpace({
 *   walletClient,
 *   spaceId: 'my-space-id',
 *   cid,
 *   network: 'TESTNET',
 * });
 *
 * console.log('Published! TX:', txHash);
 * ```
 *
 * @param params - {@link PublishEditToSpaceParams}
 * @returns The transaction hash and normalized space ID
 * @throws Error if the space is not registered
 */
export async function publishEditToSpace({
  walletClient,
  publicClient: providedPublicClient,
  spaceId,
  cid,
  network = 'TESTNET',
}: PublishEditToSpaceParams): Promise<PublishEditToSpaceResult> {
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

  // Normalize the space ID to bytes16 hex format
  const spaceIdHex = parseSpaceId(spaceId);

  // Verify the space is registered
  const spaceAddress = (await publicClient.readContract({
    address: spaceRegistryAddress,
    abi: SpaceRegistryAbi,
    functionName: 'spaceIdToAddress',
    args: [spaceIdHex],
  })) as Hex;

  if (spaceAddress.toLowerCase() === ZERO_ADDRESS.toLowerCase()) {
    throw new Error(`Space ${spaceId} is not registered`);
  }

  // Encode the CID as the data parameter
  const encodedCid = encodeAbiParameters([{ type: 'string' }], [cid]);

  // Build the calldata for enter()
  // For edits, fromSpaceId and toSpaceId are the same (editing your own space)
  const calldata = encodeFunctionData({
    abi: SpaceRegistryAbi,
    functionName: 'enter',
    args: [
      spaceIdHex, // fromSpaceId: who is publishing
      spaceIdHex, // toSpaceId: which space is being edited
      EDITS_PUBLISHED_ACTION, // action: "edits were published"
      EMPTY_TOPIC, // topic: none
      encodedCid, // data: the IPFS CID
      '0x', // signature: not needed for owner
    ],
  });

  // Send the transaction
  const txHash = await walletClient.sendTransaction({
    account,
    chain: walletClient.chain ?? null,
    to: spaceRegistryAddress,
    data: calldata,
    value: 0n,
  });

  return { txHash, spaceId: spaceIdHex };
}
