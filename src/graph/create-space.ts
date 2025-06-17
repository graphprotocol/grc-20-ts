import { MAINNET_API_ORIGIN, TESTNET_API_ORIGIN } from './constants.js';

type Params = {
  editorAddress: string;
  name: string;
  network?: 'TESTNET' | 'MAINNET';
};

/**
 * Creates a space with the given name and editor address.
 */
export const createSpace = async (params: Params) => {
  const apiHost = params.network === 'TESTNET' ? TESTNET_API_ORIGIN : MAINNET_API_ORIGIN;
  console.log('apiHost', apiHost);
  const result = await fetch(`${apiHost}/deploy`, {
    method: 'POST',
    body: JSON.stringify({
      spaceName: params.name,
      initialEditorAddress: params.editorAddress,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const jsonResult = await result.json();
  return { id: jsonResult.spaceId };
};
