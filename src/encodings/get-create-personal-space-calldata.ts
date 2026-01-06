import { encodeFunctionData, keccak256, toBytes, toHex } from 'viem';

import { SpaceRegistryAbi } from '../abis/index.js';

const PERSONAL_SPACE_TYPE = keccak256(toBytes('EOA_SPACE'));
const PERSONAL_SPACE_VERSION = '1.0.0';

/**
 * Get the calldata for creating a personal space.
 *
 * This function encodes the `registerSpaceId` function call for the Space Registry contract.
 * It registers the caller's address as a personal space with a deterministically derived space ID.
 *
 * For creating DAO spaces, use the DAO Space Factory instead via `getCreateDaoSpaceCalldata`.
 *
 * @returns Encoded calldata for the transaction
 *
 * @example
 * ```ts
 * import { getCreatePersonalSpaceCalldata, TESTNET } from '@graphprotocol/grc-20';
 * import { createWalletClient, http } from 'viem';
 *
 * const calldata = getCreatePersonalSpaceCalldata();
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
export function getCreatePersonalSpaceCalldata(): `0x${string}` {
  return encodeFunctionData({
    abi: SpaceRegistryAbi,
    functionName: 'registerSpaceId',
    args: [PERSONAL_SPACE_TYPE, toHex(PERSONAL_SPACE_VERSION)],
  });
}
