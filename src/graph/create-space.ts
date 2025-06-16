import { DEFAULT_API_ORIGIN } from './constants.js';

type Params = {
  editorAddress: string;
  name: string;
  network?: 'TESTNET' | 'MAINNET';
};

/**
 * Creates a space with the given name and editor address.
 */
export const createSpace = async (params: Params) => {
  const apiHost = DEFAULT_API_ORIGIN;
  const result = await fetch(`${apiHost}/deploy`, {
    method: 'POST',
    body: JSON.stringify({
      spaceName: params.name,
      initialEditorAddress: params.editorAddress,
      network: params.network ?? 'MAINNET',
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  console.log(result);

  const jsonResult = await result.json();
  console.log('jsonResult', jsonResult);
  return { id: jsonResult.spaceId };
};
