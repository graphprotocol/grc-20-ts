import { publishEdit } from '../ipfs.js';
import type { Op } from '../types.js';
import { DEFAULT_API_HOST } from './constants.js';

type Params = {
  operations: Op[];
  editName: string;
  spaceId: string;
  accountId: string;
  options?: {
    apiHost?: string;
    network?: 'TESTNET' | 'MAINNET';
  };
};

export const publish = async ({ operations, editName, spaceId, accountId, options }: Params) => {
  const apiHost = options?.apiHost || DEFAULT_API_HOST;
  const network = options?.network || 'TESTNET';

  const cid = await publishEdit({
    name: editName,
    ops: operations,
    author: accountId,
  });

  const result = await fetch(`${apiHost}/space/${spaceId}/edit/calldata`, {
    method: 'POST',
    body: JSON.stringify({
      cid: cid,
      network,
    }),
  });

  const jsonResult = await result.json();
  return jsonResult;

  // TODO add walletClient.sendTransaction
};
