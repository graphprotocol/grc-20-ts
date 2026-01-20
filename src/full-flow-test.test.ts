import { createPublicClient, encodeAbiParameters, encodeFunctionData, type Hex, http, keccak256, toHex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { it } from 'vitest';

import { SpaceRegistryAbi } from './abis/index.js';
import { createEntity } from './graph/create-entity.js';
import { publishEdit } from './ipfs.js';
import { getWalletClient } from './smart-wallet.js';

// Contract addresses for testnet
// Note: These should be imported from contracts.ts once it's exported
const SPACE_REGISTRY_ADDRESS = '0xB01683b2f0d38d43fcD4D9aAB980166988924132' as const;
const EMPTY_SPACE_ID = '0x00000000000000000000000000000000' as Hex;
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000' as Hex;

// Action constants
const EDITS_PUBLISHED = keccak256(toHex('GOVERNANCE.EDITS_PUBLISHED'));

/**
 * Converts a bytes16 hex space ID to a UUID string (without dashes).
 */
function hexToUuid(hex: Hex): string {
  // Remove 0x prefix and trailing zeros (bytes16 is 32 hex chars)
  return hex.slice(2, 34).toLowerCase();
}

it.skip('should create a space and publish an edit', async () => {
  // IMPORTANT: Replace with your actual private key for testing
  // You can get your private key using https://www.geobrowser.io/export-wallet
  const addressPrivateKey = '0xTODO' as `0x${string}`;
  const { address } = privateKeyToAccount(addressPrivateKey);

  console.log('address', address);

  // Get wallet client for testnet
  const walletClient = await getWalletClient({
    privateKey: addressPrivateKey,
  });

  const account = walletClient.account;
  if (!account) {
    throw new Error('Wallet client account is undefined');
  }

  // Create a public client for reading contract state
  const rpcUrl = walletClient.chain?.rpcUrls?.default?.http?.[0];
  if (!rpcUrl) {
    throw new Error('Wallet client RPC URL is undefined');
  }

  const publicClient = createPublicClient({
    transport: http(rpcUrl),
  });

  // Check if a personal space already exists for this address
  let spaceIdHex = (await publicClient.readContract({
    address: SPACE_REGISTRY_ADDRESS,
    abi: SpaceRegistryAbi,
    functionName: 'addressToSpaceId',
    args: [account.address],
  })) as Hex;

  console.log('existing spaceIdHex', spaceIdHex);

  // Create a personal space if one doesn't exist
  if (spaceIdHex.toLowerCase() === EMPTY_SPACE_ID.toLowerCase()) {
    console.log('Creating personal space...');

    const createSpaceTxHash = await walletClient.sendTransaction({
      // @ts-expect-error - viem type mismatch for account
      account: walletClient.account,
      to: SPACE_REGISTRY_ADDRESS,
      value: 0n,
      data: encodeFunctionData({
        abi: SpaceRegistryAbi,
        functionName: 'registerSpaceId',
        args: [
          keccak256(toHex('EOA_SPACE')), // _type
          encodeAbiParameters([{ type: 'string' }], ['1.0.0']), // _version
        ],
      }),
    });

    console.log('createSpaceTxHash', createSpaceTxHash);

    await publicClient.waitForTransactionReceipt({ hash: createSpaceTxHash });

    // Re-fetch the space ID after creation
    spaceIdHex = (await publicClient.readContract({
      address: SPACE_REGISTRY_ADDRESS,
      abi: SpaceRegistryAbi,
      functionName: 'addressToSpaceId',
      args: [account.address],
    })) as Hex;

    console.log('new spaceIdHex', spaceIdHex);
  }

  if (spaceIdHex.toLowerCase() === EMPTY_SPACE_ID.toLowerCase()) {
    throw new Error(`Failed to create personal space for address ${account.address}`);
  }

  const spaceId = hexToUuid(spaceIdHex);
  console.log('spaceId (UUID)', spaceId);

  // Verify the space address exists
  const spaceAddress = (await publicClient.readContract({
    address: SPACE_REGISTRY_ADDRESS,
    abi: SpaceRegistryAbi,
    functionName: 'spaceIdToAddress',
    args: [spaceIdHex],
  })) as Hex;

  if (spaceAddress.toLowerCase() === ZERO_ADDRESS.toLowerCase()) {
    throw new Error(`Space ${spaceId} not found in registry (spaceIdHex=${spaceIdHex})`);
  }

  console.log('spaceAddress', spaceAddress);

  // Create an entity with some data
  const { ops, id: entityId } = createEntity({
    name: 'Test Entity',
    description: 'Created via full-flow test',
  });

  console.log('entityId', entityId);

  // Publish the edit to IPFS
  const { cid, editId } = await publishEdit({
    name: 'Test Edit',
    ops,
    author: account.address,
    network: 'TESTNET_V2',
  });

  console.log('cid', cid);
  console.log('editId', editId);

  // Publish edit on-chain via SpaceRegistry.enter(...)
  // SpaceRegistry.enter expects `bytes data`; we ABI-encode the CID as a single string
  const enterData = encodeAbiParameters([{ type: 'string' }], [cid]);

  const calldata = encodeFunctionData({
    abi: SpaceRegistryAbi,
    functionName: 'enter',
    args: [
      spaceIdHex, // fromSpaceId (bytes16)
      spaceIdHex, // toSpaceId (bytes16)
      EDITS_PUBLISHED, // action
      '0x0000000000000000000000000000000000000000000000000000000000000000' as Hex, // topic
      enterData, // data
      '0x' as Hex, // signature (empty for direct calls)
    ],
  });

  const publishTxHash = await walletClient.sendTransaction({
    // @ts-expect-error - viem type mismatch for account
    account: walletClient.account,
    chain: walletClient.chain ?? null,
    to: SPACE_REGISTRY_ADDRESS,
    value: 0n,
    data: calldata,
  });

  console.log('publishTxHash', publishTxHash);

  const publishReceipt = await publicClient.waitForTransactionReceipt({ hash: publishTxHash });
  console.log('publishReceipt status', publishReceipt.status);

  if (publishReceipt.status === 'reverted') {
    throw new Error(`Publish transaction reverted: ${publishTxHash}`);
  }

  console.log('Successfully published edit to space', spaceId);
}, 60000);
