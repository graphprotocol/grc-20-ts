import { encodeFunctionData } from 'viem';

import { SpaceRegistryAbi } from '../abis/index.js';

/**
 * Get the calldata for registering a space ID.
 *
 * This function is called by a space contract to register itself with the Space Registry.
 * The space ID is derived from the caller's address and nonce.
 */
export function getRegisterSpaceCalldata(): `0x${string}` {
  return encodeFunctionData({
    abi: SpaceRegistryAbi,
    functionName: 'registerSpaceId',
  });
}
