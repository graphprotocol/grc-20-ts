import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { it } from 'vitest';
import { Ipfs } from '../index.js';
import { createEntity } from './graph/create-entity.js';
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

  // const space = await createSpace({
  //   editorAddress: address,
  //   name: 'test (nik)',
  //   network: 'TESTNET',
  // });

  // console.log('space', space);
  const spaceId = '20140df6-3249-4945-9264-782ca8c9ba4f';

  const { ops, id } = await createEntity({
    name: 'test (nik)',
    description: 'test (nik)',
  });
  console.log('entity id', id);

  const { cid } = await Ipfs.publishEdit({
    name: 'Edit name',
    ops,
    author: address,
  });

  console.log('cid', cid);

  const result = await fetch(`https://hypergraph-v2-testnet.up.railway.app/space/${spaceId}/edit/calldata`, {
    method: 'POST',
    body: JSON.stringify({ cid }),
  });

  console.log('edit result', result);

  const editResultJson = await result.json();
  console.log('editResultJson', editResultJson);
  const { to, data } = editResultJson;

  console.log('to', to);
  console.log('data', data);

  const txResult = await smartAccountWalletClient.sendTransaction({
    to: to,
    value: 0n,
    data: data,
  });

  console.log('txResult', txResult);
}, 30000);
