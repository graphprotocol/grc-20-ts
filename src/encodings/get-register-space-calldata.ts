import { encodeFunctionData } from 'viem';

import { SpaceRegistryAbi } from '../abis/index.js';

/**
 * Get the calldata for registering a space ID.
 *
 * This function encodes the `registerSpaceId` function call for the Space Registry contract.
 * It is called by a space contract to register itself with the Space Registry.
 * The space ID is deterministically derived from the caller's address and nonce.
 *
 * @returns Encoded calldata for the transaction
 *
 * @example
 * ```ts
 * import { getRegisterSpaceCalldata, TESTNET } from '@graphprotocol/grc-20';
 * import { createWalletClient, http } from 'viem';
 *
 * const calldata = getRegisterSpaceCalldata();
 *
 * // Using viem
 * const hash = await walletClient.sendTransaction({
 *   to: TESTNET.SPACE_REGISTRY_ADDRESS,
 *   data: calldata,
 * });
 *
 * // Using wagmi
 * const { sendTransaction } = useSendTransaction();
 * sendTransaction({
 *   to: TESTNET.SPACE_REGISTRY_ADDRESS,
 *   data: calldata,
 * });
 * ```
 */
export function getRegisterSpaceCalldata(): `0x${string}` {
  return encodeFunctionData({
    abi: SpaceRegistryAbi,
    functionName: 'registerSpaceId',
  });
}
