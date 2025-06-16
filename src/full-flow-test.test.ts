import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { it } from 'vitest';
import { Ipfs } from '../index.js';
import { createEntity } from './graph/create-entity.js';
import { createSpace } from './graph/create-space.js';
import { getSmartAccountWalletClient } from './smart-wallet.js';

it.skip('should create a space', async () => {
  const addressPrivateKey = generatePrivateKey();
  const { address } = privateKeyToAccount(addressPrivateKey);
  const smartAccountWalletClient = await getSmartAccountWalletClient({
    privateKey: addressPrivateKey,
  });

  console.log('addressPrivateKey', addressPrivateKey);
  console.log('address', address);
  // console.log('smartAccountWalletClient', smartAccountWalletClient);

  try {
    const space = await createSpace({
      editorAddress: address,
      name: 'test (nik)',
      network: 'TESTNET',
    });

    console.log('space', space);
  } catch (error) {
    console.log('error', error);
  }

  return;

  // expect(space).toBeDefined();

  const { ops, id } = await createEntity({
    name: 'test (nik)',
    description: 'test (nik)',
  });

  console.log('id', id);

  const { cid } = await Ipfs.publishEdit({
    name: 'Edit name',
    ops,
    author: address,
  });

  console.log('cid', cid);

  const result = await fetch(`https://hypergraph-v2.up.railway.app/space/${space.id}/edit/calldata`, {
    method: 'POST',
    body: JSON.stringify({
      cid: cid,
      // Optionally specify TESTNET or MAINNET. Defaults to MAINNET
      network: 'TESTNET',
    }),
  });

  const { to, data } = await result.json();

  console.log('to', to);
  console.log('data', data);

  const txResult = await smartAccountWalletClient.sendTransaction({
    to: to,
    value: 0n,
    data: data,
  });

  console.log('txResult', txResult);
}, 30000);
